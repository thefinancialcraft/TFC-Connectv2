import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  active_tokens?: string[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { tokens } = req.body;

  if (!tokens || !Array.isArray(tokens)) {
    return res.status(400).json({ error: 'Tokens array is required' });
  }

  try {
    const clientToUse = supabaseAdmin || supabase;
    
    // Find all active tokens from the list
    const { data, error } = await clientToUse
      .from('user_sessions')
      .select('token_id')
      .in('token_id', tokens)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());

    if (error) throw error;

    const activeTokens = data.map(item => item.token_id);

    return res.status(200).json({
      success: true,
      active_tokens: activeTokens,
    });
  } catch (error) {
    console.error('Batch status check error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
