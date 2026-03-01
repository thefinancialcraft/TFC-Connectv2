-- ==========================================
-- DASHBOARD OPTIMIZATION: FULL SUITE RPCs
-- ==========================================
-- Run this in your Supabase SQL Editor to speed up the dashboard from 10s to <1s.
-- This script contains all 3 optimized functions for Overview, Charts, and Performance.

-- 1. Optimized RPC for Dashboard Stats (Overview)
CREATE OR REPLACE FUNCTION public.get_dashboard_stats_advanced(
    p_start_date timestamptz DEFAULT NULL,
    p_end_date timestamptz DEFAULT NULL,
    p_org_id uuid DEFAULT NULL,
    p_filter_user_id uuid DEFAULT NULL,
    p_restricted_user_ids uuid[] DEFAULT NULL,
    p_filter_employee_id text DEFAULT NULL,
    p_restricted_employee_ids text[] DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
    DECLARE
    result json;
    v_now timestamptz := now();
    -- v_today_start should be midnight IST today
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
$$;


-- 2. Optimized RPC for Dashboard Charts (Pie, Hourly, Campaign, Trend, Heatmap)
CREATE OR REPLACE FUNCTION public.get_dashboard_charts_optimized(
    p_start_date timestamptz DEFAULT NULL,
    p_end_date timestamptz DEFAULT NULL,
    p_org_id uuid DEFAULT NULL,
    p_filter_user_id uuid DEFAULT NULL,
    p_restricted_user_ids uuid[] DEFAULT NULL,
    p_filter_employee_id text DEFAULT NULL,
    p_restricted_employee_ids text[] DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
    v_pie_data json;
    v_hourly_stats json;
    v_campaign_data json;
    v_trend_data json;
    v_heatmap_data json;
BEGIN
    -- 1. Pie Data
    SELECT json_agg(t) INTO v_pie_data FROM (
        SELECT COALESCE(disposition, 'Fresh Lead') as name, COUNT(*) as value
        FROM public.customers
        WHERE (p_org_id IS NULL OR organization_id = p_org_id)
        AND (p_start_date IS NULL OR created_at >= p_start_date)
        AND (p_end_date IS NULL OR created_at <= p_end_date)
        AND (
            (p_filter_user_id IS NULL AND p_restricted_user_ids IS NULL) OR
            (p_filter_user_id IS NOT NULL AND assigned_to = p_filter_user_id) OR
            (p_restricted_user_ids IS NOT NULL AND assigned_to = ANY(p_restricted_user_ids))
        )
        GROUP BY name ORDER BY value DESC LIMIT 5
    ) t;

    -- 2. Hourly Stats (Fixed labels)
    SELECT json_agg(t) INTO v_hourly_stats FROM (
        SELECT 
            to_char(ch.timestamp AT TIME ZONE 'Asia/Kolkata', 'FMHH AM') as hour_label, 
            COUNT(*) as total, 
            COUNT(*) FILTER (WHERE ch.call_type ILIKE '%Outgoing%') as outgoing,
            COUNT(*) FILTER (WHERE ch.call_type ILIKE '%Incoming%') as incoming,
            COUNT(*) FILTER (WHERE ch.call_type ILIKE '%Missed%') as missed,
            SUM(CASE WHEN ch.duration > 0 THEN 1 ELSE 0 END) as connected, 
            SUM(ch.duration) as talktime
        FROM public.call_history ch
        WHERE (p_start_date IS NULL OR ch.timestamp >= p_start_date) AND (p_end_date IS NULL OR ch.timestamp <= p_end_date)
        AND ((p_filter_employee_id IS NULL AND p_restricted_employee_ids IS NULL) OR (p_filter_employee_id IS NOT NULL AND LOWER(ch.employee_id) = LOWER(p_filter_employee_id)) OR (p_restricted_employee_ids IS NOT NULL AND LOWER(ch.employee_id) = ANY(SELECT LOWER(unnest(p_restricted_employee_ids)))))
        AND (p_org_id IS NULL OR EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.employee_id = ch.employee_id AND up.organization_id = p_org_id))
        GROUP BY hour_label ORDER BY MIN(ch.timestamp AT TIME ZONE 'Asia/Kolkata')
    ) t;

    -- 3. Campaign Performance
    SELECT json_agg(t) INTO v_campaign_data FROM (
        SELECT c.name, COUNT(cust.id) as total, COUNT(cust.id) FILTER (WHERE cust.disposition ILIKE ANY(ARRAY['%Sold%', '%Success%', '%Converted%', '%Closed%'])) as success
        FROM public.campaigns c JOIN public.customers cust ON c.id = cust.campaign_id
        WHERE (p_org_id IS NULL OR c.organization_id = p_org_id)
        AND ((p_filter_user_id IS NULL AND p_restricted_user_ids IS NULL) OR (p_filter_user_id IS NOT NULL AND cust.assigned_to = p_filter_user_id) OR (p_restricted_user_ids IS NOT NULL AND cust.assigned_to = ANY(p_restricted_user_ids)))
        GROUP BY c.name ORDER BY total DESC LIMIT 6
    ) t;

    -- 4. Monthly Trend
    SELECT json_agg(t) INTO v_trend_data FROM (
        SELECT to_char(date_trunc('month', ch.timestamp AT TIME ZONE 'Asia/Kolkata'), 'Mon') as name, COUNT(*) as dials, SUM(CASE WHEN ch.duration > 0 THEN 1 ELSE 0 END) as connected, date_trunc('month', ch.timestamp AT TIME ZONE 'Asia/Kolkata') as month_date
        FROM public.call_history ch
        WHERE ch.timestamp >= date_trunc('month', now()) - interval '5 months'
        AND ((p_filter_employee_id IS NULL AND p_restricted_employee_ids IS NULL) OR (p_filter_employee_id IS NOT NULL AND LOWER(ch.employee_id) = LOWER(p_filter_employee_id)) OR (p_restricted_employee_ids IS NOT NULL AND LOWER(ch.employee_id) = ANY(SELECT LOWER(unnest(p_restricted_employee_ids)))))
        AND (p_org_id IS NULL OR EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.employee_id = ch.employee_id AND up.organization_id = p_org_id))
        GROUP BY name, month_date ORDER BY month_date
    ) t;

    -- 5. Heatmap Data (Visit by Time Slot)
    SELECT json_agg(t) INTO v_heatmap_data FROM (
        WITH date_series AS (
            SELECT 
                (date_trunc('day', now() AT TIME ZONE 'Asia/Kolkata') - (i || ' days')::interval) as full_date_ts
            FROM generate_series(0, 13) i
        ),
        daily_slots AS (
            SELECT 
                to_char(full_date_ts, 'YYYY-MM-DD') as full_date,
                to_char(full_date_ts, 'Mon DD') as day_label,
                full_date_ts
            FROM date_series
        ),
        call_counts AS (
            SELECT 
                to_char(ch.timestamp AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') as full_date,
                COUNT(*) FILTER (WHERE extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') >= 8 AND extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') < 10) as "8 AM - 10 AM",
                COUNT(*) FILTER (WHERE extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') >= 10 AND extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') < 12) as "10 AM - 12 PM",
                COUNT(*) FILTER (WHERE extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') >= 12 AND extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') < 14) as "12 PM - 2 PM",
                COUNT(*) FILTER (WHERE extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') >= 14 AND extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') < 16) as "2 PM - 4 PM",
                COUNT(*) FILTER (WHERE extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') >= 16 AND extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') < 18) as "4 PM - 6 PM",
                COUNT(*) FILTER (WHERE extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') >= 18 AND extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') < 20) as "6 PM - 8 PM",
                COUNT(*) FILTER (WHERE extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') >= 20 AND extract(hour from ch.timestamp AT TIME ZONE 'Asia/Kolkata') < 22) as "8 PM - 10 PM"
            FROM public.call_history ch
            WHERE (ch.timestamp >= (now() AT TIME ZONE 'Asia/Kolkata')::date - interval '14 days')
            AND ((p_filter_employee_id IS NULL AND p_restricted_employee_ids IS NULL) OR (p_filter_employee_id IS NOT NULL AND LOWER(ch.employee_id) = LOWER(p_filter_employee_id)) OR (p_restricted_employee_ids IS NOT NULL AND LOWER(ch.employee_id) = ANY(SELECT LOWER(unnest(p_restricted_employee_ids)))))
            AND (p_org_id IS NULL OR EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.employee_id = ch.employee_id AND up.organization_id = p_org_id))
            GROUP BY full_date
        )
        SELECT 
            ds.day_label as day,
            COALESCE(cc."8 AM - 10 AM", 0) as "8 AM - 10 AM",
            COALESCE(cc."10 AM - 12 PM", 0) as "10 AM - 12 PM",
            COALESCE(cc."12 PM - 2 PM", 0) as "12 PM - 2 PM",
            COALESCE(cc."2 PM - 4 PM", 0) as "2 PM - 4 PM",
            COALESCE(cc."4 PM - 6 PM", 0) as "4 PM - 6 PM",
            COALESCE(cc."6 PM - 8 PM", 0) as "6 PM - 8 PM",
            COALESCE(cc."8 PM - 10 PM", 0) as "8 PM - 10 PM"
        FROM daily_slots ds
        LEFT JOIN call_counts cc ON ds.full_date = cc.full_date
        ORDER BY ds.full_date_ts ASC
    ) t;

    SELECT json_build_object(
        'pieData', COALESCE(v_pie_data, '[]'::json),
        'hourlyStats', COALESCE(v_hourly_stats, '[]'::json),
        'campaignData', COALESCE(v_campaign_data, '[]'::json),
        'chartData', COALESCE(v_trend_data, '[]'::json),
        'heatmapData', COALESCE(v_heatmap_data, '[]'::json)
    ) INTO result;

    RETURN result;
