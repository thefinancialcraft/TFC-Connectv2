import React, { useMemo, useState, useEffect } from "react";
import { AgentDataPoint } from "../../hooks/useAgentPerformance";
import { CampaignDataPoint, HourlyStatPoint, PieDataPoint } from "../../hooks/useDashboardCharts";
import { supabase } from "../../lib/supabase";

interface EmployeeOverviewPanelProps {
  userId: string;
  userName?: string;
  employeeCode?: string;
  designation?: string;
  agentData: AgentDataPoint[];
  campaignData: CampaignDataPoint[];
  hourlyStats: HourlyStatPoint[];
  pieData: PieDataPoint[];
  loading?: boolean;
}

interface RecentCallLog {
  id: string;
  customer_name?: string;
  phone_no?: string;
  disposition?: string;
  duration?: number;
  created_at?: string;
  campaign_name?: string;
}

interface CampaignBreakdownRow {
  name: string;
  disposed: number;
  dialed: number;
  connected: number;
  totalFollowups: number;
  overdueFollowups: number;
  upcomingFollowups: number;
}

export default function EmployeeOverviewPanel({
  userId,
  userName: userNameProp,
  employeeCode: employeeCodeProp,
  designation: designationProp,
  agentData = [],
  campaignData = [],
  hourlyStats = [],
  pieData = [],
  loading = false,
}: EmployeeOverviewPanelProps) {
  // Self-fetched profile (fallback when parent hasn't loaded users yet)
  const [selfProfile, setSelfProfile] = useState<{ user_name: string; employee_id?: string; designation?: string } | null>(null);

  // Derive effective display values — prefer parent prop if real, else use self-fetched profile
  const userName = (userNameProp && userNameProp !== "Selected Employee") ? userNameProp : (selfProfile?.user_name || "Loading...");
  const employeeCode = employeeCodeProp || selfProfile?.employee_id;
  const designation = (designationProp && designationProp !== "Agent") ? designationProp : (selfProfile?.designation || "Agent");

  // Fetch own profile from user_profiles when parent hasn't provided it yet
  useEffect(() => {
    if (!userId || userId === "all") return;
    // Only self-fetch if the parent prop is still the default placeholder
    if (userNameProp && userNameProp !== "Selected Employee") return;
    let cancelled = false;
    supabase
      .from("user_profiles")
      .select("user_name, employee_id, designation")
      .eq("user_id", userId)
      .single()
      .then(({ data }) => {
        if (!cancelled && data) setSelfProfile(data);
      });
    return () => { cancelled = true; };
  }, [userId, userNameProp]);

  // Follow-up statistics state
  const [followupStats, setFollowupStats] = useState<{
    totalFollowups: number;
    overdue: number;
    upcoming: number;
  }>({ totalFollowups: 0, overdue: 0, upcoming: 0 });

  // Last call at state (from call_logs table)
  const [lastCallAt, setLastCallAt] = useState<string | null>(null);

  // Last 5 calls from call_logs table
  const [recentCallLogs, setRecentCallLogs] = useState<RecentCallLog[]>([]);
  const [loadingRecentLogs, setLoadingRecentLogs] = useState(false);

  // Campaign-wise follow-up tracking
  const [campaignFollowups, setCampaignFollowups] = useState<Record<string, { total: number; overdue: number; upcoming: number }>>({});

  useEffect(() => {
    if (!userId || userId === "all") return;

    let isMounted = true;
    const fetchExtraEmployeeData = async () => {
      try {
        setLoadingRecentLogs(true);

        // 1. Fetch Follow Ups, Overdues, Upcoming for this specific user & group by campaign_id
        const { data: customerFollowups } = await supabase
          .from("customers")
          .select("id, campaign_id, next_called_at, disposition")
          .eq("assigned_to", userId)
          .in("disposition", ["Callback", "Call Back", "Follow Up", "FollowUp"]);

        if (isMounted && customerFollowups) {
          let overdueCount = 0;
          let upcomingCount = 0;
          const nowTime = Date.now();
          const campMap: Record<string, { total: number; overdue: number; upcoming: number }> = {};

          customerFollowups.forEach((lead) => {
            const cId = lead.campaign_id || "unassigned";
            if (!campMap[cId]) {
              campMap[cId] = { total: 0, overdue: 0, upcoming: 0 };
            }
            campMap[cId].total++;

            if (lead.next_called_at) {
              if (new Date(lead.next_called_at).getTime() < nowTime) {
                overdueCount++;
                campMap[cId].overdue++;
              } else {
                upcomingCount++;
                campMap[cId].upcoming++;
              }
            } else {
              overdueCount++;
              campMap[cId].overdue++;
            }
          });

          setFollowupStats({
            totalFollowups: customerFollowups.length,
            overdue: overdueCount,
            upcoming: upcomingCount,
          });
          setCampaignFollowups(campMap);
        }

        // 2. Fetch Latest 5 CRM Activity records for this employee
        //    Mirrors the logic in useActivityData.ts (CRM Activity tab):
        //    union of call_logs + rejected_leads + closed_deals, sorted by timestamp desc.
        let logsData: any[] = [];
        try {
          // A. call_logs — agent_id is always a UUID (user_id), never employeeCode
          const { data: crmLogs } = await supabase
            .from("call_logs")
            .select("id, customer_name, duration, disposition, sub_disposition, created_at, campaign_id")
            .eq("agent_id", userId)
            .order("created_at", { ascending: false })
            .limit(10);

          (crmLogs || []).forEach((l: any) => {
            logsData.push({
              id: l.id,
              customer_name: l.customer_name || "Lead Contact",
              disposition: l.disposition || l.sub_disposition || "Connected",
              duration: Number(l.duration) || 0,
              created_at: l.created_at,
              source: 'call_log',
            });
          });

          // B. rejected_leads — same agent_id (UUID)
          const { data: rejectedRows } = await supabase
            .from("rejected_leads")
            .select("id, customer_name, rejection_reason, rejected_at")
            .eq("agent_id", userId)
            .order("rejected_at", { ascending: false })
            .limit(10);

          (rejectedRows || []).forEach((r: any) => {
            logsData.push({
              id: `rej-${r.id}`,
              customer_name: r.customer_name || "Lead Contact",
              disposition: r.rejection_reason || "Rejected",
              duration: 0,
              created_at: r.rejected_at,
              source: 'rejected',
            });
          });

          // C. closed_deals — same agent_id (UUID)
          const { data: closedRows } = await supabase
            .from("closed_deals")
            .select("id, customer_name, final_disposition, closed_at")
            .eq("agent_id", userId)
            .order("closed_at", { ascending: false })
            .limit(10);

          (closedRows || []).forEach((c: any) => {
            logsData.push({
              id: `cls-${c.id}`,
              customer_name: c.customer_name || "Lead Contact",
              disposition: c.final_disposition || "Deal Closed",
              duration: 0,
              created_at: c.closed_at,
              source: 'closed',
            });
          });

          // Sort strictly by latest timestamp/created_at descending
          logsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          logsData = logsData.slice(0, 5);
        } catch (e) {
          console.error("Error fetching employee latest calls:", e);
        }

        if (isMounted) {
          if (logsData && logsData.length > 0) {
            const mappedLogs: RecentCallLog[] = logsData.map((item: any) => ({
              id: item.id,
              customer_name: item.customer_name || "Lead Contact",
              phone_no: item.phone_no || "",
              disposition: item.disposition || "Disposed",
              duration: Number(item.duration) || 0,
              created_at: item.created_at,
            }));
            setRecentCallLogs(mappedLogs);

            // Set last call at string from the latest activity
            const rawTime = logsData[0].created_at;
            if (rawTime) {
              const dateObj = new Date(rawTime);
              const timeStr = dateObj.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "Asia/Kolkata",
              });
              const dateStr = dateObj.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                timeZone: "Asia/Kolkata",
              });
              setLastCallAt(`${timeStr}, ${dateStr}`);
            }
          } else {
            setRecentCallLogs([]);
            setLastCallAt("No calls logged");
          }
          setLoadingRecentLogs(false);
        }
      } catch (err) {
        console.error("Error fetching extra employee data:", err);
        if (isMounted) setLoadingRecentLogs(false);
      }
    };

    fetchExtraEmployeeData();
    return () => {
      isMounted = false;
    };
  }, [userId, employeeCode]);

  // Find specific agent metrics from agentData
  const agent = useMemo(() => {
    return agentData.find((a) => a.id === userId || a.employee_id === employeeCode);
  }, [agentData, userId, employeeCode]);

  // Dials, Connected, and Duration
  const dials = agent ? agent.count : 0;
  const connected = agent ? agent.connected_count : 0;
  const totalSeconds = agent ? agent.duration : 0;

  // Format Talktime
  const talktimeDisplay = useMemo(() => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  }, [totalSeconds]);

  // Avg Talk Duration
  const avgTalkDisplay = useMemo(() => {
    if (!connected || connected === 0) return "0s";
    const avgSec = Math.floor(totalSeconds / connected);
    const m = Math.floor(avgSec / 60);
    const s = avgSec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }, [connected, totalSeconds]);

  // Streak / Gap
  const streakGap = agent?.consecutive_failed_stats || "0 / 0s";

  // Connectivity Ratio (%)
  const connectivityPct = useMemo(() => {
    if (!dials || dials === 0) return 0;
    return Math.round((connected / dials) * 100);
  }, [connected, dials]);

  // Disposed Leads and Campaign Breakdown
  const { totalDisposed, userCampaignBreakdown, mostActiveCampaign } = useMemo(() => {
    let disposedCount = 0;
    const campStats: CampaignBreakdownRow[] = [];

    campaignData.forEach((camp) => {
      const uItem = camp.userBreakdown?.find(
        (u) => (u.userId && u.userId === userId) || (u.employeeId && u.employeeId === employeeCode)
      );
      if (uItem) {
        disposedCount += uItem.disposedLeads || 0;
        const cId = camp.id || "";
        const fInfo = campaignFollowups[cId] || { total: 0, overdue: 0, upcoming: 0 };

        campStats.push({
          name: camp.name,
          dialed: uItem.dialedLeads || 0,
          connected: uItem.connectedLeads || 0,
          disposed: uItem.disposedLeads || 0,
          totalFollowups: fInfo.total,
          overdueFollowups: fInfo.overdue,
          upcomingFollowups: fInfo.upcoming,
        });
      }
    });

    if (disposedCount === 0 && pieData.length > 0) {
      disposedCount = pieData.reduce((acc, p) => acc + (Number(p.value) || 0), 0);
    }

    campStats.sort((a, b) => b.dialed - a.dialed);
    const topCamp = campStats.length > 0 ? campStats[0].name : "No Assigned Campaign";

    return {
      totalDisposed: disposedCount,
      userCampaignBreakdown: campStats,
      mostActiveCampaign: topCamp,
    };
  }, [campaignData, userId, employeeCode, pieData, campaignFollowups]);

  // Team Utilization (%)
  const utilizationPct = useMemo(() => {
    const allDials = agentData.reduce((acc, a) => acc + (a.count || 0), 0);
    if (!allDials || allDials === 0) return dials > 0 ? 100 : 0;
    return Math.round((dials / allDials) * 100);
  }, [dials, agentData]);

  // Monthly Conversion Ratio (%)
  const conversionPct = useMemo(() => {
    const deals = agent ? agent.deals_count : 0;
    if (!totalDisposed || totalDisposed === 0) {
      return deals > 0 ? 100 : 0;
    }
    return Math.round((deals / totalDisposed) * 100);
  }, [agent, totalDisposed]);

  // Peak Dial Window
  const peakWindow = useMemo(() => {
    if (!hourlyStats || hourlyStats.length === 0) return "11 AM";
    const sorted = [...hourlyStats].sort((a, b) => (b.total || 0) - (a.total || 0));
    if (sorted.length > 0 && (sorted[0].total || 0) > 0) {
      return `${sorted[0].hour}`;
    }
    return "11 AM";
  }, [hourlyStats]);

  // Sorted Dispositions
  const sortedDispositions = useMemo(() => {
    if (!pieData || pieData.length === 0) return [];
    return [...pieData].sort((a, b) => (b.value || 0) - (a.value || 0));
  }, [pieData]);

  // Radial Arc Gauge Ticks
  const gaugeTicks = useMemo(() => {
    const totalTicks = 30;
    const activeCount = Math.round((connectivityPct / 100) * totalTicks);
    const radius = 54;
    const centerX = 64;
    const centerY = 58;
    return Array.from({ length: totalTicks }).map((_, i) => {
      const angleDeg = 180 - (i / (totalTicks - 1)) * 180;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x1 = centerX + (radius - 8) * Math.cos(angleRad);
      const y1 = centerY - (radius - 8) * Math.sin(angleRad);
      const x2 = centerX + radius * Math.cos(angleRad);
      const y2 = centerY - radius * Math.sin(angleRad);
      const isActive = i <= activeCount;
      return { x1, y1, x2, y2, isActive };
    });
  }, [connectivityPct]);

  // Format Duration helper
  const formatDuration = (sec: number) => {
    if (!sec || sec === 0) return "0s";
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  // Format Time Helper
  const formatCallTime = (dateStr?: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  };

  return (
    <div className="w-full bg-transparent pb-8 box-border animate-in fade-in duration-300 space-y-5">
      
      {/* 1. Main High-Level Analytics Canvas + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Canvas (8 Columns) */}
        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-5">
          
          {/* Row 1: 3 High-Impact Minimal Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: Disposed Leads */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 text-[#4b33e8] flex items-center justify-center text-xs">
                    <i className="fi flex fi-rr-clipboard-check"></i>
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-[#263238] leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Disposed Leads
                    </h3>
                    <span className="text-[10px] text-[#787E9D]">Logged activities</span>
                  </div>
                </div>
              </div>

              <div className="my-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold text-[#263238] font-mono tracking-tight">
                    {totalDisposed.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-medium text-[#787E9D] bg-gray-50 border border-gray-200/60 px-2 py-0.5 rounded-md">
                    Disposed
                  </span>
                </div>
              </div>

              <div className="pt-2.5 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-[#787E9D] mb-1.5 font-mono">
                  <span>Dialed: <strong className="text-[#263238]">{dials.toLocaleString()}</strong></span>
                  <span>Connected: <strong className="text-[#263238]">{connected.toLocaleString()}</strong></span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#4b33e8] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(connectivityPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Connectivity Ratio & Connected Leads Gauge */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 text-[#4b33e8] flex items-center justify-center text-xs">
                    <i className="fi flex fi-rr-wifi"></i>
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-[#263238] leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Connectivity Ratio
                    </h3>
                    <span className="text-[10px] text-[#787E9D]">Connected / Dialed</span>
                  </div>
                </div>
              </div>

              {/* Radial Arc Ticks Gauge */}
              <div className="relative w-full h-20 flex items-end justify-center my-1">
                <svg viewBox="0 0 128 64" className="w-36 h-20">
                  {gaugeTicks.map((t, idx) => (
                    <line
                      key={idx}
                      x1={t.x1}
                      y1={t.y1}
                      x2={t.x2}
                      y2={t.y2}
                      stroke={t.isActive ? "#4b33e8" : "#E2E8F0"}
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
                <div className="absolute bottom-0 text-center">
                  <span className="text-2xl sm:text-3xl font-bold text-[#263238] font-mono leading-none">
                    {connectivityPct}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-gray-100 text-[11px] font-mono text-[#787E9D]">
                <span>Connected: <strong className="text-[#263238] font-bold">{connected}</strong></span>
                <span>Unreached: <strong className="text-[#263238] font-bold">{Math.max(dials - connected, 0)}</strong></span>
              </div>
            </div>

            {/* Card 3: Streak / Gap Analysis */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 text-[#4b33e8] flex items-center justify-center text-xs">
                    <i className="fi flex fi-rr-pulse"></i>
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-[#263238] leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Streak / Gap
                    </h3>
                    <span className="text-[10px] text-[#787E9D]">Consecutive fails & gap</span>
                  </div>
                </div>
              </div>

              <div className="my-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#263238] font-mono tracking-tight">
                  {streakGap}
                </span>
                <p className="text-[11px] text-[#787E9D] mt-1 font-mono">
                  Consecutive fails / Avg gap
                </p>
              </div>

              <div className="pt-2.5 border-t border-gray-100">
                <div className="flex items-center justify-between text-[11px] text-[#787E9D] mb-1.5 font-mono">
                  <span>Deals: <strong className="text-[#263238]">{agent?.deals_count || 0}</strong></span>
                  <span>Conv: <strong className="text-[#4b33e8]">{conversionPct}%</strong></span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#4b33e8] h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(conversionPct, 100)}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Larger Talktime & Hourly Calling Frequency Timeline Card */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-gray-50 border border-gray-100 text-[#4b33e8] flex items-center justify-center text-sm">
                  <i className="fi flex fi-rr-headset"></i>
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-[#263238]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Call Duration & Peak Calling Window
                  </h3>
                  <span className="text-xs text-[#787E9D]">Hourly dial frequency with talktime telemetry</span>
                </div>
              </div>

              {/* Talktime & Avg Talks Highlight Badges */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-[#787E9D] uppercase tracking-wider block">Total Talktime</span>
                  <span className="text-base font-bold text-[#263238] font-mono leading-tight">{talktimeDisplay}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-[#787E9D] uppercase tracking-wider block">Avg Talks</span>
                  <span className="text-base font-bold text-[#4b33e8] font-mono leading-tight">{avgTalkDisplay}</span>
                </div>
              </div>
            </div>

            {/* Large Hourly Calling Chart */}
            <div className="pt-4">
              <div className="flex justify-between items-center mb-2 text-xs text-[#787E9D]">
                <span>Dial Frequency Timeline</span>
                <span className="font-mono text-[#4b33e8] font-semibold">Peak Window: {peakWindow}</span>
              </div>
              <div className="w-full h-28 flex items-end justify-between gap-1.5 pt-2 pb-1 border-b border-gray-100">
                {hourlyStats.slice(0, 25).map((h, idx) => {
                  const maxH = Math.max(...hourlyStats.map(s => s.total || 0), 10);
                  const barH = Math.max(Math.min(Math.round(((h.total || 0) / maxH) * 100), 100), 8);
                  const isTop = (h.total || 0) > 0 && h.hour === peakWindow;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group/bar h-full justify-end">
                      <div 
                        style={{ height: `${barH}%` }} 
                        className={`w-full max-w-[18px] rounded-t-[4px] transition-all duration-300 ${
                          isTop ? "bg-[#4b33e8]" : "bg-gray-200 group-hover/bar:bg-gray-300"
                        }`}
                        title={`${h.hour}: ${h.total} calls`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-[11px] text-[#787E9D] pt-1.5 font-mono">
                <span>9 AM</span>
                <span className="text-[#4b33e8] font-bold">{peakWindow}</span>
                <span>9 PM</span>
              </div>
            </div>
          </div>

          {/* Row 3: Followup Management & Status Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Follow-up Card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 text-[#4b33e8] flex items-center justify-center text-xs">
                    <i className="fi flex fi-rr-calendar-clock"></i>
                  </span>
                  <div>
                    <h3 className="text-xs font-semibold text-[#263238] leading-none" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Follow-up Management
                    </h3>
                    <span className="text-[10px] text-[#787E9D]">Assigned callback leads</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#263238] font-mono bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-200/60">
                  {followupStats.totalFollowups} Total
                </span>
              </div>

              {/* 3 Followup Indicator Boxes */}
              <div className="grid grid-cols-3 gap-2 my-2">
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-[#787E9D] block">Total</span>
                  <span className="text-base sm:text-lg font-bold text-[#263238] font-mono">{followupStats.totalFollowups}</span>
                  <span className="text-[9px] text-[#787E9D] block">Assigned</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-[#787E9D] block">Overdue</span>
                  <span className="text-base sm:text-lg font-bold text-[#263238] font-mono">{followupStats.overdue}</span>
                  <span className="text-[9px] text-[#787E9D] block">Pending</span>
                </div>
                <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-[10px] text-[#787E9D] block">Upcoming</span>
                  <span className="text-base sm:text-lg font-bold text-[#4b33e8] font-mono">{followupStats.upcoming}</span>
                  <span className="text-[9px] text-[#787E9D] block">Scheduled</span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#787E9D] font-mono">
                <span>{followupStats.overdue} Overdue</span>
                <span className="text-[#4b33e8] font-semibold">{followupStats.upcoming} Upcoming</span>
              </div>
            </div>

            {/* Quick Metrics: Team Utilization & Monthly Conversion */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-3">
                  <span className="text-xs font-semibold text-[#263238]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Performance Telemetry
                  </span>
                  <span className="text-[10px] font-mono text-[#4b33e8] bg-indigo-50/50 px-2 py-0.5 rounded-md border border-indigo-100/50">
                    Live Rates
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#787E9D]">Team Utilization Share</span>
                      <span className="font-mono font-bold text-[#263238]">{utilizationPct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-[#4b33e8] h-full rounded-full" style={{ width: `${Math.min(utilizationPct, 100)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#787E9D]">Monthly Conversion Ratio</span>
                      <span className="font-mono font-bold text-[#4b33e8]">{conversionPct}% ({agent?.deals_count || 0} deals)</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-[#4b33e8] h-full rounded-full" style={{ width: `${Math.min(conversionPct, 100)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#787E9D]">
                <span>Last Call: <strong className="font-mono text-[#263238]">{lastCallAt || "Loading..."}</strong></span>
              </div>
            </div>

          </div>

        </div>

        {/* Right Sidebar: Agent Telemetry & Dispositions (4 Columns) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col h-full justify-between">
            
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 text-[#4b33e8] flex items-center justify-center text-xs">
                    <i className="fi flex fi-rr-user"></i>
                  </div>
                  <span className="text-sm font-semibold text-[#263238]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Agent Telemetry
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#787E9D] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                  {sortedDispositions.length} Dispositions
                </span>
              </div>

              {/* Agent Profile Bio Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50/70 mb-4 border border-gray-200/60">
                <div className="w-10 h-10 rounded-xl bg-[#4b33e8] text-white flex items-center justify-center font-bold text-sm shadow-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-[#263238] truncate" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {userName}
                  </h3>
                  <p className="text-[11px] text-[#787E9D] truncate">
                    Code: <span className="font-mono font-semibold text-[#263238]">{employeeCode || "N/A"}</span> • {designation}
                  </p>
                </div>
              </div>

              {/* Top Disposition Highlight Card */}
              <div className="p-3 rounded-xl bg-gray-50/80 border border-gray-200/70 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#787E9D] block">Top Disposition</span>
                  <span className="text-xs font-semibold text-[#263238] truncate block">
                    {sortedDispositions[0] ? sortedDispositions[0].name : "None logged today"}
                  </span>
                </div>
                <span className="text-base font-bold text-[#4b33e8] font-mono ml-2">
                  {sortedDispositions[0] ? sortedDispositions[0].value : 0}
                </span>
              </div>

              {/* Call Dispositions Breakdown List */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#263238] mb-2.5">
                  <span>Disposition Breakdown</span>
                  <span className="text-[11px] text-[#787E9D] font-mono font-normal">call_logs</span>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {sortedDispositions.slice(0, 6).map((disp, idx) => {
                    const totalDisp = sortedDispositions.reduce((a, b) => a + (Number(b.value) || 0), 0) || 1;
                    const pct = Math.round(((Number(disp.value) || 0) / totalDisp) * 100);
                    return (
                      <div key={idx} className="p-2 rounded-xl bg-gray-50/60 border border-gray-100">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-medium text-[#263238] truncate">{disp.name}</span>
                          <span className="font-mono font-semibold text-[#4b33e8]">{disp.value}</span>
                        </div>
                        <div className="w-full h-1 bg-gray-200/70 rounded-full overflow-hidden">
                          <div
                            className="bg-[#4b33e8] h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {sortedDispositions.length === 0 && (
                    <div className="py-6 text-center text-xs text-[#787E9D]">
                      No call logs recorded today
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Summary Strip */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs">
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-[#787E9D]">Total Talktime:</span>
                  <span className="font-semibold text-[#263238] font-mono">{talktimeDisplay}</span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-[#787E9D]">Avg Talks:</span>
                  <span className="font-semibold text-[#263238] font-mono">{avgTalkDisplay}</span>
                </div>
                <div className="flex items-center justify-between py-0.5">
                  <span className="text-[#787E9D]">Streak / Gap:</span>
                  <span className="font-semibold text-[#263238] font-mono">{streakGap}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* 2. Table Section: Last 5 Leads from Call Logs & Campaign-Wise Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pt-1">
        
        {/* Table 1: Last 5 Leads from call_logs Table (5 Columns) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 text-[#4b33e8] flex items-center justify-center text-xs">
                  <i className="fi flex fi-rr-time-past"></i>
                </span>
                <div>
                  <h3 className="text-xs font-semibold text-[#263238]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Recent 5 Calls
                  </h3>
                  <span className="text-[10px] text-[#787E9D]">Real-time telemetry & call records</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#787E9D] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {recentCallLogs.length} Records
              </span>
            </div>

            {loadingRecentLogs ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#4b33e8] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-[#787E9D] mt-2">Loading recent calls...</span>
              </div>
            ) : recentCallLogs.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#787E9D]">
                No call logs available for this employee
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-semibold text-[#787E9D] uppercase tracking-wider">
                      <th className="pb-2">Customer</th>
                      <th className="pb-2">Disposition</th>
                      <th className="pb-2 text-right">Duration</th>
                      <th className="pb-2 text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {recentCallLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 pr-2">
                          <div className="font-semibold text-[#263238] truncate max-w-[150px]" title={log.customer_name}>
                            {log.customer_name}
                          </div>
                        </td>
                        <td className="py-2.5 px-2">
                          <span className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-200/60 text-[#263238] text-[10px] font-medium inline-block truncate max-w-[110px]">
                            {log.disposition}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right font-mono font-semibold text-[#263238]">
                          {formatDuration(log.duration || 0)}
                        </td>
                        <td className="py-2.5 pl-2 text-right font-mono text-[11px] text-[#787E9D]">
                          {formatCallTime(log.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Table 2: Campaign Performance & Follow-up Breakdown (7 Columns) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-gray-200/80 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-gray-50 border border-gray-100 text-[#4b33e8] flex items-center justify-center text-xs">
                  <i className="fi flex fi-rr-bullhorn"></i>
                </span>
                <div>
                  <h3 className="text-xs font-semibold text-[#263238]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Campaign Telemetry & Follow-up Breakdown
                  </h3>
                  <span className="text-[10px] text-[#787E9D]">Dispositions, calls dialed, connected & follow-ups status</span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#787E9D] bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {userCampaignBreakdown.length} Campaigns
              </span>
            </div>

            {userCampaignBreakdown.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#787E9D]">
                No campaign data recorded for this user today
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] font-semibold text-[#787E9D] uppercase tracking-wider">
                      <th className="pb-2">Campaign</th>
                      <th className="pb-2 text-center">Disposed</th>
                      <th className="pb-2 text-center">Dialed</th>
                      <th className="pb-2 text-center">Connected</th>
                      <th className="pb-2 text-center">Followups</th>
                      <th className="pb-2 text-center">Overdue</th>
                      <th className="pb-2 text-center">Upcoming</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {userCampaignBreakdown.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-2.5 pr-2">
                          <div className="font-semibold text-[#263238] truncate max-w-[150px]" title={row.name}>
                            {row.name}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-semibold text-[#263238]">
                          {row.disposed}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[#787E9D]">
                          {row.dialed}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-[#4b33e8] font-semibold">
                          {row.connected}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-medium text-[#263238]">
                          {row.totalFollowups}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-semibold text-[#263238]">
                          {row.overdueFollowups}
                        </td>
                        <td className="py-2.5 pl-2 text-center font-mono font-semibold text-[#4b33e8]">
                          {row.upcomingFollowups}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
