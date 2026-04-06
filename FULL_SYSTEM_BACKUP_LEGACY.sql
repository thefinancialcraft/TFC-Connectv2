-- ==========================================================
-- FULL SYSTEM BACKUP (LEGACY NEXT_CALLED_AT LOGIC)
-- Use this file to revert to the old lead management system
-- ==========================================================

-- 1. Original assign_next_lead (Legacy logic with 4-hour window)
CREATE OR REPLACE FUNCTION public.assign_next_lead(p_user_id uuid, p_campaign_id text, p_exclude_lead_id uuid DEFAULT NULL::uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 AS $function$
DECLARE
    v_next_lead_id UUID;
BEGIN
    -- 1. Sticky Session / Recovery
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

    -- 2. Prioritized Lead Pool (Legacy using next_called_at)
    WITH prioritized_leads AS (
        SELECT 
            l.id, l.next_called_at, l.updated_at, l.attempt_count, l.assigned_to, l.expiry_date,
            CASE 
                -- Level 1: Overdue Callbacks
                WHEN l.next_called_at <= now() AND COALESCE(l.attempt_count, 0) > 0 AND l.assigned_to = p_user_id THEN 1
                
                -- Level 2: Upcoming Callbacks (4hr window)
                WHEN l.next_called_at > now() AND l.next_called_at <= (now() + interval '4 hours') AND l.assigned_to = p_user_id THEN 2
                
                -- Level 3: Fresh leads
                WHEN COALESCE(l.attempt_count, 0) = 0 AND (l.assigned_to IS NULL OR l.assigned_to = p_user_id) THEN 3
                
                -- Level 4: Retry / Not Contactable
                ELSE 4
            END as tier_priority
        FROM public.customers l
        LEFT JOIN public.call_sessions cs ON l.id::TEXT = cs.customer_id
        WHERE l.campaign_id = p_campaign_id
          AND l.status = 'active'
          AND (l.next_called_at IS NULL OR l.assigned_to = p_user_id)
          AND (cs.customer_id IS NULL OR cs.user_id = p_user_id OR cs.updated_at < (now() - interval '30 minutes'))
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
        CASE WHEN tier_priority = 4 THEN updated_at END ASC NULLS LAST
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

-- 2. Original get_campaign_stats (Using next_called_at)
CREATE OR REPLACE FUNCTION public.get_campaign_stats()
 RETURNS TABLE(campaign_id text, fresh_count bigint, upcoming_count bigint, overdue_count bigint, total_dials bigint, total_duration bigint)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH customer_stats AS (
        SELECT 
            c.campaign_id,
            COUNT(*) FILTER (WHERE (c.attempt_count IS NULL OR c.attempt_count = 0) AND c.assigned_to IS NULL) as raw_fresh,
            COUNT(*) FILTER (WHERE (c.disposition IN ('Callback', 'Call Back', 'Follow Up', 'FollowUp')) AND c.next_called_at >= NOW()) as upcoming,
            COUNT(*) FILTER (WHERE (c.disposition IN ('Callback', 'Call Back', 'Follow Up', 'FollowUp')) AND (c.next_called_at < NOW() OR c.next_called_at IS NULL)) as overdue
        FROM customers c
        GROUP BY c.campaign_id
    ),
    log_stats AS (
        SELECT 
            l.campaign_id,
            COUNT(*) as dials,
            SUM(COALESCE(l.duration, 0))::BIGINT as duration
        FROM call_logs l
        WHERE l.created_at >= (CURRENT_DATE AT TIME ZONE 'Asia/Kolkata')
        GROUP BY l.campaign_id
    )
    SELECT 
        camp.id::TEXT as campaign_id,
        COALESCE(cs.raw_fresh, 0) as fresh_count,
        COALESCE(cs.upcoming, 0) as upcoming_count,
        COALESCE(cs.overdue, 0) as overdue_count,
        COALESCE(ls.dials, 0) as total_dials,
        COALESCE(ls.duration, 0) as total_duration
    FROM campaigns camp
    LEFT JOIN customer_stats cs ON camp.id = cs.campaign_id
    LEFT JOIN log_stats ls ON camp.id = ls.campaign_id;
END;
$function$;

-- 3. Original get_dashboard_stats_advanced (Using next_called_at)
CREATE OR REPLACE FUNCTION public.get_dashboard_stats_advanced(p_start_date timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_date timestamp with time zone DEFAULT NULL::timestamp with time zone, p_org_id uuid DEFAULT NULL::uuid, p_filter_user_id uuid DEFAULT NULL::uuid, p_restricted_user_ids uuid[] DEFAULT NULL::uuid[], p_filter_employee_id text DEFAULT NULL::text, p_restricted_employee_ids text[] DEFAULT NULL::text[])
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
    DECLARE
    result json;
    v_now timestamptz := now();
    v_today_start timestamptz := (now() AT TIME ZONE 'Asia/Kolkata')::date AT TIME ZONE 'Asia/Kolkata';
    v_today_end timestamptz := v_today_start + interval '1 day' - interval '1 second';
BEGIN
    WITH 
    customer_stats AS (
        SELECT 
            COUNT(*) FILTER (WHERE (p_start_date IS NULL OR created_at >= p_start_date) AND (p_end_date IS NULL OR created_at <= p_end_date)) as total_customers,
            COUNT(*) FILTER (WHERE (p_start_date IS NULL OR created_at >= p_start_date) AND (p_end_date IS NULL OR created_at <= p_end_date) AND (disposition ILIKE '%Sold%' OR disposition ILIKE '%Success%' OR disposition ILIKE '%Converted%' OR disposition ILIKE '%Closed%')) as total_converted,
            COUNT(*) as all_time_records,
            COUNT(*) FILTER (WHERE disposition IN ('Callback', 'Call Back', 'Follow Up', 'FollowUp')) as all_time_followups,
            COUNT(*) FILTER (WHERE disposition IN ('Callback', 'Call Back', 'Follow Up', 'FollowUp') AND (next_called_at < v_now OR next_called_at IS NULL)) as all_time_overdue,
            COUNT(*) FILTER (WHERE (disposition IS NULL OR disposition = '') AND (attempt_count = 0 OR attempt_count IS NULL)) as fresh_global_count
        FROM public.customers
        WHERE (p_org_id IS NULL OR organization_id = p_org_id)
        AND (
            (p_filter_user_id IS NULL AND p_restricted_user_ids IS NULL) OR
            (p_filter_user_id IS NOT NULL AND assigned_to = p_filter_user_id) OR
            (p_restricted_user_ids IS NOT NULL AND assigned_to = ANY(p_restricted_user_ids))
        )
    ),
    call_stats AS (
        SELECT 
            COUNT(*) FILTER (WHERE (p_start_date IS NULL OR ch.timestamp >= p_start_date) AND (p_end_date IS NULL OR ch.timestamp <= p_end_date)) as total_dials,
            COALESCE(SUM(ch.duration) FILTER (WHERE (p_start_date IS NULL OR ch.timestamp >= p_start_date) AND (p_end_date IS NULL OR ch.timestamp <= p_end_date)), 0) as total_talktime,
            COUNT(*) FILTER (WHERE (p_start_date IS NULL OR ch.timestamp >= p_start_date) AND (p_end_date IS NULL OR ch.timestamp <= p_end_date) AND ch.duration > 0) as total_connections,
            COUNT(*) FILTER (WHERE ch.timestamp >= v_today_start AND ch.timestamp <= v_today_end) as today_calls,
            COUNT(*) FILTER (WHERE ch.duration > 0) as all_time_connections
        FROM public.call_history ch
        WHERE (
            (p_filter_employee_id IS NULL AND p_restricted_employee_ids IS NULL) OR
            (p_filter_employee_id IS NOT NULL AND LOWER(ch.employee_id) = LOWER(p_filter_employee_id)) OR
            (p_restricted_employee_ids IS NOT NULL AND LOWER(ch.employee_id) = ANY(SELECT LOWER(unnest(p_restricted_employee_ids))))
        )
        AND (p_org_id IS NULL OR EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.employee_id = ch.employee_id AND up.organization_id = p_org_id))
    ),
    misc_stats AS (
        SELECT 
            (SELECT COUNT(*) FROM public.campaigns WHERE status = 'active' AND (p_org_id IS NULL OR organization_id = p_org_id)) as active_campaigns,
            (SELECT COUNT(*) FROM public.user_profiles 
             WHERE approval_status = 'approved' 
             AND (p_org_id IS NULL OR organization_id = p_org_id)
             AND (p_restricted_user_ids IS NULL OR user_id = ANY(p_restricted_user_ids))
            ) as team_members
    )
    SELECT json_build_object(
        'totalCustomers', cs.total_customers,
        'totalConverted', cs.total_converted,
        'allTimeRecords', cs.all_time_records,
        'allTimeFollowups', cs.all_time_followups,
        'allTimeOverdue', cs.all_time_overdue,
        'freshGlobalCount', cs.fresh_global_count,
        'totalDials', cls.total_dials,
        'totalTalktime', cls.total_talktime,
        'totalConnections', cls.total_connections,
        'todayCalls', cls.today_calls,
        'allTimeConnections', cls.all_time_connections,
        'activeCampaigns', ms.active_campaigns,
        'teamCount', ms.team_members
    ) INTO result
    FROM customer_stats cs, call_stats cls, misc_stats ms;
    RETURN result;
END;
$function$;

-- 4. Clean up Upload Trigger (If reverting, just run this)
-- DROP TRIGGER IF EXISTS tr_sync_ref_date_on_upload ON public.customers;
-- DROP FUNCTION IF EXISTS public.handle_customer_upload_sync();
