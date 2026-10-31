import type { NextApiRequest, NextApiResponse } from 'next';
import { metaAdminClient, requireMetaAuth, META_GRAPH_BASE_URL } from '@/lib/metaAdsServer';

const DEMO_PAGES = [
  {
    page_id: 'page_tfc_official_101',
    page_name: 'TFC Official Business Page',
    category: 'Financial & Real Estate Services',
    is_demo: true,
  },
  {
    page_id: 'page_growth_campaigns_202',
    page_name: 'Premium Growth & Property Hub',
    category: 'Advertising / Marketing',
    is_demo: true,
  },
];

const DEMO_AD_ACCOUNTS = [
  {
    id: 'act_9081726354',
    account_id: '9081726354',
    name: 'Primary Meta Ads Account (INR)',
    currency: 'INR',
    account_status: 1,
  },
];

const DEMO_ADS_AND_FORMS = [
  {
    ad_id: 'ad_diwali_special_2026',
    ad_name: 'Diwali Festive Offer - Instant Callback Ad',
    ad_status: 'ACTIVE',
    meta_campaign_name: 'Q4 High Intent Lead Generation',
    ad_account_id: 'act_9081726354',
    ad_account_name: 'Primary Meta Ads Account (INR)',
    page_id: 'page_tfc_official_101',
    page_name: 'TFC Official Business Page',
    form_id: 'form_diwali_vip_001',
    form_name: 'Diwali VIP Inquiry Form (Instant Form)',
    leads_count: 142,
    questions: [
      { key: 'full_name', label: 'Full Name', type: 'FULL_NAME' },
      { key: 'phone_number', label: 'Phone Number', type: 'PHONE' },
      { key: 'email', label: 'Email Address', type: 'EMAIL' },
      { key: 'city', label: 'City', type: 'CITY' },
      { key: 'preferred_plan', label: 'Interested Plan / Budget', type: 'CUSTOM' },
    ],
  },
  {
    ad_id: 'ad_insurance_renewal_2026',
    ad_name: 'Health & Term Plan Zero-Commission Ad',
    ad_status: 'ACTIVE',
    meta_campaign_name: 'Insurance Renewal Drive - North India',
    ad_account_id: 'act_9081726354',
    ad_account_name: 'Primary Meta Ads Account (INR)',
    page_id: 'page_tfc_official_101',
    page_name: 'TFC Official Business Page',
    form_id: 'form_insurance_quote_002',
    form_name: 'Free Policy Quote Form v2',
    leads_count: 89,
    questions: [
      { key: 'full_name', label: 'Customer Full Name', type: 'FULL_NAME' },
      { key: 'phone_number', label: 'Mobile Number (WhatsApp)', type: 'PHONE' },
      { key: 'current_insurer', label: 'Existing Policy Provider', type: 'CUSTOM' },
      { key: 'policy_expiry_month', label: 'Policy Expiry Month', type: 'CUSTOM' },
      { key: 'sum_insured', label: 'Required Coverage Amount', type: 'CUSTOM' },
    ],
  },
  {
    ad_id: 'ad_property_site_visit_2026',
    ad_name: 'Luxury 3BHK Site Visit Booking - Reel Ad',
    ad_status: 'ACTIVE',
    meta_campaign_name: 'Real Estate Site Visits - NCR',
    ad_account_id: 'act_9081726354',
    ad_account_name: 'Primary Meta Ads Account (INR)',
    page_id: 'page_growth_campaigns_202',
    page_name: 'Premium Growth & Property Hub',
    form_id: 'form_site_visit_003',
    form_name: 'Weekend Site Visit Registration',
    leads_count: 64,
    questions: [
      { key: 'full_name', label: 'Full Name', type: 'FULL_NAME' },
      { key: 'phone_number', label: 'Contact Number', type: 'PHONE' },
      { key: 'budget_range', label: 'Budget Range', type: 'CUSTOM' },
      { key: 'preferred_visit_day', label: 'Preferred Visit Day', type: 'CUSTOM' },
    ],
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireMetaAuth(req, res);
  if (!auth || !metaAdminClient) return;

  const { organizationId, userId } = auth;

  if (req.method === 'GET') {
    try {
      const { data: integration, error } = await metaAdminClient
        .from('meta_integrations')
        .select('*')
        .eq('organization_id', organizationId)
        .maybeSingle();

      if (error) {
        // Table might not exist yet if migration hasn't run
        return res.status(200).json({
          connected: false,
          migrationPending: error.code === '42P01',
          integration: null,
          pages: [],
          adAccounts: [],
          discoverableAds: [],
        });
      }

      if (!integration || integration.status !== 'active') {
        return res.status(200).json({
          connected: false,
          integration: null,
          pages: [],
          adAccounts: [],
          discoverableAds: [],
        });
      }

      const pages: any[] = Array.isArray(integration.connected_pages) ? integration.connected_pages : [];
      const adAccounts: any[] = Array.isArray(integration.ad_accounts) ? integration.ad_accounts : [];
      const isSandbox =
        integration.user_access_token === 'SANDBOX_DEMO_TOKEN' ||
        pages.some((p: any) => p.is_demo === true);

      let discoverableAds: any[] = [];

      if (isSandbox) {
        discoverableAds = DEMO_ADS_AND_FORMS;
      } else {
        // Live Meta Graph API Discovery: Fetch leadgen_forms from each connected page + ads from ad accounts
        const formsByPage: Record<string, any[]> = {};

        await Promise.all(
          pages.map(async (page: any) => {
            const pageToken = page.page_access_token || integration.user_access_token;
            if (!pageToken || !page.page_id) return;
            try {
              const fRes = await fetch(
                `${META_GRAPH_BASE_URL}/${encodeURIComponent(
                  page.page_id
                )}/leadgen_forms?fields=id,name,status,leads_count,questions&limit=50&access_token=${encodeURIComponent(
                  pageToken
                )}`
              );
              const fData = await fRes.json();
              if (Array.isArray(fData?.data)) {
                formsByPage[page.page_id] = fData.data;
                for (const form of fData.data) {
                  discoverableAds.push({
                    ad_id: null,
                    ad_name: `All Ads using Form: ${form.name}`,
                    ad_status: form.status || 'ACTIVE',
                    meta_campaign_name: 'Page Lead Generation Form',
                    ad_account_id: adAccounts[0]?.id || '',
                    ad_account_name: adAccounts[0]?.name || 'Meta Ad Account',
                    page_id: page.page_id,
                    page_name: page.page_name,
                    form_id: form.id,
                    form_name: form.name,
                    leads_count: form.leads_count || 0,
                    questions: Array.isArray(form.questions)
                      ? form.questions.map((q: any) => ({
                          key: q.key || q.id,
                          label: q.label || q.key,
                          type: q.type || 'CUSTOM',
                        }))
                      : [
                          { key: 'full_name', label: 'Full Name', type: 'FULL_NAME' },
                          { key: 'phone_number', label: 'Phone Number', type: 'PHONE' },
                          { key: 'email', label: 'Email', type: 'EMAIL' },
                        ],
                  });
                }
              }
            } catch (e) {
              console.warn(`[MetaAssets] Failed fetching leadgen_forms for page ${page.page_id}:`, e);
            }
          })
        );

        // Also fetch individual Ads from connected Ad Accounts if available
        if (integration.user_access_token) {
          await Promise.all(
            adAccounts.slice(0, 5).map(async (acc: any) => {
              const actId = String(acc.id || '').startsWith('act_') ? acc.id : `act_${acc.account_id || acc.id}`;
              try {
                const adsRes = await fetch(
                  `${META_GRAPH_BASE_URL}/${encodeURIComponent(
                    actId
                  )}/ads?fields=id,name,status,campaign{id,name},creative{id,object_story_spec}&limit=50&access_token=${encodeURIComponent(
                    integration.user_access_token
                  )}`
                );
                const adsData = await adsRes.json();
                if (Array.isArray(adsData?.data)) {
                  for (const ad of adsData.data) {
                    const pageId =
                      ad?.creative?.object_story_spec?.page_id || pages[0]?.page_id || '';
                    const matchedPage = pages.find((p: any) => p.page_id === pageId) || pages[0];
                    const pageForms = formsByPage[pageId] || [];
                    const defaultForm = pageForms[0];

                    if (defaultForm) {
                      discoverableAds.push({
                        ad_id: ad.id,
                        ad_name: ad.name,
                        ad_status: ad.status || 'ACTIVE',
                        meta_campaign_name: ad.campaign?.name || 'Meta Campaign',
                        ad_account_id: actId,
                        ad_account_name: acc.name || actId,
                        page_id: matchedPage?.page_id || pageId,
                        page_name: matchedPage?.page_name || 'Facebook Page',
                        form_id: defaultForm.id,
                        form_name: defaultForm.name,
                        leads_count: defaultForm.leads_count || 0,
                        questions: Array.isArray(defaultForm.questions)
                          ? defaultForm.questions.map((q: any) => ({
                              key: q.key || q.id,
                              label: q.label || q.key,
                              type: q.type || 'CUSTOM',
                            }))
                          : [
                              { key: 'full_name', label: 'Full Name', type: 'FULL_NAME' },
                              { key: 'phone_number', label: 'Phone Number', type: 'PHONE' },
                            ],
                      });
                    }
                  }
                }
              } catch (e) {
                console.warn(`[MetaAssets] Failed fetching ads for account ${actId}:`, e);
              }
            })
          );
        }
      }

      // Sanitize integration before returning to client
      const safeIntegration = {
        id: integration.id,
        organization_id: integration.organization_id,
        meta_user_id: integration.meta_user_id,
        meta_user_name: integration.meta_user_name,
        meta_user_email: integration.meta_user_email,
        token_expires_at: integration.token_expires_at,
        status: integration.status,
        is_sandbox: isSandbox,
        updated_at: integration.updated_at,
      };

      const safePages = pages.map((p: any) => ({
        page_id: p.page_id,
        page_name: p.page_name,
        category: p.category,
        is_demo: p.is_demo || false,
      }));

      return res.status(200).json({
        connected: true,
        integration: safeIntegration,
        pages: safePages,
        adAccounts,
        discoverableAds,
      });
    } catch (err: any) {
      console.error('[MetaAssets GET] Error:', err);
      return res.status(500).json({ error: err?.message || 'Failed to load Meta assets.' });
    }
  }

  if (req.method === 'POST') {
    const { action, accessToken } = req.body || {};

    try {
      if (action === 'disconnect') {
        await metaAdminClient
          .from('meta_integrations')
          .update({
            status: 'disconnected',
            user_access_token: null,
            updated_at: new Date().toISOString(),
          })
          .eq('organization_id', organizationId);

        return res.status(200).json({ success: true, message: 'Meta account disconnected.' });
      }

      if (action === 'connect_sandbox') {
        const expiresAt = new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString();
        const { data: saved, error: upsertErr } = await metaAdminClient
          .from('meta_integrations')
          .upsert(
            {
              organization_id: organizationId,
              meta_user_id: 'meta_sandbox_99102',
              meta_user_name: 'Meta Business Suite (Sandbox)',
              meta_user_email: 'ads-manager@meta-business.demo',
              user_access_token: 'SANDBOX_DEMO_TOKEN',
              token_expires_at: expiresAt,
              connected_pages: DEMO_PAGES,
              ad_accounts: DEMO_AD_ACCOUNTS,
              status: 'active',
              created_by: userId,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'organization_id' }
          )
          .select('id')
          .single();

        if (upsertErr) throw upsertErr;
        return res.status(200).json({
          success: true,
          integrationId: saved?.id,
          message: 'Connected Meta Business Account (Sandbox Mode) with sample Ads & Lead Forms.',
        });
      }

      if (action === 'connect_token') {
        const cleanToken = String(accessToken || '').trim();
        if (!cleanToken) {
          return res.status(400).json({ error: 'Please provide a valid Meta User or Page Access Token.' });
        }

        const [meRes, pagesRes, adAccountsRes] = await Promise.all([
          fetch(`${META_GRAPH_BASE_URL}/me?fields=id,name,email&access_token=${encodeURIComponent(cleanToken)}`),
          fetch(
            `${META_GRAPH_BASE_URL}/me/accounts?fields=id,name,access_token,category&limit=100&access_token=${encodeURIComponent(
              cleanToken
            )}`
          ),
          fetch(
            `${META_GRAPH_BASE_URL}/me/adaccounts?fields=id,account_id,name,account_status,currency&limit=100&access_token=${encodeURIComponent(
              cleanToken
            )}`
          ),
        ]);

        const meData = await meRes.json();
        if (!meRes.ok || meData?.error) {
          return res.status(400).json({
            error: meData?.error?.message || 'Invalid Meta Access Token. Please verify token permissions.',
          });
        }

        const pagesData = await pagesRes.json();
        const adAccountsData = await adAccountsRes.json();

        let connectedPages = Array.isArray(pagesData?.data)
          ? pagesData.data.map((p: any) => ({
              page_id: p.id,
              page_name: p.name,
              category: p.category || 'Page',
              page_access_token: p.access_token,
            }))
          : [];

        // If user provided a Page Access Token directly, /me is the Page itself
        if (connectedPages.length === 0 && meData?.id) {
          connectedPages = [
            {
              page_id: meData.id,
              page_name: meData.name || 'Connected Facebook Page',
              category: 'Business Page',
              page_access_token: cleanToken,
            },
          ];
        }

        const adAccounts = Array.isArray(adAccountsData?.data)
          ? adAccountsData.data.map((a: any) => ({
              id: a.id,
              account_id: a.account_id || String(a.id).replace(/^act_/, ''),
              name: a.name || `Ad Account ${a.account_id || a.id}`,
              currency: a.currency || 'INR',
              account_status: a.account_status,
            }))
          : [];

        const expiresAt = new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString();

        const { data: saved, error: upsertErr } = await metaAdminClient
          .from('meta_integrations')
          .upsert(
            {
              organization_id: organizationId,
              meta_user_id: meData.id,
              meta_user_name: meData.name || 'Meta Business Account',
              meta_user_email: meData.email || null,
              user_access_token: cleanToken,
              token_expires_at: expiresAt,
              connected_pages: connectedPages,
              ad_accounts: adAccounts,
              status: 'active',
              created_by: userId,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'organization_id' }
          )
          .select('id')
          .single();

        if (upsertErr) throw upsertErr;

        return res.status(200).json({
          success: true,
          integrationId: saved?.id,
          pagesCount: connectedPages.length,
          adAccountsCount: adAccounts.length,
        });
      }

      return res.status(400).json({ error: 'Unsupported action.' });
    } catch (err: any) {
      console.error('[MetaAssets POST] Error:', err);
      return res.status(500).json({ error: err?.message || 'Failed to update Meta integration.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

