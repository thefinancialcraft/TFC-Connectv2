import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';
import { computePhoneHash } from '../../../lib/phoneUtils';

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

  const { phone, organization_id } = req.query;
  console.log(`[API-Search] Search Request Received. Query Phone: "${phone}", Org: "${organization_id}"`);

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  if (!organization_id) {
    return res.status(400).json({ error: 'Organization ID is strictly required to prevent cross-organization data matching.' });
  }

  // Normalize phone number
  const searchPhone = String(phone).replace(/\D/g, '');
  const phoneHash = computePhoneHash(searchPhone);
  console.log(`[API-Search] Search Phone: ${searchPhone}, Hash: ${phoneHash}`);

  try {
    const client = supabaseAdmin;
    if (!client) throw new Error("Admin client not available");

    // Search order: customers -> rejected_leads -> closed_deals
    
    // 1. Try customers
    let customerQuery = client
      .from('customers')
      .select('id, campaign_id, customer_name, phone_no, assigned_to, organization_id')
      .eq('phone_search_hash', phoneHash);
    
    if (organization_id) {
      customerQuery = customerQuery.eq('organization_id', organization_id);
    }

    const { data: customer } = await customerQuery
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (customer) {
      console.log(`[API-Search] ✅ Found in 'customers' table. ID: ${customer.id}`);
      return res.status(200).json({ success: true, lead: { ...customer, table: 'customers' } });
    }

    // 2. Try rejected_leads
    let rejectedQuery = client
      .from('rejected_leads')
      .select('id, campaign_id, customer_name, phone_no, agent_id, organization_id')
      .eq('phone_search_hash', phoneHash);

    if (organization_id) {
      rejectedQuery = rejectedQuery.eq('organization_id', organization_id);
    }

    const { data: rejected } = await rejectedQuery
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (rejected) {
      console.log(`[API-Search] ✅ Found in 'rejected_leads' table. ID: ${rejected.id}`);
      return res.status(200).json({ success: true, lead: { ...rejected, table: 'rejected_leads', assigned_to: rejected.agent_id } });
    }

    // 3. Try closed_deals
    let closedQuery = client
      .from('closed_deals')
      .select('id, customer_id, campaign_id, customer_name, phone_no, agent_id, organization_id')
      .eq('phone_search_hash', phoneHash);

    if (organization_id) {
      closedQuery = closedQuery.eq('organization_id', organization_id);
    }

    const { data: closed } = await closedQuery
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
