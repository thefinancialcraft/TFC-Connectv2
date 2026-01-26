import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  is_active?: boolean;
  expires_at?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { token_id } = req.body;

  if (!token_id) {
    return res.status(400).json({ error: 'Token ID is required' });
  }

  try {
    const clientToUse = supabaseAdmin || supabase;
    
    // Get current session status
    const { data: session, error: fetchError } = await clientToUse
      .from('user_sessions')
      .select('is_active, expires_at, user_id')
      .eq('token_id', token_id)
      .single();

    if (fetchError || !session) {
      return res.status(404).json({ error: 'Session not found', is_active: false });
    }

    // Check if session has expired
    const isExpired = new Date(session.expires_at) < new Date();
    if (isExpired) {
      // Mark as inactive if expired
      if (supabaseAdmin) {
        await supabaseAdmin
          .from('user_sessions')
          .update({ is_active: false })
          .eq('token_id', token_id);
      }
      return res.status(200).json({ success: true, is_active: false, expires_at: session.expires_at });
    }

    // Update last_accessed_at and ensure is_active is true if not expired
    if (supabaseAdmin) {
      await supabaseAdmin
        .from('user_sessions')
        .update({ 
          last_accessed_at: new Date().toISOString(),
          is_active: true // Ensure it stays active if heartbeat is received
        })
        .eq('token_id', token_id);
    }

    return res.status(200).json({
      success: true,
      is_active: true,
      expires_at: session.expires_at,
    });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
