import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  session?: any;
  server_now?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const client = supabaseAdmin || supabase;
    const { 
        campaign_id, 
        customer_id, 
        status, 
        is_manual_event, // Special flag for dialer calls
        manual_override // Flag to force clear manual session
    } = req.body;

    // 1. Fetch Current Holistic Session
    const { data: session } = await client
        .from('call_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

    let updateData: any = {
        updated_at: new Date().toISOString()
    };

    // LOGIC SWITCH:
    // If we receive a manual event (dialer), we populate the manual_ columns
    // and set is_manual = true while preserving original campaign/customer IDs.
    
    if (manual_override) {
        // Clear manual session and return to primary
        updateData = {
            ...updateData,
            is_manual: false,
            manual_campaign_id: null,
            manual_customer_id: null,
            manual_status: null
        };
    } else if (is_manual_event) {
        console.log(`[API-Session] 📱 Handling Manual Interruption for Lead: ${customer_id}`);
        updateData = {
            ...updateData,
            is_manual: true,
            manual_campaign_id: campaign_id,
            manual_customer_id: customer_id,
            manual_status: status,
            // If starting manual call, update start time
            ...(status === 'active' ? { call_start_at: new Date().toISOString() } : {})
        };
    } else {
        // Standard CRM Workflow
        // If we are NOT in a manual call, update primary columns
        // If we ARE in a manual call but UI sends a standard update, we update primary but keep is_manual=true
        updateData = {
            ...updateData,
            campaign_id: campaign_id,
            customer_id: customer_id,
            status: status,
            is_manual: session?.is_manual || false,
            ...(status === 'active' ? { call_start_at: new Date().toISOString() } : {})
        };
    }

    const { data: updated, error: upsertError } = await client
        .from('call_sessions')
        .upsert({
            user_id: user.id,
            ...updateData
        }, { onConflict: 'user_id' })
        .select('*')
        .single();

    if (upsertError) {
        console.error('[API-Session] Error:', upsertError);
        return res.status(500).json({ error: upsertError.message });
    }

    return res.status(200).json({ 
        success: true, 
        session: updated,
        server_now: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('[API-Session] Fatal:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
