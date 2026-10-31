import type { NextApiRequest, NextApiResponse } from 'next';
import {
  metaAdminClient,
  requireMetaAuth,
  ingestMetaLeadToCrm,
  META_GRAPH_BASE_URL,
  type MetaRawLeadPayload,
} from '@/lib/metaAdsServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Meta Developer Portal Webhook Challenge Verification (GET)
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    const expectedVerifyToken =
      process.env.META_WEBHOOK_VERIFY_TOKEN || 'tfc_connect_meta_verify_token';

    if (mode === 'subscribe' && token === expectedVerifyToken) {
      console.log('[MetaWebhook] Webhook verified successfully.');
      return res.status(200).send(challenge);
    }

    return res.status(403).json({ error: 'Webhook verification failed: Invalid verify_token.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!metaAdminClient) {
    return res.status(500).json({ error: 'Database service unavailable.' });
  }

  const body = req.body || {};

  // 2. Interactive Test Lead Trigger from TFC Connect UI (`action === 'test_lead'`)
  if (body.action === 'test_lead') {
    const auth = await requireMetaAuth(req, res);
    if (!auth) return;

    const { configId, testName, testPhone, testCustomFields } = body;
    if (!configId) {
      return res.status(400).json({ error: 'Configuration ID is required for test lead.' });
    }

    const { data: config, error: cfgErr } = await metaAdminClient
      .from('meta_ad_configs')
      .select('*')
      .eq('id', configId)
      .maybeSingle();

    if (cfgErr || !config) {
      return res.status(404).json({ error: 'Connected Ad Configuration not found.' });
    }

    const random4 = Math.floor(1000 + Math.random() * 9000);
    const samplePhone = testPhone || `987650${random4}`;
    const sampleName = testName || `Meta Lead #${random4}`;

    const fieldMapping = config.field_mapping || {};
    const nameKey = fieldMapping.name || 'full_name';
    const phoneKey = fieldMapping.phone || 'phone_number';

    const fieldData = [
      { name: nameKey, values: [sampleName] },
      { name: phoneKey, values: [samplePhone] },
      { name: 'city', values: [testCustomFields?.city || 'Mumbai'] },
      { name: 'email', values: [testCustomFields?.email || `lead.${random4}@example.com`] },
      { name: 'inquiry_note', values: ['Interested via Meta Lead Ad Instant Form'] },
    ];

    const simulatedPayload: MetaRawLeadPayload = {
      id: `leadgen_test_${Date.now()}_${random4}`,
      created_time: new Date().toISOString(),
      ad_id: config.ad_id || 'ad_test_id',
      ad_name: config.ad_name || 'Meta Lead Ad',
      form_id: config.form_id,
      platform: 'fb',
      field_data: fieldData,
    };

    const result = await ingestMetaLeadToCrm({
      config,
      leadPayload: simulatedPayload,
      pageId: config.page_id,
      formId: config.form_id,
      adId: config.ad_id,
    });

    return res.status(200).json({
      success: result.status !== 'failed',
      result,
    });
  }

  // 3. Live Meta Leadgen Webhook Processing (`object === 'page'`)
  try {
    if (body.object !== 'page' || !Array.isArray(body.entry)) {
      return res.status(200).json({ received: true, ignored: true });
    }

    const results: any[] = [];

    for (const entry of body.entry) {
      const pageId = String(entry.id || '');
      const changes = Array.isArray(entry.changes) ? entry.changes : [];

      for (const change of changes) {
        if (change.field !== 'leadgen' || !change.value) continue;

        const val = change.value;
        const leadgenId = String(val.leadgen_id || val.id || '');
        const formId = String(val.form_id || '');
        const adId = val.ad_id ? String(val.ad_id) : undefined;
        const eventPageId = String(val.page_id || pageId);

        if (!leadgenId || !formId) continue;

        // Find active configurations matching this form_id (and page_id)
        const { data: candidateConfigs } = await metaAdminClient
          .from('meta_ad_configs')
          .select('*')
          .eq('form_id', formId)
          .eq('is_active', true);

        if (!candidateConfigs || candidateConfigs.length === 0) {
          console.log(`[MetaWebhook] No active meta_ad_configs found for form_id=${formId}`);
          continue;
        }

        // Prioritize exact ad_id match if ad_id is present; otherwise fallback to form-level config (where ad_id is null)
        let matchedConfigs = candidateConfigs.filter(
          (c: any) => adId && c.ad_id && String(c.ad_id) === adId
        );
        if (matchedConfigs.length === 0) {
          matchedConfigs = candidateConfigs.filter((c: any) => !c.ad_id);
        }
        if (matchedConfigs.length === 0) {
          matchedConfigs = [candidateConfigs[0]];
        }

        for (const config of matchedConfigs) {
          // Fetch full lead details from Meta Graph API unless field_data is already included in payload
          let leadPayload: MetaRawLeadPayload = {
            id: leadgenId,
            created_time: val.created_time
              ? new Date(Number(val.created_time) * 1000).toISOString()
              : new Date().toISOString(),
            ad_id: adId,
            form_id: formId,
            field_data: Array.isArray(val.field_data) ? val.field_data : undefined,
          };

          if (!leadPayload.field_data) {
            const { data: integration } = await metaAdminClient
              .from('meta_integrations')
              .select('user_access_token, connected_pages')
              .eq('organization_id', config.organization_id)
              .maybeSingle();

            if (integration) {
              const pages: any[] = Array.isArray(integration.connected_pages)
                ? integration.connected_pages
                : [];
              const matchedPage = pages.find((p: any) => String(p.page_id) === eventPageId);
              const accessToken = matchedPage?.page_access_token || integration.user_access_token;

              if (accessToken && accessToken !== 'SANDBOX_DEMO_TOKEN') {
                const graphRes = await fetch(
                  `${META_GRAPH_BASE_URL}/${encodeURIComponent(
                    leadgenId
                  )}?fields=id,created_time,ad_id,ad_name,form_id,field_data,platform&access_token=${encodeURIComponent(
                    accessToken
                  )}`
                );
                const graphLead = await graphRes.json();
                if (graphRes.ok && graphLead && graphLead.id) {
                  leadPayload = graphLead;
                }
              }
            }
          }

          const ingestRes = await ingestMetaLeadToCrm({
            config,
            leadPayload,
            pageId: eventPageId,
            formId,
            adId,
          });
          results.push({ configId: config.id, leadgenId, ...ingestRes });
        }
      }
    }

    return res.status(200).json({ received: true, processed: results.length, results });
  } catch (err: any) {
    console.error('[MetaWebhook POST] Error:', err);
    return res.status(500).json({ error: err?.message || 'Webhook processing error' });
  }
}

