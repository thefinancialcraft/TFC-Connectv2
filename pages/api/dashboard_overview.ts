import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../lib/supabase";
import { getISTDateRange } from "../../lib/dateUtils";
import { DashboardLevel, getUserDashboardLevel } from "../../lib/dashboardUtils";

/**
 * Dashboard Overview API
 * 
 * Returns aggregated dashboard statistics including:
 * - Primary stats (customers, premium, conversions, campaigns)
 * - Secondary stats (today's calls, prospects, followups)
 * - Performance metrics (duration, connected rate, ROI, efficiency)
 * 
 * Security: Extracts org from authenticated user session
 * 
 * @route GET /api/dashboard/dashboard_overview
 * @query dateFilter - Date range filter (today, this_week, this_month, etc.)
 * @query orgId - Organization ID (validated against user's access)
 * @query userId - Optional: User ID to filter by
 */

interface DashboardOverviewResponse {
  success: boolean;
  data?: {
    stats: {
      totalCustomers: number;
      totalPremium: number;
      totalConverted: number;
      conversionRate: number;
      activeCampaigns: number;
      totalDials: number;
      totalTalktime: number;
      efficiencyScore: number;
    };
    secondaryStats: {
      todayCalls: number;
      incomingCount: number;
      outgoingCount: number;
      missedCount: number;
      assignedMembers: number;
      freshProspects: number;
      followupCalls: number;
      newProspects: number;
      overdueFollowups: number;
    };
    performanceMetrics: {
      avgDuration: string;
      connectedRate: string;
      roi: string;
    };
  };
  error?: string;
}

/**
 * Calculate date range based on filter
 */
// getDateRange moved to lib/dateUtils.ts

/**
 * Helper function to fetch only specific columns for summing (handles 1000 row limit)
 */
async function fetchSumData(
  client: any,
  table: string,
  column: string,
  filters: { orgId?: string; startDate?: string; endDate?: string; dateColumn?: string; userId?: string | string[]; employeeId?: string | string[]; extraFilter?: (q: any) => any }
) {
  const BATCH_SIZE = 1000;
  let total = 0;
  let from = 0;
  let hasMore = true;
  const dateCol = filters.dateColumn || "created_at";

  // CRITICAL: Empty array in .in() filter causes 500 Error in PostgREST
  if (Array.isArray(filters.userId) && filters.userId.length === 0) return 0;
  if (Array.isArray(filters.employeeId) && filters.employeeId.length === 0) return 0;

  while (hasMore) {
    let query = client.from(table).select(column).range(from, from + BATCH_SIZE - 1);

    if (filters.orgId && table !== 'call_history') query = query.eq("organization_id", filters.orgId);
    if (filters.userId && table === 'customers') {
      if (Array.isArray(filters.userId)) query = query.in('assigned_to', filters.userId);
      else query = query.eq('assigned_to', filters.userId);
    }
    if (filters.employeeId && table === 'call_history') {
      if (Array.isArray(filters.employeeId)) query = query.in('employee_id', filters.employeeId);
      else query = query.eq('employee_id', filters.employeeId);
    }
    if (filters.startDate) query = query.gte(dateCol, filters.startDate);
    if (filters.endDate) query = query.lte(dateCol, filters.endDate);
    if (filters.extraFilter) query = filters.extraFilter(query);

    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) break;

    total += data.reduce((acc: number, entry: any) => acc + (Number(entry[column]) || 0), 0);

    if (data.length < BATCH_SIZE) hasMore = false;
    else from += BATCH_SIZE;
  }
  return total;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardOverviewResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  console.log("==> Dashboard Overview API Handler Started <==");
  const startTime = Date.now();

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
    const { dateFilter = "this_month", orgId, userId: filterUserId } = req.query;
    console.log(`[API Params] dateFilter: ${dateFilter}, orgId: ${orgId}, filterUserId: ${filterUserId}`);

    // Ensure the standard supabase client is authenticated for RLS
    // Even if using supabaseAdmin later, we need to fetch the profile first
    if (!supabaseAdmin) {
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: "",
      });
    }

    // Fetch user profile to validate org access
    const { data: userProfile, error: profileError } = await (supabaseAdmin || supabase)
      .from("user_profiles")
      .select("organization_id, role, designation, is_client")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    // Determine dashboard level
    const userRole = userProfile?.role || 'user';
    const userDesignation = userProfile?.designation || '';
    const dashboardLevel = getUserDashboardLevel({ 
      isClient: userProfile?.is_client ?? false, 
      role: userRole, 
      designation: userDesignation 
    });

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


    // Determine which org to query
    let targetOrgId: string | undefined = undefined;
    const isSuperAdmin = userProfile?.role === "super_admin" || userProfile?.role === "superadmin";

    if (orgId && orgId !== "all") {
      // User requested a specific org
      if (isSuperAdmin || orgId === userProfile?.organization_id) {
        targetOrgId = orgId as string;
      } else {
        return res.status(403).json({ success: false, error: "Organization access denied" });
      }
    } else {
      // User requested "all" or didn't specify orgId
      if (!isSuperAdmin) {
        // Non-super-admins ALWAYS get restricted to their own org!
        targetOrgId = userProfile?.organization_id;
      }
    }

    const range = getISTDateRange(dateFilter as string);
    const { start: todayStart, end: todayEnd } = getISTDateRange("today");

    // Use admin client to bypass RLS and get all data
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
    // --- HIGH PERFORMANCE OPTIMIZED CALL (RPC) ---
    try {
      console.log("🚀 [Performance] Attempting optimized database RPC call...");
      const { data: rpcStats, error: rpcError } = await dbClient.rpc('get_dashboard_stats_advanced', {
        p_start_date: range.start,
        p_end_date: range.end,
        p_org_id: targetOrgId || null,
        p_filter_user_id: (filterUserId && filterUserId !== 'all') ? filterUserId : null,
        p_restricted_user_ids: (restrictedUserIds && restrictedUserIds.length > 0) ? restrictedUserIds : null,
        p_filter_employee_id: filterEmployeeId || null,
        p_restricted_employee_ids: (restrictedEmployeeIds && restrictedEmployeeIds.length > 0) ? restrictedEmployeeIds : null
      });

      if (rpcError) throw rpcError;

      console.log("✅ [Performance] RPC Success. Metrics aggregated in-database.");
      
      const totalCustomers = rpcStats.totalCustomers || 0;
      const totalConverted = rpcStats.totalConverted || 0;
      const totalPremium = 0; 
      const totalDials = rpcStats.totalDials || 0;
      const totalTalktime = rpcStats.totalTalktime || 0;
      const totalConnections = rpcStats.totalConnections || 0;
      const todayCallsCount = rpcStats.todayCalls || 0;
      const campaignsCount = rpcStats.activeCampaigns || 0;
      // Overriding RPC team count to strictly count 'active' users
      let teamCountQuery = dbClient.from('user_profiles').select('*', { count: 'exact', head: true }).eq('status', 'active');
      if (targetOrgId) teamCountQuery = teamCountQuery.eq('organization_id', targetOrgId);
      if (restrictedUserIds && restrictedUserIds.length > 0) teamCountQuery = teamCountQuery.in('user_id', restrictedUserIds);
      
      const { count: activeTeamCount } = await teamCountQuery;
      const teamCount = activeTeamCount !== null ? activeTeamCount : (rpcStats.teamCount || 0);
      const freshGlobalCount = rpcStats.freshGlobalCount || 0;
      const allTimeRecords = rpcStats.allTimeRecords || 0;
      const allTimeFollowups = rpcStats.allTimeFollowups || 0;
      const allTimeOverdue = rpcStats.allTimeOverdue || 0;
      const allTimeConnections = rpcStats.allTimeConnections || 0;
      
      // Safety Check: If the RPC is old and doesn't return the new fields, fall back
      if (rpcStats.incomingCount === undefined && rpcStats.outgoingCount === undefined) {
        throw new Error("RPC missing new call type counters. Falling back.");
      }

      const incomingCount = rpcStats.incomingCount || 0;
      const outgoingCount = rpcStats.outgoingCount || 0;
      const missedCount = rpcStats.missedCount || 0;

      return sendDashboardResponse(res, {
        totalCustomers, totalConverted, totalPremium, totalDials, totalTalktime,
        totalConnections, todayCallsCount, incomingCount, outgoingCount, missedCount, 
        campaignsCount, teamCount, freshGlobalCount,
        allTimeRecords, allTimeFollowups, allTimeOverdue, allTimeConnections, startTime
      });

    } catch (err: any) {
        console.warn("⚠️ [Performance] RPC failed or not found. Falling back to parallel count strategy.");
    }

    // If the RPC fails, we just throw the error to fail fast and avoid heavy database loads
    throw new Error("RPC get_dashboard_stats_advanced failed or is missing. Please ensure the RPC is deployed.");
  } catch (err: any) {
    console.error("Dashboard overview API error:", err);
    return res.status(500).json({ success: false, error: err.message || JSON.stringify(err) || "Internal server error" });
  }
}

