import type { NextApiRequest, NextApiResponse } from 'next';
import { requireSmartfloAdmin, smartfloAdminClient } from '@/lib/smartfloServer';

const pendingTimeoutMs = 75 * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const admin = await requireSmartfloAdmin(req, res);
  if (!admin || !smartfloAdminClient) return;

  const { data: integration, error } = await smartfloAdminClient
    .from('smartflo_integrations')
    .select('id, integration_id, enabled, status, created_at')
    .eq('organization_id', admin.organizationId)
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Unable to check Smartflo status.' });
  if (!integration) return res.status(200).json({ enabled: false, status: 'disabled' });

  const isPendingExpired = integration.status === 'pending' &&
    Date.now() - new Date(integration.created_at).getTime() >= pendingTimeoutMs;

  if (isPendingExpired) {
    const { error: deleteError } = await smartfloAdminClient
      .from('smartflo_integrations')
      .delete()
      .eq('id', integration.id)
      .eq('organization_id', admin.organizationId);

    if (deleteError) return res.status(500).json({ error: 'Unable to expire the Smartflo setup.' });
    return res.status(200).json({ enabled: false, status: 'expired' });
  }

  return res.status(200).json({
    integrationId: integration.integration_id,
    enabled: integration.enabled,
    status: integration.status,
    createdAt: integration.created_at,
  });
}