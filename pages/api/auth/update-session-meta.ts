import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { device_info, token_id } = req.body;

    if (!device_info || !token_id) {
      return res.status(400).json({ error: 'device_info and token_id are required' });
    }

    // Get session from authorization header to verify identity
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Mapping logic as requested by user
    const deviceName = `${device_info.brand} ${device_info.model}`;
    const browser = "Nexus App";
    const userAgent = device_info.androidId || "Nexus-Android";
    const deviceType = "mobile";

    if (!supabaseAdmin) {
      throw new Error("supabaseAdmin not configured");
    }

    // Update the session metadata in the user_sessions table
    const { error: updateError } = await supabaseAdmin
      .from('user_sessions')
      .update({
        device_name: deviceName,
        browser: browser,
        user_agent: userAgent,
        device_type: deviceType,
        last_accessed_at: new Date().toISOString(),
      })
      .eq('token_id', token_id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating session meta:', updateError);
      return res.status(500).json({ error: 'Failed to update session metadata' });
    }

    return res.status(200).json({
      success: true
    });
  } catch (error: any) {
    console.error('Update session meta error:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
}
