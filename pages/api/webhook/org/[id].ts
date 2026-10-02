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
