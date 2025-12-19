import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

type Session = {
  id: string;
  device_name: string | null;
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
    // Get session from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];

    // Set session for RLS
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Set session to enable RLS
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '', // Not needed for read operations
    });

    if (sessionError) {
      console.error('Session error:', sessionError);
    }

    // Fetch active sessions for this user
    const { data: sessions, error } = await supabase
      .from('user_sessions')
      .select('id, device_name, device_type, browser, user_agent, ip_address, location, is_active, last_accessed_at, created_at')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .order('last_accessed_at', { ascending: false });

    if (error) {
      console.error('Error fetching sessions:', error);
      return res.status(500).json({ error: 'Failed to fetch sessions' });
    }

    return res.status(200).json({
      success: true,
      sessions: sessions || [],
    });
  } catch (error: any) {
    console.error('Fetch sessions error:', error);
    return res.status(500).json({ error: 'An error occurred while fetching sessions' });
  }
}

