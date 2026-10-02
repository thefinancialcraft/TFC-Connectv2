import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, supabase } from '@/lib/supabase';
import {
  decryptSmartfloToken,
  smartfloAdminClient,
} from '@/lib/smartfloServer';

const hangupUrl = 'https://api-smartflo.tatateleservices.com/v1/call/hangup';
const disconnectUrl = 'https://api-smartflo.tatateleservices.com/v1/dialer/disconnect_call';
const liveListUrl = 'https://api-smartflo.tatateleservices.com/v1/live_calls';

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
  resolved_call_id?: string | null;
  target_ref_id?: string | null;
  target_phone?: string | null;
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

function cleanPhone(raw: string): string {
  if (!raw) return '';
  return raw.replace(/\D/g, '').slice(-10);
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

  const { ref_id, call_id, phone, customer_id } = req.body || {};
  const targetRefId = ref_id ? String(ref_id).trim() : '';
  const targetCallId = call_id ? String(call_id).trim() : '';
  const targetPhone = phone ? cleanPhone(String(phone)) : '';

  if (!targetRefId && !targetCallId && !targetPhone) {
    return res.status(400).json({
      success: false,
      message: 'Either ref_id, call_id, or phone is required to cancel the call.',
    });
  }

  // 1. Fetch user profile for organization_id
  let { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('id, organization_id, user_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile && !profileError) {
    const fallbackProfile = await supabaseAdmin
      .from('user_profiles')
      .select('id, organization_id, user_name')
      .eq('id', user.id)
      .maybeSingle();
    if (fallbackProfile.data) profile = fallbackProfile.data;
  }

  if (profileError || !profile) {
    return res.status(404).json({ success: false, message: 'User profile not found.' });
  }

  // 2. Fetch agent details from user_smartflo_details
  let { data: agentRow } = await smartfloAdminClient
    .from('user_smartflo_details')
    .select('smartflo_agent_id, agent_name, extension, caller_id, user_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!agentRow && profile.id && profile.id !== user.id) {
    const byRowId = await smartfloAdminClient
      .from('user_smartflo_details')
      .select('smartflo_agent_id, agent_name, extension, caller_id, user_id')
      .eq('user_id', profile.id)
      .maybeSingle();
    if (byRowId.data) agentRow = byRowId.data;
  }

  // 3. Fetch Smartflo dialer config & token
  let { data: config, error: configError } = await smartfloAdminClient
    .from('smartflo_dialer_config')
    .select('smartflo_api_token, is_token_valid, is_validate, token_expires_at')
    .eq('organization_id', profile.organization_id)
    .maybeSingle();

  if (configError || !config || !config.smartflo_api_token) {
    return res.status(500).json({ success: false, message: 'Smartflo token not configured.' });
  }

  let token: string;
  try {
    token = decryptSmartfloToken(config.smartflo_api_token);
  } catch {
    return res.status(500).json({ success: false, message: 'Could not decrypt Smartflo token.' });
  }

  console.info('🛑 [Smartflo Cancel] Initiating cancel for:', {
    targetRefId,
    targetCallId,
    targetPhone,
    agent_name: agentRow?.agent_name || profile.user_name,
    extension: agentRow?.extension,
  });

  let resolvedCallId: string | null = null;
  let matchedLiveCall: any = null;
  let lastLiveCallsCount = 0;
  let rawLiveResponseSample: any = null;

  // If targetCallId looks like a real switch call ID (contains '.' or 'HYD' and not a UUID), use it directly
  const isDirectSwitchCallId = targetCallId && targetCallId !== targetRefId && (targetCallId.includes('HYD') || targetCallId.includes('.'));
  if (isDirectSwitchCallId) {
    resolvedCallId = targetCallId;
  }

  // 4. Query GET /v1/live_calls with up to 3 retries (to allow switch 400-800ms to register channel if just dialed)
  for (let attempt = 1; attempt <= 3 && !resolvedCallId; attempt++) {
    try {
      console.info(`🛑 [Smartflo Cancel] Attempt ${attempt}: Querying ${liveListUrl}...`);
      const liveRes = await fetch(liveListUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      if (liveRes.ok) {
        const liveText = await liveRes.text();
        let liveJson: any = null;
        try {
          liveJson = liveText ? JSON.parse(liveText) : null;
        } catch {
          liveJson = null;
        }

        if (liveJson) {
          const callsArray: any[] = Array.isArray(liveJson)
            ? liveJson
            : Array.isArray(liveJson?.calls)
              ? liveJson.calls
              : Array.isArray(liveJson?.data)
                ? liveJson.data
                : Array.isArray(liveJson?.records)
                  ? liveJson.records
                  : Array.isArray(liveJson?.data?.calls)
                    ? liveJson.data.calls
                    : Array.isArray(liveJson?.result?.calls)
                      ? liveJson.result.calls
                      : Array.isArray(liveJson?.result)
                        ? liveJson.result
                        : [];

          lastLiveCallsCount = callsArray.length;
          rawLiveResponseSample = callsArray.slice(0, 3);
          console.info(`🛑 [Smartflo Cancel] Attempt ${attempt}: Found ${callsArray.length} active calls on switch`);

          // Match Priority 1: Exact ref_id or call_id in call object or custom_identifier
          matchedLiveCall = callsArray.find((c: any) => {
            const rawCustId = c.custom_identifier ? JSON.stringify(c.custom_identifier) : '';
            const cRef = String(c.ref_id || c.refId || c.uuid || '');
            const cCallId = String(c.call_id || c.callId || c.id || '');
            if (targetRefId && (cRef === targetRefId || cCallId === targetRefId || rawCustId.includes(targetRefId))) return true;
            if (targetCallId && (cCallId === targetCallId || cRef === targetCallId || rawCustId.includes(targetCallId))) return true;
            return false;
          });

          // Match Priority 2: Customer destination phone match
          if (!matchedLiveCall && targetPhone) {
            matchedLiveCall = callsArray.find((c: any) => {
              const cDest = cleanPhone(String(c.destination || c.customer_number || c.destination_number || ''));
              return cDest && (cDest.includes(targetPhone) || targetPhone.includes(cDest));
            });
          }

          // Match Priority 3: Agent name or extension match
          if (!matchedLiveCall && agentRow) {
            const agentExt = agentRow.extension?.trim();
            const agentName = agentRow.agent_name?.trim()?.toLowerCase();
            matchedLiveCall = callsArray.find((c: any) => {
              const cAgentName = String(c.agent_name || '').toLowerCase();
              const cSource = String(c.source || '');
              if (agentName && cAgentName && (cAgentName.includes(agentName) || agentName.includes(cAgentName))) return true;
              if (agentExt && (cSource.includes(agentExt) || String(c.agent_number || '').includes(agentExt))) return true;
              return false;
            });
          }

          // Match Priority 4: If only 1 call is active and it's click-to-call, it must be this one!
          if (!matchedLiveCall && callsArray.length === 1 && String(callsArray[0]?.type || '').includes('click-to-call')) {
            matchedLiveCall = callsArray[0];
            console.info('🛑 [Smartflo Cancel] Inferred single active click-to-call on account');
          }

          if (matchedLiveCall) {
            resolvedCallId = String(matchedLiveCall.call_id || matchedLiveCall.callId || matchedLiveCall.id || '');
            console.info('🛑 [Smartflo Cancel] Resolved switch call_id from live_calls:', {
              resolvedCallId,
              state: matchedLiveCall.state,
              agent_name: matchedLiveCall.agent_name,
              destination: matchedLiveCall.destination,
            });
            break;
          }
        }
      }
    } catch (err: any) {
      console.warn(`🛑 [Smartflo Cancel] Warning querying live_calls on attempt ${attempt}:`, err?.message);
    }

    if (!resolvedCallId && attempt < 3) {
      await sleep(400); // Small pause to let switch register channel
    }
  }

  // 5. Execute termination against Smartflo APIs
  const results: any[] = [];
  let successful = false;

  // Action 1: Terminate by resolved switch call_id via /v1/call/hangup
  if (resolvedCallId) {
    try {
      console.info('🛑 [Smartflo Cancel] Action 1: /v1/call/hangup with call_id:', resolvedCallId);
      const res1 = await fetch(hangupUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ call_id: resolvedCallId }),
      });
      const data1 = await res1.json().catch(() => null);
      console.info('🛑 [Smartflo Cancel] Action 1 response:', { status: res1.status, data: data1 });
      results.push({ strategy: 'hangup_call_id', status: res1.status, ok: res1.ok, data: data1 });
      if (res1.ok) successful = true;
    } catch (e: any) {
      console.warn('🛑 [Smartflo Cancel] Action 1 error:', e?.message);
    }
  }

  // Action 2: Dialer Disconnect Call API with switch call_id
  if (resolvedCallId && !successful) {
    try {
      console.info('🛑 [Smartflo Cancel] Action 2: /v1/dialer/disconnect_call with call_id:', resolvedCallId);
      const res2 = await fetch(disconnectUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ call_id: resolvedCallId }),
      });
      const data2 = await res2.json().catch(() => null);
      console.info('🛑 [Smartflo Cancel] Action 2 response:', { status: res2.status, data: data2 });
      results.push({ strategy: 'dialer_disconnect', status: res2.status, ok: res2.ok, data: data2 });
      if (res2.ok) successful = true;
    } catch (e: any) {
      console.warn('🛑 [Smartflo Cancel] Action 2 error:', e?.message);
    }
  }

  // Action 3: Fallback with ref_id
  if (!successful && targetRefId) {
    try {
      const payload: Record<string, string> = { ref_id: targetRefId };
      if (resolvedCallId) payload.call_id = resolvedCallId;

      console.info('🛑 [Smartflo Cancel] Action 3: /v1/call/hangup with ref_id:', payload);
      const res3 = await fetch(hangupUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data3 = await res3.json().catch(() => null);
      console.info('🛑 [Smartflo Cancel] Action 3 response:', { status: res3.status, data: data3 });
      results.push({ strategy: 'hangup_ref_id', status: res3.status, ok: res3.ok, data: data3 });
      if (res3.ok) successful = true;
    } catch (e: any) {
      console.warn('🛑 [Smartflo Cancel] Action 3 error:', e?.message);
    }
  }

  return res.status(200).json({
    success: true,
    message: successful ? 'Call cancelled successfully.' : 'Cancel request executed.',
    resolved_call_id: resolvedCallId,
    target_ref_id: targetRefId,
    target_phone: targetPhone,
    data: {
      matched_call: matchedLiveCall,
      live_calls_count: lastLiveCallsCount,
      live_calls_sample: rawLiveResponseSample,
      results,
    },
  });
}
