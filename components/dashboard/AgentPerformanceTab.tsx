import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";
import { useAgentPerformance } from "../../hooks/useAgentPerformance";
import MemberPerformanceTable from '@/components/shared/MemberPerformanceTable';
import { supabase } from "../../lib/supabase";
import { getISTDateRange } from "../../lib/dateUtils";

interface AgentPerformanceTabProps {
  agentData?: any[];
  totalDials?: number;
  selectedOrgId?: string;
  selectedUserId?: string;
  dateFilter?: string;
  loading?: boolean;
  restrictedUserIds?: string[] | null;
  onTotalsChange?: (totals: { totalDials: number; totalDuration: number }) => void;
}

interface AgentPerformanceRecord {
  user_id_val: string;
  employee_id_val: string;
  agent_name: string;
  total_dials: number;
  connected_calls: number;
  duration_raw: number;
  follow_ups: number;
  last_call_at: string | null;
  streak_gap: string;
  avg_talk: string;
  profile_pic_url: string | null;
}

export default function AgentPerformanceTab({
  selectedOrgId,
  selectedUserId,
  dateFilter: propDateFilter = "today",
  loading = false,
  restrictedUserIds = null,
  onTotalsChange,
}: AgentPerformanceTabProps) {
  const router = useRouter();
  
  const todayStr = new Date().toLocaleDateString('en-CA'); 
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [isFiltered, setIsFiltered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [metric, setMetric] = useState<'dials' | 'talktime'>('dials');
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const dateFilter = propDateFilter;

  // Real-time status states
  const [rawSyncMeta, setRawSyncMeta] = useState<any[]>([]);
  const [rawSessions, setRawSessions] = useState<any[]>([]);
  const [rawProfiles, setRawProfiles] = useState<any[]>([]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const { 
    agentData: hookAgentData, 
    fetchAgentPerformance, 
    loading: hookLoading
  } = useAgentPerformance();

  const [rpcData, setRpcData] = useState<AgentPerformanceRecord[]>([]);
  const [rpcLoading, setRpcLoading] = useState(false);

  const fetchRpcPerformance = async (start: string, end: string) => {
    try {
      setRpcLoading(true);
      
      let agentQuery = supabase.from('user_profiles').select('user_id, user_name, employee_id, organization_id, profile_pic_url');
      if (selectedOrgId && selectedOrgId !== "all") agentQuery = agentQuery.eq('organization_id', selectedOrgId);
      if (restrictedUserIds && restrictedUserIds.length > 0) agentQuery = agentQuery.in('user_id', restrictedUserIds);
      else if (selectedUserId && selectedUserId !== "all") agentQuery = agentQuery.eq('user_id', selectedUserId);

      const { data: agents, error: agentError } = await agentQuery.eq('status', 'active');
      if (agentError) throw agentError;
      if (!agents || agents.length === 0) { setRpcData([]); return; }

      const agentIds = agents.map(a => a.user_id);
      const employeeIds = agents.map(a => a.employee_id?.trim()).filter(Boolean) as string[];

      // BATCH FETCHING to avoid 50k limit truncation
      const BATCH_SIZE = 20;
      let allHistory: any[] = [];
      let allLogs: any[] = [];

      for (let i = 0; i < employeeIds.length; i += BATCH_SIZE) {
        const batchEmpIds = employeeIds.slice(i, i + BATCH_SIZE);
        const batchAgentIds = agentIds.slice(i, i + BATCH_SIZE);

        const [historyRes, logRes] = await Promise.all([
          supabase.from('call_history').select('employee_id, number, timestamp, duration, call_type')
            .in('employee_id', batchEmpIds)
            .gte('timestamp', start)
            .lte('timestamp', end)
            .limit(40000), // High limit per batch is safe
          supabase.from('call_logs').select('agent_id, is_connected, duration, disposition, created_at')
            .in('agent_id', batchAgentIds)
            .gte('created_at', start)
            .lte('created_at', end)
            .limit(20000)
        ]);

        if (historyRes.data) allHistory = [...allHistory, ...historyRes.data];
        if (logRes.data) allLogs = [...allLogs, ...logRes.data];
      }

      const historyData = allHistory;
      const logData = allLogs;

      // EXACT same deduplication logic as Team Page to ensure 1:1 parity
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

      // Map unique entries to agents using robust casing
      const logsByAgent: Record<string, any[]> = {};
      const employeeIdToUserId: Record<string, string> = {};
      agents.forEach(m => {
          logsByAgent[m.user_id] = [];
          if (m.employee_id) employeeIdToUserId[m.employee_id.toLowerCase().trim()] = m.user_id;
      });

      uniqueEntries.forEach(l => {
          const empId = l.employee_id?.toLowerCase().trim();
          if (empId && employeeIdToUserId[empId]) {
              const uId = employeeIdToUserId[empId];
              logsByAgent[uId].push(l);
          }
      });

      const processed = agents.map((a: any) => {
        const uId = a.user_id;
        const userLogs = logsByAgent[uId] || [];
        const agentPortalLogs = logData.filter((l: any) => l.agent_id === uId);
        
        const totalCalls = userLogs.length;
        const connectedCount = userLogs.filter(l => {
            const type = (l.call_type || '').toLowerCase();
            const duration = Number(l.duration) || 0;
            return (type.includes('outgoing') || type.includes('incoming')) && duration > 0;
        }).length;

        const totalDuration = userLogs.reduce((acc, l) => acc + (Number(l.duration) || 0), 0);
        const avgTalkSec = connectedCount ? Math.floor(totalDuration / connectedCount) : 0;

        let lastCallAt: string | null = null;
        if (userLogs.length > 0) {
            const sortedHistory = [...userLogs].sort((x, y) => new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime());
            lastCallAt = sortedHistory[0].timestamp;
        }

        // Streak/Gap Logic (Consecutive Fails since last success)
        const sortedUnique = [...userLogs].sort((x, y) => new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime());
        const lastSuccessIdx = sortedUnique.map(h => Number(h.duration) > 0).lastIndexOf(true);
        const currentStreak = lastSuccessIdx === -1 ? sortedUnique : sortedUnique.slice(lastSuccessIdx + 1);
        
        let streakCount = currentStreak.length;
        let avgGapStr = '0s';
        if (streakCount > 0) {
          let totalGap = 0;
          let gapCounts = 0;
          for (let i = 1; i < currentStreak.length; i++) {
            const gap = (new Date(currentStreak[i].timestamp).getTime() - new Date(currentStreak[i-1].timestamp).getTime()) / 1000;
            if (gap > 0) { totalGap += gap; gapCounts++; }
          }
          const avgGapSec = gapCounts > 0 ? Math.round(totalGap / gapCounts) : 0;
          const mins = Math.floor(avgGapSec / 60);
          const secs = avgGapSec % 60;
          avgGapStr = (mins > 0 ? `${mins}m ` : '') + `${secs}s`;
        }

        return {
          user_id_val: uId,
          employee_id_val: a.employee_id,
          agent_name: a.user_name,
          total_dials: totalCalls,
          connected_calls: connectedCount,
          duration_raw: totalDuration,
          follow_ups: agentPortalLogs.filter(l => l.disposition === 'Follow Up').length,
          last_call_at: lastCallAt,
          streak_gap: `${streakCount}/${avgGapStr}`,
          avg_talk: `${Math.floor(avgTalkSec / 60)}m ${avgTalkSec % 60}s`,
          profile_pic_url: a.profile_pic_url
        };
      });

      // Final Sort: Highest Dials first (Descending)
      const sortedProcessed = [...processed].sort((x, y) => {
        if (y.total_dials !== x.total_dials) return y.total_dials - x.total_dials;
        return y.duration_raw - x.duration_raw;
      });

      setRpcData(sortedProcessed);
      setLastUpdated(new Date());

      // Propagate totals to parent for dashboard tiles parity
      if (onTotalsChange) {
        const totalDials = sortedProcessed.reduce((acc, curr) => acc + (curr.total_dials || 0), 0);
        const totalDuration = sortedProcessed.reduce((acc, curr) => acc + (curr.duration_raw || 0), 0);
        onTotalsChange({ totalDials, totalDuration });
      }

    } catch (err) {
      console.error("[AgentPerformanceTab] Manual Fetch Error:", err);
    } finally {
      setRpcLoading(false);
    }
  };

  // Primary Data Fetch & Refresh Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isFiltered && startDate && endDate) {
      const start = new Date(startDate); start.setHours(0, 0, 0, 0);
      const end = new Date(endDate); end.setHours(23, 59, 59, 999);
      fetchRpcPerformance(start.toISOString(), end.toISOString());
    } else {
      const { start, end } = getISTDateRange(dateFilter);
      fetchRpcPerformance(start, end);
      interval = setInterval(() => {
        const { start: freshStart, end: freshEnd } = getISTDateRange(dateFilter);
        fetchRpcPerformance(freshStart, freshEnd);
      }, 30000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [selectedOrgId, dateFilter, selectedUserId, restrictedUserIds, isFiltered, startDate, endDate]);

  useEffect(() => { setIsFiltered(false); }, [dateFilter]);

  // Real-time Status Sync
  useEffect(() => {
    if (rpcData.length > 0) {
      const userIds = rpcData.map(i => i.user_id_val).filter(Boolean);
      const employeeIds = rpcData.map(i => i.employee_id_val).filter(Boolean);
      const fetchStatus = async () => {
        const [syncRes, sessionRes, profileRes] = await Promise.all([
          supabase.from('sync_meta').select('employee_id, on_call, is_personal, last_seen').in('employee_id', employeeIds),
          supabase.from('user_sessions').select('user_id, last_accessed_at').in('user_id', userIds).order('last_accessed_at', { ascending: false }),
          supabase.from('user_profiles').select('user_id, last_online').in('user_id', userIds)
        ]);
        if (syncRes.data) setRawSyncMeta(syncRes.data);
        if (profileRes.data) setRawProfiles(profileRes.data);
        if (sessionRes.data) {
          const latest: any[] = []; const seen = new Set();
          sessionRes.data.forEach(s => { if (!seen.has(s.user_id)) { latest.push(s); seen.add(s.user_id); } });
          setRawSessions(latest);
        }
      };
      fetchStatus();
    }
  }, [rpcData]);

  // Derived Mappings for Table & Charts
  const memberStatsMap = useMemo(() => {
    const map: Record<string, any> = {};
    const now = new Date();
    rpcData.forEach(item => {
      const uId = item.user_id_val;
      const empId = item.employee_id_val;
      const syncData = rawSyncMeta.find(s => s.employee_id === empId);
      const sessionData = rawSessions.find(s => s.user_id === uId);
      const profileData = rawProfiles.find(p => p.user_id === uId);
      
      // Robust Last Active: Max of (Call History, Portal Activity, Device Sync)
      const callLastActive = item.last_call_at ? new Date(item.last_call_at).getTime() : 0;
      const portalLastActive = profileData?.last_online ? new Date(profileData.last_online).getTime() : 0;
      const deviceLastActive = syncData?.last_seen ? new Date(syncData.last_seen).getTime() : 0;
      const sessionLastActive = sessionData?.last_accessed_at ? new Date(sessionData.last_accessed_at).getTime() : 0;
      
      const maxLastActiveTs = Math.max(callLastActive, portalLastActive, deviceLastActive, sessionLastActive);
      const lastActive = maxLastActiveTs > 0 ? new Date(maxLastActiveTs).toISOString() : null;

      const isActuallyOnline = (lastActive && (now.getTime() - new Date(lastActive).getTime()) < 60000); // 1m threshold
      
      let idleTimeStr = "N/A";
      if (lastActive) {
        const diffSec = Math.floor((now.getTime() - new Date(lastActive).getTime()) / 1000);
        if (diffSec < 60) idleTimeStr = `${diffSec}s`;
        else if (diffSec < 3600) idleTimeStr = `${Math.floor(diffSec / 60)}m`;
        else {
          const h = Math.floor(diffSec / 3600);
          const m = Math.floor((diffSec % 3600) / 60);
          idleTimeStr = `${h}h ${m}m`;
        }
      }

      const totalCalls = item.total_dials;
      const totalDurationSec = item.duration_raw;
      const utilRaw = (((totalDurationSec / 60) * 1.67) + totalCalls) / 3;

      map[uId] = {
        totalCalls,
        connected: item.connected_calls,
        connectedRate: totalCalls ? ((item.connected_calls / totalCalls) * 100).toFixed(1) : "0.0",
        avgDuration: item.avg_talk,
        totalTalkTime: formatDuration(item.duration_raw),
        streakGap: item.streak_gap,
        utilization: utilRaw.toFixed(1) + '%',
        utilizationRaw: utilRaw,
        lastActive,
        idleTime: idleTimeStr,
        status: syncData?.on_call ? (syncData.is_personal ? 'Personal Call' : 'On Call') : (isActuallyOnline ? 'Online' : 'Idle'),
        onCall: !!syncData?.on_call,
        isPersonal: !!syncData?.is_personal,
        lastOnline: profileData?.last_online || syncData?.last_seen || sessionData?.last_accessed_at || null
      };
    });
    return map;
  }, [rpcData, rawSyncMeta, rawSessions, rawProfiles]);

  const performanceMembers = useMemo(() => {
    return rpcData.map(item => ({
      user_id: item.user_id_val,
      user_name: item.agent_name,
      employee_id: item.employee_id_val,
      profile_pic_url: item.profile_pic_url
    }));
  }, [rpcData]);

  const displayData = useMemo(() => {
    return rpcData.map(item => ({
      id: item.user_id_val,
      name: item.agent_name,
      count: item.total_dials,
      duration: item.duration_raw,
    }));
  }, [rpcData]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = loading || hookLoading || rpcLoading;
  const totalDialsAll = displayData.reduce((acc, curr) => acc + (curr.count || 0), 0);

  const handleDownloadExcel = () => {
    if (rpcData.length === 0) return;
    const BOM = "\uFEFF";
    const headers = ["Agent Name", "Employee ID", "Total Dials", "Connected", "Talk Time", "Follow Ups", "Utilization", "Last Active"];
    const rows = rpcData.map(a => {
        const stats = memberStatsMap[a.user_id_val] || {};
        return [a.agent_name, a.employee_id_val, a.total_dials, a.connected_calls, a.avg_talk, a.follow_ups, stats.utilization || '0%', a.last_call_at ? new Date(a.last_call_at).toLocaleString() : 'Never'];
    });
    const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Performance_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1 sm:flex-none">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-bold text-gray-500 cursor-pointer focus:outline-none focus:border-[#4b33e8]" />
          <span className="text-gray-400 font-bold">-</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-bold text-gray-500 cursor-pointer focus:outline-none focus:border-[#4b33e8]" />
        </div>
        <button onClick={() => setIsFiltered(true)} disabled={isLoading} className="px-5 py-2.5 bg-[#4b33e8] hover:bg-[#3b25b8] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2">
          <i className="fi fi-rr-filter flex text-xs"></i><span>Apply Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-[24px] p-8 flex flex-col relative h-[550px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-[#263238] text-xl">Agent Productivity Leaderboard</h3>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Dials & Talktime per agent</p>
            </div>
            <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
              <button onClick={() => setMetric('dials')} className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${metric === 'dials' ? 'bg-white shadow-sm text-[#4b33e8]' : 'text-gray-400'}`}>Dials</button>
              <button onClick={() => setMetric('talktime')} className={`px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${metric === 'talktime' ? 'bg-white shadow-sm text-[#10b981]' : 'text-gray-400'}`}>Talktime</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-100 no-print-scroll">
            <div style={{ height: `${Math.max(300, displayData.length * 40)}px`, width: '100%', position: 'relative' }}>
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={displayData} margin={{ top: 0, right: 40, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#f1f1f1" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: "#263238", fontSize: 11, fontWeight: 700 }} width={100} />
                    <Tooltip cursor={{ fill: "#f9fafb", radius: 8 }} content={({ active, payload }) => {
                        if (active && payload?.[0]) {
                          return <div className="bg-[#111827] p-3 rounded-xl shadow-xl"><p className="text-white font-bold text-xs">{payload[0].payload.name}</p><div className="mt-1"><p className="text-[#4b33e8] text-[10px] font-bold">Dials: {payload[0].payload.count}</p><p className="text-[#10b981] text-[10px] font-bold">Talktime: {formatDuration(payload[0].payload.duration)}</p></div></div>;
                        }
                        return null;
                    }} />
                    <Bar dataKey={metric === 'dials' ? 'count' : 'duration'} fill={metric === 'dials' ? '#4b33e8' : '#10b981'} radius={[0, 20, 20, 0]} barSize={22}>
                      <LabelList dataKey={metric === 'dials' ? 'count' : 'duration'} position="right" content={(p: any) => <text x={p.x + p.width + 5} y={p.y + 13} fill={metric === 'dials' ? '#4b33e8' : '#10b981'} fontSize={10} fontWeight="bold">{metric === 'dials' ? p.value : formatDuration(p.value)}</text>} />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white rounded-[24px] p-8 flex flex-col relative h-[550px]">
          <h3 className="font-bold text-[#263238] mb-6">Activity Contribution</h3>
          <div className="space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-100">
            {rpcData.slice(0, 5).map((agent, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#4b33e8] font-bold text-xs border border-gray-100 group-hover:bg-[#4b33e8] group-hover:text-white transition-all">{agent.agent_name.charAt(0)}</div>
                  <div><p className="text-sm font-bold text-[#263238]">{agent.agent_name}</p><p className="text-[10px] text-gray-400 font-medium">Rank #{i + 1}</p></div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#263238]">{agent.total_dials.toLocaleString()} <span className="text-[10px] text-gray-400 ml-1">dials</span></p>
                  <p className="text-[9px] text-[#4b33e8] font-bold uppercase">{(((agent.total_dials || 0) / (totalDialsAll || 1)) * 100).toFixed(1)}% share</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => router.push("/portal/team")} className="mt-8 w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-[#4b33e8] hover:text-white transition-all">View All Teams</button>
        </div>
      </div>

      <div className="mt-8">
        <MemberPerformanceTable 
          members={performanceMembers}
          memberStats={memberStatsMap}
          loading={isLoading}
          onRefresh={() => { const { start, end } = getISTDateRange(dateFilter); fetchRpcPerformance(start, end); }}
          lastUpdated={lastUpdated}
        />
      </div>
    </div>
  );
}
