-- Migration: Ensure leads marked Deal Done (closed_deals) or Rejected (rejected_leads)
-- are NEVER archived into inactive_leads table.
-- inactive_leads is strictly reserved for deactivated/deleted active leads.

CREATE OR REPLACE FUNCTION public.archive_deleted_customer_to_inactive()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- 1. Avoid archiving if the lead was routed to rejected_leads
    IF EXISTS (
        SELECT 1 FROM public.rejected_leads 
        WHERE id = OLD.id OR customer_id = OLD.id
    ) THEN
        RETURN OLD;
    END IF;

    -- 2. Avoid archiving if the lead was routed to closed_deals (Deal Done)
    IF EXISTS (
        SELECT 1 FROM public.closed_deals 
        WHERE id = OLD.id OR customer_id = OLD.id
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
