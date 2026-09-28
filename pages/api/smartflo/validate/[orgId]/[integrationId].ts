import { createHash, timingSafeEqual } from 'node:crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { isUuid, smartfloAdminClient } from '@/lib/smartfloServer';

const pendingTimeoutMs = 2 * 60 * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Vary', 'Authorization');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: 'false', data: { value: 'Method not allowed' } });
  }

  const { orgId, integrationId } = req.query;
  if (!isUuid(orgId) || !isUuid(integrationId) || !smartfloAdminClient) {
    return res.status(404).json({ success: 'false', data: { value: 'Integration not found' } });
  }

  const authorization = req.headers.authorization;
  const bearerMatch = authorization?.match(/^Bearer\s+(\S+)$/i);
  const suppliedKey = bearerMatch?.[1] || authorization;
  if (!suppliedKey) {
    return res.status(401).json({ success: 'false', data: { value: 'Unauthorized' } });
  }

  const masterKey = process.env.SMARTFLO_CONNECTOR_API_KEY;
  if (!masterKey) {
    return res.status(401).json({ success: 'false', data: { value: 'Unauthorized' } });
  }

  const expectedKey = `${masterKey}-${orgId}-${integrationId}`;
  const suppliedDigest = createHash('sha256').update(suppliedKey).digest();
  const expectedDigest = createHash('sha256').update(expectedKey).digest();
  if (!timingSafeEqual(suppliedDigest, expectedDigest)) {
    return res.status(401).json({ success: 'false', data: { value: 'Unauthorized' } });
  }

  const { data: integration, error } = await smartfloAdminClient
    .from('smartflo_integrations')
    .select('id, enabled, status, created_at')
    .eq('organization_id', orgId)
    .eq('integration_id', integrationId)
    .maybeSingle();

  if (error || !integration) {
    return res.status(401).json({ success: 'false', data: { value: 'Unauthorized' } });
  }

  if (integration.enabled && integration.status === 'active') {
    return res.status(200).json({ success: 'true', data: { value: 'Rynxly CRM' } });
  }

  if (integration.status !== 'pending') {
    return res.status(410).json({ success: 'false', data: { value: 'Integration is no longer pending' } });
  }

  if (Date.now() - new Date(integration.created_at).getTime() >= pendingTimeoutMs) {
    await smartfloAdminClient
      .from('smartflo_integrations')
      .delete()
      .eq('id', integration.id)
      .eq('organization_id', orgId)
      .eq('integration_id', integrationId)
      .eq('status', 'pending')
      .eq('enabled', false);
    return res.status(410).json({ success: 'false', data: { value: 'Integration setup expired' } });
  }

  const { data: activated, error: activationError } = await smartfloAdminClient
    .from('smartflo_integrations')
    .update({ enabled: true, status: 'active', authorized_at: new Date().toISOString() })
    .eq('id', integration.id)
    .eq('status', 'pending')
    .eq('enabled', false)
    .select('id')
    .maybeSingle();

  if (activationError) {
    return res.status(500).json({ success: 'false', data: { value: 'Unable to activate integration' } });
  }

  if (!activated) {
    const { data: current } = await smartfloAdminClient
      .from('smartflo_integrations')
      .select('enabled, status')
      .eq('id', integration.id)
      .eq('organization_id', orgId)
      .eq('integration_id', integrationId)
      .maybeSingle();
    if (current?.enabled && current.status === 'active') {
      return res.status(200).json({ success: 'true', data: { value: 'Rynxly CRM' } });
    }
    return res.status(410).json({ success: 'false', data: { value: 'Integration is no longer pending' } });
  }

  return res.status(200).json({ success: 'true', data: { value: 'Rynxly CRM' } });
}