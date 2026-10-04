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
    console.log('\n================== 📥 SMARTFLO WEBHOOK RECEIVED ==================');
    console.log(`[Webhook-Dialplan:Step 0] Method: ${req.method} | Org: ${organizationId} | WebhookID: ${currentWebhookId}`);
    console.log('[Webhook-Dialplan:Step 0] Query:', JSON.stringify(req.query));
    console.log('[Webhook-Dialplan:Step 0] Headers:', JSON.stringify(req.headers));
    console.log('[Webhook-Dialplan:Step 0] Body Payload:', JSON.stringify(payload, null, 2));

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

    console.log(`[Webhook-Dialplan:Step 1] Is Inbound Dialplan: ${isInboundDialplan} (call_type param: "${callTypeParam}")`);

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

      console.log(`[Webhook-Dialplan:Step 1] 📞 Raw Phone: "${rawCustomerPhone}" -> Clean 10-Digit: "${cleanPhone}" | Virtual DID: "${virtualDid}"`);
      console.log(`[Webhook-Dialplan:Step 1] 🔑 Phone Search Hashes Generated:`, hashes);

      let matchedLead: {
        id: string;
        customer_id?: string;
        campaign_id: string;
        customer_name?: string;
        assigned_to: string | null;
        table: 'customers' | 'rejected_leads' | 'closed_deals';
      } | null = null;

      // Search DB tables in order: customers -> rejected_leads -> closed_deals
      if (cleanPhone || hashes.length > 0) {
        // A. Search 'customers' table
        try {
          console.log(`[Webhook-Dialplan:Step 2A] 🔎 Searching 'customers' table for phone: ${cleanPhone}...`);
          let query = smartfloAdminClient
            .from('customers')
            .select('id, campaign_id, customer_name, phone_no, phone_search_hash, assigned_to, organization_id')
            .eq('organization_id', organizationId);

          const orConditions: string[] = [];
          for (const h of hashes) {
            orConditions.push(`phone_search_hash.eq.${h}`);
          }
          if (cleanPhone) {
            orConditions.push(`phone_no.ilike.%${cleanPhone}%`);
          }
          if (rawCustomerPhone && rawCustomerPhone !== cleanPhone) {
            orConditions.push(`phone_no.eq.${rawCustomerPhone}`);
          }
          query = query.or(orConditions.join(','));

          const { data: customerData, error: custErr } = await query
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (custErr) {
            console.error('[Webhook-Dialplan:Step 2A] ❌ Error searching customers table:', custErr);
          } else if (customerData) {
            console.log(`[Webhook-Dialplan:Step 2A] ✅ Matched lead in 'customers' table: ID=${customerData.id}, Assigned User=${customerData.assigned_to}`);
            matchedLead = {
              id: customerData.id,
              customer_id: customerData.id,
              campaign_id: customerData.campaign_id,
              customer_name: customerData.customer_name,
              assigned_to: customerData.assigned_to,
              table: 'customers',
            };
          } else {
            console.log(`[Webhook-Dialplan:Step 2A] ℹ️ No match found in 'customers' table.`);
          }
        } catch (e) {
          console.error('[Webhook-Dialplan:Step 2A] ❌ Exception querying customers:', e);
        }

        // B. Search 'rejected_leads' table
        if (!matchedLead) {
          try {
            console.log(`[Webhook-Dialplan:Step 2B] 🔎 Searching 'rejected_leads' table for phone: ${cleanPhone}...`);
            let rejQuery = smartfloAdminClient
              .from('rejected_leads')
              .select('id, campaign_id, customer_name, phone_no, phone_search_hash, agent_id, organization_id')
              .eq('organization_id', organizationId);

            const orConditions: string[] = [];
            for (const h of hashes) {
              orConditions.push(`phone_search_hash.eq.${h}`);
            }
            if (cleanPhone) {
              orConditions.push(`phone_no.ilike.%${cleanPhone}%`);
            }
            if (rawCustomerPhone && rawCustomerPhone !== cleanPhone) {
              orConditions.push(`phone_no.eq.${rawCustomerPhone}`);
            }
            rejQuery = rejQuery.or(orConditions.join(','));

            const { data: rejectedData, error: rejErr } = await rejQuery
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (rejErr) {
              console.error('[Webhook-Dialplan:Step 2B] ❌ Error searching rejected_leads table:', rejErr);
            } else if (rejectedData) {
              console.log(`[Webhook-Dialplan:Step 2B] ✅ Matched lead in 'rejected_leads' table: ID=${rejectedData.id}, Assigned User=${rejectedData.agent_id}`);
              matchedLead = {
                id: rejectedData.id,
                customer_id: rejectedData.id,
                campaign_id: rejectedData.campaign_id,
                customer_name: rejectedData.customer_name,
                assigned_to: rejectedData.agent_id,
                table: 'rejected_leads',
              };
            } else {
              console.log(`[Webhook-Dialplan:Step 2B] ℹ️ No match found in 'rejected_leads' table.`);
            }
          } catch (e) {
            console.error('[Webhook-Dialplan:Step 2B] ❌ Exception querying rejected_leads:', e);
          }
        }

        // C. Search 'closed_deals' table
        if (!matchedLead) {
          try {
            console.log(`[Webhook-Dialplan:Step 2C] 🔎 Searching 'closed_deals' table for phone: ${cleanPhone}...`);
            let closedQuery = smartfloAdminClient
              .from('closed_deals')
              .select('id, customer_id, campaign_id, customer_name, phone_no, phone_search_hash, agent_id, organization_id')
              .eq('organization_id', organizationId);

            const orConditions: string[] = [];
            for (const h of hashes) {
              orConditions.push(`phone_search_hash.eq.${h}`);
            }
            if (cleanPhone) {
              orConditions.push(`phone_no.ilike.%${cleanPhone}%`);
            }
            if (rawCustomerPhone && rawCustomerPhone !== cleanPhone) {
              orConditions.push(`phone_no.eq.${rawCustomerPhone}`);
            }
            closedQuery = closedQuery.or(orConditions.join(','));

            const { data: closedData, error: closedErr } = await closedQuery
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (closedErr) {
              console.error('[Webhook-Dialplan:Step 2C] ❌ Error searching closed_deals table:', closedErr);
            } else if (closedData) {
              console.log(`[Webhook-Dialplan:Step 2C] ✅ Matched lead in 'closed_deals' table: ID=${closedData.id}, Assigned User=${closedData.agent_id}`);
              matchedLead = {
                id: closedData.id,
                customer_id: closedData.customer_id || closedData.id,
                campaign_id: closedData.campaign_id,
                customer_name: closedData.customer_name,
                assigned_to: closedData.agent_id,
                table: 'closed_deals',
              };
            } else {
              console.log(`[Webhook-Dialplan:Step 2C] ℹ️ No match found in 'closed_deals' table.`);
            }
          } catch (e) {
            console.error('[Webhook-Dialplan:Step 2C] ❌ Exception querying closed_deals:', e);
          }
        }
      }

      if (!matchedLead) {
        console.warn(`[Webhook-Dialplan:Step 2] ⚠️ Customer phone "${rawCustomerPhone}" not found in CRM leads. Proceeding to Fallback Agent.`);
      }

      let assignedExtension = '';
      let assignedNumber = '';
      let assignedUserId = '';
      let assignedSmartfloAgentId = '';
      let assignedAgentDisplayName = '';

      // Check if lead was matched and assigned to a specific CRM user
      if (matchedLead?.assigned_to) {
        try {
          console.log(`[Webhook-Dialplan:Step 3] 👤 Looking up Smartflo details for user_id: ${matchedLead.assigned_to}...`);
          const { data: agentDetails, error: agQueryErr } = await smartfloAdminClient
            .from('user_smartflo_details')
            .select('extension, follow_me_number, smartflo_agent_id, user_id, c2c_routing, agent_name, caller_id, login_id')
            .eq('user_id', matchedLead.assigned_to)
            .eq('organization_id', organizationId)
            .maybeSingle();

          if (agQueryErr) {
            console.error('[Webhook-Dialplan:Step 3] ❌ Error querying user_smartflo_details:', agQueryErr);
          } else if (agentDetails) {
            assignedUserId = agentDetails.user_id || matchedLead.assigned_to;
            assignedSmartfloAgentId = agentDetails.smartflo_agent_id || agentDetails.extension || '';
            assignedExtension = agentDetails.extension || agentDetails.smartflo_agent_id || '';
            assignedNumber = agentDetails.follow_me_number || agentDetails.caller_id || '';
            assignedAgentDisplayName = agentDetails.agent_name || agentDetails.login_id || `User ${assignedUserId.slice(0, 8)}`;

            console.log(`[Webhook-Dialplan:Step 3] ✅ Found Agent Details:`, {
              userId: assignedUserId,
              name: assignedAgentDisplayName,
              extension: assignedExtension,
              number: assignedNumber,
              smartfloAgentId: assignedSmartfloAgentId,
            });

            // Step 4: Sync with call_sessions so CRM UI pops the lead open for the agent
            const targetCustId = matchedLead.customer_id || matchedLead.id;
            const targetCampId = matchedLead.campaign_id;
            if (targetCustId && targetCampId) {
              const nowIso = new Date().toISOString();
              console.log(`[Webhook-Dialplan:Step 4] 🚀 Screen Pop: upserting call_sessions (user: ${assignedUserId}, cust: ${targetCustId}, camp: ${targetCampId})`);
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
                console.error('[Webhook-Dialplan:Step 4] ❌ Error upserting call_sessions:', sessionErr);
              } else {
                console.log(`[Webhook-Dialplan:Step 4] ✅ call_sessions upserted successfully.`);
              }

              // Mark agent as on_call in user_profiles
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
            console.warn(`[Webhook-Dialplan:Step 3] ⚠️ No Smartflo mapping found for user_id: ${matchedLead.assigned_to}`);
          }
        } catch (agentErr) {
          console.error('[Webhook-Dialplan:Step 3] ❌ Exception retrieving assigned agent details:', agentErr);
        }
      }

      // Step 5: Fallback Agent Flow (if lead not found or agent not mapped)
      if (!assignedExtension && !assignedNumber) {
        try {
          console.log(`[Webhook-Dialplan:Step 5] 🔁 Resolving Fallback Agent...`);
          const { data: config, error: cfgErr } = await smartfloAdminClient
            .from('smartflo_dialer_config')
            .select('click_to_call_params')
            .eq('organization_id', organizationId)
            .maybeSingle();

          if (cfgErr) {
            console.error('[Webhook-Dialplan:Step 5] ❌ Error fetching dialer config:', cfgErr);
          }

          const configuredFallbackAgentId = config?.click_to_call_params?.fallback_agent_id;
          console.log(`[Webhook-Dialplan:Step 5] Configured Fallback Agent ID in dialer config: "${configuredFallbackAgentId}"`);

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

          // Fallback to first available active mapped agent
          if (!fallbackAgentRecord) {
            console.log(`[Webhook-Dialplan:Step 5] Fallback agent not set or not found; fetching first active mapped agent in org...`);
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

            console.log(`[Webhook-Dialplan:Step 5] ✅ Selected Fallback Agent:`, {
              userId: assignedUserId,
              name: assignedAgentDisplayName,
              extension: assignedExtension,
              number: assignedNumber,
              smartfloAgentId: assignedSmartfloAgentId,
            });
          } else {
            console.error(`[Webhook-Dialplan:Step 5] ❌ No active Smartflo agents available in organization for fallback.`);
          }
        } catch (fbErr) {
          console.error('[Webhook-Dialplan:Step 5] ❌ Error in fallback agent resolution:', fbErr);
        }
      }

      // If assigned user exists, load full user profile for display name if still generic
      if (assignedUserId && (!assignedAgentDisplayName || assignedAgentDisplayName.startsWith('User '))) {
        try {
          const { data: profile } = await smartfloAdminClient
            .from('user_profiles')
            .select('full_name, employee_id, email')
            .eq('user_id', assignedUserId)
            .maybeSingle();
          if (profile?.full_name) {
            assignedAgentDisplayName = `${profile.full_name}${profile.employee_id ? ` [${profile.employee_id}]` : ''}`;
          }
        } catch {}
      }

      // Step 6: Build Inbound Dialplan Webhook Event Record
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
        },
      };

      // Record in public.webhook_responses
      console.log(`[Webhook-Dialplan:Step 6] 💾 Saving event to webhook_responses (ID: ${eventRecord.id})...`);
      const { error: insErr } = await smartfloAdminClient.from('webhook_responses').insert({
        id: eventRecord.id,
        webhook_id: currentWebhookId,
        organization_id: organizationId,
        response: eventRecord,
        created_at: eventRecord.receivedAt,
      });

      if (insErr) {
        console.error('[Webhook-Dialplan:Step 6] ❌ Error inserting webhook_responses:', insErr);
      } else {
        console.log(`[Webhook-Dialplan:Step 6] ✅ Webhook response record inserted.`);
      }

      // Dual-write to dialer config
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
      } catch (e) {
        console.error('[Webhook-Dialplan:Step 6] ❌ Error dual-writing to dialer config:', e);
      }

      // Step 7: Return dynamic bridge response to Tata Smartflo (Clean JSON format required by PBX)
      const bridgeResponse: Record<string, any> = {
        action: 'bridge',
        agent_extension: assignedExtension || undefined,
        agent_number: assignedNumber || undefined,
        rynxly_agent_id: assignedUserId || undefined,
        user_id: assignedUserId || undefined,
        agent_id: assignedSmartfloAgentId || undefined,
        fallback_queue: 'QUEUE-DEFAULT-SUPPORT',
      };

      console.log(`[Webhook-Dialplan:Step 7] 🎯 Final Bridge Response Sent to Smartflo:`, JSON.stringify(bridgeResponse, null, 2));
      console.log('====================================================================\n');

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
