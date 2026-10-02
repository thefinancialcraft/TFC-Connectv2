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

  const isDev = process.env.NODE_ENV === 'development';
  const isSuperAdmin = profile?.role === 'super_admin' || profile?.super_admin === true;
  const canManageIntegrations = profile?.role === 'admin' || isSuperAdmin || isDev;

  if (!canManageIntegrations) {
    res.status(403).json({ error: 'Organization admin access is required.' });
    return null;
  }

  let targetOrgId = profile?.organization_id;
  const requestedOrgId = (req.headers['x-organization-id'] as string) || (req.query.organizationId as string) || (req.body?.organizationId as string);
  if (requestedOrgId && isUuid(requestedOrgId)) {
    targetOrgId = requestedOrgId;
  }

  if (!targetOrgId) {
    res.status(400).json({ error: 'Organization ID not found.' });
    return null;
  }

  return { organizationId: targetOrgId, userId: user.id };
}

export interface FormattedSmartfloWebhookEvent {
  id: string;
  receivedAt: string;
  callId: string;
  refId: string;
  direction: string;
  callType: string;
  agentNumber: string;
  destinationNumber: string;
  status: string;
  hangupCause: string;
  duration: number;
  recordingUrl: string | null;
  rawPayload: Record<string, unknown>;
}

