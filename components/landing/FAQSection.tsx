import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What makes Rynxly unique?",
      a: `Rynxly stands out in the crowded CRM market by solving the one problem other "Desktop CRMs" ignore: The friction between a mobile salesperson and a web dashboard.<br/><br/>
      <strong>1. GSM/SIM Network Architecture:</strong> Rynxly uses your actual mobile SIM network. This ensures 100% voice clarity and displays a real mobile number, resulting in 3x higher call-answering rates.<br/><br/>
      <strong>2. "Zero-Overdue" Discipline Policy:</strong> Rynxly can be configured to "Lock" the lead flow. If an agent has overdue follow-ups, the system won't allow them to access fresh leads until the pending tasks are cleared.<br/><br/>
      <strong>3. Enterprise-Grade Data Privacy:</strong> Agents call leads via the app without ever seeing or exporting the actual phone number. Your lead database remains 100% secure.<br/><br/>
      <strong>4. Massive Cost Efficiency:</strong> We leverage your existing unlimited mobile calling plans. No hidden per-minute charges from our end.<br/><br/>
      <strong>5. Anti-Spreadsheet Workflow:</strong> Built for speed. Floating Mobile Overlay and Automated Sync allow agents to finish a call and move to the next lead in under 3 seconds.`
    },
    {
        q: "Why should a person choose Rynxly over its competitors?",
        a: `Choosing Rynxly over generic CRMs or VOIP-based systems is a strategic decision based on ROI and Connectivity:<br/><br/>
        <strong>• The Connectivity Gap:</strong> VOIP numbers are often ignored as spam. Rynxly uses standard 10-digit mobile numbers for 300% higher answer rates.<br/><br/>
        <strong>• Exploding Bills:</strong> VOIP providers charge per minute. Rynxly uses your flat-rate SIM plans, making it infinitely scalable at zero extra cost.<br/><br/>
        <strong>• Proactive vs Passive:</strong> Most CRMs report failures after they happen. Rynxly's Zero-Overdue policy prevents failures by design.<br/><br/>
        <strong>• Data Security:</strong> Unlike native mobile logs, Rynxly's Number Masking ensures your data belongs to the company, not the employee call logs.`
    },
    {
        q: "What's the story behind Rynxly?",
        a: `Rynxly was born in the noisy environment of real-world sales offices, not a software lab. We noticed managers drowning in "Excel Headaches" and agents spending an hour every day manually logging calls. We realized the tool agents loved most wasn't a laptop—it was their mobile phone. We built Rynxly to "Bring the CRM to the SIM," removing the administrative friction and allowing salespeople to do what they do best: Talk and Close.`
    },
    {
      q: "What is a SIM based calling CRM, and how is it different from VOIP?",
      a: "A SIM based calling CRM like Rynxly uses your existing mobile network (GSM) to make calls, rather than relying on internet data. This ensures 100% call quality and local number visibility, while automatically syncing call logs and recordings to a web dashboard for sales tracking."
    },
    {
      q: "How does the sales calling CRM sync my mobile calls?",
      a: "Rynxly installs a lightweight application on your agents' mobile devices. This app captures call data—such as duration, timestamp, and disposition—and securely uploads it to your central CRM software in real-time, even if the agent is working remotely."
    },
    {
      q: "Is Rynxly suitable for lead management CRM tasks?",
      a: "Yes! Rynxly is a comprehensive lead management CRM. You can assign leads to agents, set follow-up reminders, and track the entire lifecycle of a customer from the first call to the final conversion using our dynamic pipeline view."
    },
    {
      q: "Is my data secure within this SIM calling solution for business?",
      a: "Data security is our top priority. We use enterprise-level encryption for all data transfers and storage. Additionally, our 'Number Masking' feature ensures that agents can call leads without ever seeing their private phone numbers, protecting your business intelligence."
    },
    {
        q: "Which are the primary technologies used for building Rynxly?",
        a: `Built on a high-performance modern tech stack:<br/><br/>
        <strong>• Frontend:</strong> Next.js (v16+) and React with TypeScript.<br/>
        <strong>• Design:</strong> Tailwind CSS (v4) for ultra-performant styles.<br/>
        <strong>• Backend:</strong> Supabase (PostgreSQL) for real-time data sync.<br/>
        <strong>• Mobile:</strong> Flutter, enabling deep GSM system integration.<br/>
        <strong>• Cloud:</strong> Vercel and AWS S3.`
    }
  ];

  return (
    <div className="py-24 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
            {faqs.map((faq, idx) => (
                <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden transition-all hover:border-indigo-100 group">
                    <button 
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="w-full text-left px-6 py-5 bg-white flex items-center justify-between font-bold text-gray-800 focus:outline-none transition-colors group-hover:bg-indigo-50/30"
                    >
                        <span className="text-sm md:text-base pr-8">{faq.q}</span>
                        <i className={`fi fi-rr-angle-small-down flex transform transition-transform text-lg text-gray-400 ${openIndex === idx ? 'rotate-180 text-[#4b33e8]' : ''}`}></i>
                    </button>
                    <div 
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === idx ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                        <div className="px-6 pb-6 pt-0 text-xs md:text-sm text-gray-500 leading-relaxed border-t border-gray-50 prose prose-indigo max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: faq.a }} />
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Query / Contact Card */}
        <div className="mt-20 bg-[#263238] rounded-[2.5rem] p-8 md:p-14 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500 opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500 opacity-10 rounded-full blur-2xl"></div>

            <h3 className="text-xl md:text-2xl font-bold mb-3 relative z-10">Still have questions?</h3>
            <p className="text-gray-400 text-sm mb-8 max-w-xl mx-auto relative z-10">
                Our support team is ready to help you set up your perfect calling workflow. Book a free 30-minute demo today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
                <a href="#contact" className="px-8 py-3 bg-[#4b33e8] text-white font-bold rounded-full hover:bg-indigo-600 transition-all shadow-xl text-sm inline-block">
                    Book a Live Demo
                </a>
                <a href="tel:+918882558932" className="px-8 py-3 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/5 transition-all text-sm">
                    Contact Sales
                </a>
            </div>
        </div>
      </div>
    </div>
  );
}
