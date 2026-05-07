import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // Fetch absolute total from call_history
    // Using count: 'exact' and head: true for maximum performance (no data transfer)
    const dbClient = supabaseAdmin || supabase;
    
    // Fetch counts in parallel for performance
    const [callsResult, usersResult] = await Promise.all([
      dbClient.from("call_history").select("*", { count: "exact", head: true }),
      dbClient.from("user_profiles").select("*", { count: "exact", head: true })
    ]);

    
    if (callsResult.error) throw callsResult.error;
    if (usersResult.error) throw usersResult.error;

    return res.status(200).json({
      success: true,
      data: {
        totalCalls: callsResult.count || 0,
        totalAgents: usersResult.count || 0,
      },
    });
  } catch (error: any) {
    console.error("Public stats error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