export function formatSmartfloWebhookEvent(
  rowId: string,
  createdAt: string | null | undefined,
  raw: unknown
): FormattedSmartfloWebhookEvent {
  const p = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const innerPayload =
    p.rawPayload && typeof p.rawPayload === 'object'
      ? (p.rawPayload as Record<string, unknown>)
      : p;

  let agent = '';
  if (p.agentNumber && typeof p.agentNumber === 'string' && p.agentNumber.trim() && p.agentNumber !== 'Unknown') {
    agent = p.agentNumber.trim();
  } else if (typeof innerPayload.answered_agent_name === 'string' && innerPayload.answered_agent_name) {
    agent = `${innerPayload.answered_agent_name}${innerPayload.answered_agent_number ? ` (${innerPayload.answered_agent_number})` : ''}`.trim();
  } else if (Array.isArray(innerPayload.missed_agent) && innerPayload.missed_agent.length > 0) {
    const m = (innerPayload.missed_agent[0] || {}) as Record<string, unknown>;
    const name = m.name ? String(m.name) : '';
    const num = m.number || m.agent_number || m.id || '';
    agent = name ? `${name}${num ? ` (${num})` : ''}` : String(num);
  } else {
    agent = String(
      innerPayload.agent_name ||
        innerPayload.agent_number ||
        innerPayload.caller_id_number ||
        innerPayload.caller_id ||
        p.agentNumber ||
        ''
    ).trim();
  }

  let destination = '';
  if (p.destinationNumber && typeof p.destinationNumber === 'string' && p.destinationNumber.trim() && p.destinationNumber !== 'Unknown') {
    destination = p.destinationNumber.trim();
  } else {
    destination = String(
      innerPayload.call_to_number ||
        innerPayload['customer_no_with_prefix '] ||
        innerPayload.customer_no_with_prefix ||
        innerPayload.destination_number ||
        innerPayload.customer_number ||
        innerPayload.digits_dialed ||
        innerPayload.to ||
        ''
    ).trim();
  }

  let cause = '';
  if (p.hangupCause && typeof p.hangupCause === 'string' && p.hangupCause !== 'NORMAL_CLEARING') {
    cause = p.hangupCause;
  } else {
    cause = String(
      innerPayload.hangup_cause_description ||
        innerPayload.hangup_cause_key ||
        innerPayload.hangup_cause ||
        innerPayload.cause ||
        p.hangupCause ||
        'NORMAL_CLEARING'
    );
  }

  const status = String(
    innerPayload.call_status ||
      innerPayload.status ||
      innerPayload.disposition ||
      p.status ||
      'missed'
  );

  const direction = String(innerPayload.direction || p.direction || 'clicktocall');
  const callType =
    direction === 'clicktocall'
      ? 'Click to Call'
      : String(p.callType || 'Click to Call');

  const durCandidate =
    p.duration ??
    innerPayload.outbound_sec ??
    innerPayload.outbound_talktime ??
    innerPayload.duration ??
    innerPayload.billsec ??
    innerPayload.talk_duration ??
    innerPayload.call_duration ??
    0;
  const durNum = Number(durCandidate);

  const recUrl = innerPayload.recording_url || innerPayload.record_url || p.recordingUrl || null;

  const refId = String(
    innerPayload.ref_id ||
      innerPayload.uuid ||
      innerPayload.custom_identifier ||
      p.refId ||
      innerPayload.call_id ||
      p.callId ||
      rowId
  );

  return {
    id: rowId,
    receivedAt: createdAt || String(p.receivedAt || new Date().toISOString()),
    callId: String(innerPayload.call_id || innerPayload.ref_id || innerPayload.uuid || innerPayload.id || p.callId || rowId),
    refId,
    direction,
    callType,
    agentNumber: agent,
    destinationNumber: destination,
    status,
    hangupCause: cause,
    duration: Number.isFinite(durNum) ? durNum : 0,
    recordingUrl: typeof recUrl === 'string' && recUrl.trim() ? recUrl.trim() : null,
    rawPayload: innerPayload,
  };
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

export async function syncSmartfloWebhookToCallHistory(payload: Record<string, unknown>, fallbackOrgId?: string) {
  if (!smartfloAdminClient) return null;

  try {
    const inner = (payload.rawPayload && typeof payload.rawPayload === 'object' ? payload.rawPayload : payload) as Record<string, any>;

    // 1. Extract custom_identifier
    let customId: Record<string, any> = {};
    if (typeof inner.custom_identifier === 'object' && inner.custom_identifier !== null) {
      customId = inner.custom_identifier;
    } else if (typeof inner.custom_identifier === 'string') {
      try {
        customId = JSON.parse(inner.custom_identifier);
      } catch {
        customId = {};
      }
    }

    const callTypeKey = String(customId.call_type || inner.call_type || '').toLowerCase().replace(/-/g, '_');
    
    // Only process when call_type is 'c2c_cus_out' (or similar c2c-cus-out)
    if (callTypeKey !== 'c2c_cus_out') {
      return null;
    }

    const refId = String(inner.ref_id || inner.uuid || inner.call_id || '').trim();
    const callId = String(inner.call_id || inner.ref_id || inner.uuid || '').trim();
    const primaryId = refId || callId;
    if (!primaryId) return null;

    const orgId = customId.org_id || inner.org_id || fallbackOrgId || null;
    const rynxlyUserId = customId.rynxly_user_id || inner.rynxly_user_id || null;
    const customerId = customId.customer_id || inner.customer_id || null;

    // 2. Fetch agent details from user_profiles
    let employeeId: string | null = null;
    let userName: string | null = null;
    if (rynxlyUserId) {
      const { data: userProfile } = await smartfloAdminClient
        .from('user_profiles')
        .select('employee_id, user_name, id, user_id')
        .or(`user_id.eq.${rynxlyUserId},id.eq.${rynxlyUserId}`)
        .maybeSingle();

      if (userProfile) {
        employeeId = userProfile.employee_id || null;
        userName = userProfile.user_name || null;
      }
    }

    // 3. Fetch customer details
    let customerName = 'Customer';
    let rawPhone = String(
      inner.call_to_number ||
      inner['customer_no_with_prefix '] ||
      inner.customer_no_with_prefix ||
      inner.destination_number ||
      inner.customer_number ||
      inner.digits_dialed ||
      ''
    ).trim();

    if (customerId) {
      const { data: custData } = await smartfloAdminClient
        .from('customers')
        .select('customer_name, phone_no')
        .eq('id', customerId)
        .maybeSingle();

      if (custData) {
        if (custData.customer_name) customerName = custData.customer_name;
        if (!rawPhone && custData.phone_no) rawPhone = custData.phone_no;
      }
    }

    const cleanNumber = rawPhone.replace(/\D/g, '').slice(-10);
    if (!cleanNumber) {
      console.warn('[Smartflo Webhook] Could not extract 10-digit customer number for call_history:', rawPhone);
      return null;
    }

    const duration = Number(
      inner.outbound_sec ??
      inner.billsec ??
      inner.duration ??
      inner.talk_duration ??
      0
    );

    const sfExtension =
      inner.answered_agent_number ||
      inner.answered_agent?.number ||
      inner.answered_agent?.extension ||
      inner.extension ||
      inner.caller_id_number ||
      'Smartflo';

    const recordingUrl = inner.recording_url || inner.record_url || inner.recording || null;
    const rawTimestamp = inner.start_stamp || inner.answer_stamp || inner.created_at || inner.time || null;
    let timestamp = new Date().toISOString();
    if (rawTimestamp) {
      try {
        if (typeof rawTimestamp === 'number') {
          const ms = rawTimestamp > 1e11 ? rawTimestamp : rawTimestamp * 1000;
          timestamp = new Date(ms).toISOString();
        } else {
          const parsed = new Date(String(rawTimestamp).replace(' ', 'T'));
          if (!isNaN(parsed.getTime())) timestamp = parsed.toISOString();
        }
      } catch {
        timestamp = new Date().toISOString();
      }
    }

    const idx = `sf_${primaryId}`;

    const callHistoryRow = {
      idx,
      ref_id: primaryId,
      number: cleanNumber,
      name: customerName,
      call_type: 'outgoing',
      duration: Number.isFinite(duration) ? duration : 0,
      timestamp,
      device_id: String(sfExtension),
      call_recording: recordingUrl ? String(recordingUrl) : null,
      is_personal: false,
      employee_id: employeeId,
      user_name: userName,
      organization_id: orgId,
    };

    const { data: inserted, error: upsertErr } = await smartfloAdminClient
      .from('call_history')
      .upsert(callHistoryRow, { onConflict: 'idx' })
      .select()
      .maybeSingle();

    if (upsertErr) {
      console.error('❌ [Smartflo Webhook] Error upserting to call_history:', upsertErr);
    } else {
      console.info(`✅ [Smartflo Webhook] Logged to call_history (idx: ${idx}, duration: ${duration}s, emp: ${employeeId})`);
    }

    // Reset user_profiles on_call to false when call finishes
    if (rynxlyUserId) {
      try {
        await smartfloAdminClient
          .from('user_profiles')
          .update({
            on_call: false,
            is_personal: false,
            updated_at: new Date().toISOString()
          })
          .or(`user_id.eq.${rynxlyUserId},id.eq.${rynxlyUserId}`);
      } catch (profErr) {
        console.warn('[Smartflo Webhook] Warning resetting user on_call:', profErr);
      }
    }

    return inserted;
  } catch (err) {
    console.error('❌ [Smartflo Webhook] Exception syncing to call_history:', err);
    return null;
  }
}