import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../../lib/supabase";

/**
 * Agent Performance API
 * 
 * Returns agent leaderboard data with activity counts
 * 
 * Security: Validates user session and org access
 * 
 * @route GET /api/dashboard/agent-performance
 * @query dateFilter - Date range filter
 * @query orgId - Organization ID (validated)
 */

interface AgentDataPoint {
  name: string;
  count: number;
}

interface AgentPerformanceResponse {
  success: boolean;
  data?: {
    agents: AgentDataPoint[];
    totalDials: number;
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
  filters: { orgId?: string; startDate?: string; endDate?: string }
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
    const { dateFilter = "this_month", orgId, startDate, endDate } = req.query;
    const startTime = Date.now();

    // Ensure the standard supabase client is authenticated for RLS
    if (!supabaseAdmin) {
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: "",
      });
    }

    // Fetch user profile to validate org access
    const { data: userProfile, error: profileError } = await supabase
      .from("user_profiles")
      .select("organization_id, role")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("Agent Performance API - Profile fetch error:", profileError);
      return res.status(500).json({ success: false, error: "Database error" });
    }

    // Determine target org
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

    // 1. Fetch all users for the target org(s)
    let profilesQuery = dbClient
      .from("user_profiles")
      .select("user_id, user_name, role")
      .neq("approval_status", "rejected"); // Filter out rejected users

    if (targetOrgId) {
      profilesQuery = profilesQuery.eq("organization_id", targetOrgId);
    }

    // Prepare agent map with all users initialized to 0
    const { data: profiles } = await profilesQuery;
    const agentMap: Record<string, { name: string; count: number }> = {};
    
    if (profiles) {
      profiles.forEach((p) => {
        // Optional: Filter out specific roles if needed, e.g. "client"
        const name = p.user_name || "Unknown Agent";
        agentMap[p.user_id] = { name, count: 0 };
      });
    }

    // 2. Fetch call logs
    const callLogs = await fetchAllRows(
      dbClient,
      "call_logs",
      "agent_id", // Only need ID now
      {
        orgId: targetOrgId,
        startDate: start,
        endDate: end,
      }
    );

    // 3. Aggregate counts
    callLogs.forEach((log: any) => {
      if (log.agent_id && agentMap[log.agent_id]) {
        agentMap[log.agent_id].count++;
      } else if (log.agent_id) {
        // Handle case where agent exists in logs but not in profiles fetch (e.g. deleted user)
        // We generally skip or add as "Unknown"
         if (!agentMap[log.agent_id]) {
             agentMap[log.agent_id] = { name: "Unknown/Deleted", count: 0 };
         }
         agentMap[log.agent_id].count++;
      }
    });

    // 4. Sort and return ALL agents (no slice)
    const agents = Object.values(agentMap)
      .sort((a, b) => b.count - a.count);

    const totalDials = callLogs.length;

    const endTime = Date.now();
    console.log(`[API] agent_performance - Status: 200 - Duration: ${endTime - startTime}ms`);

    return res.status(200).json({
      success: true,
      data: {
        agents,
        totalDials,
      },
    });
  } catch (error) {
    console.error("Agent performance API error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
