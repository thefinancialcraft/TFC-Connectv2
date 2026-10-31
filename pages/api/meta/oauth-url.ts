import type { NextApiRequest, NextApiResponse } from 'next';
import { requireMetaAuth, metaAdminClient, META_GRAPH_VERSION } from '@/lib/metaAdsServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log(`[MetaOAuthUrl] Incoming ${req.method} request`, {
    query: req.query,
    host: req.headers.host,
  });

  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await requireMetaAuth(req, res);
  if (!auth || !metaAdminClient) {
    console.warn('[MetaOAuthUrl] Auth or metaAdminClient check failed');
    return;
  }

  const host = req.headers.host || 'localhost:3000';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`;
  const redirectUri = `${baseUrl}/api/meta/callback`;

  let appId = (process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID || '').trim();
  let appSecret = (process.env.META_APP_SECRET || '').trim();
  let appIdSource: 'env' | 'body' | 'db' | 'none' = appId ? 'env' : 'none';

  // If user submitted App ID & App Secret from the UI modal, persist them for this organization
  if (req.method === 'POST') {
    const submittedAppId = String(req.body?.appId || '').trim();
    const submittedAppSecret = String(req.body?.appSecret || '').trim();
    console.log('[MetaOAuthUrl] Received POST credentials from UI', {
      organizationId: auth.organizationId,
      hasAppId: Boolean(submittedAppId),
      hasAppSecret: Boolean(submittedAppSecret),
    });

    if (submittedAppId) {
      appId = submittedAppId;
      appIdSource = 'body';
      if (submittedAppSecret) {
        appSecret = submittedAppSecret;
      }
      const { error: upsertErr } = await metaAdminClient.from('meta_integrations').upsert(
        {
          organization_id: auth.organizationId,
          meta_app_id: submittedAppId,
          ...(submittedAppSecret ? { meta_app_secret: submittedAppSecret } : {}),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'organization_id' }
      );
      if (upsertErr) {
        console.error('[MetaOAuthUrl] Failed saving Meta App credentials to DB:', upsertErr);
      }
    }
  }

  // Fallback to stored organization-level Meta App ID if env var is not set
  if (!appId) {
    const { data: existingIntegration, error: dbErr } = await metaAdminClient
      .from('meta_integrations')
      .select('meta_app_id, meta_app_secret')
      .eq('organization_id', auth.organizationId)
      .maybeSingle();

    if (dbErr) {
      console.error('[MetaOAuthUrl] Error querying meta_integrations for stored App ID:', dbErr);
    }

    if (existingIntegration?.meta_app_id) {
      appId = String(existingIntegration.meta_app_id).trim();
      appIdSource = 'db';
    }
    if (!appSecret && existingIntegration?.meta_app_secret) {
      appSecret = String(existingIntegration.meta_app_secret).trim();
    }
  }

  if (!appId) {
    console.warn('[MetaOAuthUrl] Cannot generate Facebook OAuth URL: META_APP_ID is missing in both .env.local and DB.', {
      organizationId: auth.organizationId,
      redirectUri,
      envMetaAppIdPresent: Boolean(process.env.META_APP_ID),
      envNextPublicMetaAppIdPresent: Boolean(process.env.NEXT_PUBLIC_META_APP_ID),
    });

    return res.status(200).json({
      configured: false,
      needsAppCredentials: true,
      debug: {
        reason: 'META_APP_ID_MISSING',
        organizationId: auth.organizationId,
        envMetaAppId: Boolean(process.env.META_APP_ID),
        envNextPublicMetaAppId: Boolean(process.env.NEXT_PUBLIC_META_APP_ID),
        envMetaAppSecret: Boolean(process.env.META_APP_SECRET),
        redirectUri,
      },
      message:
        'META_APP_ID is not configured yet. Enter your Facebook App ID & App Secret below (or add META_APP_ID and META_APP_SECRET in .env.local) to redirect to Facebook OAuth.',
      redirectUri,
      webhookUrl: `${baseUrl}/api/meta/webhook`,
    });
  }

  const statePayload = Buffer.from(
    JSON.stringify({
      orgId: auth.organizationId,
      userId: auth.userId,
      ts: Date.now(),
    })
  ).toString('base64url');

  const scopes = [
    'public_profile',
    'pages_show_list',
    'pages_read_engagement',
    'pages_manage_ads',
    'pages_manage_metadata',
    'leads_retrieval',
    'ads_read',
    'business_management',
  ].join(',');

  const oauthUrl =
    `https://www.facebook.com/${META_GRAPH_VERSION}/dialog/oauth` +
    `?client_id=${encodeURIComponent(appId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(statePayload)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&response_type=code`;

  console.log('[MetaOAuthUrl] Generated Facebook OAuth redirect URL successfully', {
    organizationId: auth.organizationId,
    appIdSource,
    appIdPreview: `${appId.slice(0, 6)}...`,
    hasSecret: Boolean(appSecret),
    redirectUri,
  });

  return res.status(200).json({
    configured: true,
    appId,
    appIdSource,
    hasSecret: Boolean(appSecret),
    oauthUrl,
    redirectUri,
    webhookUrl: `${baseUrl}/api/meta/webhook`,
  });
}
