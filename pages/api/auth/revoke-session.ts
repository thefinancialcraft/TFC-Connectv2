import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

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
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: 'session_id is required' });
    }

    // Get session from authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify user
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    // Set session to enable RLS
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: '',
    });

    if (sessionError) {
      console.error('Session error:', sessionError);
    }

    // Revoke session (set is_active to false)
    const { error } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('id', session_id)
      .eq('user_id', user.id); // Ensure user can only revoke their own sessions

    if (error) {
      console.error('Error revoking session:', error);
      return res.status(500).json({ error: 'Failed to revoke session' });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    console.error('Revoke session error:', error);
    return res.status(500).json({ error: 'An error occurred while revoking session' });
  }
}

