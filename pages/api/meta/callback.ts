import type { NextApiRequest, NextApiResponse } from 'next';
import { metaAdminClient, META_GRAPH_BASE_URL } from '@/lib/metaAdsServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code, state, error: oauthError, error_description } = req.query;
  console.log('[MetaCallback] Incoming OAuth callback request', {
    hasCode: Boolean(code),
    hasState: Boolean(state),
    oauthError: oauthError || null,
    error_description: error_description || null,
  });

  if (oauthError) {
    console.error('[MetaCallback] Facebook returned OAuth error:', { oauthError, error_description });
    const msg = encodeURIComponent(String(error_description || oauthError));
    return res.redirect(`/workflow/meta-ads?error=${msg}`);
  }

  if (!code || !state || typeof code !== 'string' || typeof state !== 'string') {
    return res.redirect('/workflow/meta-ads?error=Invalid+OAuth+callback+parameters');
  }

  if (!metaAdminClient) {
    return res.redirect('/workflow/meta-ads?error=Database+service+unavailable');
  }

  try {
    const decodedState = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
    const { orgId, userId } = decodedState;

    if (!orgId) {
      return res.redirect('/workflow/meta-ads?error=Missing+organization+context');
    }

    let appId = (process.env.META_APP_ID || process.env.NEXT_PUBLIC_META_APP_ID || '').trim();
    let appSecret = (process.env.META_APP_SECRET || '').trim();

    if (!appId || !appSecret) {
      const { data: storedCreds } = await metaAdminClient
        .from('meta_integrations')
        .select('meta_app_id, meta_app_secret')
        .eq('organization_id', orgId)
        .maybeSingle();

      if (!appId && storedCreds?.meta_app_id) {
        appId = String(storedCreds.meta_app_id).trim();
      }
      if (!appSecret && storedCreds?.meta_app_secret) {
        appSecret = String(storedCreds.meta_app_secret).trim();
      }
    }

    const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.rynxly.in';
    const baseUrl = rawBaseUrl.replace(/\/+$/, '');
    const redirectUri = `${baseUrl}/api/meta/callback`;

    if (!appId || !appSecret) {
      return res.redirect('/workflow/meta-ads?error=META_APP_ID+or+META_APP_SECRET+missing');
    }

    // 1. Exchange authorization code for short-lived token
    const tokenRes = await fetch(
      `${META_GRAPH_BASE_URL}/oauth/access_token` +
        `?client_id=${encodeURIComponent(appId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&client_secret=${encodeURIComponent(appSecret)}` +
        `&code=${encodeURIComponent(code)}`
    );
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      throw new Error(tokenData?.error?.message || 'Failed to exchange code for Meta access token');
    }

    let finalToken: string = tokenData.access_token;
    let expiresInSeconds: number = Number(tokenData.expires_in || 5184000);

    // 2. Exchange for Long-Lived User Access Token (60 days)
    try {
      const llRes = await fetch(
        `${META_GRAPH_BASE_URL}/oauth/access_token` +
          `?grant_type=fb_exchange_token` +
          `&client_id=${encodeURIComponent(appId)}` +
          `&client_secret=${encodeURIComponent(appSecret)}` +
          `&fb_exchange_token=${encodeURIComponent(finalToken)}`
      );
      const llData = await llRes.json();
      if (llRes.ok && llData.access_token) {
        finalToken = llData.access_token;
        expiresInSeconds = Number(llData.expires_in || 5184000);
      }
    } catch (e) {
      console.warn('[MetaCallback] Could not exchange for long-lived token, using standard token:', e);
    }

    // 3. Fetch Meta User Profile, Pages, and Ad Accounts
    const [meRes, pagesRes, adAccountsRes] = await Promise.all([
      fetch(`${META_GRAPH_BASE_URL}/me?fields=id,name,email&access_token=${encodeURIComponent(finalToken)}`),
      fetch(
        `${META_GRAPH_BASE_URL}/me/accounts?fields=id,name,access_token,category,tasks&limit=100&access_token=${encodeURIComponent(
          finalToken
        )}`
      ),
      fetch(
        `${META_GRAPH_BASE_URL}/me/adaccounts?fields=id,account_id,name,account_status,currency&limit=100&access_token=${encodeURIComponent(
          finalToken
        )}`
      ),
    ]);

    const meData = await meRes.json();
    const pagesData = await pagesRes.json();
    const adAccountsData = await adAccountsRes.json();

    const connectedPages = Array.isArray(pagesData?.data)
      ? pagesData.data.map((p: any) => ({
          page_id: p.id,
          page_name: p.name,
          category: p.category || 'Page',
          page_access_token: p.access_token,
        }))
      : [];

    const adAccounts = Array.isArray(adAccountsData?.data)
      ? adAccountsData.data.map((a: any) => ({
          id: a.id,
          account_id: a.account_id || String(a.id).replace(/^act_/, ''),
          name: a.name || `Ad Account ${a.account_id || a.id}`,
          currency: a.currency || 'INR',
          account_status: a.account_status,
        }))
      : [];

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    await metaAdminClient.from('meta_integrations').upsert(
      {
        organization_id: orgId,
        meta_user_id: meData?.id || null,
        meta_user_name: meData?.name || 'Meta Business User',
        meta_user_email: meData?.email || null,
        user_access_token: finalToken,
        token_expires_at: expiresAt,
        connected_pages: connectedPages,
        ad_accounts: adAccounts,
        status: 'active',
        created_by: userId || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'organization_id' }
    );

    return res.redirect('/workflow/meta-ads?connected=1');
  } catch (err: any) {
    console.error('[MetaCallback] Error completing OAuth:', err);
    const msg = encodeURIComponent(err?.message || 'Failed to connect Meta account');
    return res.redirect(`/workflow/meta-ads?error=${msg}`);
  }
}

