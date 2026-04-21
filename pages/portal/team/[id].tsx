import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AppLayout, { useUser } from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { 
  PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { getISTDateRange } from "@/lib/dateUtils";
import MemberPerformanceTable from '@/components/shared/MemberPerformanceTable';

/**
 * TeamDetails Page Refactor
 * Goal: Improve performance, request safety, and data accuracy without UI/Behavior changes.
 */
export default function TeamDetails() {
  const router = useRouter();
  const { id } = router.query;
  const { user, mounted } = useUser();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // RAW Data States - Used as base for derived useMemo values
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [rawLogs, setRawLogs] = useState<any[]>([]);
  const [rawCustomers, setRawCustomers] = useState<any[]>([]);
  const [rawSyncMeta, setRawSyncMeta] = useState<any[]>([]);
  const [rawCallLogs, setRawCallLogs] = useState<any[]>([]);
  const [rawSessions, setRawSessions] = useState<any[]>([]);
  const [dateFilter, setDateFilter] = useState("today");

  // Recharts Constants
  const COLORS = ['#4b33e8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];
  
  // Abort Controllers for request safety
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Safe Date Range Generation (Standardized to IST)
   */
  const getDateRange = useCallback((filter: string) => {
    return getISTDateRange(filter);
  }, []);

  /**
   * Main Data Fetcher with granular error handling
   */
  const fetchTeamData = useCallback(async () => {
    if (!id || Array.isArray(id)) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log("Starting team data fetch for:", id);
      
      // 1. Fetch Team Details
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select(`
          id, 
          name, 
          is_active, 
          members, 
          leader_id, 
          organization:organizations(company_name), 
          leader:user_profiles!leader_id(user_name)
        `)
        .eq('id', id as string)
        .maybeSingle();
      
      if (teamError) {
        console.error("Team Query Error:", teamError);
        throw new Error(`Failed to fetch team details: ${teamError.message}`);
      }

      if (!teamData) {
        console.warn("No team found for ID:", id);
        setError("Team not found or access denied.");
        setLoading(false);
        return;
      }

      setTeam(teamData);

      const memberIds = Array.isArray(teamData.members) ? teamData.members : [];
      if (memberIds.length === 0) {
        setMembers([]);
        setRawLogs([]);
        setRawCustomers([]);
        setLoading(false);
        return;
      }

      // 2. Fetch Members (Profiles) First to get Employee IDs & Names
      const { data: membersData, error: membersError } = await supabase
        .from('user_profiles')
        .select('user_id, user_name, employee_id, profile_pic_url, status, last_online')
        .in('user_id', memberIds)
        .eq('status', 'active');

      if (membersError) throw new Error(`Members fetch failed: ${membersError.message}`);
      
      const validMembers = (membersData || []).sort((a: any, b: any) => 
        (a.user_name || '').localeCompare(b.user_name || '')
      );
      setMembers(validMembers);

      const employeeIds = validMembers.map(m => m.employee_id).filter(id => !!id);
      
      // 3. Fetch History (using employee IDs) & Customers (using user IDs)
      const { start, end } = getDateRange(dateFilter);
      
      const queries: any[] = [
         supabase.from('customers').select('assigned_to, next_called_at, created_at, customer_details, disposition').in('assigned_to', memberIds)
      ];

      // Only fetch history if we have employee IDs
      if (employeeIds.length > 0) {
          queries.push(
              supabase.from('call_history')
                .select('employee_id, duration, call_type, timestamp, device_id, number, name') // Added extra fields for potential future use or debugging
                .in('employee_id', employeeIds)
                .gte('timestamp', dateFilter !== 'all_time' ? start : '2000-01-01')
                .lte('timestamp', dateFilter !== 'all_time' ? end : '2099-01-01')
          );
      } else {
        queries.push(Promise.resolve({ data: [] })); // Empty history if no employee IDs
      }

      // Fetch Sync Meta
      if (employeeIds.length > 0) {
        queries.push(
            supabase.from('sync_meta')
            .select('employee_id, on_call, is_personal, last_seen')
            .in('employee_id', employeeIds)
        );
      } else {
        queries.push(Promise.resolve({ data: [] }));
      }

      // 4. Fetch Dial Logs (call_logs) for Ringing Duration
      if (memberIds.length > 0) {
        queries.push(
          supabase.from('call_logs')
            .select('agent_id, duration, is_connected, created_at')
            .in('agent_id', memberIds)
            .gte('created_at', dateFilter !== 'all_time' ? start : '2000-01-01')
            .lte('created_at', dateFilter !== 'all_time' ? end : '2099-01-01')
        );
      } else {
        queries.push(Promise.resolve({ data: [] }));
      }

      // Execute promises
      const results = await Promise.all(queries);
      const customersRes = results[0];
      const historyRes = results[1];
      const syncMetaRes = results[2];
      const callLogsRes = results[3];

      if (customersRes.error) throw new Error(`Customers fetch failed: ${customersRes.error.message}`);
      if (historyRes.error) throw new Error(`History fetch failed: ${historyRes.error.message}`);
      if (callLogsRes.error) throw new Error(`Call Logs fetch failed: ${callLogsRes.error.message}`);

      const historyData = historyRes.data || [];
      const uniqueEntries: any[] = [];
      const seenKeys = new Set<string>();

      historyData.forEach((item: any) => {
          const timeStr = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const dateStr = new Date(item.timestamp).toLocaleDateString();
          const key = `${item.number}-${item.employee_id}-${dateStr}-${timeStr}-${item.duration}`;
          
          if (!seenKeys.has(key)) {
              uniqueEntries.push(item);
              seenKeys.add(key);
          }
      });

      setRawLogs(uniqueEntries);
      setRawCustomers(customersRes.data || []);
      setRawSyncMeta(syncMetaRes?.data || []);
      setRawCallLogs(callLogsRes?.data || []);

      if (memberIds.length > 0) {
        const { data: sessionData } = await supabase
          .from('user_sessions')
          .select('user_id, last_accessed_at')
          .in('user_id', memberIds)
          .order('last_accessed_at', { ascending: false });
        
        // Group sessions to find the latest one per member
        const latestSessions: any[] = [];
        const seenUsers = new Set();
        (sessionData || []).forEach(s => {
          if (!seenUsers.has(s.user_id)) {
            latestSessions.push(s);
            seenUsers.add(s.user_id);
          }
        });
        setRawSessions(latestSessions);
      }

    } catch (err: any) {
      console.error("Fatal Error in fetchTeamData:", err);
      setError(err.message || "Failed to load team analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id, dateFilter, getDateRange]);

  // Request cancellation on unmount/re-fetch
  useEffect(() => {
    if (router.isReady && id && mounted && user) {
      console.log("Effect triggered: Fetching team data for", id);
      fetchTeamData();
    }
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [router.isReady, id, mounted, user, fetchTeamData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (router.isReady && id && mounted && user) {
      interval = setInterval(() => {
        fetchTeamData();
      }, 30000); // 30 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [router.isReady, id, mounted, user, fetchTeamData]);

  // Helper to handle Supabase joins that might return arrays
  const getSingle = (val: any) => Array.isArray(val) ? val[0] : val;

  /**
   * Derived Computations (Memoized)
   * Eliminates O(N*M) filtering inside the render loop
   */
  const processedData = useMemo(() => {
    const emptyStats: Record<string, any> = {};
    if (!members.length) return {
      memberStats: emptyStats,
      summary: { totalCalls: 0, deals: 0, revenue: 0, avgConnectRate: 0 },
      charts: { outcome: [], hourly: [], dailyTrend: [], disposition: [] },
      topAgents: []
    };

    try {
      const now = new Date();
      const stats: Record<string, any> = {};
      
      // 1. Build Lookup Maps for efficiency
      const logsByAgent: Record<string, any[]> = {};
      const customersByAgent: Record<string, any[]> = {};
      const employeeIdToUserId: Record<string, string> = {};

      members.forEach(m => {
        logsByAgent[m.user_id] = [];
        customersByAgent[m.user_id] = [];
        if (m.employee_id) employeeIdToUserId[m.employee_id] = m.user_id;
      });

      // Distribute logs (history) to agents via employeeID -> userID mapping
      rawLogs.forEach(l => {
          // l is now from call_history: { employee_id, ... }
          if (l.employee_id && employeeIdToUserId[l.employee_id]) {
              const uId = employeeIdToUserId[l.employee_id];
              logsByAgent[uId].push(l);
          }
      });

      rawCustomers.forEach(c => {
        if (customersByAgent[c.assigned_to]) customersByAgent[c.assigned_to].push(c);
      });

      let totalCallsAll = 0;
      let totalConnectedAll = 0;
      let totalDealsAll = 0;
      let totalRevenueSum = 0;

      // 2. Process Member Stats
      members.forEach((member) => {
        const mId = member.user_id;
        const userLogs = logsByAgent[mId] || []; // These are call_history items
        const userCustomers = customersByAgent[mId] || [];
        
        const totalCalls = userLogs.length;
        
        // Connected logic for call_history
        const connectedCount = userLogs.filter(l => {
            const type = (l.call_type || '').toLowerCase();
            const duration = Number(l.duration) || 0;
            return (type.includes('outgoing') || type.includes('incoming')) && duration > 0;
        }).length;
        
        const totalDuration = userLogs.reduce((acc, l) => acc + (Number(l.duration) || 0), 0);
        const avgDurationSec = connectedCount ? Math.floor(totalDuration / connectedCount) : 0;
        
        // Deals are NOT available in call_history. We'll leave it as 0 for now.
        // If we want deals, we'd need to fetch legacy call_logs specifically for dispositions.
        const dealsCount = 0; 
        
        // Calculate revenue - Try to find premium in associated customer_details
        const revenue = userCustomers.reduce((acc, c) => {
          let pVal = 0;
          try {
            const details = typeof c.customer_details === 'string' ? JSON.parse(c.customer_details) : c.customer_details;
            if (details) {
              // Look for "Premium" or similar keys
              const premiumKey = Object.keys(details).find(k => k.toLowerCase().includes('premium'));
              if (premiumKey) pVal = Number(details[premiumKey]) || 0;
            }
          } catch(e) {}
          return acc + pVal;
        }, 0);
        
        const followUpsCount = userCustomers.filter(c => c.next_called_at && new Date(c.next_called_at) > now).length;
        
        let lastActive = null;
        let idleMins = -1;
        let idleTimeStr = "N/A";
        
        if (userLogs.length > 0) {
          // call_history uses 'timestamp'
          const recentLog = userLogs.reduce((prev, curr) => 
            new Date(curr.timestamp).getTime() > new Date(prev.timestamp).getTime() ? curr : prev
          );
          lastActive = recentLog.timestamp;
          
          const diffMs = now.getTime() - new Date(recentLog.timestamp).getTime();
          const diffSec = Math.floor(diffMs / 1000);
          
          if (diffSec < 60) {
            idleTimeStr = `${diffSec}s`;
          } else if (diffSec < 3600) {
            idleTimeStr = `${Math.floor(diffSec / 60)}m`;
          } else {
            const h = Math.floor(diffSec / 3600);
            const m = Math.floor((diffSec % 3600) / 60);
            idleTimeStr = `${h}h ${m}m`;
          }
          
          idleMins = Math.floor(diffSec / 60);
        }

        const syncData = rawSyncMeta.find(s => s.employee_id === member.employee_id);
        const isActuallyOnline = (lastActive && (now.getTime() - new Date(lastActive).getTime()) < 30000); // 30s threshold
        const sessionData = rawSessions.find(s => s.user_id === mId);

        // Streak/Gap Calculation (Consecutive Fails since last success)
        const sortedLogs = [...rawLogs].filter(l => l.employee_id === member.employee_id).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        const lastSuccessIdx = sortedLogs.map(l => l.duration > 0).lastIndexOf(true);
        const currentStreak = lastSuccessIdx === -1 ? sortedLogs : sortedLogs.slice(lastSuccessIdx + 1);
        
        let streakCount = 0;
        let avgGapStr = '0s';
        
        if (currentStreak.length > 0) {
          streakCount = currentStreak.length;
          let totalGap = 0;
          let gapCounts = 0;
          
          for (let i = 1; i < currentStreak.length; i++) {
            const gap = (new Date(currentStreak[i].timestamp).getTime() - new Date(currentStreak[i-1].timestamp).getTime()) / 1000;
            if (gap > 0) {
              totalGap += gap;
              gapCounts++;
            }
          }
          
          const avgGapSec = gapCounts > 0 ? Math.round(totalGap / gapCounts) : 0;
          const mins = Math.floor(avgGapSec / 60);
          const secs = avgGapSec % 60;
          avgGapStr = (mins > 0 ? `${mins}m ` : '') + `${secs}s`;
        }

        stats[mId] = {
          totalCalls,
          connected: connectedCount,
          connectedRate: totalCalls ? ((connectedCount / totalCalls) * 100).toFixed(1) : "0.0",
          avgDuration: `${Math.floor(avgDurationSec / 60)}m ${avgDurationSec % 60}s`,
          totalTalkTime: `${Math.floor(totalDuration / 3600)}h ${Math.floor((totalDuration % 3600) / 60)}m ${totalDuration % 60}s`,
          streakGap: `${streakCount}/${avgGapStr}`, 
          deals: dealsCount,
          followUps: followUpsCount,
          lastActive,
          lastOnline: member.last_online || syncData?.last_seen || sessionData?.last_accessed_at || null,
          idleTime: idleTimeStr,
          idleMins,
          onCall: !!syncData?.on_call,
          isPersonal: !!syncData?.is_personal,
          status: syncData?.on_call ? (syncData.is_personal ? 'Personal Call' : 'On Call') : (isActuallyOnline ? 'Online' : 'Idle'),
          utilization: ((((totalDuration / 60) * 1.67) + totalCalls) / 3).toFixed(1) + '%',
          utilizationRaw: (((totalDuration / 60) * 1.67) + totalCalls) / 3
        };

        totalCallsAll += totalCalls;
        totalConnectedAll += connectedCount;
        totalDealsAll += dealsCount;
        totalRevenueSum += revenue;
      });

      // 3. Chart Data Generation
      const outcomeCounts: Record<string, number> = {};
      rawLogs.forEach(l => {
        // Map call_type to Outcome Status
        // Incoming, Outgoing, Missed, Rejected
        const type = (l.call_type || 'Unknown').toLowerCase();
        let status = 'Unknown';
        if (type.includes('outgoing')) status = 'Outgoing';
        else if (type.includes('incoming')) status = 'Incoming';
        else if (type.includes('missed')) status = 'Missed';
        else if (type.includes('reject')) status = 'Rejected';
        
        outcomeCounts[status] = (outcomeCounts[status] || 0) + 1;
      });
      const outcomeData = Object.entries(outcomeCounts).map(([name, value]) => ({ name, value }));

      const hourLabels: string[] = [];
      for (let i = 8; i <= 20; i += 2) {
        hourLabels.push(`${i > 12 ? i - 12 : i}${i >= 12 ? 'pm' : 'am'} - ${i + 2 > 12 ? i + 2 - 12 : i + 2}${i + 2 >= 12 ? 'pm' : 'am'}`);
      }
      const hourlyMap = Object.fromEntries(hourLabels.map(l => [l, 0]));
      rawLogs.forEach(l => {
        const h = new Date(l.timestamp).getHours(); // Use timestamp
        for (let i = 8; i <= 20; i += 2) {
          if (h >= i && h < i + 2) {
            hourlyMap[hourLabels[(i - 8) / 2]]++;
            break;
          }
        }
      });
      const hourlyData = hourLabels.map(name => ({ name, count: hourlyMap[name] }));

      // Disposition Data (From customers, assumes customers have disposition) - this remains valid
      const dispCounts: Record<string, number> = {};
      rawCustomers.forEach(c => {
        const d = c.disposition || 'Fresh';
        dispCounts[d] = (dispCounts[d] || 0) + 1;
      });
      const dispositionData = Object.entries(dispCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      const dailyMap: Record<string, { ts: number, label: string, count: number }> = {};
      rawLogs.forEach(l => {
        const d = new Date(l.timestamp); // Use timestamp
        const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        const dayStartTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        
        if (!dailyMap[dateStr]) {
          dailyMap[dateStr] = { ts: dayStartTs, label: dateStr, count: 0 };
        }
        dailyMap[dateStr].count++;
      });
      const dailyTrendData = Object.values(dailyMap)
        .sort((a, b) => a.ts - b.ts)
        .map(item => ({ name: item.label, count: item.count }));

      const topAgents = members.map(m => ({
        name: m.user_name || 'Unknown',
        connected: stats[m.user_id]?.connected || 0,
        profilePic: m.profile_pic_url
      }))
      .sort((a, b) => b.connected - a.connected)
      .slice(0, 3);

      return {
        memberStats: stats,
        summary: {
          totalCalls: totalCallsAll,
          deals: totalDealsAll,
          revenue: totalRevenueSum,
          avgConnectRate: totalCallsAll ? ((totalConnectedAll / totalCallsAll) * 100).toFixed(1) : "0.0"
        },
        charts: {
          outcome: outcomeData,
          hourly: hourlyData,
          dailyTrend: dailyTrendData,
          disposition: dispositionData
        },
        topAgents
      };
    } catch (e) {
      console.error("Error in processedData calculation:", e);
      return {
        memberStats: emptyStats,
        summary: { totalCalls: 0, deals: 0, revenue: 0, avgConnectRate: 0 },
        charts: { outcome: [], hourly: [], dailyTrend: [], disposition: [] },
        topAgents: []
      };
    }
  }, [members, rawLogs, rawCustomers, rawSyncMeta, rawSessions]);

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "Never";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if ((loading && !team) || (loading && members.length === 0 && team)) {
    return (
      <>
        <div className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4b33e8] border-t-transparent"></div>
                <p className="text-sm font-medium text-gray-400">Loading team analytics...</p>
            </div>
        </div>
      </>
    );
  }

  if (error || !team) {
    return (
      <>
        <div className="flex h-[80vh] items-center justify-center">
            <div className="flex flex-col items-center gap-6 max-w-md text-center px-6">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-3xl">
                    <i className="fi fi-rr-exclamation"></i>
                </div>
                <div>
                   <h2 className="text-xl font-bold text-gray-800 mb-2">{error || "Team Not Found"}</h2>
                   <p className="text-gray-500 text-sm">
                      {error ? "There was a problem loading the data." : "The requested team could not be found or you don't have permission to view it."}
                   </p>
                </div>
                <button 
                  onClick={() => router.push('/team')}
                  className="px-6 py-2 bg-[#4b33e8] text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100"
                >
                  Back to Teams
                </button>
            </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{team?.name || 'Team Details'} • TFC Nexus</title>
      </Head>

      <div className="flex-1 flex flex-col w-full min-w-0 font-poppins">
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            
            {/* Breadcrumb & Header */}
            <div className="mb-6">
                <button 
                    onClick={() => router.push('/team')}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#4b33e8] mb-4 transition-colors"
                >
                    <i className="fi flex fi-rr-arrow-left"></i> Back to Teams
                </button>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="text-left">
                        <div className="flex items-center gap-3 mb-2">
                           <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {team?.name || 'Loading Team...'}
                           </h1>
                           <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${team?.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                             {team?.is_active ? 'Active' : 'Inactive'}
                           </span>
                        </div>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <i className="fi flex fi-rr-building"></i> {getSingle(team?.organization)?.company_name || 'No Organization'}
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>Leader: <span className="font-semibold text-gray-700">{getSingle(team?.leader)?.user_name || 'N/A'}</span></span>
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <select 
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 font-medium cursor-pointer"
                        >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="this_week">This Week</option>
                            <option value="this_month">This Month</option>
                            <option value="all_time">All Time</option>
                        </select>
                        <button className="bg-[#4b33e8] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:shadow-xl transition-all">
                            Download Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Team Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                   { label: 'Total Members', value: members.length, icon: 'fi-rr-users-alt', color: 'text-blue-600', bg: 'bg-blue-50' },
                   { label: 'Total Calls', value: processedData.summary.totalCalls, icon: 'fi-rr-phone-call', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                   { label: 'Deals Closed', value: processedData.summary.deals, icon: 'fi-rr-trophy', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                   { label: 'Revenue', value: `₹${processedData.summary.revenue.toLocaleString()}`, icon: 'fi-rr-dollar', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                   { label: 'Avg Connect Rate', value: `${processedData.summary.avgConnectRate}%`, icon: 'fi-rr-chart-histogram', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 text-left">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.bg} ${stat.color}`}>
                            <i className={`fi ${stat.icon}`}></i>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 1. Outcome Distribution */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col text-left">
                    <h3 className="text-gray-800 font-bold mb-4">Call Outcomes</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={processedData.charts.outcome}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {processedData.charts.outcome.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Hourly Activity */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:col-span-2 text-left">
                    <h3 className="text-gray-800 font-bold mb-4">Hourly Activity</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={processedData.charts.hourly}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="count" fill="#4b33e8" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Expanded Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 3. Daily Trend */}
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:col-span-2 text-left">
                    <h3 className="text-gray-800 font-bold mb-4">Daily Call Trend</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={processedData.charts.dailyTrend}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4b33e8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#4b33e8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="count" stroke="#4b33e8" fillOpacity={1} fill="url(#colorCalls)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Top Lead Dispositions */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col text-left">
                    <h3 className="text-gray-800 font-bold mb-4">Lead Status</h3>
                     <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={processedData.charts.disposition}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 40,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#4b5563'}} />
                                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Agents Row */}
            <div className="mb-8 text-left">
               <h3 className="text-gray-800 font-bold mb-4 text-lg">Top Performers</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {processedData.topAgents.map((agent, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
                          <div className={`absolute top-0 right-0 p-2 font-bold text-6xl text-gray-100 -z-0 pointer-events-none select-none`}>
                              #{i+1}
                          </div>
                          <div className="w-14 h-14 rounded-full border-2 border-[#4b33e8]/20 p-0.5 z-10 bg-white flex items-center justify-center overflow-hidden">
                              {agent.profilePic ? (
                                <img src={agent.profilePic} className="w-full h-full rounded-full object-cover" alt={agent.name} />
                              ) : (
                                <i className="fi flex fi-rr-user text-2xl text-gray-400"></i>
                              )}
                          </div>
                          <div className="z-10">
                              <p className="font-bold text-gray-800">{agent.name}</p>
                              <p className="text-sm text-gray-500">{agent.connected} Connected Calls</p>
                          </div>
                      </div>
                  ))}
                  {processedData.topAgents.length === 0 && <p className="text-gray-400 text-sm col-span-3">No data available for leaderboard.</p>}
               </div>
            </div>

            {/* Detailed Member Table (Shared Component) */}
            <div className="mb-8">
                <MemberPerformanceTable 
                    members={members}
                    memberStats={processedData.memberStats}
                    loading={loading}
                    onRefresh={fetchTeamData}
                />
            </div>

          </div>
      </div>
    </>
  );
}
