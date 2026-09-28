import type { NextApiRequest, NextApiResponse } from 'next';
import {
  createSmartfloApiKey,
  getSmartfloValidationUrl,
  hashSmartfloApiKey,
  isUuid,
  requireSmartfloAdmin,
  smartfloAdminClient,
} from '@/lib/smartfloServer';

const pendingTimeoutMs = 75 * 1000;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');

  if (!['GET', 'POST', 'DELETE'].includes(req.method || '')) {
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const admin = await requireSmartfloAdmin(req, res);
  if (!admin || !smartfloAdminClient) return;

  const integrationId = req.method === 'GET'
    ? req.query.integrationId
    : req.body?.integrationId;

  if (!isUuid(integrationId)) {
    return res.status(400).json({ error: 'A valid integration ID is required.' });
  }

  if (req.method === 'DELETE') {
    const { error } = await smartfloAdminClient
      .from('smartflo_integrations')
      .delete()
      .eq('organization_id', admin.organizationId)
      .eq('integration_id', integrationId);

    if (error) return res.status(500).json({ error: 'Unable to remove the Smartflo setup.' });
    return res.status(200).json({ success: true });
  }

  const [{ data: organization, error: organizationError }, { data: existing, error: existingError }] = await Promise.all([
    smartfloAdminClient
      .from('organizations')
      .select('company_name, company_code')
      .eq('id', admin.organizationId)
      .maybeSingle(),
    smartfloAdminClient
      .from('smartflo_integrations')
      .select('id, integration_id, enabled, status, created_at')
      .eq('organization_id', admin.organizationId)
      .maybeSingle(),
  ]);

  if (organizationError || !organization) {
    return res.status(404).json({ error: 'Organization was not found.' });
  }
  if (existingError) {
    return res.status(500).json({ error: 'Unable to read the Smartflo setup.' });
  }

  let apiKey: string;
  let validationUrl: string;
  try {
    apiKey = createSmartfloApiKey(admin.organizationId, integrationId);
    validationUrl = getSmartfloValidationUrl(admin.organizationId, integrationId);
  } catch {
    return res.status(503).json({ error: 'Smartflo connector is not configured.' });
  }

  if (req.method === 'GET') {
    if (existing?.enabled && existing.status === 'active') {
      return res.status(409).json({ error: 'Smartflo is already connected.' });
    }

    return res.status(200).json({
      integrationId,
      integrationName: `Rynxly CRM${organization.company_code ? ` (${organization.company_code})` : ''}`,
      validationUrl,
      apiKey,
      companyCode: organization.company_code,
    });
  }

  if (existing) {
    const isPendingExpired = existing.status === 'pending' &&
      Date.now() - new Date(existing.created_at).getTime() >= pendingTimeoutMs;

    if (existing.integration_id === integrationId && existing.status === 'pending' && !isPendingExpired) {
      return res.status(200).json({ success: true, createdAt: existing.created_at });
    }

    if (existing.enabled && existing.status === 'active') {
      return res.status(409).json({ error: 'Smartflo is already connected.' });
    }

    if (isPendingExpired || existing.status !== 'pending') {
      const { error: deleteError } = await smartfloAdminClient
        .from('smartflo_integrations')
        .delete()
        .eq('id', existing.id)
        .eq('organization_id', admin.organizationId);
      if (deleteError) return res.status(500).json({ error: 'Unable to clear the previous Smartflo setup.' });
    } else {
      return res.status(409).json({ error: 'Another Smartflo setup is already pending.' });
    }
  }

  const { data: row, error: insertError } = await smartfloAdminClient
    .from('smartflo_integrations')
    .insert({
      organization_id: admin.organizationId,
      organization_name: organization.company_name,
      company_code: organization.company_code,
      integration_id: integrationId,
      validation_url: validationUrl,
      api_key: hashSmartfloApiKey(apiKey),
      enabled: false,
      status: 'pending',
    })
    .select('created_at')
    .single();

  if (insertError) {
    return res.status(500).json({ error: 'Unable to create the Smartflo setup.' });
  }

  return res.status(201).json({ success: true, createdAt: row.created_at });
}