/**
 * Finalize response with calculations
 */

function sendDashboardResponse(res: NextApiResponse, data: any) {
    const { 
        totalCustomers, totalConverted, totalPremium, totalDials, totalTalktime,
        totalConnections, todayCallsCount, incomingCount, outgoingCount, missedCount,
        campaignsCount, teamCount, freshGlobalCount,
        allTimeRecords, allTimeFollowups, allTimeOverdue, allTimeConnections, startTime
    } = data;



    // --- CALCULATIONS ---
    const conversionRate = totalCustomers ? (totalConverted / totalCustomers) * 100 : 0;
    const connectedRate = totalDials ? (totalConnections / totalDials) * 100 : 0;
    const avgSecs = totalDials ? totalTalktime / totalDials : 0;
    const mins = Math.floor(avgSecs / 60);
    const secs = Math.floor(avgSecs % 60);

    const efficiencyScore = Math.min(
      100,
      Math.round((conversionRate * 0.4 + connectedRate * 0.3 + (totalDials / 100) * 0.3))
    );

    const responseData: DashboardOverviewResponse = {
      success: true,
      data: {
        stats: {
          totalCustomers,
          totalPremium: Math.round(totalPremium),
          totalConverted,
          conversionRate: Math.round(conversionRate * 10) / 10,
          activeCampaigns: campaignsCount,
          totalDials,
          totalTalktime,
          efficiencyScore,
        },
        secondaryStats: {
          todayCalls: todayCallsCount,
          incomingCount,
          outgoingCount,
          missedCount,
          assignedMembers: teamCount,
          freshProspects: freshGlobalCount,
          followupCalls: allTimeFollowups,
          newProspects: allTimeRecords,
          overdueFollowups: allTimeOverdue,
        },
        performanceMetrics: {
          avgDuration: `${mins}m ${secs}s`,
          connectedRate: `${connectedRate.toFixed(1)}%`,
          roi: `${(conversionRate / 2 + 1).toFixed(1)}x`,
        },
      },
    };

    const endTime = Date.now();
    console.log(`[API] dashboard_overview - Status: 200 - Duration: ${endTime - startTime}ms`);

    return res.status(200).json(responseData);
}
