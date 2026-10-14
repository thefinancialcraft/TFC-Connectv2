-- Migration: Update delete_leads_by_source_id to isolate active leads into inactive_leads
-- and preserve system_logs record. Also enhance get_lead_counts_by_sources with inactive_count.

-- 1. Update delete_leads_by_source_id RPC
CREATE OR REPLACE FUNCTION public.delete_leads_by_source_id(p_source_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    -- Explicitly insert active customers into inactive_leads table
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
    ON CONFLICT (id) DO UPDATE SET
        customer_name = EXCLUDED.customer_name,
        phone_no = EXCLUDED.phone_no,
        status = 'inactive',
        updated_at = EXCLUDED.updated_at,
        deleted_at = NOW(),
        deleted_by = EXCLUDED.deleted_by;

    -- Delete active leads from customers table
    DELETE FROM public.customers WHERE source_id = p_source_id;

    -- Note: public.system_logs record is preserved and NOT deleted.
END;
$function$;

-- 2. Update get_lead_counts_by_sources to include inactive_count
DROP FUNCTION IF EXISTS public.get_lead_counts_by_sources(text[]);

CREATE OR REPLACE FUNCTION public.get_lead_counts_by_sources(p_source_ids text[])
RETURNS TABLE(
    source_id text, 
    active_count bigint, 
    rejected_count bigint, 
    closed_count bigint,
    inactive_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        s.val AS source_id,
        (SELECT count(*) FROM public.customers c WHERE c.source_id = s.val) AS active_count,
        (SELECT count(*) FROM public.rejected_leads r WHERE r.source_id = s.val) AS rejected_count,
        (SELECT count(*) FROM public.closed_deals d WHERE d.source_id = s.val) AS closed_count,
        (SELECT count(*) FROM public.inactive_leads i WHERE i.source_id = s.val) AS inactive_count
    FROM unnest(p_source_ids) AS s(val);
END;
$function$;
