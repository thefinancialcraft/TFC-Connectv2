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
        is_manual_event, 
        manual_override 
    } = req.body;

    console.log(`[API-Session] Request Target: User=${user.id}, Campaign=${campaign_id}, Manual=${is_manual_event}`);

    let updatePayload: any = {
        user_id: user.id,
        campaign_id: campaign_id,
        updated_at: new Date().toISOString()
    };

    if (manual_override) {
        // Clear manual state and RESTORE primary lead context
        console.log(`[API-Session] Force clearing manual state and restoring lead: ${customer_id}`);
        updatePayload = {
            ...updatePayload,
            customer_id: customer_id,
            status: status || 'assigned',
            is_manual: false,
            manual_campaign_id: null,
            manual_customer_id: null,
            manual_status: null,
            call_start_at: null 
        };
    } else if (is_manual_event) {
        // TARGETED MANUAL UPDATE: 
        // We find if this user already has a lead assigned in this specific campaign
        const { data: existing } = await client
            .from('call_sessions')
            .select('customer_id, status')
            .eq('user_id', user.id)
            .eq('campaign_id', campaign_id)
            .maybeSingle();

        console.log(`[API-Session] Manual Event for Lead Campaign: ${campaign_id}. Existing Primary Lead: ${existing?.customer_id || 'None'}`);

        updatePayload = {
            ...updatePayload,
            // If row exists, keep primary lead. If new, set this lead as primary too as fallback.
            customer_id: existing?.customer_id || customer_id, 
            status: existing?.status || 'assigned',
            is_manual: true,
            manual_campaign_id: campaign_id,
            manual_customer_id: customer_id,
            manual_status: status,
            ...(status === 'active' ? { call_start_at: new Date().toISOString() } : {})
        };
    } else {
        // STANDARD CRM WORKFLOW
        updatePayload = {
            ...updatePayload,
            customer_id: customer_id,
            status: status,
            is_manual: false,
            ...(status === 'active' ? { call_start_at: new Date().toISOString() } : {})
        };
    }

    const { data: updated, error: upsertError } = await client
        .from('call_sessions')
        .upsert(updatePayload, { onConflict: 'user_id,campaign_id' })
        .select('*')
        .single();

    if (upsertError) {
        console.error('[API-Session] DB Error:', upsertError);
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
