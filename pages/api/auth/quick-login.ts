import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  session?: {
    access_token: string;
    refresh_token: string;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id is required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Check if there's an active session for this user
    const { data: activeSession, error: sessionError } = await supabaseAdmin
      .from('user_sessions')
      .select('session_token, is_active, expires_at')
      .eq('user_id', user_id)
      .eq('is_active', true)
      .order('last_accessed_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sessionError || !activeSession) {
      return res.status(404).json({ 
        error: 'No active session found. Please login again.' 
      });
    }

    // Check if session is expired
    if (activeSession.expires_at) {
      const expiresAt = new Date(activeSession.expires_at);
      const now = new Date();
      if (now > expiresAt) {
        // Mark session as inactive
        await supabaseAdmin
          .from('user_sessions')
          .update({ is_active: false })
          .eq('session_token', activeSession.session_token);
        
        return res.status(401).json({ 
          error: 'Session expired. Please login again.' 
        });
      }
    }

    // Try to verify the session token with Supabase
    // Note: We can't directly use the stored session_token as it's a JWT
    // We need to refresh it or validate it
    // For now, return error suggesting user needs to login again
    // The stored tokens in localStorage should work with refreshSession
    
    return res.status(200).json({
      success: true,
      message: 'Active session found. Please use refresh token to get new access token.',
    });
  } catch (error: any) {
    console.error('Quick login error:', error);
    return res.status(500).json({ error: 'An error occurred during quick login' });
  }
}

