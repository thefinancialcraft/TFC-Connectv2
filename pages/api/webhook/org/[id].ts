import { randomUUID } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  formatSmartfloWebhookEvent,
  smartfloAdminClient,
  syncSmartfloWebhookToCallHistory,
  type FormattedSmartfloWebhookEvent,
} from '@/lib/smartfloServer';
import { computePhoneHash } from '@/lib/phoneUtils';

export type SmartfloWebhookEvent = FormattedSmartfloWebhookEvent;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  const { id } = req.query;
  const webhookId = Array.isArray(id) ? id[0] : id;

  if (!webhookId || typeof webhookId !== 'string') {
    return res.status(400).json({ error: 'Missing webhook identifier.' });
  }

  if (!smartfloAdminClient) {
    return res.status(500).json({ error: 'Database service is unavailable.' });
  }

  // Find the dialer configuration corresponding to this webhook_id or integration_id
  const { data: config, error: configError } = await smartfloAdminClient
    .from('smartflo_dialer_config')
    .select('id, organization_id, webhook_id, integration_id, webhook_events')
    .or(`webhook_id.eq.${webhookId},integration_id.eq.${webhookId}`)
    .maybeSingle();

  if (configError) {
    console.error('[Smartflo Webhook] DB error locating config for ID:', webhookId, configError);
    return res.status(500).json({ error: 'Database error while locating webhook configuration.' });
  }

  if (!config) {
    return res.status(404).json({ error: 'No Smartflo configuration found for this webhook ID.' });
  }

  if (req.method === 'GET') {
    const { data: responses } = await smartfloAdminClient
      .from('webhook_responses')
      .select('id, webhook_id, organization_id, response, created_at')
      .eq('organization_id', config.organization_id)
      .order('created_at', { ascending: false })
      .limit(50);

    let events: SmartfloWebhookEvent[] = (responses || []).map((row) =>
      formatSmartfloWebhookEvent(row.id, row.created_at, row.response)
    );

    if (events.length === 0 && Array.isArray(config.webhook_events) && config.webhook_events.length > 0) {
      events = config.webhook_events.map((item: any, idx: number) =>
        formatSmartfloWebhookEvent(item.id || `legacy-${idx}`, item.receivedAt, item)
      );
    }

    return res.status(200).json({
      success: true,
      webhookId: config.webhook_id || config.integration_id,
      events,
    });
  }

  if (req.method === 'DELETE') {
    await smartfloAdminClient
      .from('webhook_responses')
      .delete()
      .eq('organization_id', config.organization_id);

    await smartfloAdminClient
      .from('smartflo_dialer_config')
      .update({ webhook_events: [], updated_at: new Date().toISOString() })
      .eq('id', config.id);

    return res.status(200).json({ success: true, message: 'Webhook events cleared.' });
  }

  if (req.method === 'POST') {
    let payload: Record<string, unknown> = {};

    if (req.body && typeof req.body === 'object') {
      payload = req.body as Record<string, unknown>;
    } else if (typeof req.body === 'string') {
      try {
        payload = JSON.parse(req.body);
      } catch {
        payload = { rawText: req.body };
      }
    }

    const organizationId = config.organization_id;

    const processLogs: string[] = [];
    const logStep = (msg: string) => {
      console.log(msg);
      processLogs.push(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
    };

    logStep(`[Webhook-Org:Step 0] Method: ${req.method} | Org: ${organizationId} | WebhookID: ${webhookId}`);
    logStep(`[Webhook-Org:Step 0] Body Payload: ${JSON.stringify(payload)}`);

    // Check if Inbound Dialplan
    const callTypeParam = String(
      req.headers['call_type'] ||
      req.query.call_type ||
      payload.call_type ||
      ''
    ).trim().toLowerCase();

    const isInboundDialplan =
      callTypeParam === 'rynxly_inbound' ||
      callTypeParam === 'inbound' ||
      callTypeParam === 'inbound dialplan' ||
      (Boolean(payload.caller_id_number) &&
        Boolean(payload.call_to_number) &&
        !payload.customer_no_with_prefix &&
        !payload.answered_agent_name);

    logStep(`[Webhook-Org:Step 1] Is Inbound Dialplan: ${isInboundDialplan} (call_type param: "${callTypeParam}")`);

    if (isInboundDialplan) {
      const rawCustomerPhone = String(
        payload.caller_id_number ||
        payload.caller_id ||
        payload.from ||
        payload.customer_number ||
        ''
      ).trim();

      const virtualDid = String(
        payload.call_to_number ||
        payload.to ||
        payload.digits_dialed ||
        ''
      ).trim();

      const rawDigits = rawCustomerPhone.replace(/\D/g, '');
      let cleanPhone = rawDigits;
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
        cleanPhone = cleanPhone.slice(2);
      } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.slice(1);
      } else if (cleanPhone.length > 10) {
        cleanPhone = cleanPhone.slice(-10);
      }

      const hashes = [
        cleanPhone ? computePhoneHash(cleanPhone) : null,
        rawDigits && rawDigits !== cleanPhone ? computePhoneHash(rawDigits) : null,
        cleanPhone ? computePhoneHash(`0${cleanPhone}`) : null,
      ].filter((h): h is string => Boolean(h));

      logStep(`[Webhook-Org:Step 1] 📞 Customer Phone: "${rawCustomerPhone}" -> Clean 10-digit: "${cleanPhone}" | Virtual DID: "${virtualDid}"`);

      let matchedLead: {
        id: string;
        customer_id?: string;
        campaign_id: string;
        customer_name?: string;
        assigned_to: string | null;
        table: 'customers' | 'rejected_leads' | 'closed_deals';
      } | null = null;

      // Parallel Lead Search + Dialer Config in a single Promise.all for <200ms response
      let custPromise = Promise.resolve<{ data: any; error: any }>({ data: null, error: null });
      let rejPromise = Promise.resolve<{ data: any; error: any }>({ data: null, error: null });
      let closedPromise = Promise.resolve<{ data: any; error: any }>({ data: null, error: null });

      if (cleanPhone || hashes.length > 0) {
        const orConditions: string[] = [];
        for (const h of hashes) orConditions.push(`phone_search_hash.eq.${h}`);
        if (cleanPhone) orConditions.push(`phone_no.ilike.%${cleanPhone}%`);
        if (rawCustomerPhone && rawCustomerPhone !== cleanPhone) orConditions.push(`phone_no.eq.${rawCustomerPhone}`);
        const orStr = orConditions.join(',');

        logStep(`[Webhook-Org:Step 2] 🔎 Parallel searching CRM tables for phone: ${cleanPhone}...`);

        custPromise = smartfloAdminClient
          .from('customers')
          .select('id, campaign_id, customer_name, phone_no, phone_search_hash, assigned_to, organization_id')
          .eq('organization_id', organizationId)
          .or(orStr)
          .order('updated_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        rejPromise = smartfloAdminClient
          .from('rejected_leads')
          .select('id, campaign_id, customer_name, phone_no, phone_search_hash, agent_id, organization_id')
          .eq('organization_id', organizationId)
          .or(orStr)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        closedPromise = smartfloAdminClient
          .from('closed_deals')
          .select('id, customer_id, campaign_id, customer_name, phone_no, phone_search_hash, agent_id, organization_id')
          .eq('organization_id', organizationId)
          .or(orStr)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
      }

      const configPromise = smartfloAdminClient
        .from('smartflo_dialer_config')
        .select('id, click_to_call_params')
        .eq('organization_id', organizationId)
        .maybeSingle();

      const [custRes, rejRes, closedRes, configRes] = await Promise.all([
        custPromise,
        rejPromise,
        closedPromise,
        configPromise,
      ]);

      let matchedLead: {
        id: string;
        customer_id?: string;
        campaign_id: string;
        customer_name?: string;
        assigned_to: string | null;
        table: 'customers' | 'rejected_leads' | 'closed_deals';
      } | null = null;

      if (custRes.data) {
        matchedLead = {
          id: custRes.data.id,
          customer_id: custRes.data.id,
          campaign_id: custRes.data.campaign_id,
          customer_name: custRes.data.customer_name,
          assigned_to: custRes.data.assigned_to,
          table: 'customers',
        };
        logStep(`[Webhook-Org:Step 2A] ✅ Matched in 'customers': ID=${custRes.data.id}, Assigned=${custRes.data.assigned_to}`);
      } else if (rejRes.data) {
        matchedLead = {
          id: rejRes.data.id,
          customer_id: rejRes.data.id,
          campaign_id: rejRes.data.campaign_id,
          customer_name: rejRes.data.customer_name,
          assigned_to: rejRes.data.agent_id,
          table: 'rejected_leads',
        };
        logStep(`[Webhook-Org:Step 2B] ✅ Matched in 'rejected_leads': ID=${rejRes.data.id}, Assigned=${rejRes.data.agent_id}`);
      } else if (closedRes.data) {
        matchedLead = {
          id: closedRes.data.id,
          customer_id: closedRes.data.customer_id || closedRes.data.id,
          campaign_id: closedRes.data.campaign_id,
          customer_name: closedRes.data.customer_name,
          assigned_to: closedRes.data.agent_id,
          table: 'closed_deals',
        };
        logStep(`[Webhook-Org:Step 2C] ✅ Matched in 'closed_deals': ID=${closedRes.data.id}, Assigned=${closedRes.data.agent_id}`);
      } else {
        logStep(`[Webhook-Org:Step 2] ℹ️ Lead not found in CRM. Proceeding with Fallback Agent.`);
      }

      const configuredFallbackAgentId = configRes.data?.click_to_call_params?.fallback_agent_id;
      const targetUserId = matchedLead?.assigned_to || configuredFallbackAgentId;

      let assignedExtension = '';
      let assignedNumber = '';
      let assignedUserId = '';
      let assignedSmartfloAgentId = '';
      let assignedAgentDisplayName = '';

      // Step 3 & 5: Fetch agent details (assigned or fallback)
      try {
        let agentQuery = smartfloAdminClient
          .from('user_smartflo_details')
          .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id')
          .eq('organization_id', organizationId);

        if (targetUserId) {
          agentQuery = agentQuery.eq('user_id', targetUserId);
        }

        let { data: agentRecord } = await agentQuery.limit(1).maybeSingle();

        if (!agentRecord && configuredFallbackAgentId) {
          const { data: fbBySmartfloId } = await smartfloAdminClient
            .from('user_smartflo_details')
            .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id')
            .eq('organization_id', organizationId)
            .eq('smartflo_agent_id', configuredFallbackAgentId)
            .maybeSingle();
          agentRecord = fbBySmartfloId;
        }

        if (!agentRecord) {
          const { data: defaultAgent } = await smartfloAdminClient
            .from('user_smartflo_details')
            .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id')
            .eq('organization_id', organizationId)
            .limit(1)
            .maybeSingle();
          agentRecord = defaultAgent;
        }

        if (agentRecord) {
          assignedUserId = agentRecord.user_id || targetUserId || '';
          assignedSmartfloAgentId = agentRecord.smartflo_agent_id || agentRecord.extension || '';
          assignedExtension = agentRecord.extension || agentRecord.smartflo_agent_id || '';
          assignedNumber = agentRecord.follow_me_number || agentRecord.caller_id || '';
          assignedAgentDisplayName = agentRecord.agent_name || agentRecord.login_id
            ? (matchedLead?.assigned_to ? (agentRecord.agent_name || agentRecord.login_id) : `${agentRecord.agent_name || agentRecord.login_id} (Fallback)`)
            : 'Agent';

          logStep(`[Webhook-Org:Step 3] ✅ Resolved Agent: User=${assignedUserId}, Ext=${assignedExtension}, Number=${assignedNumber}, SmartfloID=${assignedSmartfloAgentId}`);
        } else {
          logStep(`[Webhook-Org:Step 3] ❌ No active Smartflo agent found.`);
        }
      } catch (agentErr: any) {
        logStep(`[Webhook-Org:Step 3] ❌ Exception resolving agent: ${agentErr?.message}`);
      }

      // Step 4: CRM Screen Pop (fire & forget async)
      if (assignedUserId && matchedLead) {
        const targetCustId = matchedLead.customer_id || matchedLead.id;
        const targetCampId = matchedLead.campaign_id;
        if (targetCustId && targetCampId) {
          const nowIso = new Date().toISOString();
          smartfloAdminClient
            .from('call_sessions')
            .upsert(
              {
                user_id: assignedUserId,
                campaign_id: targetCampId,
                customer_id: targetCustId,
                organization_id: organizationId,
                status: 'active',
                is_manual: true,
                manual_campaign_id: targetCampId,
                manual_customer_id: targetCustId,
                manual_status: 'active',
                is_unassigned: false,
                call_start_at: nowIso,
                updated_at: nowIso,
              },
              { onConflict: 'user_id,campaign_id' }
            )
            .then(() => {
              logStep(`[Webhook-Org:Step 4] ✅ call_sessions upserted successfully.`);
            })
            .catch((err) => {
              logStep(`[Webhook-Org:Step 4] ❌ Error upserting call_sessions: ${err?.message}`);
            });
        }
      }

      // Build bridge response (Destination & Extension & Number)
      const primaryTarget = assignedExtension || assignedNumber || undefined;
      const bridgeResponse: Record<string, any> = {
        action: 'bridge',
        destination: primaryTarget,
        agent_extension: assignedExtension || undefined,
        agent_number: assignedNumber || undefined,
        rynxly_agent_id: assignedUserId || undefined,
        user_id: assignedUserId || undefined,
        agent_id: assignedSmartfloAgentId || undefined,
        fallback_queue: 'QUEUE-DEFAULT-SUPPORT',
      };

      logStep(`[Webhook-Org:Step 7] 🎯 Bridge Response: ${JSON.stringify(bridgeResponse)}`);

      // Build Inbound Dialplan Webhook Event Record
      const eventRecord = formatSmartfloWebhookEvent(
        randomUUID(),
        new Date().toISOString(),
        {
          ...payload,
          direction: 'inbound',
          call_type: 'Inbound Dialplan',
          virtual_did: virtualDid,
          customer_number: rawCustomerPhone,
          routed_to_name: assignedAgentDisplayName || null,
          routed_to_extension: assignedExtension || null,
          routed_to_number: assignedNumber || null,
          routed_to_user_id: assignedUserId || null,
          process_logs: processLogs,
        }
      );

      const targetWebhookId = config.webhook_id || config.integration_id || webhookId;
      smartfloAdminClient.from('webhook_responses').insert({
        id: eventRecord.id,
        webhook_id: targetWebhookId,
        organization_id: config.organization_id,
        response: eventRecord,
        created_at: eventRecord.receivedAt,
      }).then(() => {}).catch(() => {});

      return res.status(200).json(bridgeResponse);
    }

    const eventRecord = formatSmartfloWebhookEvent(
      randomUUID(),
      new Date().toISOString(),
      payload
    );

    // Ensure webhook exists in public.webhooks table
    const targetWebhookId = config.webhook_id || config.integration_id || webhookId;
    await smartfloAdminClient
      .from('webhooks')
      .upsert(
        {
          webhook_id: targetWebhookId,
          organization_id: config.organization_id,
          webhook_for: 'smartflo',
          webhook_type: 'click_to_call',
        },
        { onConflict: 'webhook_id' }
      );

    // Insert into public.webhook_responses
    await smartfloAdminClient
      .from('webhook_responses')
      .insert({
        id: eventRecord.id,
        webhook_id: targetWebhookId,
        organization_id: config.organization_id,
        response: eventRecord,
        created_at: eventRecord.receivedAt,
      });

    // Also update smartflo_dialer_config.webhook_events
    const existingEvents = Array.isArray(config.webhook_events) ? config.webhook_events : [];
    const updatedEvents = [eventRecord, ...existingEvents].slice(0, 50);

    await smartfloAdminClient
      .from('smartflo_dialer_config')
      .update({
        webhook_events: updatedEvents,
        updated_at: new Date().toISOString(),
      })
      .eq('id', config.id);

    // Automatic insertion to call_history if custom_identifier.call_type === 'c2c_cus_out'
    try {
      await syncSmartfloWebhookToCallHistory(payload, config.organization_id);
    } catch (histErr) {
      console.error('[Webhook org] Error during syncSmartfloWebhookToCallHistory:', histErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Smartflo webhook event recorded successfully.',
      eventId: eventRecord.id,
    });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed.' });
}
