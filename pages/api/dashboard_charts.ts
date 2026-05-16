import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../lib/supabase";
import { getISTDateRange } from "../../lib/dateUtils";
import { DashboardLevel, getUserDashboardLevel } from "../../lib/dashboardUtils";

/**
 * Dashboard Charts API
 * 
 * Returns all chart data including:
 * - Line chart (last 6 months trend)
 * - Pie chart (disposition distribution)
 * - Campaign performance
 * - Heatmap data
 * - Hourly statistics
 * 
 * Security: Validates user session and org access
 * 
 * @route GET /api/dashboard/dashboard_charts
 * @query dateFilter - Date range filter
 * @query orgId - Organization ID (validated)
 * @query userId - Optional: User ID to filter by
 */


// level 3 users login me all team members ke ander usse record puri comany ke team ka dikha rha hai istead of its own team



interface ChartPoint {
  name: string;
  dials: number;
  connected: number;
  monthIndex?: number;
}

interface PieDataPoint {
  name: string;
  value: number;
}

interface CampaignDataPoint {
  name: string;
  total: number;
  success: number;
}

interface HeatmapDataPoint {
  day: string;
  [key: string]: string | number;
}

interface HourlyStatPoint {
  hour: string;
  total: number;
  connected: number;
  outgoing: number;
  incoming: number;
  missed: number;
  talktime: number;
}

