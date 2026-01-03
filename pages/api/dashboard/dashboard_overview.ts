import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../../lib/supabase";

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
      efficiencyScore: number;
    };
    secondaryStats: {
      todayCalls: number;
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
 * Helper function to fetch ALL rows from a table (bypasses 1000 row limit)
 * Uses pagination to fetch data in batches
 */
async function fetchAllRows(
  client: any,
  table: string,
  selectQuery: string,
  filters: { orgId?: string; startDate?: string; endDate?: string }
) {
  const BATCH_SIZE = 1000;
  let allData: any[] = [];
  let from = 0;
  let hasMore = true;

  while (hasMore) {
    let query = client.from(table).select(selectQuery).range(from, from + BATCH_SIZE - 1);

    // Apply filters
    if (filters.orgId) {
      query = query.eq("organization_id", filters.orgId);
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

    // If we got less than BATCH_SIZE, we've reached the end
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
  res: NextApiResponse<DashboardOverviewResponse>
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
    const { dateFilter = "this_month", orgId } = req.query;
    const startTime = Date.now();

    // Ensure the standard supabase client is authenticated for RLS
    // Even if using supabaseAdmin later, we need to fetch the profile first
    if (!supabaseAdmin) {
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: "",
      });
    }

    // Fetch user profile to validate org access
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("organization_id, role, designation")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return res.status(500).json({ success: false, error: "Database error" });
    }


    // Determine which org to query
    // If user requests specific org, validate they have access
    let targetOrgId: string | undefined = undefined;
    
    if (orgId && orgId !== "all") {
      // If user has profile, validate org access
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
        // No profile - allow access to requested org (or could restrict here)
        targetOrgId = orgId as string;
      }
    } else if (orgId !== "all") {
      // Default to user's org if not admin viewing all
      if (userProfile && userProfile.role !== "admin" && userProfile.role !== "super_admin") {
        targetOrgId = userProfile.organization_id;
      }
    }

    const range = getDateRange(dateFilter as string);
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

    // Use admin client to bypass RLS and get all data
    const dbClient = supabaseAdmin || supabase;
    
    console.log(`Overview API: Fetching for org ${targetOrgId || 'All'}, range: ${range.start} to ${range.end}`);

    // Fetch ALL data using pagination (no 1000 row limit)
    const [customers, callLogs, todayCallsCount, campaignsCount, teamCount] = await Promise.all([
      // All customers in date range
      fetchAllRows(dbClient, "customers", "*", {
        orgId: targetOrgId,
        startDate: range.start,
        endDate: range.end,
      }),

      // All call logs in date range
      fetchAllRows(dbClient, "call_logs", "*", {
        orgId: targetOrgId,
        startDate: range.start,
        endDate: range.end,
      }),

      // Today's calls count
      (async () => {
        const { count } = await dbClient
          .from("call_logs")
          .select("*", { count: "exact", head: true })
          .gte("created_at", todayStart)
          .lte("created_at", todayEnd)
          .then((res: any) => {
            if (targetOrgId) {
              return dbClient
                .from("call_logs")
                .select("*", { count: "exact", head: true })
                .eq("organization_id", targetOrgId)
                .gte("created_at", todayStart)
                .lte("created_at", todayEnd);
            }
            return res;
          });
        return count || 0;
      })(),

      // Active campaigns count
      (async () => {
        const { count } = await dbClient
          .from("campaigns")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");
        return count || 0;
      })(),

      // Team members count
      (async () => {
        const { count } = await dbClient
          .from("user_profiles")
          .select("*", { count: "exact", head: true })
          .eq("status", "active");
        return count || 0;
      })(),
    ]);

    console.log(`Overview API Stats: Customers: ${customers.length}, CallLogs: ${callLogs.length}, TodayCalls: ${todayCallsCount}`);

    // Calculate primary stats
    const totalCustomers = customers.length;
    const converted = customers.filter((c) =>
      ["Sold", "Success", "Converted", "Closed"].some((s) =>
        c.disposition?.toLowerCase().includes(s.toLowerCase())
      )
    );
    const totalConverted = converted.length;
    const totalPremium = converted.reduce((acc, c) => acc + (Number(c.premium) || 0), 0);
    const conversionRate = totalCustomers ? (totalConverted / totalCustomers) * 100 : 0;

    // Calculate secondary stats
    // Fresh Prospects - customers with no disposition or "fresh"
    const freshProspects = customers.filter(
      (c) => !c.disposition || c.disposition.toLowerCase().includes("fresh")
    ).length;

    // Filter customers with "callback" disposition and valid next_called_at
    const callbackCustomers = customers.filter(
      (c) =>
        c.disposition &&
        c.disposition.toLowerCase().includes("call back") &&
        c.next_called_at &&
        c.next_called_at.trim() !== ""
    );

    // Total Followups = Overdue + Upcoming (All callbacks)
    const followupCalls = callbackCustomers.length;

    // Overdue Followups = Callbacks scheduled in the past
    const overdueFollowups = callbackCustomers.filter(
      (c) => new Date(c.next_called_at) < now
    ).length;

    // New Today - customers created today
    const newProspects = customers.filter(
      (c) => c.created_at >= todayStart && c.created_at <= todayEnd
    ).length;

    // Calculate performance metrics
    const connectedCalls = callLogs.filter(
      (l) => l.is_connected === "contactable" || l.is_connected === true
    );
    const connectedRate = callLogs.length
      ? (connectedCalls.length / callLogs.length) * 100
      : 0;

    const totalTalkSeconds = callLogs.reduce(
      (acc, l) => acc + (Number(l.duration) || 0),
      0
    );
    const avgSecs = callLogs.length ? totalTalkSeconds / callLogs.length : 0;
    const mins = Math.floor(avgSecs / 60);
    const secs = Math.floor(avgSecs % 60);

    // Calculate efficiency score (0-100)
    const efficiencyScore = Math.min(
      100,
      Math.round(
        (conversionRate * 0.4 + connectedRate * 0.3 + (callLogs.length / 100) * 0.3)
      )
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
          totalDials: callLogs.length,
          efficiencyScore,
        },
        secondaryStats: {
          todayCalls: todayCallsCount,
          assignedMembers: teamCount,
          freshProspects,
          followupCalls,
          newProspects,
          overdueFollowups,
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
  } catch (error) {
    console.error("Dashboard overview API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
