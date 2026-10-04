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

  const { orgId, webhookId } = req.query;
  const organizationId = Array.isArray(orgId) ? orgId[0] : orgId;
  const currentWebhookId = Array.isArray(webhookId) ? webhookId[0] : webhookId;

  if (!organizationId || typeof organizationId !== 'string') {
    return res.status(400).json({ error: 'Missing organization identifier in webhook URL.' });
  }

  if (!currentWebhookId || typeof currentWebhookId !== 'string') {
    return res.status(400).json({ error: 'Missing webhook identifier in webhook URL.' });
  }

  if (!smartfloAdminClient) {
    return res.status(500).json({ error: 'Database service is unavailable.' });
  }

  // Verify that the webhook exists in public.webhooks table
  let { data: webhookRecord, error: webhookError } = await smartfloAdminClient
    .from('webhooks')
    .select('id, webhook_id, organization_id, webhook_for, webhook_type')
    .eq('organization_id', organizationId)
    .eq('webhook_id', currentWebhookId)
    .maybeSingle();

  if (webhookError) {
    console.error('[Webhook] Error checking webhooks table:', webhookError);
  }

  // If not found, auto-register or check if it matches dialer config
  if (!webhookRecord) {
    const { data: config } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .select('organization_id, integration_id')
      .eq('organization_id', organizationId)
      .maybeSingle();

    if (config) {
      const { data: insertedWebhook } = await smartfloAdminClient
        .from('webhooks')
        .upsert(
          {
            webhook_id: currentWebhookId,
            organization_id: organizationId,
            webhook_for: 'smartflo',
            webhook_type: 'click_to_call',
          },
          { onConflict: 'webhook_id' }
        )
        .select()
        .single();

      webhookRecord = insertedWebhook;
    }
  }

  if (req.method === 'GET') {
    // Fetch latest 50 responses from public.webhook_responses for this organization
    const { data: responses, error: fetchError } = await smartfloAdminClient
      .from('webhook_responses')
      .select('id, webhook_id, organization_id, response, created_at')
      .eq('organization_id', organizationId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (fetchError) {
      console.error('[Webhook] Error reading responses:', fetchError);
      return res.status(500).json({ error: 'Failed to load webhook responses.' });
    }

    let events: SmartfloWebhookEvent[] = (responses || []).map((row) =>
      formatSmartfloWebhookEvent(row.id, row.created_at, row.response)
    );

    // Fallback to dialer config webhook_events if responses is empty
    if (events.length === 0) {
      const { data: config } = await smartfloAdminClient
        .from('smartflo_dialer_config')
        .select('webhook_events')
        .eq('organization_id', organizationId)
        .maybeSingle();

      if (Array.isArray(config?.webhook_events) && config.webhook_events.length > 0) {
        events = config.webhook_events.map((item: any, idx: number) =>
          formatSmartfloWebhookEvent(item.id || `legacy-${idx}`, item.receivedAt, item)
        );
      }
    }

    return res.status(200).json({
      success: true,
      orgId: organizationId,
      webhookId: currentWebhookId,
      events,
    });
  }

  if (req.method === 'DELETE') {
    await smartfloAdminClient
      .from('webhook_responses')
      .delete()
      .eq('organization_id', organizationId);

    await smartfloAdminClient
      .from('smartflo_dialer_config')
      .update({ webhook_events: [], updated_at: new Date().toISOString() })
      .eq('organization_id', organizationId);

    return res.status(200).json({ success: true, message: 'Webhook responses cleared.' });
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

    console.log('\n=================== 📞 [SMARTFLO WEBHOOK INCOMING] ===================');
    const processLogs: string[] = [];
    const logStep = (msg: string) => {
      console.log(msg);
      processLogs.push(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
    };

    logStep(`[Webhook-Dialplan:Step 0] Method: ${req.method} | Org: ${organizationId} | WebhookID: ${currentWebhookId}`);
    logStep(`[Webhook-Dialplan:Step 0] Body Payload: ${JSON.stringify(payload)}`);

    // 1. Identify if this is an Inbound Dialplan request
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

    logStep(`[Webhook-Dialplan:Step 1] Is Inbound Dialplan: ${isInboundDialplan} (call_type param: "${callTypeParam}")`);

    // 2. INBOUND DIALPLAN FLOW: Dynamic Lead Routing & Call Session Activation
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

      // Normalize phone number: strip non-digits, remove country code prefix (91 or 0)
      const rawDigits = rawCustomerPhone.replace(/\D/g, '');
      let cleanPhone = rawDigits;
      if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
        cleanPhone = cleanPhone.slice(2);
      } else if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) {
        cleanPhone = cleanPhone.slice(1);
      } else if (cleanPhone.length > 10) {
        cleanPhone = cleanPhone.slice(-10);
      }

      // Compute hashes for bulletproof encrypted phone search
      const hashes = [
        cleanPhone ? computePhoneHash(cleanPhone) : null,
        rawDigits && rawDigits !== cleanPhone ? computePhoneHash(rawDigits) : null,
        cleanPhone ? computePhoneHash(`0${cleanPhone}`) : null,
      ].filter((h): h is string => Boolean(h));

      logStep(`[Webhook-Dialplan:Step 1] 📞 Raw Phone: "${rawCustomerPhone}" -> Clean 10-Digit: "${cleanPhone}" | Virtual DID: "${virtualDid}"`);

      // Parallel Lead Search + Dialer Config in a single Promise.all for <200ms response
      let custPromise: PromiseLike<any> = Promise.resolve({ data: null, error: null });
      let rejPromise: PromiseLike<any> = Promise.resolve({ data: null, error: null });
      let closedPromise: PromiseLike<any> = Promise.resolve({ data: null, error: null });

      if (cleanPhone || hashes.length > 0) {
        const orConditions: string[] = [];
        for (const h of hashes) orConditions.push(`phone_search_hash.eq.${h}`);
        if (cleanPhone) orConditions.push(`phone_no.ilike.%${cleanPhone}%`);
        if (rawCustomerPhone && rawCustomerPhone !== cleanPhone) orConditions.push(`phone_no.eq.${rawCustomerPhone}`);
        const orStr = orConditions.join(',');

        logStep(`[Webhook-Dialplan:Step 2] 🔎 Parallel searching CRM tables for phone: ${cleanPhone}...`);

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
        logStep(`[Webhook-Dialplan:Step 2A] ✅ Matched in 'customers': ID=${custRes.data.id}, Assigned=${custRes.data.assigned_to}`);
      } else if (rejRes.data) {
        matchedLead = {
          id: rejRes.data.id,
          customer_id: rejRes.data.id,
          campaign_id: rejRes.data.campaign_id,
          customer_name: rejRes.data.customer_name,
          assigned_to: rejRes.data.agent_id,
          table: 'rejected_leads',
        };
        logStep(`[Webhook-Dialplan:Step 2B] ✅ Matched in 'rejected_leads': ID=${rejRes.data.id}, Assigned=${rejRes.data.agent_id}`);
      } else if (closedRes.data) {
        matchedLead = {
          id: closedRes.data.id,
          customer_id: closedRes.data.customer_id || closedRes.data.id,
          campaign_id: closedRes.data.campaign_id,
          customer_name: closedRes.data.customer_name,
          assigned_to: closedRes.data.agent_id,
          table: 'closed_deals',
        };
        logStep(`[Webhook-Dialplan:Step 2C] ✅ Matched in 'closed_deals': ID=${closedRes.data.id}, Assigned=${closedRes.data.agent_id}`);
      } else {
        logStep(`[Webhook-Dialplan:Step 2] ℹ️ Lead not found in CRM. Proceeding with Fallback Agent.`);
      }

      const configuredFallbackAgentId = configRes.data?.click_to_call_params?.fallback_agent_id;
      const targetUserId = matchedLead?.assigned_to || configuredFallbackAgentId;

      let assignedExtension = '';
      let assignedNumber = '';
      let assignedUserId = '';
      let assignedSmartfloAgentId = '';
      let assignedIntercom = '';
      let assignedAgentDisplayName = '';

      // Step 3 & 5: Fetch agent details (assigned or fallback)
      try {
        let agentQuery = smartfloAdminClient
          .from('user_smartflo_details')
          .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id, intercom, smartflo_user_id')
          .eq('organization_id', organizationId);

        if (targetUserId) {
          agentQuery = agentQuery.eq('user_id', targetUserId);
        }

        let { data: agentRecord } = await agentQuery.limit(1).maybeSingle();

        if (!agentRecord && configuredFallbackAgentId) {
          const { data: fbBySmartfloId } = await smartfloAdminClient
            .from('user_smartflo_details')
            .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id, intercom, smartflo_user_id')
            .eq('organization_id', organizationId)
            .eq('smartflo_agent_id', configuredFallbackAgentId)
            .maybeSingle();
          agentRecord = fbBySmartfloId;
        }

        if (!agentRecord) {
          const { data: defaultAgent } = await smartfloAdminClient
            .from('user_smartflo_details')
            .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id, intercom, smartflo_user_id')
            .eq('organization_id', organizationId)
            .limit(1)
            .maybeSingle();
          agentRecord = defaultAgent;
        }

        if (agentRecord) {
          assignedUserId = agentRecord.user_id || targetUserId || '';
          assignedSmartfloAgentId = agentRecord.smartflo_agent_id || agentRecord.extension || '';
          assignedExtension = agentRecord.extension || agentRecord.smartflo_agent_id || '';
          assignedIntercom = agentRecord.intercom || '';
          assignedNumber = agentRecord.follow_me_number || agentRecord.caller_id || '';
          assignedAgentDisplayName = agentRecord.agent_name || agentRecord.login_id
            ? (matchedLead?.assigned_to ? (agentRecord.agent_name || agentRecord.login_id) : `${agentRecord.agent_name || agentRecord.login_id} (Fallback)`)
            : 'Agent';

          logStep(`[Webhook-Dialplan:Step 3] ✅ Resolved Agent: User=${assignedUserId}, Ext=${assignedExtension}, Intercom=${assignedIntercom}, Number=${assignedNumber}, SmartfloID=${assignedSmartfloAgentId}`);
        } else {
          logStep(`[Webhook-Dialplan:Step 3] ❌ No active Smartflo agent found.`);
        }
      } catch (agentErr: any) {
        logStep(`[Webhook-Dialplan:Step 3] ❌ Exception resolving agent: ${agentErr?.message}`);
      }

      // Step 4: CRM Screen Pop (fire & forget async)
      if (assignedUserId && matchedLead) {
        const targetCustId = matchedLead.customer_id || matchedLead.id;
        const targetCampId = matchedLead.campaign_id;
        if (targetCustId && targetCampId) {
          const nowIso = new Date().toISOString();
          void (async () => {
            try {
              await smartfloAdminClient!
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
                );
              logStep(`[Webhook-Dialplan:Step 4] ✅ call_sessions upserted successfully.`);
            } catch (err: any) {
              logStep(`[Webhook-Dialplan:Step 4] ❌ Error upserting call_sessions: ${err?.message}`);
            }
          })();
        }
      }

      // Build bridge response (Destination & Extension & Number)
      const primaryTarget = assignedExtension || assignedSmartfloAgentId || assignedNumber || undefined;
      const bridgeResponse: Record<string, any> = {
        action: 'transfer',
        type: 'agent',
        destination: primaryTarget,
        value: primaryTarget,
        transfer_to: primaryTarget,
        agent_id: assignedSmartfloAgentId || undefined,
        agent_extension: assignedExtension || undefined,
        extension: assignedExtension || undefined,
        intercom: assignedIntercom || undefined,
        agent_number: assignedNumber || undefined,
        phone_number: assignedNumber || undefined,
        rynxly_agent_id: assignedUserId || undefined,
        user_id: assignedUserId || undefined,
        fallback_queue: 'QUEUE-DEFAULT-SUPPORT',
      };

      logStep(`[Webhook-Dialplan:Step 7] 🎯 Bridge Response: ${JSON.stringify(bridgeResponse)}`);

      // Build Inbound Dialplan Webhook Event Record
      const callId = String(
        payload.call_id ||
        payload.ref_id ||
        payload.uuid ||
        `inbound-${Date.now()}`
      );
      const refId = String(payload.uuid || payload.ref_id || callId);

      const agentDisplay = assignedAgentDisplayName
        ? `${assignedAgentDisplayName}${assignedExtension ? ` (Ext: ${assignedExtension})` : assignedNumber ? ` (${assignedNumber})` : ''}`
        : assignedExtension
        ? `Ext: ${assignedExtension}`
        : assignedNumber
        ? assignedNumber
        : 'Fallback Queue';

      const eventRecord: SmartfloWebhookEvent = {
        id: randomUUID(),
        receivedAt: new Date().toISOString(),
        callId,
        refId,
        direction: 'inbound',
        callType: 'Inbound Dialplan',
        agentNumber: agentDisplay,
        destinationNumber: rawCustomerPhone || cleanPhone || 'Unknown Customer',
        status: 'bridged',
        hangupCause: 'ROUTED_TO_AGENT',
        duration: 0,
        recordingUrl: null,
        rawPayload: {
          ...payload,
          virtual_did: virtualDid,
          customer_number: rawCustomerPhone,
          matched_lead_id: matchedLead?.id || null,
          matched_lead_table: matchedLead?.table || null,
          routed_to_user_id: assignedUserId || null,
          routed_to_name: assignedAgentDisplayName || null,
          routed_to_extension: assignedExtension || null,
          routed_to_number: assignedNumber || null,
          process_logs: processLogs,
        },
      };

      // Save to database
      void (async () => {
        try {
          await smartfloAdminClient!.from('webhook_responses').insert({
            id: eventRecord.id,
            webhook_id: currentWebhookId,
            organization_id: organizationId,
            response: eventRecord,
            created_at: eventRecord.receivedAt,
          });

          // Dual-write to dialer config
          if (configRes.data?.id) {
            const { data: curCfg } = await smartfloAdminClient!
              .from('smartflo_dialer_config')
              .select('webhook_events')
              .eq('id', configRes.data.id)
              .maybeSingle();

            const existing = Array.isArray(curCfg?.webhook_events) ? curCfg.webhook_events : [];
            await smartfloAdminClient!
              .from('smartflo_dialer_config')
              .update({
                webhook_events: [eventRecord, ...existing].slice(0, 50),
                updated_at: new Date().toISOString(),
              })
              .eq('id', configRes.data.id);
          }
        } catch (dbErr: any) {
          console.error('[Smartflo Webhook] Error persisting response in background:', dbErr?.message);
        }
      })();

      // Return INSTANT HTTP 200 response to Smartflo PBX (< 200ms)
      return res.status(200).json(bridgeResponse);
    }

    // 4. OUTBOUND / STANDARD HANGUP WEBHOOK FLOW
    const callId = String(
      payload.call_id ||
      payload.ref_id ||
      payload.uuid ||
      payload.id ||
      payload.custom_identifier ||
      `call-${Date.now()}`
    );

    const rawStatus = String(
      payload.call_status ||
      payload.status ||
      payload.disposition ||
      payload.event ||
      'completed'
    );

    const rawDirection = String(
      payload.direction ||
      payload.call_direction ||
      'outbound'
    );

    const rawCallType = String(
      payload.direction === 'clicktocall' ? 'Click to Call' :
      payload.call_type ||
      'Click to Call'
    );

    let agentNumber = '';
    if (typeof payload.answered_agent_name === 'string' && payload.answered_agent_name) {
      agentNumber = `${payload.answered_agent_name} ${payload.answered_agent_number ? `(${payload.answered_agent_number})` : ''}`.trim();
    } else if (Array.isArray(payload.missed_agent) && payload.missed_agent.length > 0) {
      const firstMissed = payload.missed_agent[0] as Record<string, unknown>;
      const name = firstMissed.name ? String(firstMissed.name) : '';
      const num = firstMissed.number || firstMissed.agent_number || firstMissed.id || '';
      agentNumber = name ? `${name} (${num})` : String(num);
    } else {
      agentNumber = String(
        payload.agent_name ||
        payload.agent_number ||
        payload.caller_id ||
        payload.agent ||
        ''
      );
    }

    const destinationNumber = String(
      payload.call_to_number ||
      payload['customer_no_with_prefix '] ||
      payload.customer_no_with_prefix ||
      payload.destination_number ||
      payload.customer_number ||
      payload.digits_dialed ||
      payload.to ||
      ''
    ).trim();

    const hangupCause = String(
      payload.hangup_cause_description ||
      payload.hangup_cause_key ||
      payload.hangup_cause ||
      payload.cause ||
      payload.reason ||
      'NORMAL_CLEARING'
    );

    const duration = Number(
      payload.duration ??
      payload.billsec ??
      payload.call_duration ??
      payload.talk_duration ??
      0
    );

    const recordingUrl = payload.recording_url || payload.record_url || payload.recording
      ? String(payload.recording_url || payload.record_url || payload.recording)
      : null;

    const refId = String(
      payload.ref_id ||
      payload.uuid ||
      payload.custom_identifier ||
      callId
    );

    const eventRecord: SmartfloWebhookEvent = {
      id: randomUUID(),
      receivedAt: new Date().toISOString(),
      callId,
      refId,
      direction: rawDirection,
      callType: rawCallType,
      agentNumber,
      destinationNumber,
      status: rawStatus,
      hangupCause,
      duration: Number.isFinite(duration) ? duration : 0,
      recordingUrl,
      rawPayload: payload,
    };

    // Insert into public.webhook_responses
    const { error: insertError } = await smartfloAdminClient
      .from('webhook_responses')
      .insert({
        id: eventRecord.id,
        webhook_id: currentWebhookId,
        organization_id: organizationId,
        response: eventRecord,
        created_at: eventRecord.receivedAt,
      });

    if (insertError) {
      console.error('[Webhook] Failed to insert into webhook_responses:', insertError);
      return res.status(500).json({ error: 'Failed to record webhook response in database.' });
    }

    // Also dual-write into smartflo_dialer_config.webhook_events
    try {
      const { data: currentConfig } = await smartfloAdminClient
        .from('smartflo_dialer_config')
        .select('id, webhook_events')
        .eq('organization_id', organizationId)
        .maybeSingle();

      if (currentConfig) {
        const existing = Array.isArray(currentConfig.webhook_events) ? currentConfig.webhook_events : [];
        await smartfloAdminClient
          .from('smartflo_dialer_config')
          .update({
            webhook_events: [eventRecord, ...existing].slice(0, 50),
            updated_at: new Date().toISOString(),
          })
          .eq('id', currentConfig.id);
      }
    } catch (err) {
      console.error('[Webhook] Dual-write to dialer config failed:', err);
    }

    // Automatic insertion to call_history if custom_identifier.call_type === 'c2c_cus_out'
    try {
      await syncSmartfloWebhookToCallHistory(payload, organizationId);
    } catch (histErr) {
      console.error('[Webhook] Error during syncSmartfloWebhookToCallHistory:', histErr);
    }

    return res.status(200).json({
      success: true,
      message: 'Smartflo webhook response recorded successfully.',
      eventId: eventRecord.id,
    });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed.' });
}
