import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { computePhoneHash, encryptPhone } from '@/lib/phoneUtils';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const metaAdminClient: SupabaseClient | null =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      })
    : null;

export const META_GRAPH_VERSION = 'v20.0';
export const META_GRAPH_BASE_URL = `https://graph.facebook.com/${META_GRAPH_VERSION}`;

export interface MetaAuthContext {
  userId: string;
  organizationId: string;
  isLevel1: boolean;
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.trim())
  );
}

export async function requireMetaAuth(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<MetaAuthContext | null> {
  if (!metaAdminClient) {
    res.status(500).json({ error: 'Database service is not configured.' });
    return null;
  }

  const authorization = req.headers.authorization;
  const bearerMatch = authorization?.match(/^Bearer\s+(\S+)$/i);
  if (!bearerMatch) {
    res.status(401).json({ error: 'Unauthorized: Missing Bearer token.' });
    return null;
  }

  const {
    data: { user },
    error: authError,
  } = await metaAdminClient.auth.getUser(bearerMatch[1]);

  if (authError || !user) {
    res.status(401).json({ error: 'Unauthorized: Invalid session.' });
    return null;
  }

  let { data: profile } = await metaAdminClient
    .from('user_profiles')
    .select('organization_id, role, designation, is_client, super_admin')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!profile) {
    const fallback = await metaAdminClient
      .from('user_profiles')
      .select('organization_id, role, designation, is_client, super_admin')
      .eq('id', user.id)
      .maybeSingle();
    if (fallback.data) profile = fallback.data;
  }

  const role = String(profile?.role || '').toLowerCase().trim();
  const designation = String(profile?.designation || '').toLowerCase().trim();
  const isLevel1 =
    profile?.super_admin === true ||
    role === 'superadmin' ||
    role === 'super_admin' ||
    (profile?.is_client === false && (role === 'admin' || designation === 'ceo'));

  const requestedOrgId =
    (req.headers['x-organization-id'] as string) ||
    (req.query.organizationId as string) ||
    (req.body?.organizationId as string);

  let targetOrgId = profile?.organization_id || '';
  if (requestedOrgId && isUuid(requestedOrgId) && (isLevel1 || requestedOrgId === profile?.organization_id)) {
    targetOrgId = requestedOrgId;
  }

  if (!targetOrgId && isLevel1) {
    const { data: firstOrg } = await metaAdminClient
      .from('organizations')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (firstOrg?.id) targetOrgId = firstOrg.id;
  }

  if (!targetOrgId) {
    res.status(400).json({ error: 'Target organization could not be resolved.' });
    return null;
  }

  return {
    userId: user.id,
    organizationId: targetOrgId,
    isLevel1,
  };
}

export interface MetaFieldDataItem {
  name: string;
  values: string[];
}

export interface MetaRawLeadPayload {
  id: string;
  created_time?: string;
  ad_id?: string;
  ad_name?: string;
  adset_id?: string;
  adset_name?: string;
  campaign_id?: string;
  campaign_name?: string;
  form_id?: string;
  is_organic?: boolean;
  platform?: string;
  field_data?: MetaFieldDataItem[];
}

/**
 * Normalizes a raw phone string to 10-digit Indian mobile or clean digits
 */
export function normalizeMetaPhone(rawPhone: string): string {
  const digits = String(rawPhone || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.slice(1);
  }
  if (digits.length > 10) {
    return digits.slice(-10);
  }
  return digits;
}

/**
 * Extracts flat key-value map from Meta's field_data array
 */
export function flattenMetaFieldData(fieldData: MetaFieldDataItem[] = []): Record<string, string> {
  const map: Record<string, string> = {};
  for (const item of fieldData) {
    if (!item || !item.name) continue;
    const val = Array.isArray(item.values) ? item.values.filter(Boolean).join(', ') : String(item.values || '');
    map[item.name] = val.trim();
  }
  return map;
}

/**
 * Core Engine: Ingest a Meta Lead into CRM (`customers`, `system_logs`, `meta_lead_logs`)
 */
