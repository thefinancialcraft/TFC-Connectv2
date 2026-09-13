import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase, supabaseAdmin } from '../../../lib/supabase';

type Data = {
  success?: boolean;
  error?: string;
  session?: any;
  message?: string;
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
        manual_override,
        terminate,
        is_unassigned
    } = req.body;

    console.log(`[API-Session] Request Target: User=${user.id}, Campaign=${campaign_id}, Manual=${is_manual_event}, Terminate=${terminate}, Unassigned=${is_unassigned}`);

    // ACTION: TERMINATE SESSION
    if (terminate) {
        const { error: deleteError } = await client
            .from('call_sessions')
            .delete()
            .eq('user_id', user.id)
            .eq('campaign_id', campaign_id);
        
        if (deleteError) {
            console.error('[API-Session] Delete Error:', deleteError);
            return res.status(500).json({ error: deleteError.message });
        }

        // Clear calling presence on terminate
        try {
            await client
                .from('agent_live_presence')
                .update({
                    on_call: false,
                    active_mode: null,
                    dialed_no: null,
                    customer_name: null,
                    calling_status: null,
                    call_started_at: null,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);
        } catch (presErr) {
            console.error('[API-Session] Error clearing presence on terminate:', presErr);
        }

        const responseData: Data = { success: true, message: 'Session terminated' };
        return res.status(200).json(responseData);
    }

    // 0. FETCH ORGANIZATION ID FOR SESSION TRACKING
    const { data: campaignMeta } = await client
        .from('campaigns')
        .select('organization_id')
        .eq('id', campaign_id)
        .maybeSingle();

    let updatePayload: any = {
        user_id: user.id,
        campaign_id: campaign_id,
        organization_id: campaignMeta?.organization_id || null,
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
            is_unassigned: false,
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

        // 🔄 REFRESH LOGIC: We no longer delete and recreate here. 
        // Upsert below handles the transition without triggering DELETE events in Realtime.

        updatePayload = {
            ...updatePayload,
            // If row exists, keep primary lead. If new, set this lead as primary too as fallback.
            customer_id: existing?.customer_id || customer_id, 
            status: existing?.status || 'assigned',
            is_manual: true,
            manual_campaign_id: campaign_id,
            manual_customer_id: customer_id,
            manual_status: status,
            is_unassigned: is_unassigned || false,
            ...(status === 'active' ? { call_start_at: new Date().toISOString() } : {})
        };
    } else {
        // STANDARD CRM WORKFLOW
        updatePayload = {
            ...updatePayload,
            customer_id: customer_id,
            status: status,
            is_manual: false,
            manual_campaign_id: null,
            manual_customer_id: null,
            manual_status: null,
            ...(status === 'active' ? { call_start_at: new Date().toISOString() } : { call_start_at: null })
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

    // Sync call state with agent_live_presence
    try {
        if (status === 'active') {
            let custPhone = null;
            let custName = null;
            if (customer_id) {
                const { data: cust } = await client
                    .from('customers')
                    .select('phone, name')
                    .eq('id', customer_id)
                    .maybeSingle();
                custPhone = cust?.phone || null;
                custName = cust?.name || null;
            }

            await client
                .from('agent_live_presence')
                .update({
                    on_call: true,
                    dialed_no: custPhone,
                    customer_name: custName,
                    calling_status: 'connected',
                    call_started_at: updatePayload.call_start_at || new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);
        } else if (status === 'disposition_pending') {
            await client
                .from('agent_live_presence')
                .update({
                    on_call: false,
                    calling_status: 'disposition_pending',
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', user.id);
        }
    } catch (presSyncErr) {
        console.error('[API-Session] Error syncing agent_live_presence:', presSyncErr);
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
