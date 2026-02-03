import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../../lib/supabase";

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
  filters: { orgId?: string; startDate?: string; endDate?: string; dateColumn?: string }
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
      .select("user_id, user_name, role, employee_id, profile_pic_url")
      .neq("approval_status", "rejected"); // Filter out rejected users

    if (targetOrgId) {
      profilesQuery = profilesQuery.eq("organization_id", targetOrgId);
    }
    
    // Filter by User ID if provided
    if (filterUserId && filterUserId !== 'all') {
      profilesQuery = profilesQuery.eq('user_id', filterUserId);
    }

    // Prepare agent map with all users initialized to 0
    const { data: profiles } = await profilesQuery;
    const agentMap: Record<string, AgentDataPoint> = {};
    const employeeIdMap: Record<string, string> = {}; // Map employee_id -> user_id
    
    if (profiles) {
      profiles.forEach((p) => {
        const name = p.user_name || "Unknown Agent";
        agentMap[p.user_id] = { 
          id: p.user_id, 
          name, 
          employee_id: p.employee_id,
          profile_pic_url: p.profile_pic_url,
          count: 0, 
          duration: 0,
          connected_count: 0,
          deals_count: 0,
          follow_ups_count: 0,
          last_active: null,
          last_online: null,
          on_call: false,
          is_personal: false
        };
        // Populate employee id map for lookup
        if (p.employee_id) {
            employeeIdMap[p.employee_id] = p.user_id;
        }
      });
    }

    // 2. Fetch call logs from call_history
    const callLogs = await fetchAllRows(
      dbClient,
      "call_history",
      "employee_id, duration, call_type, timestamp", // Removed agent_id, is_connected, disposition
      {
        orgId: targetOrgId,
        startDate: start,
        endDate: end,
        dateColumn: "timestamp"
      }
    );

    // 3. Aggregate counts and duration
    let totalDuration = 0;
   // const successDispositions = ['Sold', 'Converted', 'Success', 'Closed', 'Deal Done'];

    callLogs.forEach((log: any) => {
      const duration = Number(log.duration) || 0;
      // Filter out invalid logs if necessary?
      
      const employeeId = log.employee_id;
      const userId = employeeId ? employeeIdMap[employeeId] : null;

      if (userId && agentMap[userId]) {
        totalDuration += duration;
        const agent = agentMap[userId];
        agent.count++;
        agent.duration += duration;

        // Connected logic for call_history
        const type = (log.call_type || '').toLowerCase();
        const isConnected = (type.includes('outgoing') || type.includes('incoming')) && duration > 0;

        if (isConnected) agent.connected_count++;

        // Last active tracking with timestamp
        if (!agent.last_active || new Date(log.timestamp) > new Date(agent.last_active)) {
          agent.last_active = log.timestamp;
        }
      }
    });

    // 4. Fetch follow-ups count from customers
    const agentIds = Object.keys(agentMap);
    if (agentIds.length > 0) {
      const now = new Date().toISOString();
      const { data: followUps } = await dbClient
        .from('customers')
        .select('assigned_to')
        .in('assigned_to', agentIds)
        .gt('next_called_at', now);
      
      if (followUps) {
        followUps.forEach((f: any) => {
          if (agentMap[f.assigned_to]) {
            agentMap[f.assigned_to].follow_ups_count++;
          }
        });
      }
    }

    // 5. Fetch Real-time On-Call status from sync_meta
    const employeeIds = Object.values(agentMap)
      .map(a => a.employee_id)
      .filter((id): id is string => !!id);

    if (employeeIds.length > 0) {
      const { data: syncMeta } = await dbClient
        .from('sync_meta')
        .select('employee_id, on_call, is_personal')
        .in('employee_id', employeeIds);
      
      if (syncMeta) {
        syncMeta.forEach((meta: any) => {
          // Find the agents with this employee_id
          Object.values(agentMap).forEach(agent => {
            if (agent.employee_id === meta.employee_id) {
              agent.on_call = !!meta.on_call;
              agent.is_personal = !!meta.is_personal;
            }
          });
        });
      }
    }

    // 6. Fetch last_online from user_sessions
    const userIds = Object.keys(agentMap);
    if (userIds.length > 0) {
      // Fetch latest session for each user
      const { data: sessions } = await dbClient
        .from('user_sessions')
        .select('user_id, last_accessed_at')
        .in('user_id', userIds)
        .order('last_accessed_at', { ascending: false });

      if (sessions) {
        sessions.forEach((session: any) => {
          // Since it's ordered by last_accessed_at desc, the first one we see for a user is the latest
          if (agentMap[session.user_id] && !agentMap[session.user_id].last_online) {
            agentMap[session.user_id].last_online = session.last_accessed_at;
          }
        });
      }
    }

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
        totalDuration,
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
