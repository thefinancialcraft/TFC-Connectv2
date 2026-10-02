import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin, supabase } from '@/lib/supabase';
import {
  decryptSmartfloToken,
  smartfloAdminClient,
} from '@/lib/smartfloServer';

const hangupUrl = 'https://api-smartflo.tatateleservices.com/v1/call/hangup';

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: unknown;
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

  const { ref_id, call_id, phone } = req.body || {};
  if (!ref_id && !call_id && !phone) {
    return res.status(400).json({
      success: false,
      message: 'Either ref_id, call_id, or phone is required to disconnect the call.',
    });
  }

  // 1. Fetch user profile for organization_id
  let { data: profile, error: profileError } = await supabaseAdmin
    .from('user_profiles')
    .select('id, organization_id')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile && !profileError) {
    const fallbackProfile = await supabaseAdmin
      .from('user_profiles')
      .select('id, organization_id')
      .eq('id', user.id)
      .maybeSingle();
    if (fallbackProfile.data) profile = fallbackProfile.data;
  }

  if (profileError || !profile) {
    return res.status(404).json({ success: false, message: 'User profile not found.' });
  }

  // 2. Fetch Smartflo dialer config & token
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

  // 3. If call_id is missing or equals ref_id, check live_calls
  let resolvedCallId = call_id ? String(call_id).trim() : '';
  const targetRefId = ref_id ? String(ref_id).trim() : '';
  const cleanPhone = phone ? String(phone).replace(/\D/g, '').slice(-10) : '';

  if (!resolvedCallId || resolvedCallId === targetRefId) {
    try {
      const liveRes = await fetch('https://api-smartflo.tatateleservices.com/v1/live_calls', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      });
      if (liveRes.ok) {
        const liveJson = await liveRes.json().catch(() => null);
        const callsArray: any[] = Array.isArray(liveJson) ? liveJson : (liveJson?.calls || liveJson?.data || []);
        const matched = callsArray.find((c: any) => {
          const cRef = String(c.ref_id || '');
          const cCallId = String(c.call_id || '');
          const cCust = String(c.customer_number || c.destination || '').replace(/\D/g, '');
          const custMatches = cleanPhone && (cCust.endsWith(cleanPhone) || cleanPhone.endsWith(cCust));
          const refMatches = (targetRefId && (cRef === targetRefId || cCallId === targetRefId || JSON.stringify(c.custom_identifier || '').includes(targetRefId))) ||
                             (resolvedCallId && (cCallId === resolvedCallId || cRef === resolvedCallId));
          return refMatches || custMatches;
        });

        if (matched?.call_id) {
          resolvedCallId = String(matched.call_id);
          console.info('[Smartflo Hangup] Resolved switch call_id from live_calls:', resolvedCallId);
        }
      }
    } catch (e) {
      console.warn('[Smartflo Hangup] Warning checking live_calls:', e);
    }
  }

  // Send Hangup request to Smartflo
  const hangupPayload: Record<string, string> = {};
  if (resolvedCallId) hangupPayload.call_id = resolvedCallId;
  if (targetRefId && !resolvedCallId) hangupPayload.ref_id = targetRefId;

  try {
    console.info('[Smartflo Hangup] Calling hangup API with payload:', hangupPayload);

    const sfRes = await fetch(hangupUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(hangupPayload),
    });

    const responseText = await sfRes.text();
    let sfData: unknown = null;
    try {
      sfData = JSON.parse(responseText);
    } catch {
      sfData = responseText;
    }

    console.info('[Smartflo Hangup] Response from Smartflo:', {
      status: sfRes.status,
      ok: sfRes.ok,
      data: sfData,
    });

    const isIgnorableSfStatus = sfRes.status === 422 || sfRes.status === 404 || sfRes.status === 429;

    // Always reset user_profiles on_call status to false when hangup is requested
    const client = supabaseAdmin || supabase;
    if (client && user?.id) {
      const nowIso = new Date().toISOString();
      const updatePayload = {
        on_call: false,
        is_personal: false,
        idle_time: nowIso,
        updated_at: nowIso,
      };
      try {
        await client.from('user_profiles').update(updatePayload).eq('user_id', user.id);
        if (profile?.id) {
          await client.from('user_profiles').update(updatePayload).eq('id', profile.id);
        } else {
          await client.from('user_profiles').update(updatePayload).eq('id', user.id);
        }
      } catch (err) {
        console.error('[Smartflo Hangup] Failed to update user_profiles on_call status:', err);
      }
    }

    if (!sfRes.ok && !isIgnorableSfStatus) {
      return res.status(sfRes.status).json({
        success: false,
        message: 'Smartflo hangup request failed.',
        data: sfData,
      });
    }

    let statusMsg = 'Call hangup request sent successfully.';
    if (sfRes.status === 422 || sfRes.status === 404) {
      statusMsg = 'Call already disconnected on switch.';
    } else if (sfRes.status === 429) {
      statusMsg = 'Hangup acknowledged (switch rate limit cooldown).';
    }

    return res.status(200).json({
      success: true,
      message: statusMsg,
      data: sfData,
    });
  } catch (err: any) {
    console.error('[Smartflo Hangup] Network or server error:', err);
    return res.status(500).json({
      success: false,
      message: err?.message || 'Failed to communicate with Smartflo hangup service.',
    });
  }
}
