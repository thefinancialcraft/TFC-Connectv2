import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';
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

function getSmartfloTokenEncryptionKey() {
  const secret = process.env.SMARTFLO_TOKEN_ENCRYPTION_KEY || serviceRoleKey;
  if (!secret) throw new Error('Smartflo token encryption is not configured.');
  return createHash('sha256').update(secret).digest();
}

export function hashSmartfloToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function encryptSmartfloToken(token: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getSmartfloTokenEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return `v1:${iv.toString('base64')}:${authTag.toString('base64')}:${ciphertext.toString('base64')}`;
}

export function decryptSmartfloToken(encryptedToken: string): string {
  const [version, encodedIv, encodedAuthTag, encodedCiphertext] = encryptedToken.split(':');
  if (version !== 'v1' || !encodedIv || !encodedAuthTag || !encodedCiphertext) {
    throw new Error('Stored Smartflo token has an unsupported format.');
  }

  const decipher = createDecipheriv(
    'aes-256-gcm',
    getSmartfloTokenEncryptionKey(),
    Buffer.from(encodedIv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(encodedAuthTag, 'base64'));
  return Buffer.concat([
    decipher.update(Buffer.from(encodedCiphertext, 'base64')),
    decipher.final(),
  ]).toString('utf8');
}

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