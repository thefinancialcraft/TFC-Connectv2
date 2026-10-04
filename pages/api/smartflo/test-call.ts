import type { NextApiRequest, NextApiResponse } from 'next';
import {
  decryptSmartfloToken,
  requireSmartfloAdmin,
  smartfloAdminClient,
} from '@/lib/smartfloServer';

const clickToCallUrl = 'https://api-smartflo.tatateleservices.com/v1/click_to_call';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const admin = await requireSmartfloAdmin(req, res);
  if (!admin || !smartfloAdminClient) return;

  let { data: config, error: configError } = await smartfloAdminClient
    .from('smartflo_dialer_config')
    .select('smartflo_api_token, is_token_valid, is_validate, token_expires_at, click_to_call_params')
    .eq('organization_id', admin.organizationId)
    .maybeSingle();



  if (configError) return res.status(500).json({ error: 'Unable to load Smartflo configuration.' });
  if (!config?.smartflo_api_token || !(config.is_token_valid ?? config.is_validate)) {
    return res.status(409).json({ error: 'Authenticate a Smartflo token before testing the call.' });
  }
  if (config.token_expires_at && Date.parse(config.token_expires_at) <= Date.now()) {
    return res.status(409).json({ error: 'The Smartflo token has expired.' });
  }

  const params = config.click_to_call_params && typeof config.click_to_call_params === 'object'
    ? config.click_to_call_params as Record<string, unknown>
    : {};
  const configuredCallerId = typeof params.caller_id === 'string'
    ? params.caller_id.trim()
    : Array.isArray(params.caller_id) && typeof params.caller_id[0] === 'string'
      ? params.caller_id[0].trim()
      : '';
  const selectedAgentIds = Array.isArray(params.agent_number)
    ? params.agent_number.filter((value): value is string => typeof value === 'string')
    : [];

  if (selectedAgentIds.length === 0) {
    return res.status(400).json({ error: 'Select at least one agent in Request Configuration first.' });
  }

  let { data: agentRows, error: agentsError } = await smartfloAdminClient
    .from('user_smartflo_details')
    .select('smartflo_agent_id, extension, intercom, caller_id, c2c_routing')
    .eq('organization_id', admin.organizationId);

  if (!agentRows || agentRows.length === 0) {
    const fallbackAgents = await smartfloAdminClient
      .from('user_smartflo_details')
      .select('smartflo_agent_id, extension, intercom, caller_id, c2c_routing');
    if (fallbackAgents.data && fallbackAgents.data.length > 0) {
      agentRows = fallbackAgents.data;
    }
  }

  if (agentsError) return res.status(500).json({ error: 'Unable to load selected Smartflo agents.' });

  const selectedAgent = agentRows?.find((agent) => selectedAgentIds.includes(agent.smartflo_agent_id));

  if (!selectedAgent) {
    return res.status(400).json({ error: 'The selected agent is no longer available. Refresh configuration and select again.' });
  }

  let token: string;
  try {
    token = decryptSmartfloToken(config.smartflo_api_token);
  } catch {
    return res.status(500).json({ error: 'Saved Smartflo token could not be decrypted.' });
  }

  const callerId = configuredCallerId || (typeof selectedAgent.caller_id === 'string' ? selectedAgent.caller_id.trim() : '');
  if (!callerId) {
    return res.status(422).json({ error: 'Set a shared caller ID or enter one for the selected user before testing.' });
  }

  let requestedDestination = '';
  if (req.body && typeof req.body === 'object') {
    if (typeof req.body.destination_number === 'string') {
      requestedDestination = req.body.destination_number.trim();
    }
  } else if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      if (typeof parsed?.destination_number === 'string') {
        requestedDestination = parsed.destination_number.trim();
      }
    } catch {
      // ignore
    }
  }

  const destinationNumber = requestedDestination.replace(/[\s\-\(\)]/g, '') || '9217175080';
  if (!destinationNumber) {
    return res.status(400).json({ error: 'Please enter a destination phone number.' });
  }

  // In Tata Smartflo Click-to-Call:
  // - Extension (060XXXXXX): Routes the first leg directly to the agent's Softphone (WebRTC / App).
  // - Agent ID (050XXXXXX): Routes to the agent's Call Forward Number (PSTN / personal mobile phone).
  const isMobileRouting = selectedAgent.c2c_routing === 'agent' || selectedAgent.c2c_routing === 'agent_mobile' || selectedAgent.c2c_routing === 'caller_forward_first';
  const targetAgentNumber = isMobileRouting
    ? (selectedAgent.smartflo_agent_id?.trim() || selectedAgent.extension?.trim())
    : (selectedAgent.extension?.trim() || selectedAgent.smartflo_agent_id?.trim());

  console.info('[Smartflo Click-to-Call] Routing target:', {
    agent_number: targetAgentNumber,
    agent_id: selectedAgent.smartflo_agent_id,
    extension: selectedAgent.extension,
    destination_number: destinationNumber,
    caller_id: callerId,
  });

  const requestBody = {
    agent_number: targetAgentNumber,
    destination_number: destinationNumber,
    async: '1',
    caller_id: callerId,
    custom_identifier: 'test-002',
  };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const smartfloResponse = await fetch(clickToCallUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
      cache: 'no-store',
    });

    const responseText = await smartfloResponse.text();
    let data: unknown = responseText;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = responseText.slice(0, 2000);
    }

    const responseData = data && typeof data === 'object' && !Array.isArray(data)
      ? data as Record<string, unknown>
      : {};
    if (!smartfloResponse.ok || responseData.success === false) {
      return res.status(502).json({
        success: false,
        error: typeof responseData.message === 'string' ? responseData.message : 'Smartflo could not queue the test call.',
        status: smartfloResponse.status,
      });
    }

    const { error: activationError } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .update({ enabled: true, status: 'configured' })
      .eq('organization_id', admin.organizationId);

    if (activationError) {
      console.error('[Smartflo test-call] call queued but activation state could not be saved', activationError);
    }

    const callId = typeof responseData.call_id === 'string'
      ? responseData.call_id
      : typeof responseData.callId === 'string'
        ? responseData.callId
        : typeof (responseData.data as any)?.call_id === 'string'
          ? (responseData.data as any).call_id
          : null;

    return res.status(200).json({
      success: true,
      message: typeof responseData.message === 'string' ? responseData.message : 'Originate successfully queued',
      ref_id: typeof responseData.ref_id === 'string' ? responseData.ref_id : null,
      call_id: callId,
      activated: !activationError,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'Smartflo test call timed out.' : 'Unable to reach Smartflo click-to-call API.',
    });
  } finally {
    clearTimeout(timeout);
  }
}