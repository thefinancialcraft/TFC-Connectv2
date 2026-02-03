import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../../lib/supabase";

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
  };
  error?: string;
}

function getDateRange(filter: string) {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).toISOString();
  const todayEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  ).toISOString();

  let start = todayStart;
  let end = todayEnd;

  switch (filter) {
    case "yesterday": {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      start = new Date(y.getFullYear(), y.getMonth(), y.getDate()).toISOString();
      end = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59).toISOString();
      break;
    }
    case "this_week": {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()).toISOString();
      break;
    }
    case "last_7_days": {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      start = d.toISOString();
      break;
    }
    case "this_month":
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      break;
    case "last_month":
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
      break;
    case "this_year":
      start = new Date(now.getFullYear(), 0, 1).toISOString();
      break;
    case "multi_year":
      start = new Date(now.getFullYear() - 3, 0, 1).toISOString();
      break;
    case "all_time":
      start = "2000-01-01T00:00:00.000Z";
      break;
  }

  return { start, end };
}

/**
 * Helper function to fetch ALL rows (bypasses 1000 row limit)
 */
async function fetchAllRows(
  client: any,
  table: string,
  selectQuery: string,
  filters: { orgId?: string; startDate?: string; endDate?: string; userId?: string }
) {
  const BATCH_SIZE = 1000;
  let allData: any[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    let query = client.from(table).select(selectQuery).range(from, from + BATCH_SIZE - 1);

    if (filters.orgId) {
      query = query.eq("organization_id", filters.orgId);
    }
    
    // Apply user filters
    if (filters.userId) {
        if (table === 'customers') {
            query = query.eq('assigned_to', filters.userId);
        } else if (table === 'call_logs') {
            // call_logs uses agent_id to reference the user
            query = query.eq('agent_id', filters.userId);
        }
    }

    if (filters.startDate) {
      query = query.gte("created_at", filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte("created_at", filters.endDate);
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

    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("organization_id, role")
      .eq("user_id", requestUserId)
      .maybeSingle();

    if (profileError) {
      console.error("Charts API - Profile fetch error:", profileError);
      return res.status(500).json({ success: false, error: "Database error" });
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
      const range = getDateRange(dateFilter as string);
      if (dateFilter !== "all_time") {
        start = range.start;
        end = range.end;
      }
    }

    // Use admin client to bypass RLS
    const dbClient = supabaseAdmin || supabase;

    // Fetch ALL data using pagination (no 1000 row limit)
    const [customers, callLogs, campaigns] = await Promise.all([
      // All customers
      fetchAllRows(dbClient, "customers", "*", {
        orgId: targetOrgId,
        startDate: start,
        endDate: end,
        userId: (filterUserId && filterUserId !== 'all') ? (filterUserId as string) : undefined
      }),

      // All call logs
      fetchAllRows(dbClient, "call_logs", "*", {
        orgId: targetOrgId,
        startDate: start,
        endDate: end,
        userId: (filterUserId && filterUserId !== 'all') ? (filterUserId as string) : undefined
      }),

      // All campaigns
      (async () => {
        const { data } = await dbClient.from("campaigns").select("id, name");
        return data || [];
      })(),
    ]);

    // Build campaign lookup
    const campaignMap: Record<string, string> = {};
    campaigns.forEach((c) => (campaignMap[c.id] = c.name));

    // 1. Line Chart Data (Last 6 months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const last6Months: ChartPoint[] = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      return {
        name: months[d.getMonth()],
        dials: 0,
        connected: 0,
        monthIndex: d.getMonth(),
      };
    }).reverse();

    callLogs.forEach((log) => {
      const date = new Date(log.created_at);
      const mIdx = date.getMonth();
      const found = last6Months.find((m) => m.monthIndex === mIdx);
      if (found) {
        found.dials++;
        if (log.is_connected === "contactable" || log.is_connected === true) {
          found.connected++;
        }
      }
    });

    // 2. Pie Data (Disposition distribution)
    const dispositionMap: Record<string, number> = {};
    customers.forEach((c) => {
      const disp = c.disposition || "Fresh Lead";
      dispositionMap[disp] = (dispositionMap[disp] || 0) + 1;
    });

    const pieData: PieDataPoint[] = Object.entries(dispositionMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // 3. Campaign Performance
    const campPerfMap: Record<string, { name: string; total: number; success: number }> = {};
    
    customers.forEach((c) => {
      const name = campaignMap[c.campaign_id] || c.campaign_id;
      if (!name || name === "Unknown Campaign") return;

      if (!campPerfMap[name]) {
        campPerfMap[name] = { name, total: 0, success: 0 };
      }
      campPerfMap[name].total++;

      if (
        ["Sold", "Success", "Converted", "Closed"].some((s) =>
          c.disposition?.toLowerCase().includes(s.toLowerCase())
        )
      ) {
        campPerfMap[name].success++;
      }
    });

    const campaignData: CampaignDataPoint[] = Object.values(campPerfMap)
      .filter((item) => item.name !== "Unknown Campaign")
      .sort((a, b) => b.total - a.total)
      .slice(0, 6);

    // 4. Heatmap Data
    const hasDateRange = !!(start && end);
    
    let isAggregateMode = true;
    let labels: string[] = [];
    
    if (hasDateRange) {
      const startTimeResult = new Date(start!);
      const endTimeResult = new Date(end!);
      
      const diffTime = Math.abs(endTimeResult.getTime() - startTimeResult.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
      
      // Only aggregate if range is > 3 months (approx 93 days)
      isAggregateMode = diffDays > 93;
      
      if (!isAggregateMode) {
        const current = new Date(startTimeResult);
        let loopGuard = 0;
        // Allow up to 100 days of columns
        while (current <= endTimeResult && loopGuard < 100) {
          labels.push(
            current.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          );
          current.setDate(current.getDate() + 1);
          loopGuard++;
        }
      }
    }

    if (isAggregateMode) {
      // Default to last 7 days for better visualization in aggregate mode
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        labels.push(
          d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        );
      }
    }

    const timeSlots = [
      "8 AM - 10 AM",
      "10 AM - 12 PM",
      "12 PM - 2 PM",
      "2 PM - 4 PM",
      "4 PM - 6 PM",
      "6 PM - 8 PM",
      "8 PM - 10 PM",
    ];

    const heatmapMap: Record<string, Record<string, number>> = {};
    labels.forEach((l) => {
      heatmapMap[l] = {};
      timeSlots.forEach((t) => (heatmapMap[l][t] = 0));
    });

    callLogs.forEach((log: any) => {
      const date = new Date(log.created_at);
      const hour = date.getHours();

      let slot = "";
      if (hour >= 8 && hour < 10) slot = "8 AM - 10 AM";
      else if (hour >= 10 && hour < 12) slot = "10 AM - 12 PM";
      else if (hour >= 12 && hour < 14) slot = "12 PM - 2 PM";
      else if (hour >= 14 && hour < 16) slot = "2 PM - 4 PM";
      else if (hour >= 16 && hour < 18) slot = "4 PM - 6 PM";
      else if (hour >= 18 && hour < 20) slot = "6 PM - 8 PM";
      else if (hour >= 20 && hour < 22) slot = "8 PM - 10 PM";

      if (slot) {
        let rowLabel = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });

        // In aggregate mode, we only track logs that fall into our 7-day window
        if (heatmapMap[rowLabel]) {
          heatmapMap[rowLabel][slot]++;
        }
      }
    });

    const heatmapData: HeatmapDataPoint[] = labels.map((day) => ({
      day,
      ...heatmapMap[day],
    }));

    // 5. Hourly Stats
    const hourMap: Record<number, HourlyStatPoint> = {};
    for (let i = 8; i <= 20; i++) {
      hourMap[i] = {
        hour: `${i > 12 ? i - 12 : i} ${i >= 12 ? "pm" : "am"}`,
        total: 0,
        connected: 0,
        outgoing: 0,
        incoming: 0,
        missed: 0,
        talktime: 0,
      };
    }

    callLogs.forEach((log) => {
      const hour = new Date(log.created_at).getHours();
      if (hourMap[hour]) {
        hourMap[hour].total++;
        if (log.is_connected === "contactable" || log.is_connected === true) {
          hourMap[hour].connected++;
        }
        hourMap[hour].outgoing++;
        hourMap[hour].talktime += log.duration || 0;
      }
    });

    const hourlyStats: HourlyStatPoint[] = Object.values(hourMap);

    const endTime = Date.now();
    console.log(`[API] dashboard_charts - Status: 200 - Duration: ${endTime - startTime}ms`);

    return res.status(200).json({
      success: true,
      data: {
        chartData: last6Months,
        pieData,
        campaignData,
        heatmapData,
        hourlyStats,
      },
    });
  } catch (error) {
    console.error("Dashboard charts API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