export async function ingestMetaLeadToCrm(params: {
  config: any;
  leadPayload: MetaRawLeadPayload;
  pageId?: string;
  formId?: string;
  adId?: string;
}): Promise<{
  status: 'imported' | 'duplicate_skipped' | 'duplicate_merged' | 'failed';
  customerId?: string;
  assignedTo?: string | null;
  customerName?: string;
  error?: string;
}> {
  if (!metaAdminClient) {
    return { status: 'failed', error: 'Database client unavailable' };
  }

  const { config, leadPayload } = params;
  const orgId: string = config.organization_id;
  const campaignId: string = config.campaign_id;
  const sourceId: string = config.source_id;
  const leadgenId = String(leadPayload.id || `META-${Date.now()}`);

  try {
    // 1. Check if this exact leadgen_id was already imported for this config
    const { data: existingLeadLog } = await metaAdminClient
      .from('meta_lead_logs')
      .select('id, status, customer_id')
      .eq('organization_id', orgId)
      .eq('leadgen_id', leadgenId)
      .eq('status', 'imported')
      .maybeSingle();

    if (existingLeadLog) {
      return {
        status: 'duplicate_skipped',
        customerId: existingLeadLog.customer_id,
        error: 'Leadgen ID already processed',
      };
    }

    // 2. Flatten Meta field_data
    const flatFields = flattenMetaFieldData(leadPayload.field_data || []);
    const mapping = config.field_mapping || {};

    // 3. Extract Customer Name
    let customerName = '';
    if (mapping.name && flatFields[mapping.name]) {
      customerName = flatFields[mapping.name];
    } else {
      const nameKey = Object.keys(flatFields).find((k) =>
        /^(full_name|name|customer_name|first_name|your_name)$/i.test(k)
      );
      if (nameKey) {
        customerName = flatFields[nameKey];
        if (/^first_name$/i.test(nameKey)) {
          const lastKey = Object.keys(flatFields).find((k) => /^last_name$/i.test(k));
          if (lastKey && flatFields[lastKey]) {
            customerName = `${customerName} ${flatFields[lastKey]}`.trim();
          }
        }
      } else {
        const fuzzyNameKey = Object.keys(flatFields).find((k) => /name/i.test(k));
        if (fuzzyNameKey) customerName = flatFields[fuzzyNameKey];
      }
    }
    if (!customerName) {
      customerName = 'Meta Ad Lead';
    }

    // 4. Extract Phone Number
    let rawPhone = '';
    if (mapping.phone && flatFields[mapping.phone]) {
      rawPhone = flatFields[mapping.phone];
    } else {
      const phoneKey = Object.keys(flatFields).find((k) =>
        /phone|mobile|contact|whatsapp|number|cell/i.test(k)
      );
      if (phoneKey) rawPhone = flatFields[phoneKey];
    }

    const cleanPhone = normalizeMetaPhone(rawPhone);
    if (!cleanPhone || cleanPhone.length < 6) {
      await metaAdminClient.from('meta_lead_logs').insert({
        organization_id: orgId,
        config_id: config.id,
        leadgen_id: leadgenId,
        page_id: params.pageId || config.page_id,
        form_id: params.formId || config.form_id,
        ad_id: params.adId || leadPayload.ad_id || config.ad_id,
        customer_name: customerName,
        status: 'failed',
        error_message: 'Missing or invalid phone number in Meta lead form submission.',
        raw_payload: leadPayload as any,
      });
      return { status: 'failed', customerName, error: 'Missing or invalid phone number' };
    }

    const phoneHash = computePhoneHash(cleanPhone);
    const encryptedPhone = encryptPhone(cleanPhone);

    // 5. Compute Expiry Date based on Config
    let computedExpiryDate: string | null = null;
    const expiryMode = config.expiry_mode || 'relative_days';
    if (expiryMode === 'fixed_date' && config.expiry_date) {
      const d = new Date(config.expiry_date);
      if (!isNaN(d.getTime())) computedExpiryDate = d.toISOString();
    } else if (expiryMode === 'relative_days') {
      const days = Number(config.expiry_days) > 0 ? Number(config.expiry_days) : 15;
      const d = new Date();
      d.setDate(d.getDate() + days);
      computedExpiryDate = d.toISOString();
    }

    // 6. Build customer_details JSON from remaining form fields + Meta Ad metadata
    const usedKeys = new Set<string>([mapping.name, mapping.phone].filter(Boolean));
    const detailsObj: Record<string, any> = {
      Source_Platform_checked: leadPayload.platform || 'Meta Ads',
      Source_Name_checked: config.source_name,
    };
    if (leadPayload.ad_name || config.ad_name) {
      detailsObj['Meta_Ad_Name_checked'] = leadPayload.ad_name || config.ad_name;
    }
    if (config.form_name) {
      detailsObj['Meta_Form_Name_checked'] = config.form_name;
    }

    const customFieldsConfig: Array<{ meta_key: string; crm_label: string; checked?: boolean }> =
      Array.isArray(mapping.custom_fields) ? mapping.custom_fields : [];

    if (customFieldsConfig.length > 0) {
      for (const cf of customFieldsConfig) {
        if (!cf.meta_key || usedKeys.has(cf.meta_key)) continue;
        const val = flatFields[cf.meta_key];
        if (val !== undefined && val !== '') {
          const suffix = cf.checked !== false ? '_checked' : '_unchecked';
          detailsObj[`${cf.crm_label || cf.meta_key}${suffix}`] = val;
          usedKeys.add(cf.meta_key);
        }
      }
    }

    // Also include any unmapped fields from the Meta Lead Form automatically
    for (const [key, val] of Object.entries(flatFields)) {
      if (usedKeys.has(key) || !val) continue;
      if (/^(full_name|phone_number)$/i.test(key)) continue;
      const cleanLabel = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      detailsObj[`${cleanLabel}_checked`] = val;
    }

    // 7. Check for Duplicate Phone in `customers` for this Organization
    const { data: existingCustomer } = await metaAdminClient
      .from('customers')
      .select('id, customer_name, customer_details, campaign_id, assigned_to')
      .eq('organization_id', orgId)
      .eq('phone_search_hash', phoneHash)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingCustomer) {
      const dupHandling = config.duplicate_handling || 'skip';

      if (dupHandling === 'merge') {
        // Merge into existing customer's customer_details history
        let existingDetails: any = existingCustomer.customer_details;
        if (typeof existingDetails === 'string') {
          try {
            existingDetails = JSON.parse(existingDetails);
          } catch {
            existingDetails = null;
          }
        }
        const history: Record<string, any> =
          existingDetails && typeof existingDetails === 'object' && existingDetails.history
            ? { ...existingDetails.history }
            : {};
        const nextIndex = Object.keys(history).length + 1;
        const nextKey = `details-${nextIndex}`;
        history[nextKey] = detailsObj;

        const updatedCustomerDetails = {
          active_details: nextKey,
          history,
        };

        await metaAdminClient
          .from('customers')
          .update({
            customer_details: updatedCustomerDetails,
            expiry_date: computedExpiryDate || undefined,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingCustomer.id);

        await metaAdminClient
          .from('meta_ad_configs')
          .update({
            duplicate_leads_skipped: (config.duplicate_leads_skipped || 0) + 1,
            last_lead_received_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', config.id);

        await incrementSystemLogCounters(orgId, sourceId, 0, 1);

        await metaAdminClient.from('meta_lead_logs').insert({
          organization_id: orgId,
          config_id: config.id,
          leadgen_id: leadgenId,
          page_id: params.pageId || config.page_id,
          form_id: params.formId || config.form_id,
          ad_id: params.adId || leadPayload.ad_id || config.ad_id,
          customer_id: existingCustomer.id,
          customer_name: customerName,
          assigned_to: existingCustomer.assigned_to,
          status: 'duplicate_merged',
          raw_payload: leadPayload as any,
        });

        return {
          status: 'duplicate_merged',
          customerId: existingCustomer.id,
          assignedTo: existingCustomer.assigned_to,
          customerName,
        };
      }

      // Default: Skip duplicate phone
      await metaAdminClient
        .from('meta_ad_configs')
        .update({
          duplicate_leads_skipped: (config.duplicate_leads_skipped || 0) + 1,
          last_lead_received_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', config.id);

      await incrementSystemLogCounters(orgId, sourceId, 0, 1);

      await metaAdminClient.from('meta_lead_logs').insert({
        organization_id: orgId,
        config_id: config.id,
        leadgen_id: leadgenId,
        page_id: params.pageId || config.page_id,
        form_id: params.formId || config.form_id,
        ad_id: params.adId || leadPayload.ad_id || config.ad_id,
        customer_id: existingCustomer.id,
        customer_name: customerName,
        assigned_to: existingCustomer.assigned_to,
        status: 'duplicate_skipped',
        error_message: 'Phone number already exists in CRM.',
        raw_payload: leadPayload as any,
      });

      return {
        status: 'duplicate_skipped',
        customerId: existingCustomer.id,
        assignedTo: existingCustomer.assigned_to,
        customerName,
      };
    }

    // 8. Determine Agent Assignment (General Pool vs Specific Agent vs Round-Robin)
    let assignedAgentId: string | null = null;
    let nextCursorIndex = Number(config.agent_cursor_index || 0);

    if (config.assignment_type === 'single_agent' && config.assigned_agent_id) {
      assignedAgentId = config.assigned_agent_id;
    } else if (config.assignment_type === 'round_robin') {
      const agentIds: string[] = Array.isArray(config.assigned_agents_config?.agent_ids)
        ? config.assigned_agents_config.agent_ids.filter(Boolean)
        : [];
      if (agentIds.length > 0) {
        assignedAgentId = agentIds[nextCursorIndex % agentIds.length];
        nextCursorIndex = (nextCursorIndex + 1) % agentIds.length;
      }
    }
    // else 'unassigned' -> General Pool (assignedAgentId = null)

    // 9. Insert Fresh Lead into `public.customers`
    const leadIdCode = `LEAD-META-${Date.now().toString().slice(-6)}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    const { data: insertedCustomer, error: insertError } = await metaAdminClient
      .from('customers')
      .insert({
        lead_id: leadIdCode,
        customer_name: customerName,
        phone_no: encryptedPhone,
        phone_search_hash: phoneHash,
        expiry_date: computedExpiryDate,
        customer_details: {
          active_details: 'details-1',
          history: {
            'details-1': detailsObj,
          },
        },
        campaign_id: campaignId,
        organization_id: orgId,
        source_id: sourceId,
        assigned_to: assignedAgentId,
        status: 'pending',
        attempt_count: 0,
        is_connected: false,
      })
      .select('id')
      .single();

    if (insertError || !insertedCustomer) {
      throw new Error(insertError?.message || 'Failed to insert customer into CRM');
    }

    // 10. Update `meta_ad_configs` counters & cursor
    await metaAdminClient
      .from('meta_ad_configs')
      .update({
        total_leads_synced: (config.total_leads_synced || 0) + 1,
        agent_cursor_index: nextCursorIndex,
        last_lead_received_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', config.id);

    // 11. Update `system_logs` counters
    await incrementSystemLogCounters(orgId, sourceId, 1, 0);

    // 12. Record in `meta_lead_logs`
    await metaAdminClient.from('meta_lead_logs').insert({
      organization_id: orgId,
      config_id: config.id,
      leadgen_id: leadgenId,
      page_id: params.pageId || config.page_id,
      form_id: params.formId || config.form_id,
      ad_id: params.adId || leadPayload.ad_id || config.ad_id,
      customer_id: insertedCustomer.id,
      customer_name: customerName,
      assigned_to: assignedAgentId,
      status: 'imported',
      raw_payload: leadPayload as any,
    });

    return {
      status: 'imported',
      customerId: insertedCustomer.id,
      assignedTo: assignedAgentId,
      customerName,
    };
  } catch (err: any) {
    console.error('[MetaAdsServer] Error ingesting Meta lead:', err);
    await metaAdminClient.from('meta_lead_logs').insert({
      organization_id: orgId,
      config_id: config.id,
      leadgen_id: leadgenId,
      page_id: params.pageId || config.page_id,
      form_id: params.formId || config.form_id,
      ad_id: params.adId || leadPayload.ad_id || config.ad_id,
      status: 'failed',
      error_message: err?.message || 'Unexpected ingestion error',
      raw_payload: leadPayload as any,
    });
    return { status: 'failed', error: err?.message || 'Unexpected ingestion error' };
  }
}

async function incrementSystemLogCounters(
  organizationId: string,
  sourceId: string,
  addedLeads: number,
  addedDuplicates: number
) {
  if (!metaAdminClient || !sourceId) return;
  const { data: sysLog } = await metaAdminClient
    .from('system_logs')
    .select('id, total_leads, duplicate_leads')
    .eq('organization_id', organizationId)
    .eq('source_id', sourceId)
    .maybeSingle();

  if (sysLog) {
    await metaAdminClient
      .from('system_logs')
      .update({
        total_leads: (sysLog.total_leads || 0) + addedLeads,
        duplicate_leads: (sysLog.duplicate_leads || 0) + addedDuplicates,
      })
      .eq('id', sysLog.id);
  }
}

