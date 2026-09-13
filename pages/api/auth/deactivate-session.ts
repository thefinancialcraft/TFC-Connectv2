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
    
    // We use supabaseAdmin here because we need to update records 
    // potentially after the client session is cleared or token is expired
    if (!supabaseAdmin) {
        return res.status(500).json({ error: 'Database admin not configured' });
    }

    if (!token_id) {
        return res.status(400).json({ error: 'Token ID is required' });
    }

    // Set is_active = false for this specific token
    const { error: updateError } = await supabaseAdmin
      .from('user_sessions')
      .update({ 
        is_active: false,
        last_accessed_at: new Date().toISOString() 
      })
      .eq('token_id', token_id);

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


