import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { messages, context } = req.body;
  const lastUserMessage = messages[messages.length - 1]?.content || "";

  // 1. Parsing Workspace Context
  let ctx: any = {};
  try { ctx = JSON.parse(context); } catch (e) { console.error("Ctx error", e); }

  const { 
    currentUser, 
    recentCallLogs, 
    userFollowups, 
    activeTasks, 
    knowledgeBase,
    customInstructions 
  } = ctx;

  const apiKeyOpenAI = process.env.OPENAI_API_KEY;
  const apiKeyGemini = process.env.GEMINI_API_KEY;

  // Pre-calculate workspace stats for the prompt
  const callCount = recentCallLogs?.length || 0;
  const avgDuration = callCount > 0 
    ? (recentCallLogs.reduce((acc: number, log: any) => acc + (log.duration || 0), 0) / callCount).toFixed(0) 
    : 0;
  const pendingTasks = activeTasks?.reduce((acc: number, p: any) => acc + p.tasks.length, 0) || 0;
  const followupCount = userFollowups?.length || 0;

  // --- BRAIN SYSTEM PROMPT ---
  const systemPrompt = `
    You are the "TFC Sales Co-Pilot", an elite sales strategist for The Financial Craft.
    Your mission is to act as a 24/7 intelligent partner for the sales team.
    
    Current User: ${currentUser?.name || 'Partner'} (${currentUser?.role || 'Sales Rep'})
    User Level: ${currentUser?.level || 'N/A'}
    
    WORKSPACE INTELLIGENCE (REAL-TIME DATA):
    - Recent Calls: ${callCount} analyzed.
    - Performance: Avg Talktime is ${avgDuration}s.
    - Pipeline: ${followupCount} pending follow-ups.
    - Workload: ${pendingTasks} active tasks.
    
    KNOWLEDGE BASE (PRIORITY):
    ${knowledgeBase || 'User has not uploaded specific plan details yet.'}
    
    CORE DIRECTIVES:
    1. If talktime < 45s, suggest "Pattern Interrupts" or "Opening Hooks".
    2. If followupCount > 3, suggest prioritizing high-value leads.
    3. Refer to Knowledge Base for any product-specific questions.
    4. Keep answers extremely direct, professional, and optimistic.
    5. Formatting: Use Bold text for emphasis and Bullet points for steps.
    
    USER'S BRAND VOICE/INSTRUCTIONS:
    ${customInstructions || 'Act as a professional, proactive sales coach.'}
  `;

  // --- AI EXECUTION PIPELINE (With Graceful Fallbacks) ---
  let finalReply = "";

  // 1. Try OpenAI GPT-4o-Mini
  if (apiKeyOpenAI) {
    try {
      const openai = new OpenAI({ apiKey: apiKeyOpenAI });
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        temperature: 0.7,
      });
      finalReply = response.choices[0].message.content || "";
    } catch (e: any) {
      console.error("OpenAI Error:", e.message);
      // Don't return yet, try next fallback
    }
  }

  // 2. Try Gemini 1.5 Flash (if OpenAI failed or no key)
  if (!finalReply && apiKeyGemini) {
    try {
      const genAI = new GoogleGenerativeAI(apiKeyGemini);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
      const chat = model.startChat({
        history: messages.slice(0, -1).map((m: any) => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content || "" }],
        })),
        generationConfig: { maxOutputTokens: 1000 },
      });

      const fullMessage = `${systemPrompt}\n\nUser Question: ${lastUserMessage}`;
      const result = await chat.sendMessage(fullMessage);
      const response = await result.response;
      finalReply = response.text();
    } catch (e: any) {
      console.error("Gemini Error:", e.message);
    }
  }

  // 3. Final Fallback: Smart Simulation (If real AI fails or no keys)
  if (!finalReply) {
    const errorPrefix = (apiKeyOpenAI || apiKeyGemini) 
       ? "⚠️ **Connection Note**: Your AI keys are set but encountered an issue (likely quota or auth). Using Local Brain for now.\n\n" 
       : "";
    
    finalReply = errorPrefix + 
                 `**Contextual Advice for ${currentUser?.name || 'Partner'}:** \n\n` +
                 `I've scanned your **${callCount} recent calls** and **${followupCount} follow-ups**. \n` +
                 `Your current talktime is **${avgDuration}s**. Focus on your pending tasks in **${activeTasks?.[0]?.project || 'Active Projects'}** to keep the momentum going! \n\n` +
                 `To get full GPT/Gemini intelligence, please double-check your API keys in the settings or .env file.`;
  }

  return res.status(200).json({ reply: finalReply });
}
