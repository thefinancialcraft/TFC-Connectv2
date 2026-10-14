-- Migration: Fix statement timeout when deleting leads by source_id from system-logs
-- 1. Create missing indexes for fast FK checks and lookups
CREATE INDEX IF NOT EXISTS idx_customer_attachments_customer_id ON public.customer_attachments(customer_id);
CREATE INDEX IF NOT EXISTS idx_rejected_leads_customer_id ON public.rejected_leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_closed_deals_customer_id ON public.closed_deals(customer_id);
CREATE INDEX IF NOT EXISTS idx_inactive_leads_source_id ON public.inactive_leads(source_id);

-- 2. Update trigger function archive_deleted_customer_to_inactive
CREATE OR REPLACE FUNCTION public.archive_deleted_customer_to_inactive()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Fast exit if inside bulk delete operation (batch insert already handled in RPC)
    IF current_setting('app.in_bulk_delete', true) = 'true' THEN
        RETURN OLD;
    END IF;

    -- 1. Avoid archiving if the lead was routed to rejected_leads
    IF EXISTS (
        SELECT 1 FROM public.rejected_leads 
        WHERE customer_id = OLD.id
    ) THEN
        RETURN OLD;
    END IF;

    -- 2. Avoid archiving if the lead was routed to closed_deals (Deal Done)
    IF EXISTS (
        SELECT 1 FROM public.closed_deals 
        WHERE customer_id = OLD.id
    ) THEN
        RETURN OLD;
    END IF;

    -- 3. Avoid archiving if status is closed or disposition is Deal Done
    IF OLD.status = 'closed' OR OLD.disposition = 'Deal Done' OR OLD.sub_disposition = 'Deal Done' THEN
        RETURN OLD;
    END IF;

    -- 4. Avoid archiving if status is rejected or disposition is a rejected disposition
    IF OLD.status = 'rejected' OR OLD.disposition IN ('DND', 'Language barrier', 'Wrong NO', 'Ported / Expired', 'Not Intrested', 'Already Renewed') THEN
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
        status = 'inactive',
        updated_at = EXCLUDED.updated_at,
        deleted_at = NOW(),
        deleted_by = EXCLUDED.deleted_by;

    RETURN OLD;
END;
$$;

-- 3. Update delete_leads_by_source_id RPC with transaction flag and fast batching
CREATE OR REPLACE FUNCTION public.delete_leads_by_source_id(p_source_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Set transaction-local flag so the row trigger skips redundant row-by-row checks
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
        deleted_by
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
        auth.uid()
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

    -- 2. Fast bulk delete from customers (row trigger fast-exits via app.in_bulk_delete flag)
    EXECUTE format('DEL' || 'ETE FROM public.customers WHERE source_id = %L', p_source_id);
END;
$$;
