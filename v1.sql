
DECLARE
    v_next_lead_id UUID;
BEGIN
    -- STEP 1: Session Recovery / Sticky Lead
    -- Check if the user has an ongoing session that isn't finished yet.
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

    -- STEP 2: Main Assignment Logic (Tiered Priority)
    WITH prioritized_leads AS (
        SELECT 
            l.id,
            l.next_called_at,
            l.expiry_date,
            l.updated_at,
            l.attempt_count,
            CASE 
                -- Level 1: MY Own Follow-up (Now or Overdue)
                WHEN l.next_called_at <= now() AND l.assigned_to = p_user_id THEN 1
                
                -- Level 2: MY Own Upcoming Follow-up (within 4 hours)
                WHEN l.next_called_at > now() AND l.next_called_at <= (now() + interval '4 hours') AND l.assigned_to = p_user_id THEN 2
                
                -- Level 3: Fresh Leads (Available to all, 0 attempts)
                WHEN COALESCE(l.attempt_count, 0) = 0 THEN 3
                
                -- Level 4: Retry / Not Contactable leads
                ELSE 4
            END as tier_priority
        FROM public.customers l
        LEFT JOIN public.call_sessions cs ON l.id::TEXT = cs.customer_id
        WHERE l.campaign_id = p_campaign_id
          AND l.status = 'active'
          -- [USER REQUIREMENT] Follow-up Privacy: A scheduled call MUST only show to its assigned user.
          AND (l.next_called_at IS NULL OR l.assigned_to = p_user_id)
          -- Lead Lock Logic: Not assigned to someone else OR I am the owner OR session is stale (>30m)
          AND (cs.customer_id IS NULL OR cs.user_id = p_user_id OR cs.updated_at < (now() - interval '30 minutes'))
          -- Don't repeat the lead we just came from
          AND (p_exclude_lead_id IS NULL OR l.id != p_exclude_lead_id)
    )
    SELECT id INTO v_next_lead_id
    FROM prioritized_leads
    ORDER BY 
        tier_priority ASC,
        -- Sorting for Tiers 1 & 2: By Scheduled Time (Oldest first)
        CASE WHEN tier_priority IN (1, 2) THEN next_called_at END ASC,
        -- Sorting for Tiers 3 & 4 (Rule C): 1. Expiry Date ASC, 2. Updated At ASC
        expiry_date ASC NULLS LAST,
             ASC NULLS LAST
    LIMIT 1;

    -- STEP 3: Register / Update Session table
    IF v_next_lead_id IS NOT NULL THEN
        INSERT INTO public.call_sessions (
            user_id, 
            campaign_id, 
            customer_id, 
            status, 
            updated_at
        )
        VALUES (
            p_user_id, 
            p_campaign_id, 
            v_next_lead_id::TEXT,
            'assigned', 
            now()
        )
        ON CONFLICT (user_id, campaign_id)
        DO UPDATE SET 
            customer_id = EXCLUDED.customer_id,
            status = 'assigned',
            updated_at = now();
            
        RETURN v_next_lead_id;
    END IF;

    RETURN NULL;
END;
