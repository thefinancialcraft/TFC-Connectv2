import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  lead?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone } = req.query;
  console.log(`[API-Search] Search Request Received. Query Phone: "${phone}"`);

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  // Normalize phone number (removed .slice(-10) to support dummy numbers)
  const searchPhone = String(phone).replace(/\D/g, '');
  console.log(`[API-Search] Search Phone: ${searchPhone}`);

  try {
    const client = supabaseAdmin;
    if (!client) throw new Error("Admin client not available");

    // Search order: customers -> rejected_leads -> closed_deals
    
    // 1. Try customers
    const { data: customer } = await client
      .from('customers')
      .select('id, campaign_id, customer_name, phone_no')
      .ilike('phone_no', `%${searchPhone}`)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (customer) {
      console.log(`[API-Search] ✅ Found in 'customers' table. ID: ${customer.id}`);
      return res.status(200).json({ success: true, lead: { ...customer, table: 'customers' } });
    }

    // 2. Try rejected_leads
    const { data: rejected } = await client
      .from('rejected_leads')
      .select('id, campaign_id, customer_name, phone_no')
      .ilike('phone_no', `%${searchPhone}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (rejected) {
      console.log(`[API-Search] ✅ Found in 'rejected_leads' table. ID: ${rejected.id}`);
      return res.status(200).json({ success: true, lead: { ...rejected, table: 'rejected_leads' } });
    }

    // 3. Try closed_deals
    const { data: closed } = await client
      .from('closed_deals')
      .select('id, customer_id, campaign_id, customer_name, phone_no')
      .ilike('phone_no', `%${searchPhone}`)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (closed) {
      console.log(`[API-Search] ✅ Found in 'closed_deals' table. ID: ${closed.id || (closed as any).customer_id}`);
      return res.status(200).json({ 
        success: true, 
        lead: { 
            ...closed, 
            id: closed.id || (closed as any).customer_id, 
            table: 'closed_deals' 
        } 
      });
    }

    return res.status(404).json({ success: false, error: 'Lead not found' });

  } catch (error: any) {
    console.error('[API] Lead Search Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
