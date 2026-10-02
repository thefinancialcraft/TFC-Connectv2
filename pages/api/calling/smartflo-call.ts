import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, supabase } from '@/lib/supabase';
import {
  decryptSmartfloToken,
  smartfloAdminClient,
} from '@/lib/smartfloServer';

const clickToCallUrl = 'https://api-smartflo.tatateleservices.com/v1/click_to_call';

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
  ref_id?: string | null;
  call_id?: string | null;
  metadata?: Record<string, string>;
}

async function getAuthenticatedUser(req: NextApiRequest) {
  const authorization = req.headers.authorization;
  const bearerMatch = authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!bearerMatch) return null;

  const token = bearerMatch[1];
  const client = supabaseAdmin || supabase;
  if (!client) return null;

  try {
    const { data: { user }, error } = await client.auth.getUser(token);
    if (!error && user) return user;

    if (supabaseAdmin && client !== supabase) {
      const { data: { user: fallbackUser }, error: fallbackError } = await supabase.auth.getUser(token);
      if (!fallbackError && fallbackUser) return fallbackUser;
    }
  } catch {
    return null;
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const user = await getAuthenticatedUser(req);
  if (!user || !supabaseAdmin || !smartfloAdminClient) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Please sign in.' });
  }

  // 1. Fetch user profile & calling provider settings
  let { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('id, organization_id, calling_provider, user_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile && !profileError) {
    const fallbackProfile = await supabaseAdmin
      .from('user_profiles')
      .select('id, organization_id, calling_provider, user_name')
      .eq('id', user.id)
      .maybeSingle();
    if (fallbackProfile.data) profile = fallbackProfile.data;
  }

  if (profileError) {
    console.error('[Smartflo CRM Call] Error loading user profile:', profileError);
    return res.status(500).json({ success: false, message: 'Database error loading user profile.' });
  }

  if (!profile) {
    console.warn('[Smartflo CRM Call] Profile not found for auth user id:', user.id);
    return res.status(404).json({ success: false, message: 'User profile not found.' });
  }

  const callingProvider = profile.calling_provider as Record<string, any> | null;
  const smartfloUser = callingProvider?.smartflo;

  // 2. Validate that Smartflo is enabled and DID is mapped
  if (!smartfloUser?.enable) {
    return res.status(400).json({
      success: false,
      message: 'Smartflo calling is not enabled for your account.',
    });
  }

  if (!smartfloUser?.is_mapped) {
    return res.status(400).json({
      success: false,
      message: 'DID number not avilable config softllow setting. Please contact your admin.',
    });
  }

  // 3. Query user_smartflo_details for the agent's extension and assigned caller_id
  let { data: agentRow, error: agentError } = await smartfloAdminClient
    .from('user_smartflo_details')
    .select('smartflo_agent_id, agent_name, extension, intercom, caller_id, user_id, is_mapped')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!agentRow && profile.id && profile.id !== user.id) {
    const byRowId = await smartfloAdminClient
      .from('user_smartflo_details')
      .select('smartflo_agent_id, agent_name, extension, intercom, caller_id, user_id, is_mapped')
      .eq('user_id', profile.id)
      .maybeSingle();
    if (byRowId.data) {
      agentRow = byRowId.data;
    }
  }

  if (!agentRow && smartfloUser?.agent_id) {
    const fallbackAgent = await smartfloAdminClient
      .from('user_smartflo_details')
      .select('smartflo_agent_id, agent_name, extension, intercom, caller_id, user_id, is_mapped')
      .eq('smartflo_agent_id', smartfloUser.agent_id)
      .maybeSingle();
    if (fallbackAgent.data) {
      agentRow = fallbackAgent.data;
    }
  }

  if (agentError || !agentRow) {
    return res.status(400).json({
      success: false,
      message: 'DID number not avilable config softllow setting. Please contact your admin.',
    });
  }

  // Agent number: Use agent extension so Smartflo routes directly to the softphone/WebRTC
  const agentNumber = agentRow.extension?.trim() || agentRow.smartflo_agent_id?.trim();
  if (!agentNumber) {
    return res.status(400).json({
      success: false,
      message: 'No extension or agent ID configured for your Smartflo account.',
    });
  }

  // 4. Fetch Smartflo organization dialer configuration & token
  let { data: config, error: configError } = await smartfloAdminClient
    .from('smartflo_dialer_config')
    .select('integration_id, smartflo_api_token, is_token_valid, is_validate, token_expires_at, click_to_call_params')
    .eq('organization_id', profile.organization_id)
    .maybeSingle();

  if (configError || !config) {
    return res.status(500).json({ success: false, message: 'Unable to load Smartflo dialer configuration.' });
  }

  if (!config.smartflo_api_token || !(config.is_token_valid ?? config.is_validate)) {
    return res.status(409).json({ success: false, message: 'Authenticate a Smartflo token before calling.' });
  }

  if (config.token_expires_at && Date.parse(config.token_expires_at) <= Date.now()) {
    return res.status(409).json({ success: false, message: 'The Smartflo token has expired. Please re-authenticate in admin settings.' });
  }

  let token: string;
  try {
    token = decryptSmartfloToken(config.smartflo_api_token);
  } catch {
    return res.status(500).json({ success: false, message: 'Saved Smartflo token could not be decrypted.' });
  }

  // 5. Caller ID: Use agent assigned caller_id, fallback to org configured caller_id
  const orgParams = config.click_to_call_params && typeof config.click_to_call_params === 'object'
    ? config.click_to_call_params as Record<string, unknown>
    : {};
  const orgCallerId = typeof orgParams.caller_id === 'string'
    ? orgParams.caller_id.trim()
    : Array.isArray(orgParams.caller_id) && typeof orgParams.caller_id[0] === 'string'
      ? orgParams.caller_id[0].trim()
      : '';

  const callerId = agentRow.caller_id?.trim() || orgCallerId;
  if (!callerId) {
    return res.status(422).json({
      success: false,
      message: 'No Caller ID is assigned to your Smartflo extension. Please contact your admin.',
    });
  }

  // 6. Destination Number: Customer phone number
  let rawDestination = '';
  if (req.body && typeof req.body === 'object') {
    if (typeof req.body.destination_number === 'string') {
      rawDestination = req.body.destination_number;
    }
  }

  let destinationNumber = rawDestination.replace(/[\s\-\(\)]/g, '');
  if (destinationNumber.startsWith('+91')) destinationNumber = destinationNumber.substring(3);
  if (destinationNumber.startsWith('91') && destinationNumber.length === 12) destinationNumber = destinationNumber.substring(2);
  if (destinationNumber.startsWith('0') && destinationNumber.length === 11) destinationNumber = destinationNumber.substring(1);

  if (!destinationNumber || destinationNumber.length < 10) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid destination customer phone number (minimum 10 digits).',
    });
  }

  const campaignId = String(req.body?.campaign_id || req.headers['campaign_id'] || req.headers['campaign-id'] || 'CAM').trim();
  const customerId = String(req.body?.customer_id || req.headers['customer-id'] || req.headers['customer_id'] || 'CUST').trim();
  const rynxlyUserId = String(user.id || req.headers['rynxly_user_id'] || '').trim();
  const orgId = String(profile.organization_id || req.headers['org_id'] || '').trim();
  const integrationId = String(config?.integration_id || '').trim();
  const isManual = req.body?.is_manual === true || req.body?.is_manual === 'true' || req.headers['is_manual'] === 'true';
  const callType = String(req.body?.call_type || req.headers['call_type'] || 'c2c_cus_out').trim();

  // Object structure for Smartflo custom_identifier (echoed in webhooks)
  const customIdentifierObj = {
    customer_id: customerId,
    rynxly_user_id: rynxlyUserId,
    campaign_id: campaignId,
    org_id: orgId,
    integration_id: integrationId,
    is_manual: isManual,
    call_type: callType,
  };

  const customIdentifier = typeof req.body?.custom_identifier === 'string'
    ? req.body.custom_identifier.trim()
    : customIdentifierObj;

  console.info('[Smartflo CRM Click-to-Call] Initiating originate with metadata:', {
    agent_number: agentNumber,
    destination_number: destinationNumber,
    caller_id: callerId,
    'customer-id': customerId,
    'rynxly_user_id': rynxlyUserId,
    'campaign_id': campaignId,
    'org_id': orgId,
    'integration_id': integrationId,
    custom_identifier: customIdentifier,
    user_id: user.id,
    agent_name: agentRow.agent_name || profile.user_name,
  });

  const requestBody = {
    agent_number: agentNumber,
    destination_number: destinationNumber,
    caller_id: callerId,
    async: '1',
    custom_identifier: customIdentifier,
  };

  const smartfloHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'customer-id': customerId,
    'rynxly_user_id': rynxlyUserId,
    'campaign_id': campaignId,
    'org_id': orgId,
    'integration_id': integrationId,
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const smartfloResponse = await fetch(clickToCallUrl, {
      method: 'POST',
      headers: smartfloHeaders,
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
      console.error('[Smartflo CRM Click-to-Call] Call initiation rejected by Smartflo:', {
        status: smartfloResponse.status,
        responseData,
      });
      return res.status(502).json({
        success: false,
        message: typeof responseData.message === 'string' ? responseData.message : 'Smartflo could not queue the call.',
        data: responseData,
      });
    }

    const callId = typeof responseData.call_id === 'string'
      ? responseData.call_id
      : typeof responseData.callId === 'string'
        ? responseData.callId
        : typeof (responseData.data as any)?.call_id === 'string'
          ? (responseData.data as any).call_id
          : null;

    const refId = typeof responseData.ref_id === 'string'
      ? responseData.ref_id
      : typeof responseData.refId === 'string'
        ? responseData.refId
        : typeof responseData.uuid === 'string'
          ? responseData.uuid
          : typeof (responseData.data as any)?.ref_id === 'string'
            ? (responseData.data as any).ref_id
            : typeof (responseData.data as any)?.uuid === 'string'
              ? (responseData.data as any).uuid
              : null;

    // Set metadata headers on the API response
    res.setHeader('customer-id', customerId);
    res.setHeader('rynxly_user_id', rynxlyUserId);
    res.setHeader('campaign_id', campaignId);
    res.setHeader('org_id', orgId);
    res.setHeader('integration_id', integrationId);

    // Update user_profiles when ref_id / call_id is successfully returned
    const client = supabaseAdmin || supabase;
    if (client && user?.id && (refId || callId || responseData.success !== false)) {
      const updatePayload = {
        on_call: true,
        is_personal: false,
        updated_at: new Date().toISOString(),
      };

      try {
        await client.from('user_profiles').update(updatePayload).eq('user_id', user.id);
        if (profile?.id) {
          await client.from('user_profiles').update(updatePayload).eq('id', profile.id);
        } else {
          await client.from('user_profiles').update(updatePayload).eq('id', user.id);
        }
        console.info(`📞 [Smartflo] Successfully updated user_profiles on_call = true for user ${user.id}`);
      } catch (err) {
        console.error('❌ [Smartflo] Failed to update user_profiles on_call status:', err);
      }
    }

    return res.status(200).json({
      success: true,
      message: typeof responseData.message === 'string' ? responseData.message : 'Originate successfully queued',
      ref_id: refId,
      call_id: callId,
      metadata: {
        'customer-id': customerId,
        'rynxly_user_id': rynxlyUserId,
        'campaign_id': campaignId,
        'org_id': orgId,
        'integration_id': integrationId,
      },
      data: responseData,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    console.error('[Smartflo CRM Click-to-Call] Request exception:', error);
    return res.status(timedOut ? 504 : 502).json({
      success: false,
      message: timedOut ? 'Smartflo call request timed out.' : 'Unable to reach Smartflo click-to-call service.',
    });
  } finally {
    clearTimeout(timeout);
  }
}
