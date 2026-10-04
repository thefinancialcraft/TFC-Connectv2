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

      // Step 2: Search CRM Lead Tables
      if (cleanPhone || hashes.length > 0) {
        // A. Search customers
        try {
          logStep(`[Webhook-Org:Step 2A] 🔎 Searching 'customers' table for phone: ${cleanPhone}...`);
          let query = smartfloAdminClient
            .from('customers')
            .select('id, campaign_id, customer_name, phone_no, phone_search_hash, assigned_to, organization_id')
            .eq('organization_id', organizationId);

          const orConditions: string[] = [];
          for (const h of hashes) orConditions.push(`phone_search_hash.eq.${h}`);
          if (cleanPhone) orConditions.push(`phone_no.ilike.%${cleanPhone}%`);
          if (rawCustomerPhone && rawCustomerPhone !== cleanPhone) orConditions.push(`phone_no.eq.${rawCustomerPhone}`);
          query = query.or(orConditions.join(','));

          const { data: customerData, error: custErr } = await query
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (custErr) {
            logStep(`[Webhook-Org:Step 2A] ❌ Error querying customers table: ${custErr.message}`);
          } else if (customerData) {
            logStep(`[Webhook-Org:Step 2A] ✅ Matched lead in 'customers' table! ID: ${customerData.id}, Assigned User: ${customerData.assigned_to}`);
            matchedLead = {
              id: customerData.id,
              customer_id: customerData.id,
              campaign_id: customerData.campaign_id,
              customer_name: customerData.customer_name,
              assigned_to: customerData.assigned_to,
              table: 'customers',
            };
          } else {
            logStep(`[Webhook-Org:Step 2A] ℹ️ No match found in 'customers' table.`);
          }
        } catch (e: any) {
          logStep(`[Webhook-Org:Step 2A] ❌ Exception querying customers: ${e?.message}`);
        }

        // B. Search rejected_leads
        if (!matchedLead) {
          try {
            logStep(`[Webhook-Org:Step 2B] 🔎 Searching 'rejected_leads' table for phone: ${cleanPhone}...`);
            let rejQuery = smartfloAdminClient
              .from('rejected_leads')
              .select('id, campaign_id, customer_name, phone_no, phone_search_hash, agent_id, organization_id')
              .eq('organization_id', organizationId);

            const orConditions: string[] = [];
            for (const h of hashes) orConditions.push(`phone_search_hash.eq.${h}`);
            if (cleanPhone) orConditions.push(`phone_no.ilike.%${cleanPhone}%`);
            if (rawCustomerPhone && rawCustomerPhone !== cleanPhone) orConditions.push(`phone_no.eq.${rawCustomerPhone}`);
            rejQuery = rejQuery.or(orConditions.join(','));

            const { data: rejectedData, error: rejErr } = await rejQuery
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (rejErr) {
              logStep(`[Webhook-Org:Step 2B] ❌ Error querying rejected_leads table: ${rejErr.message}`);
            } else if (rejectedData) {
              logStep(`[Webhook-Org:Step 2B] ✅ Matched lead in 'rejected_leads' table! ID: ${rejectedData.id}, Assigned User: ${rejectedData.agent_id}`);
              matchedLead = {
                id: rejectedData.id,
                customer_id: rejectedData.id,
                campaign_id: rejectedData.campaign_id,
                customer_name: rejectedData.customer_name,
                assigned_to: rejectedData.agent_id,
                table: 'rejected_leads',
              };
            } else {
              logStep(`[Webhook-Org:Step 2B] ℹ️ No match found in 'rejected_leads' table.`);
            }
          } catch (e: any) {
            logStep(`[Webhook-Org:Step 2B] ❌ Exception querying rejected_leads: ${e?.message}`);
          }
        }

        // C. Search closed_deals
        if (!matchedLead) {
          try {
            logStep(`[Webhook-Org:Step 2C] 🔎 Searching 'closed_deals' table for phone: ${cleanPhone}...`);
            let closedQuery = smartfloAdminClient
              .from('closed_deals')
              .select('id, customer_id, campaign_id, customer_name, phone_no, phone_search_hash, agent_id, organization_id')
              .eq('organization_id', organizationId);

            const orConditions: string[] = [];
            for (const h of hashes) orConditions.push(`phone_search_hash.eq.${h}`);
            if (cleanPhone) orConditions.push(`phone_no.ilike.%${cleanPhone}%`);
            if (rawCustomerPhone && rawCustomerPhone !== cleanPhone) orConditions.push(`phone_no.eq.${rawCustomerPhone}`);
            closedQuery = closedQuery.or(orConditions.join(','));

            const { data: closedData, error: closedErr } = await closedQuery
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (closedErr) {
              logStep(`[Webhook-Org:Step 2C] ❌ Error querying closed_deals table: ${closedErr.message}`);
            } else if (closedData) {
              logStep(`[Webhook-Org:Step 2C] ✅ Matched lead in 'closed_deals' table! ID: ${closedData.id}, Assigned User: ${closedData.agent_id}`);
              matchedLead = {
                id: closedData.id,
                customer_id: closedData.customer_id || closedData.id,
                campaign_id: closedData.campaign_id,
                customer_name: closedData.customer_name,
                assigned_to: closedData.agent_id,
                table: 'closed_deals',
              };
            } else {
              logStep(`[Webhook-Org:Step 2C] ℹ️ No match found in 'closed_deals' table.`);
            }
          } catch (e: any) {
            logStep(`[Webhook-Org:Step 2C] ❌ Exception querying closed_deals: ${e?.message}`);
          }
        }
      }

      if (!matchedLead) {
        logStep(`[Webhook-Org:Step 2] ⚠️ Lead not found in CRM for caller "${rawCustomerPhone}". Proceeding to Fallback Agent.`);
      }

      let assignedExtension = '';
      let assignedNumber = '';
      let assignedUserId = '';
      let assignedSmartfloAgentId = '';
      let assignedAgentDisplayName = '';

      // Step 3: Mapped Assigned Lead Agent Details
      if (matchedLead?.assigned_to) {
        try {
          logStep(`[Webhook-Org:Step 3] 👤 Looking up Smartflo mapping for assigned user_id: ${matchedLead.assigned_to}...`);
          const { data: agentDetails, error: agErr } = await smartfloAdminClient
            .from('user_smartflo_details')
            .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id')
            .eq('user_id', matchedLead.assigned_to)
            .eq('organization_id', organizationId)
            .maybeSingle();

          if (agErr) {
            logStep(`[Webhook-Org:Step 3] ❌ Error querying user_smartflo_details: ${agErr.message}`);
          } else if (agentDetails) {
            assignedUserId = agentDetails.user_id || matchedLead.assigned_to;
            assignedSmartfloAgentId = agentDetails.smartflo_agent_id || agentDetails.extension || '';
            assignedExtension = agentDetails.extension || agentDetails.smartflo_agent_id || '';
            assignedNumber = agentDetails.follow_me_number || agentDetails.caller_id || '';
            assignedAgentDisplayName = agentDetails.agent_name || agentDetails.login_id || `User ${assignedUserId.slice(0, 8)}`;

            logStep(`[Webhook-Org:Step 3] ✅ Assigned Agent Details: User=${assignedUserId}, Ext=${assignedExtension}, Number=${assignedNumber}, SmartfloID=${assignedSmartfloAgentId}`);

            // Step 4: Screen Pop & Call Session Activation
            const targetCustId = matchedLead.customer_id || matchedLead.id;
            const targetCampId = matchedLead.campaign_id;
            if (targetCustId && targetCampId) {
              const nowIso = new Date().toISOString();
              logStep(`[Webhook-Org:Step 4] 🚀 Activating CRM Screen Pop: user=${assignedUserId}, customer=${targetCustId}, campaign=${targetCampId}`);
              const { error: sessionErr } = await smartfloAdminClient
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

              if (sessionErr) {
                logStep(`[Webhook-Org:Step 4] ❌ Error upserting call_sessions: ${sessionErr.message}`);
              } else {
                logStep(`[Webhook-Org:Step 4] ✅ call_sessions upserted successfully.`);
              }

              await smartfloAdminClient
                .from('user_profiles')
                .update({
                  on_call: true,
                  is_personal: false,
                  updated_at: nowIso,
                })
                .eq('user_id', assignedUserId);
            }
          } else {
            logStep(`[Webhook-Org:Step 3] ⚠️ Assigned user ${matchedLead.assigned_to} has no user_smartflo_details mapping.`);
          }
        } catch (e: any) {
          logStep(`[Webhook-Org:Step 3] ❌ Exception fetching agent details: ${e?.message}`);
        }
      }

      // Step 5: Fallback Agent Resolution
      if (!assignedExtension && !assignedNumber) {
        try {
          logStep(`[Webhook-Org:Step 5] 🔁 Resolving Fallback Agent...`);
          const { data: configData, error: cfgErr } = await smartfloAdminClient
            .from('smartflo_dialer_config')
            .select('click_to_call_params')
            .eq('organization_id', organizationId)
            .maybeSingle();

          if (cfgErr) {
            logStep(`[Webhook-Org:Step 5] ❌ Error fetching dialer config for fallback agent: ${cfgErr.message}`);
          }

          const configuredFallbackAgentId = configData?.click_to_call_params?.fallback_agent_id;
          logStep(`[Webhook-Org:Step 5] Configured Fallback Agent ID: "${configuredFallbackAgentId}"`);

          let fallbackAgentRecord: any = null;

          if (configuredFallbackAgentId) {
            const { data: fbAgent } = await smartfloAdminClient
              .from('user_smartflo_details')
              .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id')
              .eq('organization_id', organizationId)
              .eq('user_id', configuredFallbackAgentId)
              .maybeSingle();

            fallbackAgentRecord = fbAgent;

            if (!fallbackAgentRecord) {
              const { data: fbBySmartfloId } = await smartfloAdminClient
                .from('user_smartflo_details')
                .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id')
                .eq('organization_id', organizationId)
                .eq('smartflo_agent_id', configuredFallbackAgentId)
                .maybeSingle();
              fallbackAgentRecord = fbBySmartfloId;
            }
          }

          if (!fallbackAgentRecord) {
            logStep(`[Webhook-Org:Step 5] Fetching first available active mapped agent in org...`);
            const { data: defaultAgent } = await smartfloAdminClient
              .from('user_smartflo_details')
              .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id')
              .eq('organization_id', organizationId)
              .limit(1)
              .maybeSingle();
            fallbackAgentRecord = defaultAgent;
          }

          if (fallbackAgentRecord) {
            assignedUserId = fallbackAgentRecord.user_id || configuredFallbackAgentId || '';
            assignedSmartfloAgentId = fallbackAgentRecord.smartflo_agent_id || fallbackAgentRecord.extension || '';
            assignedExtension = fallbackAgentRecord.extension || fallbackAgentRecord.smartflo_agent_id || '';
            assignedNumber = fallbackAgentRecord.follow_me_number || fallbackAgentRecord.caller_id || '';
            assignedAgentDisplayName = fallbackAgentRecord.agent_name || fallbackAgentRecord.login_id
              ? `${fallbackAgentRecord.agent_name || fallbackAgentRecord.login_id} (Fallback)`
              : 'Fallback Agent';

            logStep(`[Webhook-Org:Step 5] ✅ Selected Fallback Agent: User=${assignedUserId}, Ext=${assignedExtension}, Number=${assignedNumber}, SmartfloID=${assignedSmartfloAgentId}`);
          } else {
            logStep(`[Webhook-Org:Step 5] ❌ No active Smartflo agent found in org for fallback routing!`);
          }
        } catch (e: any) {
          logStep(`[Webhook-Org:Step 5] ❌ Exception resolving fallback agent: ${e?.message}`);
        }
      }

      // Step 6: Create and Save Event Record
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
      logStep(`[Webhook-Org:Step 6] 💾 Saving eventRecord to webhook_responses (ID: ${eventRecord.id})...`);
      const { error: insErr } = await smartfloAdminClient.from('webhook_responses').insert({
        id: eventRecord.id,
        webhook_id: targetWebhookId,
        organization_id: config.organization_id,
        response: eventRecord,
        created_at: eventRecord.receivedAt,
      });

      if (insErr) {
        logStep(`[Webhook-Org:Step 6] ❌ Error inserting webhook_responses: ${insErr.message}`);
      } else {
        logStep(`[Webhook-Org:Step 6] ✅ Webhook event successfully saved.`);
      }

      // Step 7: Build & Return Clean Bridge Response
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

      logStep(`[Webhook-Org:Step 7] 🎯 Final Bridge Response Sent to Smartflo: ${JSON.stringify(bridgeResponse)}`);

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
