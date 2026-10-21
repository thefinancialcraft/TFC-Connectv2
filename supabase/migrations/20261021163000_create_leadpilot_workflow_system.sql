-- Migration: LeadPilot Workflow System Tables, Alterations, Indexes, and RLS
-- Created: 2026-10-21

-- 1. Table: workflows (Workflow Registry)
CREATE TABLE IF NOT EXISTS public.workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'fi-rr-branching',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflows_org ON public.workflows(organization_id);

-- 2. Table: leadpilot (Bulk Upload Configurations)
CREATE TABLE IF NOT EXISTS public.leadpilot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    campaign_id TEXT NOT NULL REFERENCES public.campaigns(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    source_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled', -- 'draft', 'scheduled', 'running', 'paused', 'completed', 'cancelled'
    
    -- Scheduling
    batches_per_day INTEGER NOT NULL CHECK (batches_per_day BETWEEN 1 AND 20),
    batch_times JSONB NOT NULL,
    batch_size INTEGER NOT NULL CHECK (batch_size > 0),
    pause_days TEXT[] DEFAULT '{}',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    
    -- Assignment & Quotas
    assignment_type TEXT NOT NULL DEFAULT 'unassigned',
    assigned_agents_config JSONB DEFAULT '{}'::jsonb,
    agent_cursor_index INTEGER DEFAULT 0,
    
    -- Sorting & Priority
    sort_by TEXT NOT NULL DEFAULT 'file_order',
    
    -- Remembered Column Mappings (Used for auto-mapping on subsequent uploads)
    column_mapping JSONB DEFAULT '{}'::jsonb,
    total_files_uploaded INTEGER DEFAULT 1,
    
    -- Live Tracking Metrics
    total_leads INTEGER DEFAULT 0,
    uploaded_leads INTEGER DEFAULT 0,
    pending_leads INTEGER DEFAULT 0,
    failed_leads INTEGER DEFAULT 0,
    skipped_leads INTEGER DEFAULT 0,
    completed_batches INTEGER DEFAULT 0,
    next_execution_at TIMESTAMPTZ,
    last_executed_at TIMESTAMPTZ,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leadpilot_org ON public.leadpilot(organization_id);
CREATE INDEX IF NOT EXISTS idx_leadpilot_source_id ON public.leadpilot(source_id);
CREATE INDEX IF NOT EXISTS idx_leadpilot_status_next_exec ON public.leadpilot(status, next_execution_at);

-- 3. Table: pilotlead_uploads (Upload History Audit)
CREATE TABLE IF NOT EXISTS public.pilotlead_uploads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pilotlead_id UUID NOT NULL REFERENCES public.leadpilot(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size_bytes BIGINT,
    total_rows INTEGER NOT NULL,
    valid_rows INTEGER NOT NULL,
    duplicate_rows INTEGER NOT NULL DEFAULT 0,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pilotlead_uploads_pilot ON public.pilotlead_uploads(pilotlead_id, created_at DESC);

-- 4. Table: lead_sheduled (Staged Leads Cloned Schema)
CREATE TABLE IF NOT EXISTS public.lead_sheduled (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pilotlead_id UUID NOT NULL REFERENCES public.leadpilot(id) ON DELETE CASCADE,
    upload_id UUID REFERENCES public.pilotlead_uploads(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    campaign_id TEXT NOT NULL REFERENCES public.campaigns(id),
    source_id TEXT NOT NULL,
    source_file_name TEXT,
    
    -- Cloned customer fields
    lead_id TEXT,
    customer_name TEXT NOT NULL,
    phone_no TEXT,
    phone_search_hash TEXT,
    expiry_date TIMESTAMPTZ,
    customer_details TEXT,
    assigned_to UUID REFERENCES auth.users(id),
    
    -- Staging execution fields
    row_index INTEGER NOT NULL,
    upload_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'uploaded', 'failed', 'skipped', 'cancelled'
    batch_number INTEGER,
    uploaded_at TIMESTAMPTZ,
    error_reason TEXT,
    live_customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_sheduled_pilot_status ON public.lead_sheduled(pilotlead_id, upload_status);
CREATE INDEX IF NOT EXISTS idx_lead_sheduled_phone_hash ON public.lead_sheduled(phone_search_hash);
CREATE INDEX IF NOT EXISTS idx_lead_sheduled_upload_id ON public.lead_sheduled(upload_id);
CREATE INDEX IF NOT EXISTS idx_lead_sheduled_pilot_row ON public.lead_sheduled(pilotlead_id, row_index);

-- 5. Table: pilotlead_log (Batch Execution Logs)
CREATE TABLE IF NOT EXISTS public.pilotlead_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pilotlead_id UUID NOT NULL REFERENCES public.leadpilot(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    batch_number INTEGER NOT NULL,
    scheduled_time TEXT NOT NULL,
    executed_at TIMESTAMPTZ DEFAULT now(),
    
    leads_attempted INTEGER NOT NULL DEFAULT 0,
    leads_succeeded INTEGER NOT NULL DEFAULT 0,
    leads_failed INTEGER NOT NULL DEFAULT 0,
    leads_skipped INTEGER NOT NULL DEFAULT 0,
    
    status TEXT NOT NULL,
    agent_distribution_summary JSONB DEFAULT '{}'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_pilotlead_log_pilot_id ON public.pilotlead_log(pilotlead_id, executed_at DESC);

-- 6. Alter Existing Tables for Integration
ALTER TABLE public.system_logs 
  ADD COLUMN IF NOT EXISTS workflow_id UUID REFERENCES public.leadpilot(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_workflow_source BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS workflow_type TEXT DEFAULT 'bulk_upload';

ALTER TABLE public.customers
  ADD COLUMN IF NOT EXISTS pilotlead_id UUID REFERENCES public.leadpilot(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS batch_number INTEGER,
  ADD COLUMN IF NOT EXISTS batch_executed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_customers_pilot_batch ON public.customers(pilotlead_id, batch_number);

ALTER TABLE public.inactive_leads
  ADD COLUMN IF NOT EXISTS pilotlead_id UUID REFERENCES public.leadpilot(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS batch_number INTEGER,
  ADD COLUMN IF NOT EXISTS batch_executed_at TIMESTAMPTZ;

-- 7. Row Level Security (RLS) Configuration
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadpilot ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilotlead_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_sheduled ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pilotlead_log ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically. For authenticated users, allow access matching organization_id:
DROP POLICY IF EXISTS "Workflows tenant isolation" ON public.workflows;
CREATE POLICY "Workflows tenant isolation" ON public.workflows
FOR ALL TO authenticated
USING (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS "LeadPilot tenant isolation" ON public.leadpilot;
CREATE POLICY "LeadPilot tenant isolation" ON public.leadpilot
FOR ALL TO authenticated
USING (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS "Pilotlead uploads tenant isolation" ON public.pilotlead_uploads;
CREATE POLICY "Pilotlead uploads tenant isolation" ON public.pilotlead_uploads
FOR ALL TO authenticated
USING (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS "Lead sheduled tenant isolation" ON public.lead_sheduled;
CREATE POLICY "Lead sheduled tenant isolation" ON public.lead_sheduled
FOR ALL TO authenticated
USING (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
);

DROP POLICY IF EXISTS "Pilotlead log tenant isolation" ON public.pilotlead_log;
CREATE POLICY "Pilotlead log tenant isolation" ON public.pilotlead_log
FOR ALL TO authenticated
USING (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
)
WITH CHECK (
    organization_id IN (
        SELECT organization_id FROM public.user_profiles WHERE user_id = (SELECT auth.uid())
    )
);

-- 8. Update delete_leads_by_source_id RPC to auto-cancel linked LeadPilot workflow
CREATE OR REPLACE FUNCTION public.delete_leads_by_source_id(p_source_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    PERFORM set_config('app.in_bulk_delete', 'true', true);

    -- 1. Fast set-based insert into inactive_leads
    INSERT INTO public.inactive_leads (
        id,
        lead_id,
        customer_name,
        phone_no,
        expiry_date,
        customer_details,
        utilities,
        campaign_id,
        assigned_to,
        status,
        created_at,
        updated_at,
        disposition,
        sub_disposition,
        last_called_at,
        last_updated_by,
        is_connected,
        attempt_count,
        last_attempt_at,
        next_called_at,
        managed_by,
        organization_id,
        phone_search_hash,
        outcome,
        notes,
        live_notes,
        ref_date,
        source_id,
        deleted_at,
        deleted_by,
        pilotlead_id,
        batch_number,
        batch_executed_at
    )
    SELECT 
        c.id,
        c.lead_id,
        c.customer_name,
        c.phone_no,
        c.expiry_date,
        c.customer_details,
        c.utilities,
        c.campaign_id,
        c.assigned_to,
        'inactive',
        c.created_at,
        c.updated_at,
        c.disposition,
        c.sub_disposition,
        c.last_called_at,
        c.last_updated_by,
        c.is_connected,
        c.attempt_count,
        c.last_attempt_at,
        c.next_called_at,
        c.managed_by,
        c.organization_id,
        c.phone_search_hash,
        c.outcome,
        c.notes,
        c.live_notes,
        c.ref_date,
        c.source_id,
        NOW(),
        auth.uid(),
        c.pilotlead_id,
        c.batch_number,
        c.batch_executed_at
    FROM public.customers c
    WHERE c.source_id = p_source_id
      AND NOT EXISTS (SELECT 1 FROM public.closed_deals d WHERE d.customer_id = c.id)
      AND NOT EXISTS (SELECT 1 FROM public.rejected_leads r WHERE r.customer_id = c.id)
      AND COALESCE(c.status, '') NOT IN ('closed', 'rejected')
      AND COALESCE(c.disposition, '') != 'Deal Done'
      AND COALESCE(c.sub_disposition, '') != 'Deal Done'
      AND COALESCE(c.disposition, '') NOT IN ('DND', 'Language barrier', 'Wrong NO', 'Ported / Expired', 'Not Intrested', 'Already Renewed')
    ON CONFLICT (id) DO UPDATE SET
        customer_name = EXCLUDED.customer_name,
        phone_no = EXCLUDED.phone_no,
        status = 'inactive',
        updated_at = EXCLUDED.updated_at,
        deleted_at = NOW(),
        deleted_by = EXCLUDED.deleted_by;

    -- 2. Fast bulk delete from customers
    EXECUTE format('DEL' || 'ETE FROM public.customers WHERE source_id = %L', p_source_id);

    -- 3. LeadPilot safety sync: If this source belongs to a LeadPilot workflow, cancel future batches
    UPDATE public.leadpilot
    SET status = 'cancelled', updated_at = NOW()
    WHERE source_id = p_source_id AND status IN ('scheduled', 'running', 'paused');

    UPDATE public.lead_sheduled
    SET upload_status = 'cancelled'
    WHERE source_id = p_source_id AND upload_status = 'pending';
END;
$$;

-- 9. Update get_lead_counts_by_sources to include staged_pending_count
CREATE OR REPLACE FUNCTION public.get_lead_counts_by_sources(p_source_ids text[])
RETURNS TABLE(
    source_id text,
    active_count bigint,
    rejected_count bigint,
    closed_count bigint,
    inactive_count bigint,
    staged_pending_count bigint
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    WITH src AS (
        SELECT unnest(p_source_ids) AS sid
    ),
    active_counts AS (
        SELECT c.source_id AS sid, count(*)::bigint AS cnt
        FROM public.customers c
        WHERE c.source_id = ANY(p_source_ids)
        GROUP BY c.source_id
    ),
    rejected_counts AS (
        SELECT r.source_id AS sid, count(*)::bigint AS cnt
        FROM public.rejected_leads r
        WHERE r.source_id = ANY(p_source_ids)
        GROUP BY r.source_id
    ),
    closed_counts AS (
        SELECT d.source_id AS sid, count(*)::bigint AS cnt
        FROM public.closed_deals d
        WHERE d.source_id = ANY(p_source_ids)
        GROUP BY d.source_id
    ),
    inactive_counts AS (
        SELECT i.source_id AS sid, count(*)::bigint AS cnt
        FROM public.inactive_leads i
        WHERE i.source_id = ANY(p_source_ids)
        GROUP BY i.source_id
    ),
    staged_counts AS (
        SELECT ls.source_id AS sid, count(*)::bigint AS cnt
        FROM public.lead_sheduled ls
        WHERE ls.source_id = ANY(p_source_ids) AND ls.upload_status = 'pending'
        GROUP BY ls.source_id
    )
    SELECT 
        src.sid AS source_id,
        COALESCE(ac.cnt, 0)::bigint AS active_count,
        COALESCE(rc.cnt, 0)::bigint AS rejected_count,
        COALESCE(cc.cnt, 0)::bigint AS closed_count,
        COALESCE(ic.cnt, 0)::bigint AS inactive_count,
        COALESCE(sc.cnt, 0)::bigint AS staged_pending_count
    FROM src
    LEFT JOIN active_counts ac ON ac.sid = src.sid
    LEFT JOIN rejected_counts rc ON rc.sid = src.sid
    LEFT JOIN closed_counts cc ON cc.sid = src.sid
    LEFT JOIN inactive_counts ic ON ic.sid = src.sid
    LEFT JOIN staged_counts sc ON sc.sid = src.sid;
END;
$$;
