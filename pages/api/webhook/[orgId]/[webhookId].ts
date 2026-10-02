import { randomUUID } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  formatSmartfloWebhookEvent,
  smartfloAdminClient,
  syncSmartfloWebhookToCallHistory,
  type FormattedSmartfloWebhookEvent,
} from '@/lib/smartfloServer';

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

    // Extract common Tata Smartflo webhook fields with smart fallbacks
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

    // Agent info: answered_agent, missed_agent array, or caller_id_number
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
        payload.agent_number ||
        payload.caller_id_number ||
        payload.caller_id ||
        payload.agent ||
        payload.from ||
        ''
      );
    }

    // Destination number
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

    // Hangup cause
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
