import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

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
    const { token_id } = req.body;
    
    if (!supabaseAdmin) {
        return res.status(500).json({ error: 'Database admin not configured' });
    }

    if (!token_id) {
        return res.status(400).json({ error: 'Token ID is required' });
    }

    // Reactivate the session
    const { error: updateError } = await supabaseAdmin
      .from('user_sessions')
      .update({ 
        is_active: true,
        last_accessed_at: new Date().toISOString(),
        last_login_at: new Date().toISOString() // Show as a new activity
      })
      .eq('token_id', token_id);

    if (updateError) {
      console.error('Error activating session:', updateError);
      return res.status(500).json({ error: 'Failed to activate session' });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    console.error('Activate session error:', error);
    return res.status(500).json({ error: 'An error occurred while activating session' });
  }
}
