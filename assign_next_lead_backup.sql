-- ==========================================
-- BACKUP: assign_next_lead (Original Version)
-- Purpose: Reference logic using next_called_at and 4-hour window
-- Saved: 2026-04-06
-- ==========================================

CREATE OR REPLACE FUNCTION public.assign_next_lead(p_campaign_id text, p_user_id uuid, p_exclude_lead_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
    v_next_lead_id UUID;
BEGIN
    -- Recovery / Sticky Session
    SELECT customer_id::UUID INTO v_next_lead_id
    FROM public.call_sessions
    WHERE user_id = p_user_id
      AND campaign_id = p_campaign_id
      AND status NOT IN ('closed', 'disposition_pending')
      AND (p_exclude_lead_id IS NULL OR customer_id::TEXT != p_exclude_lead_id::TEXT)
    LIMIT 1;

    IF v_next_lead_id IS NOT NULL THEN
        RETURN v_next_lead_id;
    END IF;

    -- Prioritized Queue Logic
    WITH prioritized_leads AS (
        SELECT 
            l.id, l.next_called_at, l.expiry_date, l.updated_at, l.attempt_count,
            CASE 
                WHEN l.next_called_at <= now() AND l.assigned_to = p_user_id THEN 1
                WHEN l.next_called_at > now() AND l.next_called_at <= (now() + interval '4 hours') AND l.assigned_to = p_user_id THEN 2
                WHEN COALESCE(l.attempt_count, 0) = 0 AND (l.assigned_to IS NULL OR l.assigned_to = p_user_id) THEN 3
                ELSE 4
            END as tier_priority
        FROM public.customers l
        LEFT JOIN public.call_sessions cs ON l.id::TEXT = cs.customer_id
        WHERE l.campaign_id = p_campaign_id
          AND l.status = 'active'
          AND (l.next_called_at IS NULL OR l.assigned_to = p_user_id)
          -- Ensure lead isn't currently locked by another active session (unless it's stale > 30m)
          AND (cs.customer_id IS NULL OR cs.user_id = p_user_id OR cs.updated_at < (now() - interval '30 minutes'))
          -- Don't pick the lead we just excluded (e.g. on Skip)
          AND (p_exclude_lead_id IS NULL OR l.id != p_exclude_lead_id)
    )
    SELECT id INTO v_next_lead_id
    FROM prioritized_leads
    WHERE tier_priority IS NOT NULL
    ORDER BY 
        tier_priority ASC,
        CASE WHEN tier_priority IN (1, 2) THEN next_called_at END ASC,
        CASE WHEN tier_priority = 3 THEN expiry_date END ASC NULLS LAST,
        CASE WHEN tier_priority = 3 THEN updated_at END ASC NULLS LAST,
        CASE WHEN tier_priority = 4 THEN updated_at END ASC NULLS LAST,
        CASE WHEN tier_priority = 4 THEN expiry_date END ASC NULLS LAST
    LIMIT 1;

    IF v_next_lead_id IS NOT NULL THEN
        UPDATE public.customers 
        SET assigned_to = p_user_id, updated_at = now()
        WHERE id = v_next_lead_id;
        RETURN v_next_lead_id;
    END IF;

    RETURN NULL;
END;
$function$;
