import { randomUUID } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { smartfloAdminClient } from '@/lib/smartfloServer';

export interface SmartfloWebhookEvent {
  id: string;
  receivedAt: string;
  callId: string;
  direction: string;
  callType: string;
  agentNumber: string;
  destinationNumber: string;
  status: string;
  hangupCause: string;
  duration: number;
  recordingUrl: string | null;
  rawPayload: Record<string, unknown>;
}

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

  const existingEvents: SmartfloWebhookEvent[] = Array.isArray(config.webhook_events)
    ? config.webhook_events
    : [];

  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      webhookId: config.webhook_id || config.integration_id,
      events: existingEvents,
    });
  }

  if (req.method === 'DELETE') {
    // Clear webhook events
    const { error: clearError } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .update({ webhook_events: [], updated_at: new Date().toISOString() })
      .eq('id', config.id);

    if (clearError) {
      return res.status(500).json({ error: 'Failed to clear webhook events.' });
    }

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

    // Extract common Tata Smartflo webhook fields with smart fallbacks
    const callId = String(
      payload.call_id ||
      payload.uuid ||
      payload.id ||
      payload.ref_id ||
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
      payload.call_direction ||
      payload.direction ||
      'outbound'
    );

    const rawCallType = String(
      payload.call_type ||
      'click_to_call'
    );

    const agentNumber = String(
      payload.agent_number ||
      payload.caller_id ||
      payload.agent ||
      payload.from ||
      ''
    );

    const destinationNumber = String(
      payload.destination_number ||
      payload.customer_number ||
      payload.to ||
      payload.customer_phone ||
      ''
    );

    const hangupCause = String(
      payload.hangup_cause ||
      payload.cause ||
      payload.reason ||
      payload.hangup_reason ||
      'NORMAL_CLEARING'
    );

    const duration = Number(
      payload.call_duration ??
      payload.duration ??
      payload.talk_duration ??
      payload.billsec ??
      0
    );

    const recordingUrl = payload.recording_url || payload.record_url || payload.recording
      ? String(payload.recording_url || payload.record_url || payload.recording)
      : null;

    const newEvent: SmartfloWebhookEvent = {
      id: randomUUID(),
      receivedAt: new Date().toISOString(),
      callId,
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

    const updatedEvents = [newEvent, ...existingEvents].slice(0, 50);

    const { error: updateError } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .update({
        webhook_events: updatedEvents,
        updated_at: new Date().toISOString(),
      })
      .eq('id', config.id);

    if (updateError) {
      console.error('[Smartflo Webhook] Error updating webhook_events:', updateError);
      return res.status(500).json({ error: 'Failed to record webhook event.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Smartflo webhook event recorded successfully.',
      eventId: newEvent.id,
    });
  }

  res.setHeader('Allow', 'GET, POST, DELETE');
  return res.status(405).json({ error: 'Method not allowed.' });
}
