import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabase';
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
  if (!bearerMatch || !supabaseAdmin) return null;

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(bearerMatch[1]);
  return error || !user ? null : user;
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

  const { ref_id, call_id } = req.body || {};
  if (!ref_id && !call_id) {
    return res.status(400).json({
      success: false,
      message: 'Either ref_id or call_id is required to disconnect the call.',
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

  // 3. Send Hangup request to Smartflo
  const hangupPayload: Record<string, string> = {};
  if (ref_id) hangupPayload.ref_id = String(ref_id).trim();
  if (call_id) hangupPayload.call_id = String(call_id).trim();

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

    if (!sfRes.ok) {
      return res.status(sfRes.status).json({
        success: false,
        message: 'Smartflo hangup request failed.',
        data: sfData,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Call hangup request sent successfully.',
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
