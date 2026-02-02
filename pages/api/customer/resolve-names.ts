import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(200).json({ data: [] });
  }

  try {
    // Fetch from tables - check both ID and customer_id for rejected/closed to be safe
    const [active, rejectedById, rejectedByCustId, closedById, closedByCustId] = await Promise.all([
      supabaseAdmin.from('customers').select('*').in('id', ids),
      supabaseAdmin.from('rejected_leads').select('*').in('id', ids),
      supabaseAdmin.from('rejected_leads').select('*').in('customer_id', ids),
      supabaseAdmin.from('closed_deals').select('*').in('id', ids),
      supabaseAdmin.from('closed_deals').select('*').in('customer_id', ids)
    ]);

    // Combine results
    const combined = [
      ...(active.data || []),
      ...(rejectedById.data || []),
      ...(rejectedByCustId.data || []),
      ...(closedById.data || []),
      ...(closedByCustId.data || [])
    ];

    // Deduplicate (priority to active, then closed, then rejected if logic dictates, but IDs should be unique typically)
    const uniqueMap = new Map();
    combined.forEach(item => {
        if (!uniqueMap.has(item.id)) {
            uniqueMap.set(item.id, {
                id: item.id,
                customer_name: item.customer_name || item.name || "Unknown",
                phone_no: item.phone_no,
                phone_search_hash: item.phone_search_hash
            });
        }
    });

    return res.status(200).json({ 
      success: true, 
      data: Array.from(uniqueMap.values()) 
    });

  } catch (error: any) {
    console.error('Resolve Names API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
