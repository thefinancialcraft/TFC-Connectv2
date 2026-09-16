import React, { useMemo, useState, useEffect } from "react";
import { AgentDataPoint } from "../../hooks/useAgentPerformance";
import { CampaignDataPoint, HourlyStatPoint, PieDataPoint } from "../../hooks/useDashboardCharts";
import { supabase } from "../../lib/supabase";

interface EmployeeTilesGridProps {
  userId: string;
  userName?: string;
  employeeCode?: string;
  agentData: AgentDataPoint[];
  campaignData: CampaignDataPoint[];
  hourlyStats: HourlyStatPoint[];
  pieData: PieDataPoint[];
  loading?: boolean;
}

export default function EmployeeTilesGrid({
  userId,
  userName = "Selected Employee",
  employeeCode,
  agentData = [],
  campaignData = [],
  hourlyStats = [],
  pieData = [],
  loading = false,
}: EmployeeTilesGridProps) {
  // Follow-up statistics state (from customers table where assigned_to = userId)
  const [followupStats, setFollowupStats] = useState<{
    totalFollowups: number;
    overdue: number;
    upcoming: number;
  }>({ totalFollowups: 0, overdue: 0, upcoming: 0 });

  // Last call at state (from call_logs table where agent_id = userId)
  const [lastCallAt, setLastCallAt] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    if (!userId || userId === "all") return;

    let isMounted = true;
    const fetchExtraEmployeeData = async () => {
      setFetchLoading(true);
      try {
        const nowIso = new Date().toISOString();

        // 1. Fetch Follow Ups, Overdues, Upcoming for this specific user
        const { data: customerFollowups } = await supabase
          .from("customers")
          .select("id, next_called_at, disposition")
          .eq("assigned_to", userId)
          .in("disposition", ["Callback", "Call Back", "Follow Up", "FollowUp"]);

        if (isMounted && customerFollowups) {
          let overdueCount = 0;
          let upcomingCount = 0;
          customerFollowups.forEach((lead) => {
            if (lead.next_called_at) {
              if (new Date(lead.next_called_at).getTime() < new Date().getTime()) {
                overdueCount++;
              } else {
                upcomingCount++;
              }
            } else {
              overdueCount++;
            }
          });
          setFollowupStats({
            totalFollowups: customerFollowups.length,
            overdue: overdueCount,
            upcoming: upcomingCount,
          });
        }

        // 2. Fetch Last Call At for this employee directly from call_logs table
        const { data: lastCallLog } = await supabase
          .from("call_logs")
          .select("created_at, call_start_time, call_time")
          .eq("agent_id", userId)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (isMounted) {
          const rawTime =
            lastCallLog?.created_at ||
            lastCallLog?.call_start_time ||
            lastCallLog?.call_time;
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
          } else {
            setLastCallAt("No Calls");
          }
        }
      } catch (err) {
        console.error("Error fetching extra employee data:", err);
      } finally {
        if (isMounted) setFetchLoading(false);
      }
    };

    fetchExtraEmployeeData();
    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Find specific agent metrics from agentData
  const agent = useMemo(() => {
    return agentData.find((a) => a.id === userId || a.employee_id === employeeCode);
  }, [agentData, userId, employeeCode]);

  // Total Dials
  const dials = agent ? agent.count : 0;
  // Connected Calls
  const connected = agent ? agent.connected_count : 0;
  // Total Talktime in seconds
  const totalSeconds = agent ? agent.duration : 0;

  // Format Talktime
  const talktimeDisplay = useMemo(() => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  }, [totalSeconds]);

  // Avg Talk Duration per connected call
  const avgTalkDisplay = useMemo(() => {
    if (!connected || connected === 0) return "0s";
    const avgSec = Math.floor(totalSeconds / connected);
    const m = Math.floor(avgSec / 60);
    const s = avgSec % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }, [connected, totalSeconds]);

  // Streak / Gap
  const streakGap = agent?.consecutive_failed_stats || "0 / 0s";

  // Connectivity Ratio (Connected / Dials * 100)
  const connectivityRatio = useMemo(() => {
    if (!dials || dials === 0) return "0%";
    const pct = Math.round((connected / dials) * 100);
    return `${pct}%`;
  }, [connected, dials]);

  // Disposed Leads and Campaign Breakdown for this user from campaignData
  const { totalDisposed, userCampaignBreakdown, mostActiveCampaign } = useMemo(() => {
    let disposedCount = 0;
    const campStats: { name: string; dialed: number; connected: number; disposed: number }[] = [];

    campaignData.forEach((camp) => {
      const uItem = camp.userBreakdown?.find(
        (u) => (u.userId && u.userId === userId) || (u.employeeId && u.employeeId === employeeCode)
      );
      if (uItem) {
        disposedCount += uItem.disposedLeads || 0;
        campStats.push({
          name: camp.name,
          dialed: uItem.dialedLeads || 0,
          connected: uItem.connectedLeads || 0,
          disposed: uItem.disposedLeads || 0,
        });
      }
    });

    // If disposed count is 0 from campaigns, fallback to pieData totals if any
    if (disposedCount === 0 && pieData.length > 0) {
      disposedCount = pieData.reduce((acc, p) => acc + (Number(p.value) || 0), 0);
    }

    campStats.sort((a, b) => b.dialed - a.dialed);
    const topCamp = campStats.length > 0 ? campStats[0].name : "None";

    return {
      totalDisposed: disposedCount,
      userCampaignBreakdown: campStats,
      mostActiveCampaign: topCamp,
    };
  }, [campaignData, userId, employeeCode, pieData]);

  // Utilization: (User dials vs Total dials of all team)
  const utilization = useMemo(() => {
    const allDials = agentData.reduce((acc, a) => acc + (a.count || 0), 0);
    if (!allDials || allDials === 0) return dials > 0 ? "100%" : "0%";
    const pct = ((dials / allDials) * 100).toFixed(1);
    return `${pct}%`;
  }, [dials, agentData]);

  // Conversion Ratio of Current Month: Deals closed vs Unique Disposed
  const conversionRatio = useMemo(() => {
    const deals = agent ? agent.deals_count : 0;
    if (!totalDisposed || totalDisposed === 0) {
      return deals > 0 ? "100%" : "0%";
    }
    const pct = ((deals / totalDisposed) * 100).toFixed(1);
    return `${pct}%`;
  }, [agent, totalDisposed]);

  // Call Dials Peak Window (from hourlyStats)
  const peakWindow = useMemo(() => {
    if (!hourlyStats || hourlyStats.length === 0) return "10 AM - 1 PM";
    const sorted = [...hourlyStats].sort((a, b) => (b.total || 0) - (a.total || 0));
    if (sorted.length > 0 && (sorted[0].total || 0) > 0) {
      return `${sorted[0].hour} (Peak)`;
    }
    return "10 AM - 1 PM";
  }, [hourlyStats]);

  // Top Dispositions Breakdown text
  const topDisposition = useMemo(() => {
    if (!pieData || pieData.length === 0) return "Pending Sync";
    const top = [...pieData].sort((a, b) => (b.value || 0) - (a.value || 0))[0];
    return top ? `${top.name} (${top.value})` : "N/A";
  }, [pieData]);

  const cards = [
    {
      title: "Disposed Leads",
      value: totalDisposed.toLocaleString(),
      subtext: "Logged activity",
      icon: "fi-rr-clipboard-check",
      color: "text-[#4b33e8]",
      bg: "bg-[#4b33e8]/5",
      border: "border-[#4b33e8]/15",
    },
    {
      title: "Dialed Leads",
      value: dials.toLocaleString(),
      subtext: "Total outbound calls",
      icon: "fi-rr-phone-call",
      color: "text-blue-600",
      bg: "bg-blue-50/70",
      border: "border-blue-100",
    },
    {
      title: "Connected Leads",
      value: connected.toLocaleString(),
      subtext: "Duration > 0s",
      icon: "fi-rr-headset",
      color: "text-emerald-600",
      bg: "bg-emerald-50/70",
      border: "border-emerald-100",
    },
    {
      title: "Total Talktime",
      value: talktimeDisplay,
      subtext: "Cumulative duration",
      icon: "fi-rr-clock-three",
      color: "text-violet-600",
      bg: "bg-violet-50/70",
      border: "border-violet-100",
    },
    {
      title: "Avg Talks Duration",
      value: avgTalkDisplay,
      subtext: "Per connected call",
      icon: "fi-rr-time-forward",
      color: "text-teal-600",
      bg: "bg-teal-50/70",
      border: "border-teal-100",
    },
    {
      title: "Streak / Gap",
      value: streakGap,
      subtext: "Fails / Avg gap interval",
      icon: "fi-rr-pulse",
      color: "text-amber-600",
      bg: "bg-amber-50/70",
      border: "border-amber-100",
    },
    {
      title: "Team Utilization",
      value: utilization,
      subtext: "Share of total team dials",
      icon: "fi-rr-chart-pie-alt",
      color: "text-indigo-600",
      bg: "bg-indigo-50/70",
      border: "border-indigo-100",
    },
    {
      title: "Connectivity Ratio",
      value: connectivityRatio,
      subtext: "Connected / Dialed",
      icon: "fi-rr-wifi",
      color: "text-sky-600",
      bg: "bg-sky-50/70",
      border: "border-sky-100",
    },
    {
      title: "Monthly Conversion",
      value: conversionRatio,
      subtext: "Deals per unique disposition",
      icon: "fi-rr-badge-check",
      color: "text-emerald-700",
      bg: "bg-emerald-50/80",
      border: "border-emerald-200/70",
    },
    {
      title: "Top Disposition",
      value: topDisposition,
      subtext: `${pieData.length} total categories`,
      icon: "fi-rr-list-check",
      color: "text-fuchsia-600",
      bg: "bg-fuchsia-50/70",
      border: "border-fuchsia-100",
    },
    {
      title: "Highly Active Campaign",
      value: mostActiveCampaign,
      subtext: `${userCampaignBreakdown.length} assigned campaigns`,
      icon: "fi-rr-bullhorn",
      color: "text-orange-600",
      bg: "bg-orange-50/70",
      border: "border-orange-100",
    },
    {
      title: "Peak Dial Window",
      value: peakWindow,
      subtext: "Highest calling frequency",
      icon: "fi-rr-flame",
      color: "text-rose-600",
      bg: "bg-rose-50/70",
      border: "border-rose-100",
    },
    {
      title: "Total Followups",
      value: followupStats.totalFollowups.toLocaleString(),
      subtext: "Scheduled callbacks",
      icon: "fi-rr-calendar-clock",
      color: "text-blue-700",
      bg: "bg-blue-50/80",
      border: "border-blue-200/70",
    },
    {
      title: "Overdue Followups",
      value: followupStats.overdue.toLocaleString(),
      subtext: "Action required immediately",
      icon: "fi-rr-exclamation",
      color: "text-red-600",
      bg: "bg-red-50/80",
      border: "border-red-200/70",
    },
    {
      title: "Upcoming Followups",
      value: followupStats.upcoming.toLocaleString(),
      subtext: "Future scheduled calls",
      icon: "fi-rr-time-forward",
      color: "text-emerald-600",
      bg: "bg-emerald-50/80",
      border: "border-emerald-200/70",
    },
    {
      title: "Last Call At",
      value: lastCallAt || "Loading...",
      subtext: "Based on call_logs table",
      icon: "fi-rr-phone-call",
      color: "text-indigo-600",
      bg: "bg-indigo-50/80",
      border: "border-indigo-200/70",
    },
  ];

  return (
    <div className="w-full bg-transparent p-1 sm:p-2 box-border animate-in fade-in zoom-in-95 duration-200">
      {/* Header Profile Tag */}
      <div className="flex items-center justify-between pb-4 mb-2 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#4b33e8]/10 text-[#4b33e8] flex items-center justify-center font-bold text-sm">
            <i className="fi flex fi-rr-user"></i>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#263238]">
                {userName}
              </h2>
              {employeeCode && (
                <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200/80">
                  {employeeCode}
                </span>
              )}
            </div>
            <p className="text-xs text-[#787E9D]">
              Individual Performance & Operational Insights
            </p>
          </div>
        </div>
      </div>

      {/* Grid: 12 Metrics in Clean 2-cols mobile, 3-cols tablet, 4-cols desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-white border ${c.border} shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-200 flex flex-col justify-between group`}
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[12px] font-semibold text-[#787E9D] tracking-tight">
                {c.title}
              </span>
              <div
                className={`w-7 h-7 rounded-lg ${c.bg} ${c.color} flex items-center justify-center text-xs transition-transform group-hover:scale-110`}
              >
                <i className={`fi flex ${c.icon}`}></i>
              </div>
            </div>

            {loading ? (
              <div className="animate-pulse py-1">
                <div className="h-6 bg-gray-200/70 rounded w-1/2 mb-2"></div>
                <div className="h-2.5 bg-gray-200/50 rounded w-3/4"></div>
              </div>
            ) : (
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[#263238] font-mono tracking-tight leading-tight group-hover:text-[#4b33e8] transition-colors truncate">
                  {c.value}
                </div>
                <div className="text-[11px] font-medium text-[#787E9D] mt-1.5 truncate">
                  {c.subtext}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
