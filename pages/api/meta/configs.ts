import type { NextApiRequest, NextApiResponse } from 'next';
import { metaAdminClient, requireMetaAuth, META_GRAPH_BASE_URL } from '@/lib/metaAdsServer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = await requireMetaAuth(req, res);
  if (!auth || !metaAdminClient) return;

  const { organizationId, userId, isLevel1 } = auth;

  if (req.method === 'GET') {
    try {
      const filterOrg = (req.query.organizationId as string) || organizationId;

      let configsQuery = metaAdminClient
        .from('meta_ad_configs')
        .select('*, campaigns(id, name, status), organizations(id, company_name)')
        .order('created_at', { ascending: false });

      if (isLevel1 && req.query.organizationId === 'all') {
        // Level 1 viewing all organizations
      } else {
        configsQuery = configsQuery.eq('organization_id', filterOrg);
      }

      const [configsRes, logsRes] = await Promise.all([
        configsQuery,
        metaAdminClient
          .from('meta_lead_logs')
          .select('*')
          .eq('organization_id', filterOrg)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (configsRes.error) {
        if (configsRes.error.code === '42P01') {
          return res.status(200).json({
            migrationPending: true,
            configs: [],
            recentLogs: [],
          });
        }
        throw configsRes.error;
      }

      return res.status(200).json({
        configs: configsRes.data || [],
        recentLogs: logsRes.data || [],
      });
    } catch (err: any) {
      console.error('[MetaConfigs GET] Error:', err);
      return res.status(500).json({ error: err?.message || 'Failed to load Meta Ad configurations.' });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        page_id,
        page_name,
        ad_account_id,
        ad_account_name,
        ad_id,
        ad_name,
        form_id,
        form_name,
        campaign_id,
        source_name,
        assignment_type,
        assigned_agent_id,
        assigned_agents_config,
        expiry_mode,
        expiry_date,
        expiry_days,
        duplicate_handling,
        field_mapping,
      } = req.body || {};

      if (!campaign_id) {
        return res.status(400).json({ error: 'Target Campaign is required.' });
      }
      if (!source_name || !String(source_name).trim()) {
        return res.status(400).json({ error: 'Source Name is required.' });
      }
      if (!form_id || !page_id) {
        return res.status(400).json({ error: 'Meta Page and Lead Form are required.' });
      }

      // 1. Find organization's meta_integrations record
      const { data: integration } = await metaAdminClient
        .from('meta_integrations')
        .select('*')
        .eq('organization_id', organizationId)
        .maybeSingle();

      // 2. Subscribe the Facebook Page to `leadgen` webhooks if real page access token exists
      if (integration && integration.user_access_token !== 'SANDBOX_DEMO_TOKEN') {
        const pages: any[] = Array.isArray(integration.connected_pages) ? integration.connected_pages : [];
        const matchedPage = pages.find((p: any) => p.page_id === page_id);
        const pageToken = matchedPage?.page_access_token || integration.user_access_token;

        if (pageToken) {
          try {
            await fetch(
              `${META_GRAPH_BASE_URL}/${encodeURIComponent(page_id)}/subscribed_apps`,
              {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  subscribed_fields: ['leadgen'],
                  access_token: pageToken,
                }),
              }
            );
          } catch (subErr) {
            console.warn('[MetaConfigs POST] Page webhook subscription warning:', subErr);
          }
        }
      }

      // 3. Generate unique Source ID (`SRC-META-XXXXXX`)
      const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
      const sourceId = `SRC-META-${suffix}`;
      const cleanSourceName = String(source_name).trim();

      // 4. Insert into `public.meta_ad_configs`
      const { data: createdConfig, error: configError } = await metaAdminClient
        .from('meta_ad_configs')
        .insert({
          organization_id: organizationId,
          integration_id: integration?.id || null,
          page_id: String(page_id),
          page_name: page_name || 'Facebook Page',
          ad_account_id: ad_account_id || null,
          ad_account_name: ad_account_name || null,
          ad_id: ad_id ? String(ad_id) : null,
          ad_name: ad_name || form_name || 'Meta Lead Ad',
          form_id: String(form_id),
          form_name: form_name || 'Lead Form',
          campaign_id: String(campaign_id),
          source_id: sourceId,
          source_name: cleanSourceName,
          assignment_type: assignment_type || 'unassigned',
          assigned_agent_id:
            assignment_type === 'single_agent' && assigned_agent_id ? assigned_agent_id : null,
          assigned_agents_config:
            assignment_type === 'round_robin' && assigned_agents_config
              ? assigned_agents_config
              : { agent_ids: [] },
          agent_cursor_index: 0,
          expiry_mode: expiry_mode || 'relative_days',
          expiry_date: expiry_mode === 'fixed_date' && expiry_date ? expiry_date : null,
          expiry_days:
            expiry_mode === 'relative_days'
              ? Math.max(1, Number(expiry_days) || 15)
              : null,
          duplicate_handling: duplicate_handling || 'skip',
          field_mapping: field_mapping || { name: 'full_name', phone: 'phone_number' },
          is_active: true,
          created_by: userId,
        })
        .select('*, campaigns(id, name, status)')
        .single();

      if (configError) throw configError;

      // 5. Register Master Source Record in `public.system_logs` for Source Analytics
      await metaAdminClient.from('system_logs').insert({
        source_id: sourceId,
        source_name: cleanSourceName,
        total_leads: 0,
        duplicate_leads: 0,
        campaign_id: String(campaign_id),
        organization_id: organizationId,
        is_workflow_source: true,
        workflow_type: 'meta_ads',
        created_by: userId,
      });

      return res.status(201).json({
        success: true,
        config: createdConfig,
      });
    } catch (err: any) {
      console.error('[MetaConfigs POST] Error:', err);
      return res.status(500).json({ error: err?.message || 'Failed to save Meta Ad configuration.' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const {
        id,
        is_active,
        campaign_id,
        source_name,
        assignment_type,
        assigned_agent_id,
        assigned_agents_config,
        expiry_mode,
        expiry_date,
        expiry_days,
        duplicate_handling,
        field_mapping,
      } = req.body || {};

      if (!id) {
        return res.status(400).json({ error: 'Configuration ID is required.' });
      }

      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };

      if (typeof is_active === 'boolean') updates.is_active = is_active;
      if (campaign_id) updates.campaign_id = campaign_id;
      if (source_name && String(source_name).trim()) updates.source_name = String(source_name).trim();
      if (assignment_type) {
        updates.assignment_type = assignment_type;
        updates.assigned_agent_id =
          assignment_type === 'single_agent' && assigned_agent_id ? assigned_agent_id : null;
        if (assignment_type === 'round_robin' && assigned_agents_config) {
          updates.assigned_agents_config = assigned_agents_config;
        }
      }
      if (expiry_mode) {
        updates.expiry_mode = expiry_mode;
        updates.expiry_date = expiry_mode === 'fixed_date' && expiry_date ? expiry_date : null;
        updates.expiry_days =
          expiry_mode === 'relative_days' ? Math.max(1, Number(expiry_days) || 15) : null;
      }
      if (duplicate_handling) updates.duplicate_handling = duplicate_handling;
      if (field_mapping) updates.field_mapping = field_mapping;

      const { data: updated, error: updateErr } = await metaAdminClient
        .from('meta_ad_configs')
        .update(updates)
        .eq('id', id)
        .select('*, campaigns(id, name, status)')
        .single();

      if (updateErr) throw updateErr;

      // Sync source_name or campaign_id in system_logs if updated
      if ((updates.source_name || updates.campaign_id) && updated?.source_id) {
        const sysLogUpdates: Record<string, any> = {};
        if (updates.source_name) sysLogUpdates.source_name = updates.source_name;
        if (updates.campaign_id) sysLogUpdates.campaign_id = updates.campaign_id;
        await metaAdminClient
          .from('system_logs')
          .update(sysLogUpdates)
          .eq('source_id', updated.source_id)
          .eq('organization_id', updated.organization_id);
      }

      return res.status(200).json({
        success: true,
        config: updated,
      });
    } catch (err: any) {
      console.error('[MetaConfigs PATCH] Error:', err);
      return res.status(500).json({ error: err?.message || 'Failed to update Meta Ad configuration.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const id = (req.query.id as string) || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: 'Configuration ID is required.' });
      }

      const { error: delErr } = await metaAdminClient
        .from('meta_ad_configs')
        .delete()
        .eq('id', id);

      if (delErr) throw delErr;

      return res.status(200).json({ success: true });
    } catch (err: any) {
      console.error('[MetaConfigs DELETE] Error:', err);
      return res.status(500).json({ error: err?.message || 'Failed to delete Meta Ad configuration.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

