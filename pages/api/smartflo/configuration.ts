import { randomUUID } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  decryptSmartfloToken,
  encryptSmartfloToken,
  formatSmartfloWebhookEvent,
  hashSmartfloToken,
  requireSmartfloAdmin,
  smartfloAdminClient,
} from '@/lib/smartfloServer';
import { syncSmartfloUsers } from '@/lib/smartfloUsers';

const smartfloUsersUrl = 'https://api-smartflo.tatateleservices.com/v1/users';
const allowedExpiryDays = [15, 30, 90];
const parameterOptions = {
  destination_number: ['CRM lead phone number', 'Manual dial number'],
  async: ['true', 'false'],
  custom_identifier: ['Customer ID', 'Campaign ID'],
  call_timeout: ['30 seconds', '60 seconds', '90 seconds'],
} as const;

type ClickToCallParams = Record<keyof typeof parameterOptions, string> & {
  agent_number: string[];
  caller_id: string | null;
};

const defaultClickToCallParams: ClickToCallParams = {
  agent_number: [],
  destination_number: 'CRM lead phone number',
  caller_id: null,
  async: 'false',
  custom_identifier: 'Customer ID',
  call_timeout: '30 seconds',
};

function sanitizeClickToCallParams(
  value: unknown,
  allowedAgentIds?: ReadonlySet<string>
): ClickToCallParams {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const result = { ...defaultClickToCallParams };
  const sanitizeSelections = (candidate: unknown, allowedValues?: ReadonlySet<string>) => {
    if (!Array.isArray(candidate)) return [];
    return [...new Set(candidate
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim())
      .filter((item) => item.length > 0 && (!allowedValues || allowedValues.has(item)))
      .slice(0, 100))];
  };

  result.agent_number = sanitizeSelections(input.agent_number, allowedAgentIds);
  const callerId = Array.isArray(input.caller_id) ? input.caller_id[0] : input.caller_id;
  result.caller_id = typeof callerId === 'string' ? callerId.trim().slice(0, 50) || null : null;

  for (const key of Object.keys(parameterOptions) as (keyof typeof parameterOptions)[]) {
    const candidate = input[key];
    if (typeof candidate === 'string' && (parameterOptions[key] as readonly string[]).includes(candidate)) {
      result[key] = candidate;
    }
  }

  return result;
}

function calculateExpiryDays(createdAt: string | null, expiresAt: string | null): number | null {
  if (!createdAt || !expiresAt) return null;
  const elapsedDays = Math.round((Date.parse(expiresAt) - Date.parse(createdAt)) / 86_400_000);
  const days = elapsedDays + 2;
  return allowedExpiryDays.includes(days) ? days : null;
}

function parseCreatedAtDate(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
    ? parsed.toISOString()
    : null;
}

async function readConfiguration(organizationId: string) {
  const res = await smartfloAdminClient!
    .from('smartflo_dialer_config')
    .select('integration_id, smartflo_api_token, smartflo_api_token_hash, is_token_valid, is_validate, token_created_at, token_expires_at, click_to_call_params, enabled, webhook_id, webhook_events')
    .eq('organization_id', organizationId)
    .maybeSingle();

  return res;
}

async function updateUserSmartfloMapping(
  organizationId: string,
  userId: string,
  agentId: string | null
): Promise<boolean> {
  const { data: profile, error: profileError } = await smartfloAdminClient!
    .from('user_profiles')
    .select('calling_provider')
    .eq('user_id', userId)
    .eq('organization_id', organizationId)
    .maybeSingle();
  if (profileError || !profile) return false;

  const provider = profile.calling_provider && typeof profile.calling_provider === 'object'
    ? profile.calling_provider as Record<string, unknown>
    : {};
  const sim = provider.sim && typeof provider.sim === 'object'
    ? provider.sim as Record<string, unknown>
    : {};
  const smartflo = provider.smartflo && typeof provider.smartflo === 'object'
    ? provider.smartflo as Record<string, unknown>
    : {};
  const callingProvider = {
    ...provider,
    sim: { enable: sim.enable === true, in_use: sim.in_use === true },
    smartflo: {
      ...smartflo,
      enable: smartflo.enable === true,
      in_use: smartflo.in_use === true,
      is_mapped: Boolean(agentId),
      agent_id: agentId,
    },
  };

  const { error: updateError } = await smartfloAdminClient!
    .from('user_profiles')
    .update({ calling_provider: callingProvider })
    .eq('user_id', userId)
    .eq('organization_id', organizationId);
  return !updateError;
}

