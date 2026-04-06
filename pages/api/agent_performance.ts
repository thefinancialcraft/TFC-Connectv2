import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../lib/supabase";
import { getISTDateRange } from "../../lib/dateUtils";
import { DashboardLevel, getUserDashboardLevel } from "../../lib/dashboardUtils";

/**
 * Agent Performance API
 * 
 * Returns agent leaderboard data with activity counts
 * 
 * Security: Validates user session and org access
 * 
 * @route GET /api/dashboard/agent_performance
 * @query dateFilter - Date range filter
 * @query orgId - Organization ID (validated)
 */
 

interface AgentDataPoint {
  id: string;
  name: string;
  employee_id: string | null;
  profile_pic_url: string | null;
  count: number;
  duration: number;
  connected_count: number;
  deals_count: number;
  follow_ups_count: number;
  last_active: string | null;
  last_online: string | null;
  on_call: boolean;
  is_personal: boolean;
  consecutive_failed_stats: string;
}

interface AgentPerformanceResponse {
  success: boolean;
  data?: {
    agents: AgentDataPoint[];
    totalDials: number;
    totalDuration: number;
  };
  error?: string;
}

/**
 * Calculate date range based on filter
 */
// getDateRange moved to lib/dateUtils.ts

/**
 * Helper function to fetch ALL rows (bypasses 1000 row limit)
 */
