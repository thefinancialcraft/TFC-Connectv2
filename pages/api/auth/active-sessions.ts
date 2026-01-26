import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Session = {
  id: string;
  token_id: string;
  device_name: string | null;
  device_type: string | null;
  browser: string | null;
  user_agent: string | null;
  ip_address: string | null;
  location: string | null;
  is_active: boolean;
  last_accessed_at: string;
  created_at: string;
};


type Data = {
  success?: boolean;
  error?: string;
  sessions?: Session[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify user identity using the token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('❌ [ActiveSessions] Auth verification failed:', userError);
      return res.status(401).json({ error: 'Invalid session' });
    }

    const userId = user.id;
    console.log(`🔍 [ActiveSessions] Fetching sessions for Auth UID: ${userId}`);

    if (!supabaseAdmin) {
      console.error('❌ [ActiveSessions] supabaseAdmin is missing!');
      throw new Error("supabaseAdmin not initialized");
    }

    // Attempt to fetch ALL sessions first to see if the table responds (DEBUG ONLY)
    const { data: allSessions, error: allErr } = await supabaseAdmin
      .from('user_sessions')
      .select('user_id, is_active')
      .limit(1);
    
    if (allErr) {
       console.error('❌ [ActiveSessions] Table access test failed:', allErr);
    } else {
       console.log('📡 [ActiveSessions] Table is reachable. Test record:', allSessions?.[0]);
    }

    // Actual targeted query - Select all columns and filter by user_id
    const { data: rawSessions, error } = await supabaseAdmin
      .from('user_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('last_accessed_at', { ascending: false });

    if (error) {
      console.error('❌ [ActiveSessions] DB Query Error:', error);
      return res.status(500).json({ error: 'Failed to fetch sessions from database' });
    }

    if (rawSessions && rawSessions.length > 0) {
       console.log('📄 [ActiveSessions] Sample session from DB:', rawSessions[0]);
    }

    // Map the database rows to our frontend Session type
    const sessions: Session[] = (rawSessions || []).map(s => ({
      id: s.id || s.token_id, 
      token_id: s.token_id,
      device_name: s.device_name,
      device_type: s.device_type,
      browser: s.browser,
      user_agent: s.user_agent,
      ip_address: s.ip_address,
      location: s.location,
      is_active: s.is_active,
      last_accessed_at: s.last_accessed_at,
      created_at: s.created_at
    }));



    console.log(`✅ [ActiveSessions] Request successful. User: ${userId} | Found: ${sessions?.length || 0}`);

    return res.status(200).json({
      success: true,
      sessions: sessions || [],
    });
  } catch (error: any) {
    console.error('❌ [ActiveSessions] Internal Handler Error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching sessions' });
  }
}



