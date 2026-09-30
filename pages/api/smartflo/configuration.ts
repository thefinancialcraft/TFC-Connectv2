import { randomUUID } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  decryptSmartfloToken,
  encryptSmartfloToken,
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
  return smartfloAdminClient!
    .from('smartflo_dialer_config')
    .select('integration_id, smartflo_api_token, smartflo_api_token_hash, is_token_valid, is_validate, token_created_at, token_expires_at, click_to_call_params, enabled, webhook_id, webhook_events')
    .eq('organization_id', organizationId)
    .maybeSingle();
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

    const { data: smartfloAgents, error: agentsError } = await smartfloAdminClient
      .from('user_smartflo_details')
      .select('smartflo_agent_id, user_id, agent_name, login_id, extension, intercom, follow_me_number, caller_id, is_active')
      .eq('organization_id', admin.organizationId)
      .order('agent_name', { ascending: true });
    if (agentsError) return res.status(500).json({ error: 'Unable to load Smartflo agent options.' });
    const allowedAgentIds = new Set((smartfloAgents || []).map((agent) => agent.smartflo_agent_id));
    const { data: crmUsers, error: crmUsersError } = await smartfloAdminClient
      .from('user_profiles')
      .select('user_id, user_name, employee_id, email')
      .eq('organization_id', admin.organizationId)
      .limit(1000);
    if (crmUsersError) return res.status(500).json({ error: 'Unable to load CRM users for mapping.' });

    return res.status(200).json({
      configuration: config ? {
        integrationId: config.integration_id,
        webhookId: config.webhook_id || config.integration_id,
        webhookEvents: Array.isArray(config.webhook_events) ? config.webhook_events : [],
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
    if (req.body?.action === 'clear_webhook_events') {
      const { error } = await smartfloAdminClient
        .from('smartflo_dialer_config')
        .update({ webhook_events: [] })
        .eq('organization_id', admin.organizationId);
      if (error) return res.status(500).json({ error: 'Unable to clear webhook events.' });
      return res.status(200).json({ success: true, webhookEvents: [] });
    }

    if (req.body?.action === 'regenerate_webhook_id') {
      const newWebhookId = randomUUID();
      const { error } = await smartfloAdminClient
        .from('smartflo_dialer_config')
        .update({ webhook_id: newWebhookId })
        .eq('organization_id', admin.organizationId);
      if (error) return res.status(500).json({ error: 'Unable to update webhook ID.' });
      return res.status(200).json({ success: true, webhookId: newWebhookId });
    }

    if (req.body?.action === 'simulate_webhook') {
      const { data: currentConfig } = await smartfloAdminClient
        .from('smartflo_dialer_config')
        .select('webhook_events')
        .eq('organization_id', admin.organizationId)
        .maybeSingle();

      const existing = Array.isArray(currentConfig?.webhook_events) ? currentConfig.webhook_events : [];
      const testEvent = {
        id: randomUUID(),
        receivedAt: new Date().toISOString(),
        callId: `smartflo-${Date.now().toString().slice(-6)}`,
        direction: 'outbound',
        callType: 'click_to_call',
        agentNumber: req.body?.agentNumber || '0507733050004',
        destinationNumber: req.body?.destinationNumber || '9217175080',
        status: req.body?.status || 'answered',
        hangupCause: 'NORMAL_CLEARING',
        duration: 45,
        recordingUrl: 'https://api-smartflo.tatateleservices.com/recordings/sample.mp3',
        rawPayload: {
          event: 'call_hangup',
          direction: 'outbound',
          call_type: 'click_to_call',
          hangup_cause: 'NORMAL_CLEARING',
          customer_number: req.body?.destinationNumber || '9217175080',
          agent_number: req.body?.agentNumber || '0507733050004',
          call_duration: 45,
          recording_url: 'https://api-smartflo.tatateleservices.com/recordings/sample.mp3',
          simulated: true,
        },
      };
      const updated = [testEvent, ...existing].slice(0, 50);
      await smartfloAdminClient
        .from('smartflo_dialer_config')
        .update({ webhook_events: updated })
        .eq('organization_id', admin.organizationId);

      return res.status(200).json({ success: true, event: testEvent, webhookEvents: updated });
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

    const { data: smartfloAgents, error: agentsError } = await smartfloAdminClient
      .from('user_smartflo_details')
      .select('smartflo_agent_id')
      .eq('organization_id', admin.organizationId);
    if (agentsError) return res.status(500).json({ error: 'Unable to validate Smartflo agent selections.' });

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