interface ChartsResponse {
  success: boolean;
  data?: {
    chartData: ChartPoint[];
    pieData: PieDataPoint[];
    campaignData: CampaignDataPoint[];
    heatmapData: HeatmapDataPoint[];
    hourlyStats: HourlyStatPoint[];
    isFallback?: boolean;
    processingTime?: number;
  };
  error?: string;
}

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

  while (hasMore) {
    let query = client.from(table).select(selectQuery).range(from, from + BATCH_SIZE - 1);

    const dateCol = filters.dateColumn || "created_at";

    if (filters.orgId) {
      query = query.eq("organization_id", filters.orgId);
    }
    
    // Apply user filters
    if (filters.userId && table === 'customers') {
      if (Array.isArray(filters.userId)) {
        query = query.in('assigned_to', filters.userId);
      } else {
        query = query.eq('assigned_to', filters.userId);
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
  res: NextApiResponse<ChartsResponse>
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

    const requestUserId = authUser.id;
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
      .select("organization_id, role, designation, is_client")
      .eq("user_id", requestUserId)
      .maybeSingle();

    if (profileError) {
      console.error("Charts API - Profile fetch error:", profileError);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    // Determine dashboard level
    const userRole = userProfile?.role || 'user';
    const userDesignation = (userProfile as any)?.designation || '';
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
        .eq('leader_id', requestUserId)
        .eq('is_active', true);
      
      const memberIds = new Set<string>();
      memberIds.add(requestUserId);
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

    let targetOrgId: string | undefined = undefined;
    
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

    // Use admin client to bypass RLS
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
      console.log("🚀 [Performance] Attempting optimized charts RPC call...");
      const { data: rpcCharts, error: rpcError } = await dbClient.rpc('get_dashboard_charts_optimized', {
        p_start_date: start,
        p_end_date: end,
        p_org_id: targetOrgId || null,
        p_filter_user_id: (filterUserId && filterUserId !== 'all') ? filterUserId : null,
        p_restricted_user_ids: (restrictedUserIds && restrictedUserIds.length > 0) ? restrictedUserIds : null,
        p_filter_employee_id: filterEmployeeId || null,
        p_restricted_employee_ids: (restrictedEmployeeIds && restrictedEmployeeIds.length > 0) ? restrictedEmployeeIds : null
      });

      if (rpcError) throw rpcError;

      // Ensure we have an object, as RPC sometimes returns as a single-element array
      const rpcResult = Array.isArray(rpcCharts) ? rpcCharts[0] : rpcCharts;
      const finalData = rpcResult?.get_dashboard_charts_optimized || rpcResult || {};

      // Map hourly stats (SQL: FMHH AM => '9 AM', '10 AM', '1 PM')
      const hourMap: Record<string, HourlyStatPoint> = {};
      // Expanded range: 6 AM to 11 PM
      for (let i = 6; i <= 23; i++) {
        const displayHour = i > 12 ? i - 12 : (i === 0 ? 12 : i);
        const ampm = i >= 12 ? "PM" : "AM";
        const label = `${displayHour} ${ampm}`;
        hourMap[label] = {
          hour: label, total: 0, connected: 0, outgoing: 0, incoming: 0, missed: 0, talktime: 0,
        };
      }

      (finalData.hourlyStats || []).forEach((h: any) => {
        const cleanLabel = h.hour_label ? h.hour_label.trim().toUpperCase() : "";
        // Find label in map (case-insensitive)
        const targetLabel = Object.keys(hourMap).find(k => k.trim().toUpperCase() === cleanLabel);
        
        if (targetLabel) {
          hourMap[targetLabel].total = h.total || 0;
          hourMap[targetLabel].connected = h.connected || 0;
          hourMap[targetLabel].outgoing = h.outgoing || 0;
          hourMap[targetLabel].incoming = h.incoming || 0;
          hourMap[targetLabel].missed = h.missed || 0;
          hourMap[targetLabel].talktime = h.talktime || 0;
        }
      });

      const endTime = Date.now();
      console.log(`✅ [Performance] Charts RPC Success - Duration: ${endTime - startTime}ms`);

      return res.status(200).json({
        success: true,
        data: {
          chartData: finalData.chartData || [],
          pieData: finalData.pieData || [],
          campaignData: finalData.campaignData || [],
          heatmapData: finalData.heatmapData || [],
          hourlyStats: Object.values(hourMap),
        },
      });

    } catch (err: any) {
      console.warn("⚠️ [Performance] RPC failed or timed out. Falling back to manual aggregation strategy.", err.message);
      
      try {
        const logs = await fetchAllRows(dbClient, "call_history", "timestamp, duration, call_type, employee_id", {
          orgId: targetOrgId,
          startDate: start,
          endDate: end,
          dateColumn: "timestamp",
          employeeId: filterEmployeeId || restrictedEmployeeIds
        });

        console.log(`[Charts Fallback] Fetched ${logs.length} records for aggregation.`);

        // 1. Process Chart Data (Trend)
        const trendMap: Record<string, ChartPoint> = {};
        logs.forEach(log => {
          const date = new Date(log.timestamp).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
          if (!trendMap[date]) trendMap[date] = { name: date, dials: 0, connected: 0 };
          trendMap[date].dials++;
          if (log.duration > 0) trendMap[date].connected++;
        });
        const chartData = Object.values(trendMap).sort((a, b) => a.name.localeCompare(b.name));

        // 2. Process Hourly Stats
        const hourMap: Record<string, HourlyStatPoint> = {};
        for (let i = 6; i <= 23; i++) {
          const label = `${i > 12 ? i - 12 : (i === 0 ? 12 : i)} ${i >= 12 ? "PM" : "AM"}`;
          hourMap[label] = { hour: label, total: 0, connected: 0, outgoing: 0, incoming: 0, missed: 0, talktime: 0 };
        }

        logs.forEach(log => {
          const istHourStr = new Date(log.timestamp).toLocaleString("en-US", { 
            hour: 'numeric', 
            hour12: true, 
            timeZone: "Asia/Kolkata" 
          });
          const label = istHourStr.replace(/^0/, '');
          if (hourMap[label]) {
            hourMap[label].total++;
            if (log.duration > 0) hourMap[label].connected++;
            if (log.call_type === 'outgoing') hourMap[label].outgoing++;
            else if (log.call_type === 'incoming') hourMap[label].incoming++;
            hourMap[label].talktime += (log.duration || 0);
          }
        });

        // 3. Process Heatmap Data
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const heatmapData: HeatmapDataPoint[] = days.map(day => {
          const point: HeatmapDataPoint = { day };
          for (let i = 6; i <= 23; i++) {
            const label = `${i > 12 ? i - 12 : (i === 0 ? 12 : i)} ${i >= 12 ? "PM" : "AM"}`;
            point[label] = 0;
          }
          return point;
        });

        logs.forEach(log => {
          const date = new Date(log.timestamp);
          let dayIndex = date.getDay() - 1;
          if (dayIndex < 0) dayIndex = 6;
          const hour = date.getHours();
          if (hour >= 6 && hour <= 23 && dayIndex >= 0 && dayIndex < 7) {
            const label = `${hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour)} ${hour >= 12 ? "PM" : "AM"}`;
            (heatmapData[dayIndex] as any)[label]++;
          }
        });

        // 4. Pie Data
        const callLogs = await fetchAllRows(dbClient, "call_logs", "disposition", {
          orgId: targetOrgId,
          startDate: start,
          endDate: end,
          userId: filterUserId || restrictedUserIds
        });

        const dispMap: Record<string, number> = {};
        callLogs.forEach(l => {
          const d = l.disposition || "Unknown";
          dispMap[d] = (dispMap[d] || 0) + 1;
        });
        const pieData = Object.entries(dispMap)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);

        return res.status(200).json({
          success: true,
          data: {
            chartData,
            pieData,
            campaignData: [],
            heatmapData,
            hourlyStats: Object.values(hourMap),
            isFallback: true,
            processingTime: Date.now() - startTime
          }
        });

      } catch (fallbackErr: any) {
        console.error("Dashboard charts fallback error:", fallbackErr);
        return res.status(500).json({ 
          success: false, 
          error: "Database statement timeout. Try a smaller date range or contact support to optimize your database indexes." 
        });
      }
    }
  } catch (error: any) {
    console.error("Fatal Dashboard charts API error:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
}