END;
$$;


-- 3. Optimized RPC for Agent Performance Leaderboard
CREATE OR REPLACE FUNCTION public.get_agent_performance_optimized(
    p_start_date timestamptz DEFAULT NULL,
    p_end_date timestamptz DEFAULT NULL,
    p_org_id uuid DEFAULT NULL,
    p_restricted_user_ids uuid[] DEFAULT NULL,
    p_filter_user_id uuid DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    WITH agent_calls AS (
        SELECT 
            ch.employee_id,
            COUNT(*) as count,
            COALESCE(SUM(ch.duration), 0) as duration,
            COUNT(*) FILTER (WHERE ch.duration > 0) as connected_count,
            MAX(ch.timestamp) as last_active
        FROM public.call_history ch
        WHERE (p_start_date IS NULL OR ch.timestamp >= p_start_date)
          AND (p_end_date IS NULL OR ch.timestamp <= p_end_date)
          AND (p_org_id IS NULL OR ch.organization_id = p_org_id)
        GROUP BY ch.employee_id
    ),
    agent_leads AS (
        SELECT 
            assigned_to as user_id,
            COUNT(*) FILTER (WHERE disposition ILIKE ANY(ARRAY['%Sold%', '%Success%', '%Converted%', '%Closed%'])) as deals_count,
            COUNT(*) FILTER (WHERE disposition ILIKE ANY(ARRAY['%Callback%', '%Follow Up%', '%FollowUp%'])) as follow_ups_count
        FROM public.customers
        WHERE (p_org_id IS NULL OR organization_id = p_org_id)
        GROUP BY assigned_to
    ),
    agent_status AS (
        SELECT DISTINCT ON (employee_id) 
            employee_id, 
            last_seen,
            on_call,
            is_personal
        FROM public.sync_meta
        ORDER BY employee_id, last_seen DESC
    )
    SELECT json_agg(t) INTO result FROM (
        SELECT 
            u.user_id as id,
            u.user_name as name,
            u.employee_id,
            u.profile_pic_url,
            COALESCE(ac.count, 0) as count,
            COALESCE(ac.duration, 0) as duration,
            COALESCE(ac.connected_count, 0) as connected_count,
            COALESCE(al.deals_count, 0) as deals_count,
            COALESCE(al.follow_ups_count, 0) as follow_ups_count,
            ac.last_active,
            ast.last_seen as last_online,
            COALESCE(ast.on_call, false) as on_call,
            COALESCE(ast.is_personal, false) as is_personal
        FROM public.user_profiles u
        LEFT JOIN agent_calls ac ON LOWER(u.employee_id) = LOWER(ac.employee_id)
        LEFT JOIN agent_leads al ON u.user_id = al.user_id
        LEFT JOIN agent_status ast ON LOWER(u.employee_id) = LOWER(ast.employee_id)
        WHERE (p_org_id IS NULL OR u.organization_id = p_org_id)
        AND (p_restricted_user_ids IS NULL OR u.user_id = ANY(p_restricted_user_ids))
        AND (p_filter_user_id IS NULL OR u.user_id = p_filter_user_id)
        AND u.approval_status = 'approved'
        AND u.role IN ('user', 'agent')
        ORDER BY count DESC
    ) t;

    RETURN result;
END;
$$;


-- 4. Missing Indexes for Speed
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON public.customers (created_at);
CREATE INDEX IF NOT EXISTS idx_customers_org_id ON public.customers (organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_assigned_to ON public.customers (assigned_to);
CREATE INDEX IF NOT EXISTS idx_customers_disposition ON public.customers (disposition);
CREATE INDEX IF NOT EXISTS idx_call_history_timestamp ON public.call_history (timestamp);
CREATE INDEX IF NOT EXISTS idx_call_history_employee_id ON public.call_history (employee_id);
CREATE INDEX IF NOT EXISTS idx_call_history_duration ON public.call_history (duration);
CREATE INDEX IF NOT EXISTS idx_user_profiles_org_id ON public.user_profiles (organization_id);

-- Reload schema
NOTIFY pgrst, 'reload schema';
