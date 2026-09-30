import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from 'node:crypto';
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
const millisecondsPerDay = 86_400_000;

function parseCreatedAtDate(value: unknown): string | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
    ? parsed.toISOString()
    : null;
}

function calculateExpiryDate(createdAt: string, expiryDays: number): string {
  return new Date(Date.parse(createdAt) + (expiryDays + 1) * millisecondsPerDay - 72 * 60 * 60 * 1000).toISOString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const admin = await requireSmartfloAdmin(req, res);
  if (!admin || !smartfloAdminClient) return;

  let token = typeof req.body?.token === 'string' ? req.body.token.trim() : '';
  const expiryDays = Number(req.body?.expiryDays ?? 30);
  const createdAt = parseCreatedAtDate(req.body?.createdAt);
  const retry = Boolean(req.body?.retry);

  if (!createdAt) {
    return res.status(400).json({ error: 'Select a valid Created At date.' });
  }

  if (retry && !token) {
    const { data: config, error } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .select('smartflo_api_token')
      .eq('organization_id', admin.organizationId)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ error: 'Unable to load the saved Smartflo token.' });
    }

    if (!config?.smartflo_api_token) {
      return res.status(404).json({ error: 'No saved Smartflo token is available to retry.' });
    }

    try {
      token = decryptSmartfloToken(config.smartflo_api_token);
    } catch {
      return res.status(500).json({ error: 'Saved Smartflo token could not be decrypted for retry.' });
    }
  }

  if (!token || token.length > 4096 || !allowedExpiryDays.includes(expiryDays)) {
    return res.status(400).json({ error: 'A valid Smartflo API token and supported expiry are required.' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const smartfloResponse = await fetch(smartfloUsersUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    const responseText = await smartfloResponse.text();
    let data: unknown = responseText;
    try {
      data = responseText ? JSON.parse(responseText) : null;
    } catch {
      data = responseText.slice(0, 4000);
    }

    if (!smartfloResponse.ok) {
      return res.status(200).json({
        success: false,
        status: smartfloResponse.status,
        data,
        error: 'Smartflo rejected the token.',
      });
    }

    const responseData = data && typeof data === 'object' && !Array.isArray(data)
      ? data as Record<string, unknown>
      : null;
    const users = Array.isArray(responseData?.data)
      ? responseData.data
      : Array.isArray(data)
        ? data as unknown[]
        : [];
    const syncCounts = await syncSmartfloUsers(admin.organizationId, users);
    const { data: existingConfig, error: existingConfigError } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .select('click_to_call_params')
      .eq('organization_id', admin.organizationId)
      .maybeSingle();
    if (existingConfigError) return res.status(500).json({ error: 'Unable to preserve existing Smartflo request settings.' });

    const clickToCallParams = existingConfig?.click_to_call_params && typeof existingConfig.click_to_call_params === 'object'
      ? existingConfig.click_to_call_params
      : {};
    const expiresAt = calculateExpiryDate(createdAt, expiryDays);
    const integrationId = randomUUID();

    const { error: configError } = await smartfloAdminClient
      .from('smartflo_dialer_config')
      .upsert({
        organization_id: admin.organizationId,
        integration_id: integrationId,
        smartflo_api_token: encryptSmartfloToken(token),
        smartflo_api_token_hash: hashSmartfloToken(token),
        is_token_valid: true,
        is_validate: true,
        token_created_at: createdAt,
        token_expires_at: expiresAt,
        click_to_call_params: clickToCallParams,
        status: 'configured',
      }, { onConflict: 'organization_id' });

    if (configError) {
      return res.status(500).json({ error: 'Unable to save the Smartflo authentication.' });
    }

    console.info('[Smartflo preflight] users received and synced', {
      status: smartfloResponse.status,
      receivedCount: users.length,
      ...syncCounts,
    });

    return res.status(200).json({
      success: true,
      status: smartfloResponse.status,
      data,
      users,
      configuration: {
        integrationId,
        isTokenValid: true,
        tokenCreatedAt: createdAt,
        tokenExpiresAt: expiresAt,
        expiryDays,
        clickToCallParams,
      },
      ...syncCounts,
    });
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'Smartflo token verification timed out.' : 'Unable to reach Smartflo for token verification.',
    });
  } finally {
    clearTimeout(timeout);
  }
}