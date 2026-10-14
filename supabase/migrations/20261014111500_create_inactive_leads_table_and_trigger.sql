-- Migration: Create inactive_leads table cloned from customers without data
-- and set up trigger to automatically transfer deleted customers to inactive_leads

-- 1. Create inactive_leads table cloned from customers schema without data
CREATE TABLE IF NOT EXISTS public.inactive_leads (
    LIKE public.customers INCLUDING DEFAULTS
);

-- Ensure primary key on id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'public.inactive_leads'::regclass AND contype = 'p'
    ) THEN
        ALTER TABLE public.inactive_leads ADD PRIMARY KEY (id);
    END IF;
END $$;

-- Add tracking columns for when and by whom the lead was deleted
ALTER TABLE public.inactive_leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.inactive_leads ADD COLUMN IF NOT EXISTS deleted_by UUID;

-- Add foreign key constraint for organization (null on delete)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conrelid = 'public.inactive_leads'::regclass AND conname = 'fk_inactive_leads_organization'
    ) THEN
        ALTER TABLE public.inactive_leads 
        ADD CONSTRAINT fk_inactive_leads_organization 
        FOREIGN KEY (organization_id) REFERENCES public.organizations(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 2. Performance indexes on inactive_leads
CREATE INDEX IF NOT EXISTS idx_inactive_leads_org ON public.inactive_leads (organization_id);
CREATE INDEX IF NOT EXISTS idx_inactive_leads_camp ON public.inactive_leads (campaign_id);
CREATE INDEX IF NOT EXISTS idx_inactive_leads_phone ON public.inactive_leads (phone_no);
CREATE INDEX IF NOT EXISTS idx_inactive_leads_deleted_at ON public.inactive_leads (deleted_at);
CREATE INDEX IF NOT EXISTS idx_inactive_leads_lead_id ON public.inactive_leads (lead_id);

-- 3. Row Level Security for inactive_leads
ALTER TABLE public.inactive_leads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'inactive_leads' AND policyname = 'Allow view inactive_leads'
    ) THEN
        CREATE POLICY "Allow view inactive_leads"
        ON public.inactive_leads
        FOR SELECT
        TO authenticated
        USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'inactive_leads' AND policyname = 'Allow insert inactive_leads'
    ) THEN
        CREATE POLICY "Allow insert inactive_leads"
        ON public.inactive_leads
        FOR INSERT
        TO authenticated
        WITH CHECK (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'inactive_leads' AND policyname = 'Allow delete inactive_leads'
    ) THEN
        CREATE POLICY "Allow delete inactive_leads"
        ON public.inactive_leads
        FOR DELETE
        TO authenticated
        USING (true);
    END IF;
END $$;

-- 4. Trigger function to archive deleted customers to inactive_leads
CREATE OR REPLACE FUNCTION public.archive_deleted_customer_to_inactive()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Avoid double archiving if the lead was already routed to rejected_leads
    IF EXISTS (
        SELECT 1 FROM public.rejected_leads 
        WHERE id = OLD.id OR customer_id = OLD.id
    ) THEN
        RETURN OLD;
    END IF;

    -- Insert the deleted customer record into inactive_leads
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
        deleted_by
    ) VALUES (
        OLD.id,
        OLD.lead_id,
        OLD.customer_name,
        OLD.phone_no,
        OLD.expiry_date,
        OLD.customer_details,
        OLD.utilities,
        OLD.campaign_id,
        OLD.assigned_to,
        'inactive',
        OLD.created_at,
        OLD.updated_at,
        OLD.disposition,
        OLD.sub_disposition,
        OLD.last_called_at,
        OLD.last_updated_by,
        OLD.is_connected,
        OLD.attempt_count,
        OLD.last_attempt_at,
        OLD.next_called_at,
        OLD.managed_by,
        OLD.organization_id,
        OLD.phone_search_hash,
        OLD.outcome,
        OLD.notes,
        OLD.live_notes,
        OLD.ref_date,
        OLD.source_id,
        NOW(),
        auth.uid()
    )
    ON CONFLICT (id) DO UPDATE SET
        customer_name = EXCLUDED.customer_name,
        phone_no = EXCLUDED.phone_no,
        updated_at = EXCLUDED.updated_at,
        deleted_at = NOW(),
        deleted_by = EXCLUDED.deleted_by;

    RETURN OLD;
END;
$$;

-- 5. Attach the trigger to customers table
DROP TRIGGER IF EXISTS tr_archive_deleted_customer_to_inactive ON public.customers;

CREATE TRIGGER tr_archive_deleted_customer_to_inactive
BEFORE DELETE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.archive_deleted_customer_to_inactive();
