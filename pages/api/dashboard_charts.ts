import { NextApiRequest, NextApiResponse } from "next";
import { supabase, supabaseAdmin } from "../../lib/supabase";
import { getISTDateRange } from "../../lib/dateUtils";
import { DashboardLevel, getUserDashboardLevel } from "../../lib/dashboardUtils";
import crypto from "crypto";

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

interface CampaignUserBreakdown {
  userId?: string;
  employeeId?: string;
  userName: string;
  assignedLeads?: number;
  disposedLeads: number;
  dialedLeads: number;
  connectedLeads: number;
  connectedConversion?: string;
}

interface CampaignDataPoint {
  id?: string;
  name: string;
  total: number;
  success: number;
  todayConnected?: number;
  todayCustomers?: number;
  todayRejected?: number;
  todayDeals?: number;
  totalLeads?: number;
  userBreakdown?: CampaignUserBreakdown[];
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
  filters: { orgId?: string; startDate?: string; endDate?: string; dateColumn?: string; userId?: string | string[]; employeeId?: string | string[]; maxLimit?: number }
) {
  const BATCH_SIZE = 1000;
  let allData: any[] = [];
  let from = 0;
  let hasMore = true;
  const maxLimit = filters.maxLimit || 50000;

  while (hasMore) {
    let query = client.from(table).select(selectQuery).range(from, from + BATCH_SIZE - 1);

    const dateCol = filters.dateColumn || "created_at";

    if (filters.orgId && table !== 'call_history') {
      query = query.eq("organization_id", filters.orgId);
    }
    
    // Apply user filters
    if (filters.userId) {
      if (table === 'customers') {
        if (Array.isArray(filters.userId)) {
          query = query.in('assigned_to', filters.userId);
        } else {
          query = query.eq('assigned_to', filters.userId);
        }
      } else if (table === 'call_logs' || table === 'rejected_leads' || table === 'closed_deals') {
        if (Array.isArray(filters.userId)) {
          query = query.in('agent_id', filters.userId);
        } else {
          query = query.eq('agent_id', filters.userId);
        }
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

    if (data.length < BATCH_SIZE || allData.length >= maxLimit) {
      hasMore = false;
    } else {
      from += BATCH_SIZE;
    }
  }

  return allData;
}

// Comprehensive helper to calculate all requested campaign metrics:
// 1. Available Leads (customers table where campaign_id, exactly like customer page)
// 2. Fresh Leads (customers where attempt_count === 0 or null)
// 3. Disposed Leads (from activity page CRM activity table with campaign filter)
// 4. Dialed Leads (from mobile activity call_history mapped to customer/reject/closed phone numbers)
// 5. Connected Leads (dialed leads with talk time duration > 0s)
// 6. Connected Conversion (connected leads / dialed leads * 100)
// 7. Campaign Utilization (specific campaign dials vs all campaigns dials)
async function enrichCampaignsWithDetails(
  dbClient: any,
  campaigns: any[],
  targetOrgId?: string,
  options?: {
    startDate?: string;
    endDate?: string;
    filterUserId?: string;
    filterEmployeeId?: string;
    restrictedUserIds?: string[];
    restrictedEmployeeIds?: string[];
  }
): Promise<CampaignDataPoint[]> {
  try {
    const todayIST = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    const defaultStartOfDay = new Date(`${todayIST}T00:00:00+05:30`).toISOString();
    const defaultEndOfDay = new Date(`${todayIST}T23:59:59+05:30`).toISOString();

    // Use passed date range if provided, otherwise fallback to todayIST
    const startRange = options?.startDate || defaultStartOfDay;
    const endRange = options?.endDate || defaultEndOfDay;

    const effectiveUserFilter = options?.filterUserId || options?.restrictedUserIds;
    const effectiveEmpFilter = options?.filterEmployeeId || options?.restrictedEmployeeIds;

    const campIds = campaigns.map((c: any) => c.id).filter(Boolean);
    if (campIds.length === 0) return [];

    const nameToId: Record<string, string> = {};
    campaigns.forEach((c: any) => {
      nameToId[c.name] = c.id;
    });

    const counts: Record<string, {
      totalLeads: number;
      freshLeads: number;
      allConversions: number;
      todayCalls: number;
      todayConnectedCalls: number;
      todayRejected: number;
      todayDeals: number;
      dialedLeads: number;
      connectedLeads: number;
      users: Record<string, {
        userId?: string;
        employeeId?: string;
        userName?: string;
        disposedLeads: number;
        dialedLeads: number;
        connectedLeads: number;
        assignedLeads: number;
      }>;
    }> = {};

    campIds.forEach(id => {
      counts[id] = {
        totalLeads: 0,
        freshLeads: 0,
        allConversions: 0,
        todayCalls: 0,
        todayConnectedCalls: 0,
        todayRejected: 0,
        todayDeals: 0,
        dialedLeads: 0,
        connectedLeads: 0,
        users: {},
      };
    });

    // Hash and phone mapping dictionaries to map call_history to campaign_id
    const phoneToCamp: Record<string, string> = {};
    const hashToCamp: Record<string, string> = {};

    // 1. Fetch exact total available leads, fresh leads, and assigned_to breakdown per campaign
    await Promise.all(
      campIds.map(async (cid) => {
        try {
          // Exact Available Leads (customers table where campaign_id)
          let custQuery = dbClient
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', cid);

          if (effectiveUserFilter) {
            if (Array.isArray(effectiveUserFilter)) {
              custQuery = custQuery.in('assigned_to', effectiveUserFilter);
            } else {
              custQuery = custQuery.eq('assigned_to', effectiveUserFilter);
            }
          }

          const { count: totalCount } = await custQuery;

          if (typeof totalCount === 'number') {
            counts[cid].totalLeads = totalCount;
          }

          // Exact Fresh Leads (attempt_count === 0 or null)
          let freshQuery = dbClient
            .from('customers')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', cid)
            .or('attempt_count.eq.0,attempt_count.is.null');

          if (effectiveUserFilter) {
            if (Array.isArray(effectiveUserFilter)) {
              freshQuery = freshQuery.in('assigned_to', effectiveUserFilter);
            } else {
              freshQuery = freshQuery.eq('assigned_to', effectiveUserFilter);
            }
          }

          const { count: freshCount } = await freshQuery;

          if (typeof freshCount === 'number') {
            counts[cid].freshLeads = freshCount;
          }

          // All-time closed deals
          let dealsQuery = dbClient
            .from('closed_deals')
            .select('*', { count: 'exact', head: true })
            .eq('campaign_id', cid);

          if (effectiveUserFilter) {
            if (Array.isArray(effectiveUserFilter)) {
              dealsQuery = dealsQuery.in('agent_id', effectiveUserFilter);
            } else {
              dealsQuery = dealsQuery.eq('agent_id', effectiveUserFilter);
            }
          }

          const { count: dealsCount } = await dealsQuery;

          if (typeof dealsCount === 'number') {
            counts[cid].allConversions = dealsCount;
          }
        } catch (e) {
          console.error(`Error fetching exact counts for campaign ${cid}:`, e);
        }
      })
    );

    // Fetch customers for these specific campaigns to compute assigned leads per user
    try {
      let custAssignedQuery = dbClient
        .from('customers')
        .select('campaign_id, assigned_to')
        .in('campaign_id', campIds);

      if (effectiveUserFilter) {
        if (Array.isArray(effectiveUserFilter)) {
          custAssignedQuery = custAssignedQuery.in('assigned_to', effectiveUserFilter);
        } else {
          custAssignedQuery = custAssignedQuery.eq('assigned_to', effectiveUserFilter);
        }
      }

      const { data: assignedCusts } = await custAssignedQuery.limit(20000);
      (assignedCusts || []).forEach((c: any) => {
        if (c.campaign_id && counts[c.campaign_id] && c.assigned_to) {
          const uKey = `uid_${c.assigned_to}`;
          if (!counts[c.campaign_id].users[uKey]) {
            counts[c.campaign_id].users[uKey] = {
              userId: c.assigned_to,
              disposedLeads: 0,
              dialedLeads: 0,
              connectedLeads: 0,
              assignedLeads: 0,
            };
          }
          counts[c.campaign_id].users[uKey].assignedLeads++;
        }
      });
    } catch (e) {
      console.error("Error fetching assigned leads per user:", e);
    }

    // 2. Fetch call_logs (for CRM activity & disposed count) including agent_id
    const callLogs = await fetchAllRows(
      dbClient,
      'call_logs',
      'customer_id, campaign_id, agent_id, is_connected, duration, created_at',
      {
        startDate: startRange,
        endDate: endRange,
        dateColumn: 'created_at',
        userId: effectiveUserFilter,
      }
    );

    // 3. Fetch rejected leads (for CRM activity & disposed count) including agent_id
    const rejData = await fetchAllRows(
      dbClient,
      'rejected_leads',
      'id, customer_id, campaign_id, agent_id, phone_no, phone_search_hash, rejected_at',
      {
        startDate: startRange,
        endDate: endRange,
        dateColumn: 'rejected_at',
        userId: effectiveUserFilter,
      }
    );

    // 4. Fetch closed deals (for CRM activity & disposed count) including agent_id
    const dealsData = await fetchAllRows(
      dbClient,
      'closed_deals',
      'id, customer_id, campaign_id, agent_id, phone_no, phone_search_hash, closed_at',
      {
        startDate: startRange,
        endDate: endRange,
        dateColumn: 'closed_at',
        userId: effectiveUserFilter,
      }
    );

    const campIdSet = new Set(campIds);
    const validCallLogs = (callLogs || []).filter((l: any) => campIdSet.has(l.campaign_id));
    const todayRejectedLeads = (rejData || []).filter((r: any) => campIdSet.has(r.campaign_id));
    const todayClosedDeals = (dealsData || []).filter((c: any) => campIdSet.has(c.campaign_id));

    // Deduplicate within 5 seconds window (matching useActivityData CRM activity logic)
    const deduplicatedRejected = todayRejectedLeads.filter(
      (r: any) => !validCallLogs.some((l: any) => l.customer_id && l.customer_id === r.customer_id && Math.abs(new Date(l.created_at).getTime() - new Date(r.rejected_at).getTime()) < 5000)
    );
    const deduplicatedClosed = todayClosedDeals.filter(
      (c: any) => !validCallLogs.some((l: any) => l.customer_id && l.customer_id === c.customer_id && Math.abs(new Date(l.created_at).getTime() - new Date(c.closed_at).getTime()) < 5000)
    );

    // Aggregate CRM call logs
    validCallLogs.forEach((l: any) => {
      if (l.campaign_id && counts[l.campaign_id]) {
        counts[l.campaign_id].todayCalls++;
        const isConn = l.is_connected === 'contactable' || l.is_connected === 'connected' || (l.duration && l.duration > 0);
        if (isConn) {
          counts[l.campaign_id].todayConnectedCalls++;
        }
        if (l.agent_id) {
          const uKey = `uid_${l.agent_id}`;
          if (!counts[l.campaign_id].users[uKey]) {
            counts[l.campaign_id].users[uKey] = {
              userId: l.agent_id,
              disposedLeads: 0,
              dialedLeads: 0,
              connectedLeads: 0,
              assignedLeads: 0,
            };
          }
          counts[l.campaign_id].users[uKey].disposedLeads++;
        }
      }
    });

    // Aggregate rejected
    deduplicatedRejected.forEach((r: any) => {
      if (r.campaign_id && counts[r.campaign_id]) {
        counts[r.campaign_id].todayRejected++;
        if (r.agent_id) {
          const uKey = `uid_${r.agent_id}`;
          if (!counts[r.campaign_id].users[uKey]) {
            counts[r.campaign_id].users[uKey] = {
              userId: r.agent_id,
              disposedLeads: 0,
              dialedLeads: 0,
              connectedLeads: 0,
              assignedLeads: 0,
            };
          }
          counts[r.campaign_id].users[uKey].disposedLeads++;
        }
      }
    });

    // Aggregate closed
    deduplicatedClosed.forEach((c: any) => {
      if (c.campaign_id && counts[c.campaign_id]) {
        counts[c.campaign_id].todayDeals++;
        if (c.agent_id) {
          const uKey = `uid_${c.agent_id}`;
          if (!counts[c.campaign_id].users[uKey]) {
            counts[c.campaign_id].users[uKey] = {
              userId: c.agent_id,
              disposedLeads: 0,
              dialedLeads: 0,
              connectedLeads: 0,
              assignedLeads: 0,
            };
          }
          counts[c.campaign_id].users[uKey].disposedLeads++;
        }
      }
    });

    // 5. Fetch mobile activity (call_history) for date range including employee_id
    let totalAllCampaignDials = 0;
    try {
      const mobileHistory = await fetchAllRows(
        dbClient,
        'call_history',
        'number, duration, timestamp, employee_id',
        {
          startDate: startRange,
          endDate: endRange,
          dateColumn: 'timestamp',
          employeeId: effectiveEmpFilter,
        }
      );

      // Collect distinct phone digits from mobile history dialed today
      const rawMobileList = mobileHistory || [];
      const distinctDigits = Array.from(new Set(
        rawMobileList
          .map((m: any) => String(m.number || '').replace(/\D/g, '').slice(-10))
          .filter((d: string) => d.length >= 7)
      ));

      // Hash each dialed number to find customer matches
      const dialedHashes = distinctDigits.map((d: string) =>
        crypto.createHash('sha256').update(d).digest('hex')
      );

      const phoneToCamp: Record<string, string> = {};
      const hashToCamp: Record<string, string> = {};

      if (dialedHashes.length > 0) {
        // Chunk hashes into groups of 200 to prevent Supabase query limits
        const chunkSize = 200;
        for (let i = 0; i < dialedHashes.length; i += chunkSize) {
          const hashChunk = dialedHashes.slice(i, i + chunkSize);

          // Query matching customers for dialed hashes
          const { data: matchedCusts } = await dbClient
            .from('customers')
            .select('campaign_id, phone_search_hash, phone_no')
            .in('phone_search_hash', hashChunk);

          (matchedCusts || []).forEach((c: any) => {
            if (c.campaign_id) {
              if (c.phone_search_hash) hashToCamp[c.phone_search_hash] = c.campaign_id;
              if (c.phone_no) {
                const d = String(c.phone_no).replace(/\D/g, '').slice(-10);
                if (d) phoneToCamp[d] = c.campaign_id;
              }
            }
          });

          // Query matching rejected leads
          const { data: matchedRej } = await dbClient
            .from('rejected_leads')
            .select('campaign_id, phone_search_hash, phone_no')
            .in('phone_search_hash', hashChunk);

          (matchedRej || []).forEach((r: any) => {
            if (r.campaign_id) {
              if (r.phone_search_hash) hashToCamp[r.phone_search_hash] = r.campaign_id;
              if (r.phone_no) {
                const d = String(r.phone_no).replace(/\D/g, '').slice(-10);
                if (d) phoneToCamp[d] = r.campaign_id;
              }
            }
          });

          // Query matching closed deals
          const { data: matchedDeals } = await dbClient
            .from('closed_deals')
            .select('campaign_id, phone_search_hash, phone_no')
            .in('phone_search_hash', hashChunk);

          (matchedDeals || []).forEach((deal: any) => {
            if (deal.campaign_id) {
              if (deal.phone_search_hash) hashToCamp[deal.phone_search_hash] = deal.campaign_id;
              if (deal.phone_no) {
                const d = String(deal.phone_no).replace(/\D/g, '').slice(-10);
                if (d) phoneToCamp[d] = deal.campaign_id;
              }
            }
          });
        }
      }

      // Map each call from mobile call_history to campaign and employee
      rawMobileList.forEach((m: any) => {
        const rawNum = String(m.number || '');
        const clean10 = rawNum.replace(/\D/g, '').slice(-10);
        let cid = clean10 ? phoneToCamp[clean10] : null;

        if (!cid && rawNum) {
          const h = crypto.createHash('sha256').update(clean10 || rawNum.replace(/\D/g, '')).digest('hex');
          cid = hashToCamp[h];
        }

        if (cid && counts[cid]) {
          counts[cid].dialedLeads++;
          totalAllCampaignDials++;
          const isConn = (m.duration || 0) > 0;
          if (isConn) {
            counts[cid].connectedLeads++;
          }

          if (m.employee_id) {
            const empKey = `emp_${m.employee_id}`;
            if (!counts[cid].users[empKey]) {
              counts[cid].users[empKey] = {
                employeeId: m.employee_id,
                disposedLeads: 0,
                dialedLeads: 0,
                connectedLeads: 0,
                assignedLeads: 0,
              };
            }
            counts[cid].users[empKey].dialedLeads++;
            if (isConn) {
              counts[cid].users[empKey].connectedLeads++;
            }
          }
        }
      });
    } catch (e) {
      console.error("Error mapping mobile call_history:", e);
    }

    // 6. Fetch user profiles to unify userId & employeeId, and attach user_name
    const allReferencedUserIds = new Set<string>();
    const allReferencedEmpIds = new Set<string>();

    campIds.forEach(cid => {
      Object.values(counts[cid].users).forEach(u => {
        if (u.userId) allReferencedUserIds.add(u.userId);
        if (u.employeeId) allReferencedEmpIds.add(u.employeeId);
      });
    });

    let profilesList: any[] = [];
    try {
      let profQuery = dbClient
        .from('user_profiles')
        .select('user_id, employee_id, user_name');

      if (targetOrgId && targetOrgId !== 'all') {
        profQuery = profQuery.eq('organization_id', targetOrgId);
      }

      const { data: profs } = await profQuery;
      profilesList = profs || [];
    } catch (e) {
      console.error("Error fetching user_profiles for campaign breakdown:", e);
    }

    const userProfileById: Record<string, any> = {};
    const userProfileByEmp: Record<string, any> = {};
    profilesList.forEach(p => {
      if (p.user_id) userProfileById[p.user_id] = p;
      if (p.employee_id) userProfileByEmp[p.employee_id] = p;
    });

    // Map into final enriched format
    return campaigns.map((c: any) => {
      const cid = c.id || nameToId[c.name];
      const s = (cid && counts[cid]) ? counts[cid] : {
        totalLeads: 0,
        freshLeads: 0,
        allConversions: 0,
        todayCalls: 0,
        todayConnectedCalls: 0,
        todayRejected: 0,
        todayDeals: 0,
        dialedLeads: 0,
        connectedLeads: 0,
        users: {},
      };

      // Disposed leads = today's CRM Activity count (all call_logs dispositions + rejected + closed)
      const disposedLeads = s.todayCalls + s.todayRejected + s.todayDeals;
      const todayConnected = s.todayConnectedCalls;

      const dialed = s.dialedLeads;
      const connected = s.connectedLeads;

      const connectedConversion = dialed > 0 ? `${((connected / dialed) * 100).toFixed(1)}%` : "0.0%";
      const utilizationRate = totalAllCampaignDials > 0 ? `${((dialed / totalAllCampaignDials) * 100).toFixed(1)}%` : "0.0%";

      // Merge user metrics by unique user profile
      const unifiedUserMap: Record<string, CampaignUserBreakdown> = {};

      Object.values(s.users || {}).forEach(u => {
        let profile = (u.userId ? userProfileById[u.userId] : null) || 
                      (u.employeeId ? userProfileByEmp[u.employeeId] : null);

        const finalUserId = profile?.user_id || u.userId || u.employeeId || 'unknown';
        const finalEmpId = profile?.employee_id || u.employeeId || '';
        const finalName = profile?.user_name || finalEmpId || finalUserId || 'Agent';

        if (!unifiedUserMap[finalUserId]) {
          unifiedUserMap[finalUserId] = {
            userId: finalUserId,
            employeeId: finalEmpId,
            userName: finalName,
            assignedLeads: 0,
            disposedLeads: 0,
            dialedLeads: 0,
            connectedLeads: 0,
          };
        }

        unifiedUserMap[finalUserId].assignedLeads = (unifiedUserMap[finalUserId].assignedLeads || 0) + (u.assignedLeads || 0);
        unifiedUserMap[finalUserId].disposedLeads += (u.disposedLeads || 0);
        unifiedUserMap[finalUserId].dialedLeads += (u.dialedLeads || 0);
        unifiedUserMap[finalUserId].connectedLeads += (u.connectedLeads || 0);
      });

      const userBreakdown: CampaignUserBreakdown[] = Object.values(unifiedUserMap)
        .map(u => {
          const conv = u.dialedLeads > 0 ? `${((u.connectedLeads / u.dialedLeads) * 100).toFixed(1)}%` : "0.0%";
          return {
            ...u,
            connectedConversion: conv,
          };
        })
        .sort((a, b) => {
          if (b.disposedLeads !== a.disposedLeads) return b.disposedLeads - a.disposedLeads;
          if (b.dialedLeads !== a.dialedLeads) return b.dialedLeads - a.dialedLeads;
          return (b.assignedLeads || 0) - (a.assignedLeads || 0);
        });

      return {
        id: cid || c.id,
        name: c.name || 'Campaign',
        total: s.totalLeads, // 1. Available Leads (customers table where campaign_id)
        freshLeads: s.freshLeads, // 2. Fresh Leads (attempt_count = 0)
        disposedLeads, // 3. Disposed Leads (CRM activity today)
        dialedLeads: dialed, // 4. Dialed Leads (mobile activity table call_history mapped to campaign)
        connectedLeads: connected, // 5. Connected Leads (dialed with duration > 0)
        connectedConversion, // 6. Connected Conversion (connected / dialed * 100)
        utilizationRate, // 7. Campaign Utilization compared to others (campaign dials / all dials * 100)
        success: s.allConversions, // Real all-time conversions
        todayConnected,
        todayCalls: s.todayCalls,
        todayConnectedCalls: s.todayConnectedCalls,
        todayCustomers: s.todayConnectedCalls,
        todayRejected: s.todayRejected,
        todayDeals: s.todayDeals,
        userBreakdown,
      };
    }).sort((a: any, b: any) => {
      if ((b.dialedLeads || 0) !== (a.dialedLeads || 0)) {
        return (b.dialedLeads || 0) - (a.dialedLeads || 0);
      }
      if ((b.todayConnected || 0) !== (a.todayConnected || 0)) {
        return (b.todayConnected || 0) - (a.todayConnected || 0);
      }
      return (b.total || 0) - (a.total || 0);
    });
  } catch (err) {
    console.error("Error in enrichCampaignsWithDetails:", err);
    return campaigns;
  }
}

// Augment campaigns from RPC
async function augmentWithTodayConnects(
  dbClient: any,
  campaigns: CampaignDataPoint[],
  targetOrgId?: string,
  options?: {
    startDate?: string;
    endDate?: string;
    filterUserId?: string;
    filterEmployeeId?: string;
    restrictedUserIds?: string[];
    restrictedEmployeeIds?: string[];
  }
): Promise<CampaignDataPoint[]> {
  const campNames = campaigns.map(c => c.name);
  const { data: cList } = await dbClient
    .from('campaigns')
    .select('id, name')
    .in('name', campNames);

  if (!cList || cList.length === 0) return campaigns;
  return enrichCampaignsWithDetails(dbClient, cList, targetOrgId, options);
}

// Fallback helper to fetch campaigns
async function fetchMostUsedCampaigns(
  dbClient: any,
  targetOrgId?: string,
  options?: {
    startDate?: string;
    endDate?: string;
    filterUserId?: string;
    filterEmployeeId?: string;
    restrictedUserIds?: string[];
    restrictedEmployeeIds?: string[];
  }
): Promise<CampaignDataPoint[]> {
  let campQuery = dbClient
    .from('campaigns')
    .select('id, name, status, organization_id')
    .order('created_at', { ascending: false });

  if (targetOrgId && targetOrgId !== 'all') {
    campQuery = campQuery.eq('organization_id', targetOrgId);
  }

  // TL filter: only show campaigns where any team member is assigned
  // Mirrors the exact same JSONB OR filter used in the campaigns page for team leaders
  if (options?.restrictedUserIds && options.restrictedUserIds.length > 0) {
    const orFilter = options.restrictedUserIds
      .map(id => `users.cs.[{"user_id":"${id}"}]`)
      .join(',');
    campQuery = campQuery.or(orFilter);
  }

  const { data: campaigns, error: campErr } = await campQuery.limit(35);
  if (campErr || !campaigns || campaigns.length === 0) return [];

  return enrichCampaignsWithDetails(dbClient, campaigns, targetOrgId, options);
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
      const effectiveFilter = (!dateFilter || dateFilter === "all_time") ? "today" : (dateFilter as string);
      const range = getISTDateRange(effectiveFilter);
      start = range.start;
      end = range.end;
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

    // --- DIRECT AGGREGATION STRATEGY (Bypassing RPC timeout) ---
    try {
      const logs = await fetchAllRows(dbClient, "call_history", "timestamp, duration, call_type, employee_id", {
        orgId: targetOrgId,
        startDate: start,
        endDate: end,
        dateColumn: "timestamp",
        employeeId: filterEmployeeId || restrictedEmployeeIds,
        maxLimit: 15000,
      });

      console.log(`[Dashboard Charts] Directly aggregated ${logs.length} call records for range: ${start} to ${end}`);

        // 1. Process Chart Data (Trend) — from call_logs (CRM activity, same as Activity tab)
        const crmLogsForTrend = await fetchAllRows(dbClient, "call_logs", "created_at, duration, agent_id", {
          orgId: targetOrgId,
          startDate: start,
          endDate: end,
          dateColumn: "created_at",
          userId: filterUserId && filterUserId !== 'all' ? filterUserId as string : restrictedUserIds,
          maxLimit: 15000,
        });

        const trendMap: Record<string, ChartPoint> = {};
        crmLogsForTrend.forEach((log: any) => {
          const date = new Date(log.created_at).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
          if (!trendMap[date]) trendMap[date] = { name: date, dials: 0, connected: 0 };
          trendMap[date].dials++;
          if ((log.duration || 0) > 0) trendMap[date].connected++;
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
          userId: filterUserId || restrictedUserIds,
          maxLimit: 10000,
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

        const fallbackCampaignFilterOptions = {
          startDate: start,
          endDate: end,
          filterUserId: (filterUserId && filterUserId !== 'all') ? (filterUserId as string) : undefined,
          filterEmployeeId,
          restrictedUserIds,
          restrictedEmployeeIds,
        };

        const resolvedCampaigns = await fetchMostUsedCampaigns(dbClient, targetOrgId, fallbackCampaignFilterOptions);

        return res.status(200).json({
          success: true,
          data: {
            chartData,
            pieData,
            campaignData: resolvedCampaigns,
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
  } catch (error: any) {
    console.error("Fatal Dashboard charts API error:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
}