async function fetchAllRows(
  client: any,
  table: string,
  selectQuery: string,
  filters: { orgId?: string; startDate?: string; endDate?: string; dateColumn?: string; userId?: string | string[]; employeeId?: string | string[] }
) {
  const BATCH_SIZE = 1000;
  let allData: any[] = [];
  let from = 0;
  let hasMore = true;
  const dateCol = filters.dateColumn || "created_at";

  while (hasMore) {
    let query = client.from(table).select(selectQuery).range(from, from + BATCH_SIZE - 1);

    if (filters.orgId && table !== 'call_history') {
       query = query.eq("organization_id", filters.orgId);
    }
    // Apply user filters
    if (filters.userId && (table === 'customers' || table === 'user_profiles')) {
      if (Array.isArray(filters.userId)) {
        query = query.in(table === 'customers' ? 'assigned_to' : 'user_id', filters.userId);
      } else {
        query = query.eq(table === 'customers' ? 'assigned_to' : 'user_id', filters.userId);
      }
    }
    if (filters.employeeId && table === 'call_history') {
      if (Array.isArray(filters.employeeId)) {
        query = query.in('employee_id', filters.employeeId);
      } else {
        query = query.eq('employee_id', filters.employeeId);
      }
    }

    if (filters.startDate) {
      query = query.gte(dateCol, filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte(dateCol, filters.endDate);
    }

    const { data, error } = await query;

    if (error) throw error;
    if (!data || data.length === 0) {
      hasMore = false;
      break;
    }

    allData = [...allData, ...data];

    if (data.length < BATCH_SIZE) {
      hasMore = false;
    } else {
      from += BATCH_SIZE;
    }
  }

  return allData;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AgentPerformanceResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    // Get the auth token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const token = authHeader.split("Bearer ")[1];

    // Verify the token and get user
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
      return res.status(401).json({ success: false, error: "Invalid or expired token" });
    }

    const userId = authUser.id;
    const { dateFilter = "this_month", orgId, startDate, endDate, userId: filterUserId } = req.query;
    const startTime = Date.now();

    // Ensure the standard supabase client is authenticated for RLS
    if (!supabaseAdmin) {
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: "",
      });
    }

    // Fetch user profile to validate org access
    const { data: userProfile, error: profileError } = await (supabaseAdmin || supabase)
      .from("user_profiles")
      .select("organization_id, role, designation")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Agent Performance API - Profile fetch error:", profileError);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    // Determine dashboard level
    const userRole = userProfile?.role || 'user';
    const userDesignation = userProfile?.designation || '';
    const dashboardLevel = getUserDashboardLevel({ isClient: true, role: userRole, designation: userDesignation });

    // Team Leader IDs tracking
    let restrictedUserIds: string[] | undefined = undefined;
    let restrictedEmployeeIds: string[] | undefined = undefined;

    if (dashboardLevel === DashboardLevel.LEVEL_3_TL_SALES) {
      const { data: teams } = await (supabaseAdmin || supabase)
        .from('teams')
        .select('members')
        .eq('leader_id', userId)
        .eq('is_active', true);
      
      const memberIds = new Set<string>();
      memberIds.add(userId);
      teams?.forEach(t => {
        if (Array.isArray(t.members)) {
          t.members.forEach((m: string) => { if (m) memberIds.add(m); });
        }
      });
      restrictedUserIds = Array.from(memberIds);

      // Also get employee IDs for call_history filtering
      const { data: memberProfiles } = await (supabaseAdmin || supabase)
        .from('user_profiles')
        .select('employee_id')
        .in('user_id', restrictedUserIds);
      
      restrictedEmployeeIds = memberProfiles?.map(p => p.employee_id).filter(id => !!id) as string[];
    }

    // Determine target org
    let targetOrgId: string | undefined = undefined;

    // Use admin client
    const dbClient = supabaseAdmin || supabase;

    // If filterUserId provided, get employee_id for call_history matching
    let filterEmployeeId: string | undefined;
    if (filterUserId && filterUserId !== 'all') {
      const { data: filterUser } = await dbClient
        .from('user_profiles')
        .select('employee_id')
        .eq('user_id', filterUserId)
        .maybeSingle();
      if (filterUser?.employee_id) filterEmployeeId = filterUser.employee_id;
    }

    if (orgId && orgId !== "all") {
      if (userProfile) {
        if (
          userProfile.role === "admin" ||
          userProfile.role === "super_admin" ||
          orgId === userProfile.organization_id
        ) {
          targetOrgId = orgId as string;
        } else {
          return res.status(403).json({ success: false, error: "Organization access denied" });
        }
      } else {
        targetOrgId = orgId as string;
      }
    } else if (orgId !== "all") {
      if (userProfile && userProfile.role !== "admin" && userProfile.role !== "super_admin") {
        targetOrgId = userProfile.organization_id;
      }
    }

    // Determine date range priorities:
    // 1. Custom startDate/endDate query params
    // 2. dateFilter preset (unless "all_time")
    let start: string | undefined;
    let end: string | undefined;

    if (startDate && endDate) {
      start = startDate as string;
      end = endDate as string;
    } else {
      const range = getISTDateRange(dateFilter as string);
      if (dateFilter !== "all_time") {
        start = range.start;
        end = range.end;
      }
    }

    // --- HIGH PERFORMANCE OPTIMIZED CALL (RPC) ---
    try {
      console.log("🚀 [Performance] Attempting optimized agent performance RPC call...");
      const { data: agentsRaw, error: rpcError } = await dbClient.rpc('get_agent_performance_optimized', {
        p_start_date: start,
        p_end_date: end,
        p_org_id: targetOrgId || null,
        p_restricted_user_ids: (restrictedUserIds && restrictedUserIds.length > 0) ? restrictedUserIds : null,
        p_filter_user_id: (filterUserId && filterUserId !== 'all') ? filterUserId : null
      });

      if (rpcError) throw rpcError;

      // Safe extract as RPC sometimes returns single object or array
      const agentsUnwrapped = Array.isArray(agentsRaw) ? agentsRaw : (agentsRaw ? [agentsRaw] : []);
      
      // Extract data
      const agents: AgentDataPoint[] = (agentsUnwrapped || []).map((a: any) => ({
        ...a,
        connected_count: Number(a.connected_count) || 0,
        count: Number(a.count) || 0,
        duration: Number(a.duration) || 0,
        deals_count: Number(a.deals_count) || 0,
        follow_ups_count: Number(a.follow_ups_count) || 0,
        last_active: a.last_active || null,
        last_online: a.last_online || null,
        on_call: !!a.on_call,
        is_personal: !!a.is_personal,
        consecutive_failed_stats: a.consecutive_failed_stats || '0/0s'
      }));

      const totalDials = agents.reduce((acc, a) => acc + a.count, 0);
      const totalDuration = agents.reduce((acc, a) => acc + a.duration, 0);

      const endTime = Date.now();
      console.log(`✅ [Performance] Agent Performance RPC Success - Duration: ${endTime - startTime}ms`);

      return res.status(200).json({
        success: true,
        data: { agents, totalDials, totalDuration },
      });

    } catch (err: any) {
        console.error("Agent performance API error:", err);
        return res.status(500).json({ success: false, error: err.message || "Internal server error" });
    }
  } catch (error: any) {
    console.error("Fatal Agent Performance API error:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
}
