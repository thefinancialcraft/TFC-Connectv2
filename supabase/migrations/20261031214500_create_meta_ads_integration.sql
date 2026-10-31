-- Migration: Create Meta (Facebook) Lead Ads Integration Tables, Indexes, and RLS
-- Created: 2026-10-31

-- 1. Table: meta_integrations (Per-Organization Facebook OAuth & Connected Pages/Ad Accounts)
CREATE TABLE IF NOT EXISTS public.meta_integrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    meta_app_id TEXT,
    meta_app_secret TEXT,
    meta_user_id TEXT,
    meta_user_name TEXT,
    meta_user_email TEXT,
    user_access_token TEXT,
    token_expires_at TIMESTAMPTZ,
    connected_pages JSONB NOT NULL DEFAULT '[]'::jsonb,
    ad_accounts JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active', -- 'active', 'expired', 'disconnected'
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT meta_integrations_organization_id_key UNIQUE (organization_id)
);

CREATE INDEX IF NOT EXISTS idx_meta_integrations_org ON public.meta_integrations(organization_id);
CREATE INDEX IF NOT EXISTS idx_meta_integrations_status ON public.meta_integrations(status);

-- 2. Table: meta_ad_configs (Lead Routing & Campaign Configuration per Connected Ad / Lead Form)
CREATE TABLE IF NOT EXISTS public.meta_ad_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    integration_id UUID REFERENCES public.meta_integrations(id) ON DELETE SET NULL,
    
    -- Meta Asset Identifiers
    page_id TEXT NOT NULL,
    page_name TEXT,
    ad_account_id TEXT,
    ad_account_name TEXT,
    ad_id TEXT, -- NULL or specific Meta Ad ID
    ad_name TEXT,
    form_id TEXT NOT NULL, -- Meta Leadgen Form ID
    form_name TEXT,
    
    -- CRM Target & Source Tracking
    campaign_id TEXT NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
    source_id TEXT NOT NULL,
    source_name TEXT NOT NULL,
    
    -- Agent Assignment Configuration
    -- 'unassigned' (General Pool), 'single_agent', 'round_robin'
    assignment_type TEXT NOT NULL DEFAULT 'unassigned',
    assigned_agent_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    assigned_agents_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    agent_cursor_index INTEGER NOT NULL DEFAULT 0,
    
    -- Expiry Date Configuration
    -- 'relative_days' (+X days from lead arrival), 'fixed_date' (specific date), 'none'
    expiry_mode TEXT NOT NULL DEFAULT 'relative_days',
    expiry_date TIMESTAMPTZ,
    expiry_days INTEGER DEFAULT 15,
    
    -- Duplicate Lead Handling & Field Mapping
    duplicate_handling TEXT NOT NULL DEFAULT 'skip', -- 'skip' | 'merge'
    field_mapping JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Telemetry Counters
    total_leads_synced INTEGER NOT NULL DEFAULT 0,
    duplicate_leads_skipped INTEGER NOT NULL DEFAULT 0,
    last_lead_received_at TIMESTAMPTZ,
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meta_ad_configs_org ON public.meta_ad_configs(organization_id);
CREATE INDEX IF NOT EXISTS idx_meta_ad_configs_form_id ON public.meta_ad_configs(form_id, is_active);
CREATE INDEX IF NOT EXISTS idx_meta_ad_configs_ad_id ON public.meta_ad_configs(ad_id, is_active);
CREATE INDEX IF NOT EXISTS idx_meta_ad_configs_page_id ON public.meta_ad_configs(page_id, is_active);
CREATE INDEX IF NOT EXISTS idx_meta_ad_configs_source_id ON public.meta_ad_configs(source_id);

-- 3. Table: meta_lead_logs (Real-Time Webhook & Sync Audit Trail)
CREATE TABLE IF NOT EXISTS public.meta_lead_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    config_id UUID REFERENCES public.meta_ad_configs(id) ON DELETE SET NULL,
    leadgen_id TEXT NOT NULL,
    page_id TEXT,
    form_id TEXT,
    ad_id TEXT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_name TEXT,
    assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status TEXT NOT NULL DEFAULT 'imported', -- 'imported', 'duplicate_skipped', 'duplicate_merged', 'failed'
    error_message TEXT,
    raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_meta_lead_logs_org_created ON public.meta_lead_logs(organization_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meta_lead_logs_config ON public.meta_lead_logs(config_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_meta_lead_logs_leadgen_id ON public.meta_lead_logs(leadgen_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.meta_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_ad_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_lead_logs ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.meta_integrations TO service_role;
GRANT ALL ON TABLE public.meta_ad_configs TO service_role;
GRANT ALL ON TABLE public.meta_lead_logs TO service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.meta_integrations TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.meta_ad_configs TO authenticated;
GRANT SELECT, INSERT ON TABLE public.meta_lead_logs TO authenticated;

-- 5. RLS Policies (Supporting Level 1 Internal Superadmin/Team + Organization Tenant Isolation)
DROP POLICY IF EXISTS "Meta integrations tenant isolation" ON public.meta_integrations;
CREATE POLICY "Meta integrations tenant isolation" ON public.meta_integrations
FOR ALL TO authenticated
USING (
    (EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
          AND (
            user_profiles.is_client = false
            OR user_profiles.super_admin = true
            OR user_profiles.role IN ('superadmin', 'super_admin')
          )
    ))
    OR (organization_id IN (
        SELECT user_profiles.organization_id
        FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
    ))
)
WITH CHECK (
    (EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
          AND (
            user_profiles.is_client = false
            OR user_profiles.super_admin = true
            OR user_profiles.role IN ('superadmin', 'super_admin')
          )
    ))
    OR (organization_id IN (
        SELECT user_profiles.organization_id
        FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
    ))
);

DROP POLICY IF EXISTS "Meta ad configs tenant isolation" ON public.meta_ad_configs;
CREATE POLICY "Meta ad configs tenant isolation" ON public.meta_ad_configs
FOR ALL TO authenticated
USING (
    (EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
          AND (
            user_profiles.is_client = false
            OR user_profiles.super_admin = true
            OR user_profiles.role IN ('superadmin', 'super_admin')
          )
    ))
    OR (organization_id IN (
        SELECT user_profiles.organization_id
        FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
    ))
)
WITH CHECK (
    (EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
          AND (
            user_profiles.is_client = false
            OR user_profiles.super_admin = true
            OR user_profiles.role IN ('superadmin', 'super_admin')
          )
    ))
    OR (organization_id IN (
        SELECT user_profiles.organization_id
        FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
    ))
);

DROP POLICY IF EXISTS "Meta lead logs tenant isolation" ON public.meta_lead_logs;
CREATE POLICY "Meta lead logs tenant isolation" ON public.meta_lead_logs
FOR ALL TO authenticated
USING (
    (EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
          AND (
            user_profiles.is_client = false
            OR user_profiles.super_admin = true
            OR user_profiles.role IN ('superadmin', 'super_admin')
          )
    ))
    OR (organization_id IN (
        SELECT user_profiles.organization_id
        FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
    ))
)
WITH CHECK (
    (EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
          AND (
            user_profiles.is_client = false
            OR user_profiles.super_admin = true
            OR user_profiles.role IN ('superadmin', 'super_admin')
          )
    ))
    OR (organization_id IN (
        SELECT user_profiles.organization_id
        FROM public.user_profiles
        WHERE user_profiles.user_id = (SELECT auth.uid())
    ))
);

