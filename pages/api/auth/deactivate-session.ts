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

    // Deactivate all active sessions for this user (or just the current one)
    // Option 1: Deactivate only the current session
    const { error: updateError } = await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', user.id)
      .eq('session_token', token)
      .eq('is_active', true);

    if (updateError) {
      console.error('Error deactivating session:', updateError);
      return res.status(500).json({ error: 'Failed to deactivate session' });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    console.error('Deactivate session error:', error);
    return res.status(500).json({ error: 'An error occurred while deactivating session' });
  }
}

