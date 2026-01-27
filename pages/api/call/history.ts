
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Initialize Supabase Admin Client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { customerId } = req.query;

  if (!customerId || typeof customerId !== 'string') {
    return res.status(400).json({ error: 'Missing customerId' });
  }

  try {
    // Determine which table the customer is in to get context if needed
    // But primarily we just need call_logs which are linked by customer_id
    
    // Fetch call logs with explicit join on user_profiles for agent and updater
    // We select specific fields to avoid leaking sensitive data
    const { data: historyData, error: historyError } = await supabaseAdmin
        .from('call_logs')
        .select(`
            *,
            agent:agent_id(user_name, employee_id),
            updater:last_updated_by(user_name, employee_id)
        `)
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

    if (historyError) {
      console.error('Error fetching timeline:', historyError);
      return res.status(500).json({ error: historyError.message });
    }

    return res.status(200).json({ 
      success: true, 
      data: historyData 
    });

  } catch (error: any) {
    console.error('Timeline API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
