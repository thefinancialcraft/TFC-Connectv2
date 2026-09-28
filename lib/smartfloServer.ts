import { createHash } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const smartfloAdminClient: SupabaseClient | null =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

export interface SmartfloAdminContext {
  organizationId: string;
  userId: string;
}

export async function requireSmartfloAdmin(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<SmartfloAdminContext | null> {
  if (!smartfloAdminClient) {
    res.status(500).json({ error: 'Smartflo service is not configured.' });
    return null;
  }

  const authorization = req.headers.authorization;
  const bearerMatch = authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!bearerMatch) {
    res.status(401).json({ error: 'Unauthorized.' });
    return null;
  }

  const { data: { user }, error: authError } = await smartfloAdminClient.auth.getUser(bearerMatch[1]);
  if (authError || !user) {
    res.status(401).json({ error: 'Unauthorized.' });
    return null;
  }

  const { data: profile, error: profileError } = await smartfloAdminClient
    .from('user_profiles')
    .select('organization_id, role, super_admin')
    .eq('user_id', user.id)
    .maybeSingle();

  if (profileError) {
    res.status(500).json({ error: 'Unable to verify organization access.' });
    return null;
  }

  const canManageIntegrations =
    profile?.role === 'admin' ||
    profile?.role === 'super_admin' ||
    profile?.super_admin === true;

  if (!canManageIntegrations || !profile?.organization_id) {
    res.status(403).json({ error: 'Organization admin access is required.' });
    return null;
  }

  return { organizationId: profile.organization_id, userId: user.id };
}

export function createSmartfloApiKey(organizationId: string, integrationId: string): string {
  const masterKey = process.env.SMARTFLO_CONNECTOR_API_KEY;
  if (!masterKey) throw new Error('Smartflo connector key is not configured.');

  return `${masterKey}-${organizationId}-${integrationId}`;
}

export function hashSmartfloApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex');
}

export function getSmartfloValidationUrl(organizationId: string, integrationId: string): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rynxly.in';
  const origin = new URL(configuredUrl).origin;
  return `${origin}/api/smartflo/validate/${organizationId}/${integrationId}`;
}

export function isUuid(value: unknown): value is string {
  return typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}