async function verifySmartfloToken(token: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(smartfloUsersUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    const data: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      return { response, data, users: null };
    }

    const responseData = data && typeof data === 'object' && !Array.isArray(data)
      ? data as Record<string, unknown>
      : null;
    const users = Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(data)
        ? data as unknown[]
        : null;
    return { response, data, users };
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  if (!['GET', 'POST', 'PATCH'].includes(req.method || '')) {
    res.setHeader('Allow', 'GET, POST, PATCH');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const admin = await requireSmartfloAdmin(req, res);
  if (!admin || !smartfloAdminClient) return;

  const { data: config, error: configError } = await readConfiguration(admin.organizationId);
  if (configError) return res.status(500).json({ error: 'Unable to load Smartflo configuration.' });

  const isTokenValid = Boolean(config?.is_token_valid ?? config?.is_validate ?? false);
  const isExpired = Boolean(config?.token_expires_at && Date.parse(config.token_expires_at) <= Date.now());

  if (req.method === 'GET') {
    if (isExpired && isTokenValid) {
      await smartfloAdminClient
        .from('smartflo_dialer_config')
        .update({ is_token_valid: false, is_validate: false, status: 'not_configured' })
        .eq('organization_id', admin.organizationId);
    }

    let { data: smartfloAgents, error: agentsError } = await smartfloAdminClient
      .from('user_smartflo_details')
      .select('smartflo_agent_id, user_id, agent_name, login_id, extension, intercom, follow_me_number, caller_id, is_active')
      .eq('organization_id', admin.organizationId)
      .order('agent_name', { ascending: true });
    if (agentsError) return res.status(500).json({ error: 'Unable to load Smartflo agent options.' });

    if (!smartfloAgents || smartfloAgents.length === 0) {
      const fallbackQuery = await smartfloAdminClient
        .from('user_smartflo_details')
        .select('smartflo_agent_id, user_id, agent_name, login_id, extension, intercom, follow_me_number, caller_id, is_active')
        .order('agent_name', { ascending: true });
      if (fallbackQuery.data && fallbackQuery.data.length > 0) {
        smartfloAgents = fallbackQuery.data;
      }
    }

    const allowedAgentIds = new Set((smartfloAgents || []).map((agent) => agent.smartflo_agent_id));
    let { data: crmUsers, error: crmUsersError } = await smartfloAdminClient
      .from('user_profiles')
      .select('user_id, user_name, employee_id, email')
      .eq('organization_id', admin.organizationId)
      .limit(1000);
    if (crmUsersError) return res.status(500).json({ error: 'Unable to load CRM users for mapping.' });



    // Query public.webhooks table for this organization
    let { data: webhookRow } = await smartfloAdminClient
      .from('webhooks')
      .select('webhook_id, webhook_for, webhook_type')
      .eq('organization_id', admin.organizationId)
      .eq('webhook_for', 'smartflo')
      .maybeSingle();

    if (!webhookRow) {
      const initialWebhookId = randomUUID();
      const { data: insertedWebhook } = await smartfloAdminClient
        .from('webhooks')
        .upsert(
          {
            webhook_id: initialWebhookId,
            organization_id: admin.organizationId,
            webhook_for: 'smartflo',
            webhook_type: 'click_to_call',
          },
          { onConflict: 'webhook_id' }
        )
        .select()
        .single();
      webhookRow = insertedWebhook;
    }

    const currentWebhookId = webhookRow?.webhook_id || randomUUID();

    // Fetch responses from public.webhook_responses table for this organization
    const { data: dbResponses } = await smartfloAdminClient
      .from('webhook_responses')
      .select('id, webhook_id, organization_id, response, created_at')
      .eq('organization_id', admin.organizationId)
      .order('created_at', { ascending: false })
      .limit(50);

    let formattedEvents = (dbResponses || []).map((row) =>
      formatSmartfloWebhookEvent(row.id, row.created_at, row.response)
    );

    // Fallback to legacy config.webhook_events if webhook_responses has no rows
    if (formattedEvents.length === 0 && Array.isArray(config?.webhook_events) && config.webhook_events.length > 0) {
      formattedEvents = config.webhook_events.map((item: any, idx: number) =>
        formatSmartfloWebhookEvent(item.id || `legacy-${idx}`, item.receivedAt, item)
      );
    }

    return res.status(200).json({
      configuration: config ? {
        organizationId: admin.organizationId,
        integrationId: config.integration_id,
        webhookId: currentWebhookId,
        webhookEvents: formattedEvents,
        hasToken: Boolean(config.smartflo_api_token),
        isActivated: Boolean(config.enabled),
        isTokenValid: isTokenValid && !isExpired,
        tokenCreatedAt: config.token_created_at,
        tokenExpiresAt: config.token_expires_at,
        expiryDays: calculateExpiryDays(config.token_created_at, config.token_expires_at),
        clickToCallParams: sanitizeClickToCallParams(config.click_to_call_params, allowedAgentIds),
      } : null,
      smartfloAgents: (smartfloAgents || []).map((agent) => ({
        agentId: agent.smartflo_agent_id,
        userId: agent.user_id,
        agentName: agent.agent_name,
        loginId: agent.login_id,
        extension: agent.extension,
        intercom: agent.intercom,
        followMeNumber: agent.follow_me_number,
        callerId: agent.caller_id,
        isActive: agent.is_active,
      })),
      crmUsers: (crmUsers || []).map((user) => ({
        userId: user.user_id,
        userName: user.user_name,
        employeeId: user.employee_id,
        email: user.email,
      })),
    });
  }

  if (req.method === 'PATCH') {
    if (req.body?.action === 'disable' || req.body?.action === 'reset_click_to_call') {
      // 1. Reset smartflo_dialer_config in Supabase
      await smartfloAdminClient
        .from('smartflo_dialer_config')
        .update({
          enabled: false,
          status: 'not_configured',
          smartflo_api_token: null,
          smartflo_api_token_hash: null,
          is_token_valid: false,
          is_validate: false,
          token_created_at: null,
          token_expires_at: null,
          click_to_call_params: defaultClickToCallParams,
          webhook_events: [],
          updated_at: new Date().toISOString(),
        })
        .eq('organization_id', admin.organizationId);

      // 2. Clear webhook_responses
      await smartfloAdminClient
        .from('webhook_responses')
        .delete()
        .eq('organization_id', admin.organizationId);

      // 3. Clear user_smartflo_details
      await smartfloAdminClient
        .from('user_smartflo_details')
        .delete()
        .eq('organization_id', admin.organizationId);

      // 4. Reset user_profiles calling_provider smartflo
      const { data: profiles } = await smartfloAdminClient
        .from('user_profiles')
        .select('user_id, calling_provider')
        .eq('organization_id', admin.organizationId);

      if (Array.isArray(profiles)) {
        for (const p of profiles) {
          if (p.calling_provider && typeof p.calling_provider === 'object') {
            const cp = p.calling_provider as Record<string, any>;
            if (cp.smartflo) {
              const updatedCp = {
                ...cp,
                smartflo: {
                  enable: false,
                  in_use: false,
                  is_mapped: false,
                  agent_id: null,
                },
              };
              await smartfloAdminClient
                .from('user_profiles')
                .update({ calling_provider: updatedCp })
                .eq('user_id', p.user_id)
                .eq('organization_id', admin.organizationId);
            }
          }
        }
      }

      return res.status(200).json({ success: true, message: 'Click to Call configuration reset successfully.', enabled: false });
    }

    if (req.body?.action === 'enable') {
      const { data: existing } = await smartfloAdminClient
        .from('smartflo_dialer_config')
        .select('id')
        .eq('organization_id', admin.organizationId)
        .maybeSingle();

      if (existing) {
        await smartfloAdminClient
          .from('smartflo_dialer_config')
          .update({
            enabled: true,
            updated_at: new Date().toISOString(),
          })
          .eq('organization_id', admin.organizationId);
      } else {
        await smartfloAdminClient
          .from('smartflo_dialer_config')
          .insert({
            organization_id: admin.organizationId,
            integration_id: randomUUID(),
            enabled: true,
            status: 'not_configured',
          });
      }

      return res.status(200).json({ success: true, enabled: true });
    }

    if (req.body?.action === 'clear_webhook_events') {
      await smartfloAdminClient
        .from('webhook_responses')
        .delete()
        .eq('organization_id', admin.organizationId);

      await smartfloAdminClient
        .from('smartflo_dialer_config')
        .update({ webhook_events: [], updated_at: new Date().toISOString() })
        .eq('organization_id', admin.organizationId);

      return res.status(200).json({ success: true, webhookEvents: [] });
    }

    if (req.body?.action === 'regenerate_webhook_id') {
      const newWebhookId = randomUUID();
      const { error } = await smartfloAdminClient
        .from('webhooks')
        .update({ webhook_id: newWebhookId, updated_at: new Date().toISOString() })
        .eq('organization_id', admin.organizationId)
        .eq('webhook_for', 'smartflo');
      if (error) return res.status(500).json({ error: 'Unable to update webhook ID.' });
      return res.status(200).json({ success: true, webhookId: newWebhookId });
    }

    if (req.body?.action === 'simulate_webhook') {
      const { data: wRow } = await smartfloAdminClient
        .from('webhooks')
        .select('webhook_id')
        .eq('organization_id', admin.organizationId)
        .eq('webhook_for', 'smartflo')
        .maybeSingle();

      const activeWebhookId = wRow?.webhook_id || config?.integration_id || randomUUID();

      // Ensure activeWebhookId exists in webhooks table
      await smartfloAdminClient
        .from('webhooks')
        .upsert(
          {
            webhook_id: activeWebhookId,
            organization_id: admin.organizationId,
            webhook_for: 'smartflo',
            webhook_type: 'click_to_call',
          },
          { onConflict: 'webhook_id' }
        );

      const testEvent = {
        id: randomUUID(),
        receivedAt: new Date().toISOString(),
        callId: 'HYD1-D4-1790798403.486134',
        refId: '01a0f3e7-1767-70b3-afc8-901a4f999f82',
        direction: 'clicktocall',
        callType: 'Click to Call',
        agentNumber: 'Nidhi (+916392700613)',
        destinationNumber: '9217175080',
        status: 'missed',
        hangupCause: 'No answer from user (user alerted)',
        duration: 0,
        recordingUrl: null,
        rawPayload: {
          uuid: '6abd6a43699d4',
          ref_id: '01a0f3e7-1767-70b3-afc8-901a4f999f82',
          billsec: '0',
          call_id: 'HYD1-D4-1790798403.486134',
          duration: '0',
          call_flow: [],
          direction: 'clicktocall',
          end_stamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
          queue_name: '',
          reason_key: '',
          call_status: 'missed',
          campaign_id: '',
          start_stamp: new Date(Date.now() - 16000).toISOString().replace('T', ' ').slice(0, 19),
          answer_stamp: '',
          missed_agent: [
            {
              id: '0507733050004',
              name: 'Nidhi',
              number: '+916392700613',
              agent_number: '+916392700613',
            },
          ],
          outbound_sec: '0',
          campaign_name: '',
          digits_dialed: '',
          recording_url: '',
          answered_agent: '',
          billing_circle: {
            circle: 'Punjab',
            operator: 'TTL',
          },
          call_connected: '0',
          call_to_number: '9217175080',
          agent_ring_time: '13',
          caller_id_number: '8065605914',
          hangup_cause_key: 'NO_ANSWER',
          custom_identifier: 'test-002',
          hangup_cause_code: '19',
          customer_ring_time: '',
          answered_agent_name: '',
          answered_agent_number: '',
          broadcast_lead_fields: '',
          agent_transfer_ring_time: '',
          'customer_no_with_prefix ': '9217175080',
          hangup_cause_description: 'No answer from user (user alerted)',
          aws_call_recording_identifier: '',
        },
      };

      await smartfloAdminClient
        .from('webhook_responses')
        .insert({
          id: testEvent.id,
          webhook_id: activeWebhookId,
          organization_id: admin.organizationId,
          response: testEvent,
          created_at: testEvent.receivedAt,
        });

      const { data: updatedRows } = await smartfloAdminClient
        .from('webhook_responses')
        .select('id, response, created_at')
        .eq('organization_id', admin.organizationId)
        .order('created_at', { ascending: false })
        .limit(50);

      const updatedEvents = (updatedRows || []).map((row) =>
        formatSmartfloWebhookEvent(row.id, row.created_at, row.response)
      );

      // Also dual-write to config.webhook_events
      await smartfloAdminClient
        .from('smartflo_dialer_config')
        .update({ webhook_events: updatedEvents, updated_at: new Date().toISOString() })
        .eq('organization_id', admin.organizationId);

      return res.status(200).json({ success: true, event: testEvent, webhookEvents: updatedEvents });
    }

    if (!isTokenValid || isExpired) {
      return res.status(409).json({ error: 'Authenticate a valid Smartflo token before saving parameters.' });
    }

    if (req.body?.agentUserMapping !== undefined) {
      const mapping = req.body.agentUserMapping as Record<string, unknown>;
      const agentId = typeof mapping?.agentId === 'string' ? mapping.agentId.trim() : '';
      const userId = mapping?.userId === null || mapping?.userId === ''
        ? null
        : typeof mapping?.userId === 'string'
          ? mapping.userId.trim()
          : undefined;
      if (!agentId || userId === undefined) {
        return res.status(400).json({ error: 'Provide a valid Smartflo agent and CRM user mapping.' });
      }

      if (userId) {
        const { data: crmUser, error: crmUserError } = await smartfloAdminClient
          .from('user_profiles')
          .select('user_id')
          .eq('user_id', userId)
          .eq('organization_id', admin.organizationId)
          .maybeSingle();
        if (crmUserError) return res.status(500).json({ error: 'Unable to verify the CRM user mapping.' });
        if (!crmUser) return res.status(404).json({ error: 'CRM user not found in this organization.' });
      }

      const { data: currentAgent, error: currentAgentError } = await smartfloAdminClient
        .from('user_smartflo_details')
        .select('user_id')
        .eq('organization_id', admin.organizationId)
        .eq('smartflo_agent_id', agentId)
        .maybeSingle();
      if (currentAgentError) return res.status(500).json({ error: 'Unable to load the current Smartflo user mapping.' });
      if (!currentAgent) return res.status(404).json({ error: 'Smartflo agent not found in this organization.' });

      const previousUserId = currentAgent.user_id as string | null;
      let previousUserAgentId: string | null = null;
      if (previousUserId && previousUserId !== userId) {
        const { data: otherMappings, error: otherMappingsError } = await smartfloAdminClient
          .from('user_smartflo_details')
          .select('smartflo_agent_id')
          .eq('organization_id', admin.organizationId)
          .eq('user_id', previousUserId)
          .neq('smartflo_agent_id', agentId)
          .limit(1);
        if (otherMappingsError) return res.status(500).json({ error: 'Unable to check other Smartflo user mappings.' });
        previousUserAgentId = otherMappings?.[0]?.smartflo_agent_id || null;
      }

      const { data: updatedAgent, error: mappingError } = await smartfloAdminClient
        .from('user_smartflo_details')
        .update({ user_id: userId, is_mapped: Boolean(userId) })
        .eq('organization_id', admin.organizationId)
        .eq('smartflo_agent_id', agentId)
        .select('smartflo_agent_id, user_id, is_mapped')
        .maybeSingle();
      if (mappingError) return res.status(500).json({ error: 'Unable to save the CRM user mapping.' });
      if (!updatedAgent) return res.status(404).json({ error: 'Smartflo agent not found in this organization.' });

      if (previousUserId && previousUserId !== userId) {
        const previousUserUpdated = await updateUserSmartfloMapping(
          admin.organizationId,
          previousUserId,
          previousUserAgentId
        );
        if (!previousUserUpdated) return res.status(500).json({ error: 'Mapping saved, but previous user provider details could not be cleared.' });
      }
      if (userId) {
        const userUpdated = await updateUserSmartfloMapping(admin.organizationId, userId, agentId);
        if (!userUpdated) return res.status(500).json({ error: 'Mapping saved, but user provider details could not be updated.' });
      }

      return res.status(200).json({
        success: true,
        agentId: updatedAgent.smartflo_agent_id,
        userId: updatedAgent.user_id,
        isMapped: updatedAgent.is_mapped,
      });
    }

    if (req.body?.agentCallerId !== undefined) {
      const update = req.body.agentCallerId as Record<string, unknown>;
      const agentId = typeof update?.agentId === 'string' ? update.agentId.trim() : '';
      const callerId = update?.callerId === null || update?.callerId === ''
        ? null
        : typeof update?.callerId === 'string'
          ? update.callerId.trim().slice(0, 50) || null
          : undefined;
      if (!agentId || callerId === undefined) {
        return res.status(400).json({ error: 'Provide a valid Smartflo agent and caller ID.' });
      }

      const { data: updatedAgent, error: updateError } = await smartfloAdminClient
        .from('user_smartflo_details')
        .update({ caller_id: callerId })
        .eq('organization_id', admin.organizationId)
        .eq('smartflo_agent_id', agentId)
        .select('smartflo_agent_id, caller_id')
        .maybeSingle();
      if (updateError) return res.status(500).json({ error: 'Unable to save this agent caller ID.' });
      if (!updatedAgent) return res.status(404).json({ error: 'Smartflo agent not found in this organization.' });
      return res.status(200).json({
        success: true,
        agentId: updatedAgent.smartflo_agent_id,
        callerId: updatedAgent.caller_id,
      });
    }

    let { data: smartfloAgents, error: agentsError } = await smartfloAdminClient
      .from('user_smartflo_details')
      .select('smartflo_agent_id')
      .eq('organization_id', admin.organizationId);
    if (agentsError) return res.status(500).json({ error: 'Unable to validate Smartflo agent selections.' });

    if (!smartfloAgents || smartfloAgents.length === 0) {
      const fallbackQuery = await smartfloAdminClient
        .from('user_smartflo_details')
        .select('smartflo_agent_id');
      if (fallbackQuery.data && fallbackQuery.data.length > 0) {
        smartfloAgents = fallbackQuery.data;
      }
    }

    const allowedAgentIds = new Set((smartfloAgents || []).map((agent) => agent.smartflo_agent_id));
    const clickToCallParams = sanitizeClickToCallParams(
      req.body?.clickToCallParams,
      allowedAgentIds
    );
    const { error } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .update({ click_to_call_params: clickToCallParams })
      .eq('organization_id', admin.organizationId);
    if (error) return res.status(500).json({ error: 'Unable to save click-to-call parameters.' });
    return res.status(200).json({ success: true, clickToCallParams });
  }

  const isRetry = req.body?.action === 'retry';
  const expiryDays = Number(req.body?.expiryDays);
  const requestedCreatedAt = parseCreatedAtDate(req.body?.createdAt);
  const clickToCallParams = sanitizeClickToCallParams(
    req.body?.clickToCallParams ?? config?.click_to_call_params
  );
  let token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';

  if (!allowedExpiryDays.includes(expiryDays)) {
    return res.status(400).json({ error: 'Choose a token expiry of 15, 30, or 90 days.' });
  }

  if (isRetry) {
    if (!config?.smartflo_api_token) {
      return res.status(404).json({ error: 'No saved Smartflo token is available to retry.' });
    }
    if (isExpired) {
      await smartfloAdminClient
        .from('smartflo_dialer_config')
        .update({ is_token_valid: false, is_validate: false, status: 'not_configured' })
        .eq('organization_id', admin.organizationId);
      return res.status(409).json({ error: 'Token expired. Enter a new token to authenticate again.' });
    }
    try {
      token = decryptSmartfloToken(config.smartflo_api_token);
    } catch {
      return res.status(500).json({ error: 'Saved token could not be decrypted. Enter the token again.' });
    }
  } else if (!token || token.length > 4096 || !requestedCreatedAt) {
    return res.status(400).json({ error: 'Provide a token, a valid Created At date, and an expiry of 15, 30, or 90 days.' });
  }

  try {
    const verified = await verifySmartfloToken(token);
    if (!verified.response.ok) {
      return res.status(200).json({
        success: false,
        status: verified.response.status,
        data: verified.data,
        error: 'Smartflo rejected the token.',
      });
    }
    if (!verified.users) return res.status(502).json({ error: 'Smartflo returned an unexpected users response.' });

    const syncCounts = await syncSmartfloUsers(admin.organizationId, verified.users);
    const tokenCreatedAt = requestedCreatedAt || (isRetry ? config?.token_created_at : null) || new Date().toISOString();
    const tokenExpiresAt = new Date(Date.parse(tokenCreatedAt) + (expiryDays + 1) * 86_400_000 - 72 * 60 * 60 * 1000).toISOString();
    const integrationId = config?.integration_id || randomUUID();

    const { error: saveError } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .upsert({
        organization_id: admin.organizationId,
        integration_id: integrationId,
        smartflo_api_token: isRetry ? config?.smartflo_api_token : encryptSmartfloToken(token),
        smartflo_api_token_hash: isRetry ? config?.smartflo_api_token_hash : hashSmartfloToken(token),
        is_token_valid: true,
        is_validate: true,
        token_created_at: tokenCreatedAt,
        token_expires_at: tokenExpiresAt,
        click_to_call_params: clickToCallParams,
        status: 'configured',
      }, { onConflict: 'organization_id' });
    if (saveError) return res.status(500).json({ error: 'Token verified but could not be saved.' });

    console.info('[Smartflo preflight] /v1/users verified', {
      status: verified.response.status,
      syncedCount: syncCounts.syncedCount,
      mappedCount: syncCounts.mappedCount,
    });

    return res.status(200).json({
      success: true,
      status: verified.response.status,
      data: verified.data,
      integrationId,
      tokenCreatedAt,
      tokenExpiresAt,
      expiryDays: isRetry ? calculateExpiryDays(tokenCreatedAt, tokenExpiresAt) : expiryDays,
      clickToCallParams,
      ...syncCounts,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'Smartflo token verification timed out.' : error instanceof Error ? error.message : 'Unable to verify and sync Smartflo.',
    });
  }
}