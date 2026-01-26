import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  revoked_token_id?: string;
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

    // Use supabaseAdmin to bypass RLS and ensure the session is deleted
    if (!supabaseAdmin) {
      throw new Error("supabaseAdmin not initialized");
    }

    // First fetch the token_id so we can return it to the frontend
    const { data: sessionData } = await supabaseAdmin
      .from('user_sessions')
      .select('token_id')
      .eq('id', session_id)
      .eq('user_id', user.id)
      .single();

    // Revoke session (DELETE the record)
    const { error } = await supabaseAdmin
      .from('user_sessions')
      .delete()
      .eq('id', session_id)
      .eq('user_id', user.id); 

    if (error) {
      console.error('Error revoking session:', error);
      return res.status(500).json({ error: 'Failed to revoke session' });
    }

    return res.status(200).json({
      success: true,
      revoked_token_id: sessionData?.token_id
    });

  } catch (error: any) {
    console.error('Revoke session error:', error);
    return res.status(500).json({ error: 'An error occurred while revoking session' });
  }
}

