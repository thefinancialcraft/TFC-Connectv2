import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../../lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const token = authHeader.split("Bearer ")[1];

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ success: false, error: "Invalid token" });
    }

    const { user_id, campaign_id } = req.body;
    if (!user_id || !campaign_id) {
      return res.status(400).json({ success: false, error: "user_id and campaign_id are required" });
    }

    const dbClient = supabaseAdmin || supabase;

    const { error } = await dbClient
      .from("call_sessions")
      .delete()
      .match({ user_id, campaign_id });

    if (error) {
      console.error("Error deleting call session:", error);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("Delete call session error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
