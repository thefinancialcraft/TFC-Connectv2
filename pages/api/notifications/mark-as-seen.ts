import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { id, markAll } = req.body;
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({ error: 'Service role key not configured' });
    }

    let query = supabaseAdmin.from('notifications').update({ is_seen: true }).eq('user_id', user.id);

    if (!markAll && id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('is_seen', false);
    }

    const { data, error } = await query.select();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ 
      success: true, 
      updatedCount: data?.length || 0 
    });

  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
