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

    if (!token_id) {
      return res.status(400).json({ error: 'token_id is required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Supabase admin client not initialized' });
    }

    // Delete the session entry from user_sessions
    const { error } = await supabaseAdmin
      .from('user_sessions')
      .delete()
      .eq('token_id', token_id);

    if (error) {
      console.error('Error deleting session:', error);
      return res.status(500).json({ error: 'Failed to delete session entry' });
    }

    return res.status(200).json({
      success: true,
    });
  } catch (error: any) {
    console.error('Delete session error:', error);
    return res.status(500).json({ error: 'An error occurred while deleting session' });
  }
}
