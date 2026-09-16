import { useState, useEffect, useMemo, memo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardStats, PerformanceMetrics } from "../../hooks/useDashboardStats";
import { CampaignDataPoint, PieDataPoint } from "../../hooks/useDashboardCharts";

import { ensureValidSession } from "../../lib/sessionManager";

interface ProspectTabProps {
  stats: DashboardStats;
  performanceMetrics: PerformanceMetrics;
  campaignData: CampaignDataPoint[];
  pieData: PieDataPoint[];
  selectedOrgId?: string;
  selectedUserId?: string;
  dateFilter?: string;
  loading?: boolean;
}

const PALETTE = [
  "#4b33e8", // Brand Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#06b6d4", // Cyan
  "#ec4899", // Pink
  "#8b5cf6", // Purple
];

// Custom Tooltip for Campaign Bar Chart with Truthful Metrics and Today's 3-Table Insights
const CustomBarTooltip = memo(({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0]?.payload;
    const total = Number(dataItem?.total) || 0;
    const freshLeads = Number(dataItem?.freshLeads) || 0;
    const dialedLeads = Number(dataItem?.dialedLeads) || 0;
    const connectedLeads = Number(dataItem?.connectedLeads) || 0;
    const disposedLeads = Number(dataItem?.disposedLeads ?? dataItem?.todayConnected) || 0;
    const connectedConversion = dataItem?.connectedConversion || (dialedLeads > 0 ? `${((connectedLeads / dialedLeads) * 100).toFixed(1)}%` : "0.0%");
    const utilizationRate = dataItem?.utilizationRate || "0.0%";
    const success = Number(dataItem?.success) || 0;
    const rank = dataItem?.rank;

    return (
      <div className="bg-gray-900/95 backdrop-blur-sm text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-gray-800 text-xs min-w-[220px]">
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-gray-800">
          <p className="font-bold text-gray-100 truncate max-w-[140px]">{label || dataItem?.name || "Campaign"}</p>
          {rank && (
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#4b33e8]/30 text-indigo-300 border border-indigo-500/30 shrink-0">
              #{rank} Active
            </span>
          )}
        </div>

        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center justify-between gap-4 text-indigo-300">
            <span>Available Leads:</span>
            <span className="font-mono font-bold text-white">{total.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-emerald-300">
            <span>Fresh Leads (0 Calls):</span>
            <span className="font-mono font-bold text-emerald-400">{freshLeads.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-blue-300 border-t border-gray-800/80 pt-1">
            <span>Dialed Leads (Mobile):</span>
            <span className="font-mono font-bold text-blue-400">{dialedLeads.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-indigo-200">
            <span>Connected Leads (&gt;0s):</span>
            <span className="font-mono font-bold text-indigo-300">{connectedLeads.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-amber-300">
            <span>Connected Conversion:</span>
            <span className="font-mono font-bold text-amber-400">{connectedConversion}</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-purple-300 border-t border-gray-800/80 pt-1">
            <span>Disposed Leads (CRM):</span>
            <span className="font-mono font-bold text-purple-400">{disposedLeads.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between gap-4 text-cyan-300">
            <span>Campaign Utilization:</span>
            <span className="font-mono font-bold text-cyan-400">{utilizationRate}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
});
CustomBarTooltip.displayName = "CustomBarTooltip";

// Custom Tooltip for Pie Chart
const CustomPieTooltip = memo(({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-gray-900/95 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg shadow-xl border border-gray-800 text-xs flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload?.fill || item.color }} />
        <span className="text-gray-300">{item.name}:</span>
        <span className="font-mono font-bold text-white">{item.value?.toLocaleString()}</span>
      </div>
    );
  }
  return null;
});
CustomPieTooltip.displayName = "CustomPieTooltip";

export default function ProspectTab({
  stats,
  performanceMetrics,
  campaignData = [],
  pieData = [],
  selectedOrgId,
  selectedUserId,
  dateFilter = "today",
  loading = false,
}: ProspectTabProps) {
  const [mounted, setMounted] = useState(false);
  const [campaignLimit, setCampaignLimit] = useState<number | "all">(6);
  const [campaignFilter, setCampaignFilter] = useState<string>("All Campaigns");
  const [campaignSearch, setCampaignSearch] = useState<string>("");
  const [selectedCampaign, setSelectedCampaign] = useState<any | null>(null);
  const [userSearch, setUserSearch] = useState<string>("");

  // Employee Campaign Time Breakdown State (9 AM to 9 PM)
  const [selectedEmployeeUser, setSelectedEmployeeUser] = useState<any | null>(null);
  const [timeIntervalMode, setTimeIntervalMode] = useState<"1hr" | "30min">("1hr");
  const [timeBreakdownSlots, setTimeBreakdownSlots] = useState<any[]>([]);
  const [timeBreakdownTotals, setTimeBreakdownTotals] = useState<{
    totalDisposed: number;
    totalDialed: number;
    totalConnected: number;
    totalFollowUps: number;
    overallConversion: string;
    employeeName: string;
    employeeId: string;
    campaignName: string;
  } | null>(null);
  const [loadingTimeBreakdown, setLoadingTimeBreakdown] = useState<boolean>(false);
  const [timeBreakdownError, setTimeBreakdownError] = useState<string | null>(null);

  // Fetch Employee Campaign Time Breakdown when an employee is selected
  useEffect(() => {
    if (!selectedCampaign?.id || !selectedEmployeeUser) {
      setTimeBreakdownSlots([]);
      setTimeBreakdownTotals(null);
      return;
    }

    let isCancelled = false;
    const fetchBreakdown = async () => {
      setLoadingTimeBreakdown(true);
      setTimeBreakdownError(null);
      try {
        const session = await ensureValidSession();
        if (!session) {
          setLoadingTimeBreakdown(false);
          return;
        }

        const params = new URLSearchParams({
          campaignId: selectedCampaign.id,
          dateFilter: dateFilter || "today",
          interval: timeIntervalMode,
          ...(selectedEmployeeUser.userId && { userId: selectedEmployeeUser.userId }),
          ...(selectedEmployeeUser.employeeId && { employeeId: selectedEmployeeUser.employeeId }),
        });

        const res = await fetch(`/api/campaign/employee_time_breakdown?${params}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to load time breakdown (status ${res.status})`);
        }

        const json = await res.json();
        if (!isCancelled) {
          if (json.success && json.data) {
            setTimeBreakdownSlots(json.data.slots || []);
            setTimeBreakdownTotals({
              totalDisposed: json.data.totalDisposed ?? 0,
              totalDialed: json.data.totalDialed ?? 0,
              totalConnected: json.data.totalConnected ?? 0,
              totalFollowUps: json.data.totalFollowUps ?? 0,
              overallConversion: json.data.overallConversion ?? "0.0%",
              employeeName: json.data.employeeName || selectedEmployeeUser.userName || "Agent",
              employeeId: json.data.employeeId || selectedEmployeeUser.employeeId || "",
              campaignName: json.data.campaignName || selectedCampaign.name || "Campaign",
            });
          } else {
            setTimeBreakdownError(json.error || "Failed to load time breakdown data");
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Error fetching employee time breakdown:", err);
          setTimeBreakdownError(err.message || "An error occurred while loading time breakdown");
        }
      } finally {
        if (!isCancelled) {
          setLoadingTimeBreakdown(false);
        }
      }
    };

    fetchBreakdown();
    return () => {
      isCancelled = true;
    };
  }, [selectedCampaign?.id, selectedEmployeeUser, dateFilter, timeIntervalMode]);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const totalLeads = stats?.totalCustomers || 0;
  const efficiency = Math.min(Math.max(stats?.efficiencyScore || 0, 0), 100);

  // Efficiency badge color and label
  const efficiencyMeta = useMemo(() => {
    if (efficiency >= 75) {
      return { label: "High Momentum", color: "text-emerald-700 bg-emerald-50 border-emerald-200/60", stroke: "#10b981" };
    }
    if (efficiency >= 50) {
      return { label: "On Target", color: "text-indigo-700 bg-indigo-50 border-indigo-200/60", stroke: "#4b33e8" };
    }
    return { label: "Needs Focus", color: "text-amber-700 bg-amber-50 border-amber-200/60", stroke: "#f59e0b" };
  }, [efficiency]);

  // Clean, accurate campaign ranking with user-defined 7 columns:
  // 1. Available Leads (Total leads from customer page filter)
  // 2. Fresh Leads (0 attempts)
  // 3. Disposed Leads (CRM Activity today)
  // 4. Dialed Leads (Mobile activity mapped to campaign)
  // 5. Connected Leads (Talk time > 0s)
  // 6. Connected Conversion (Connected / Dialed * 100)
  // 7. Campaign Utilization (Campaign Dials vs All Campaigns Dials)
  const validCampaigns = useMemo(() => {
    return (campaignData || [])
      .filter((c) => c && c.name)
      .map((c) => {
        const total = Number(c.total) || 0; // Available Leads
        const freshLeads = Number(c.freshLeads) || 0; // Fresh Leads (0 attempts)
        const disposedLeads = Number(c.disposedLeads ?? c.todayConnected) || 0; // Disposed Leads (CRM Activity)
        const dialedLeads = Number(c.dialedLeads) || 0; // Dialed Leads (mobile activity)
        const connectedLeads = Number(c.connectedLeads) || 0; // Connected Leads (talk time > 0s)
        const connectedConversion = c.connectedConversion || (dialedLeads > 0 ? `${((connectedLeads / dialedLeads) * 100).toFixed(1)}%` : "0.0%");
        const utilizationRate = c.utilizationRate || "0.0%";
        const success = Number(c.success) || 0;
        const todayConnected = Number(c.todayConnected ?? disposedLeads) || 0;
        const todayCalls = Number(c.todayCalls) || 0;
        const todayConnectedCalls = Number(c.todayConnectedCalls ?? c.todayCustomers) || 0;
        const todayCustomers = Number(c.todayCustomers ?? c.todayConnectedCalls) || 0;
        const todayRejected = Number(c.todayRejected) || 0;
        const todayDeals = Number(c.todayDeals) || 0;
        const convRate = total > 0 ? ((success / total) * 100).toFixed(1) : "0.0";

        return {
          ...c,
          total,
          freshLeads,
          disposedLeads,
          dialedLeads,
          connectedLeads,
          connectedConversion,
          utilizationRate,
          success,
          todayConnected,
          todayCalls,
          todayConnectedCalls,
          todayCustomers,
          todayRejected,
          todayDeals,
          convRate,
        };
      })
      .sort((a, b) => {
        // Primary: Most Disposed / CRM Activity today
        if ((b.disposedLeads || 0) !== (a.disposedLeads || 0)) {
          return (b.disposedLeads || 0) - (a.disposedLeads || 0);
        }
        // Secondary: Most dialed leads
        if ((b.dialedLeads || 0) !== (a.dialedLeads || 0)) {
          return (b.dialedLeads || 0) - (a.dialedLeads || 0);
        }
        // Tertiary: Highest total lead volume
        return (b.total || 0) - (a.total || 0);
      })
      .map((item, idx) => ({
        ...item,
        rank: idx + 1,
      }));
  }, [campaignData]);

  // Unique campaign names for dropdown filtering
  const campaignOptions = useMemo(() => {
    return Array.from(new Set(validCampaigns.map((c) => c.name))).sort();
  }, [validCampaigns]);

  // Filtered campaigns based on user campaign selection & search
  const filteredCampaigns = useMemo(() => {
    let list = validCampaigns;
    if (campaignFilter !== "All Campaigns") {
      list = list.filter((c) => c.name === campaignFilter);
    }
    if (campaignSearch.trim()) {
      const q = campaignSearch.toLowerCase().trim();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [validCampaigns, campaignFilter, campaignSearch]);

  // Sliced for chart view based on selected limit or single campaign focus
  const displayedCampaigns = useMemo(() => {
    if (campaignFilter !== "All Campaigns") {
      return validCampaigns.filter((c) => c.name === campaignFilter);
    }
    if (campaignLimit === "all") return validCampaigns;
    return validCampaigns.slice(0, campaignLimit);
  }, [validCampaigns, campaignLimit, campaignFilter]);

  // Cleaned pie data with percentages calculated
  const validPieData = useMemo(() => {
    const total = pieData.reduce((acc, p) => acc + (p?.value || 0), 0) || totalLeads || 1;
    return (pieData || [])
      .filter((p) => p && p.value > 0)
      .map((item, idx) => ({
        ...item,
        percentage: ((item.value / total) * 100).toFixed(1),
        color: item.color || PALETTE[idx % PALETTE.length],
      }));
  }, [pieData, totalLeads]);

  return (
    <div className="space-y-4 pt-3 pb-6">
      {/* Top Row: Compact Executive Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Efficiency Score */}
        <div className="bg-white rounded-xl border border-gray-200/70 p-3.5 flex items-center justify-between transition-all hover:border-gray-300">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              Efficiency Score
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-gray-800 font-mono">
                {efficiency}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">/ 100</span>
            </div>
            <span className={`inline-block mt-1 px-1.5 py-0.2 rounded text-[9px] font-semibold border ${efficiencyMeta.color}`}>
              {efficiencyMeta.label}
            </span>
          </div>

          {/* Mini SVG Radial Indicator */}
          <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-100"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeWidth="3.5"
                strokeDasharray={`${efficiency}, 100`}
                strokeLinecap="round"
                stroke={efficiencyMeta.stroke}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <i className="fi flex fi-rr-dashboard text-xs text-gray-500 absolute"></i>
          </div>
        </div>

        {/* Metric 2: Connected Ratio */}
        <div className="bg-white rounded-xl border border-gray-200/70 p-3.5 flex items-center justify-between transition-all hover:border-gray-300">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              Connected Rate
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-gray-800 font-mono">
                {performanceMetrics?.connectedRate || "0%"}
              </span>
            </div>
            <span className="inline-block mt-1 text-[10px] text-gray-400 font-medium">
              Call reachability ratio
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center shrink-0">
            <i className="fi flex fi-rr-phone-call text-sm"></i>
          </div>
        </div>

        {/* Metric 3: Avg Duration */}
        <div className="bg-white rounded-xl border border-gray-200/70 p-3.5 flex items-center justify-between transition-all hover:border-gray-300">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              Avg Duration
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-gray-800 font-mono">
                {performanceMetrics?.avgDuration || "0m 0s"}
              </span>
            </div>
            <span className="inline-block mt-1 text-[10px] text-gray-400 font-medium">
              Talk time per connect
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <i className="fi flex fi-rr-time-twenty-four text-sm"></i>
          </div>
        </div>

        {/* Metric 4: Conversion Rate / Output */}
        <div className="bg-white rounded-xl border border-gray-200/70 p-3.5 flex items-center justify-between transition-all hover:border-gray-300">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
              Conversion Rate
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-gray-800 font-mono">
                {stats?.conversionRate ? `${stats.conversionRate}%` : (performanceMetrics?.roi || "0%")}
              </span>
            </div>
            <span className="inline-block mt-1 text-[10px] text-emerald-600 font-medium font-mono">
              {stats?.totalConverted || 0} deals closed
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <i className="fi flex fi-rr-chart-line-up text-sm"></i>
          </div>
        </div>
      </div>

      {/* Middle Row: Two Clean Interactive Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Chart: Campaign Lead Responses (Real Leads vs Converted) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-gray-200/70 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1.5">
                  Campaign Lead Responses
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[10px] font-bold text-[#4b33e8]">
                  Most Active
                </span>
              </div>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Total prospects vs conversions across active campaigns
              </p>
            </div>

            {/* Controls: Limit Selector + Legend */}
            <div className="flex items-center gap-3 self-end sm:self-auto flex-wrap">
              {validCampaigns.length > 5 && (
                <div className="flex items-center bg-gray-100/90 p-0.5 rounded-lg text-[10px] font-semibold text-gray-500">
                  <button
                    onClick={() => setCampaignLimit(5)}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      campaignLimit === 5 ? "bg-white text-gray-800 shadow-sm font-bold" : "hover:text-gray-800"
                    }`}
                  >
                    Top 5
                  </button>
                  <button
                    onClick={() => setCampaignLimit(8)}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      campaignLimit === 8 ? "bg-white text-gray-800 shadow-sm font-bold" : "hover:text-gray-800"
                    }`}
                  >
                    Top 8
                  </button>
                  <button
                    onClick={() => setCampaignLimit("all")}
                    className={`px-2 py-0.5 rounded-md transition-all ${
                      campaignLimit === "all" ? "bg-white text-gray-800 shadow-sm font-bold" : "hover:text-gray-800"
                    }`}
                  >
                    All ({validCampaigns.length})
                  </button>
                </div>
              )}

              {/* Chart Legend */}
              <div className="flex items-center gap-2.5 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#4b33e8]" />
                  <span className="text-gray-500 font-medium">Total</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#10b981]" />
                  <span className="text-gray-500 font-medium">Converted</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-[210px] relative">
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-[#4b33e8] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : mounted && displayedCampaigns.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={displayedCampaigns} barGap={4} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
                    dy={4}
                    tickFormatter={(val: string) => {
                      if (!val) return "";
                      return val.length > 12 ? `${val.substring(0, 10)}...` : val;
                    }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                  />
                  <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "#f8fafc" }} />
                  <Bar
                    dataKey="total"
                    name="Total Leads"
                    fill="#4b33e8"
                    radius={[3, 3, 0, 0]}
                    barSize={14}
                  />
                  <Bar
                    dataKey="success"
                    name="Converted"
                    fill="#10b981"
                    radius={[3, 3, 0, 0]}
                    barSize={14}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                <i className="fi flex fi-rr-chart-histogram text-2xl mb-1 text-gray-300"></i>
                <span className="text-xs">No campaign lead data available</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Chart: Lead Status & Dispositions Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-gray-200/70 p-4 sm:p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-800">
                Prospect Dispositions
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Current status distribution
              </p>
            </div>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-semibold">
              {validPieData.length} Stages
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 my-auto">
            {/* Donut Chart with More Space */}
            <div className="w-[165px] h-[165px] shrink-0 relative flex items-center justify-center">
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#4b33e8] border-t-transparent rounded-full animate-spin" />
              ) : mounted && validPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={validPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={54}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {validPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full rounded-full border border-dashed border-gray-200 flex items-center justify-center text-[10px] text-gray-400">
                  No data
                </div>
              )}

              {/* Center Total Count Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-bold text-gray-800 font-mono leading-none">
                  {totalLeads > 999 ? `${(totalLeads / 1000).toFixed(1)}k` : totalLeads}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold mt-0.5">
                  Leads
                </span>
              </div>
            </div>

            {/* Compact Progress Legend with Reduced Bar Width */}
            <div className="w-full sm:max-w-[210px] space-y-2.5 min-w-0">
              {validPieData.slice(0, 4).map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 truncate text-gray-600 font-medium">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-mono text-gray-500 font-semibold shrink-0 ml-2 text-[10px]">
                      {item.value} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Detailed Most Used Campaigns Breakdown Table OR User Breakdown Drilldown View */}
      {validCampaigns.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200/70 overflow-hidden shadow-sm">
          {selectedEmployeeUser && selectedCampaign ? (
            /* ========================================================= */
            /* DRILL-DOWN LEVEL 2: EMPLOYEE CAMPAIGN TIME BREAKDOWN      */
            /* ========================================================= */
            <div>
              {/* Employee Time Breakdown Header & Toolbar */}
              <div className="px-4 py-3.5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {/* Back to User Breakdown Button */}
                  <button
                    onClick={() => {
                      setSelectedEmployeeUser(null);
                      setTimeBreakdownSlots([]);
                      setTimeBreakdownTotals(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm group"
                  >
                    <i className="fi flex fi-rr-arrow-small-left text-sm transition-transform group-hover:-translate-x-0.5"></i>
                    <span>Back to User Breakdown</span>
                  </button>

                  <div className="h-4 w-px bg-gray-200 hidden sm:block" />

                  {/* Campaign & Employee Info Badges */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <i className="fi flex fi-rr-bullseye-arrow text-[#4b33e8] text-xs"></i>
                      {selectedCampaign.name}
                    </span>

                    <span className="text-gray-300">/</span>

                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50/80 border border-indigo-200/60 text-[#4b33e8] text-xs font-bold">
                      <i className="fi flex fi-rr-user text-xs"></i>
                      <span>{selectedEmployeeUser.userName || "Agent"}</span>
                      {selectedEmployeeUser.employeeId && (
                        <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded shadow-2xs border border-indigo-100">
                          {selectedEmployeeUser.employeeId}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                      <i className="fi flex fi-rr-clock text-[10px]"></i>
                      9:00 AM - 9:00 PM
                    </span>
                  </div>
                </div>

                {/* Interval Mode Toggle (1 Hour vs 30 Minutes) */}
                <div className="flex items-center gap-2 self-start md:self-auto">
                  <span className="text-[11px] font-semibold text-gray-500 flex items-center gap-1">
                    <i className="fi flex fi-rr-time-forward text-xs text-gray-400"></i>
                    Time Slot Gap:
                  </span>
                  <div className="inline-flex p-0.5 bg-gray-100 rounded-lg border border-gray-200/80">
                    <button
                      type="button"
                      onClick={() => setTimeIntervalMode("1hr")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        timeIntervalMode === "1hr"
                          ? "bg-white text-[#4b33e8] shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      1 Hour
                    </button>
                    <button
                      type="button"
                      onClick={() => setTimeIntervalMode("30min")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                        timeIntervalMode === "30min"
                          ? "bg-white text-[#4b33e8] shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      30 Min
                    </button>
                  </div>
                </div>
              </div>

              {/* Summary Metric Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 bg-gray-50/70 border-b border-gray-100">
                <div className="bg-white p-2.5 rounded-xl border border-gray-200/70">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Disposed Leads
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-bold font-mono text-purple-700">
                      {timeBreakdownTotals ? timeBreakdownTotals.totalDisposed.toLocaleString() : "-"}
                    </span>
                    <span className="text-[10px] text-gray-400">CRM logs</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200/70">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Dialed Leads
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-bold font-mono text-blue-700">
                      {timeBreakdownTotals ? timeBreakdownTotals.totalDialed.toLocaleString() : "-"}
                    </span>
                    <span className="text-[10px] text-gray-400">total dials</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200/70">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Connected Leads
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-bold font-mono text-[#4b33e8]">
                      {timeBreakdownTotals ? timeBreakdownTotals.totalConnected.toLocaleString() : "-"}
                    </span>
                    <span className="text-[10px] text-gray-400">&gt; 0s talk time</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200/70">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Follow Ups
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-bold font-mono text-amber-600">
                      {timeBreakdownTotals ? timeBreakdownTotals.totalFollowUps.toLocaleString() : "-"}
                    </span>
                    <span className="text-[10px] text-gray-400">callbacks</span>
                  </div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-gray-200/70">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-0.5">
                    Connected Conv.
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base sm:text-lg font-bold font-mono text-emerald-600">
                      {timeBreakdownTotals ? timeBreakdownTotals.overallConversion : "0.0%"}
                    </span>
                    <span className="text-[10px] text-gray-400">overall</span>
                  </div>
                </div>
              </div>

              {/* Time Breakdown Slots Table */}
              <div className="overflow-x-auto">
                {loadingTimeBreakdown ? (
                  <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center space-y-3">
                    <div className="w-7 h-7 border-2 border-[#4b33e8]/30 border-t-[#4b33e8] rounded-full animate-spin"></div>
                    <p className="text-xs font-semibold text-gray-600">Loading hourly breakdown...</p>
                    <p className="text-[11px] text-gray-400">Aggregating leads for {selectedEmployeeUser.userName || "Agent"} between 9 AM and 9 PM</p>
                  </div>
                ) : timeBreakdownError ? (
                  <div className="py-12 text-center text-rose-500 flex flex-col items-center justify-center space-y-2">
                    <i className="fi flex fi-rr-exclamation text-2xl text-rose-400"></i>
                    <p className="text-xs font-bold text-rose-600">Failed to load time breakdown</p>
                    <p className="text-[11px] text-gray-500 max-w-sm">{timeBreakdownError}</p>
                  </div>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50/90 border-b border-gray-100 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        <th className="px-3 py-2.5 w-12 text-center">#</th>
                        <th className="px-3.5 py-2.5 min-w-[190px]">Time Window (9 AM - 9 PM)</th>
                        <th className="px-3 py-2.5 text-center text-gray-600" title="Disposed leads in this time interval">
                          Disposed Leads
                        </th>
                        <th className="px-3 py-2.5 text-center text-gray-600" title="Dialed calls in this time interval">
                          Dialed Leads
                        </th>
                        <th className="px-3 py-2.5 text-center text-gray-600" title="Connected calls (>0s) in this time interval">
                          Connected Leads
                        </th>
                        <th className="px-3 py-2.5 text-center text-gray-600" title="Follow Up callbacks created in this time interval">
                          Follow Ups
                        </th>
                        <th className="px-3.5 py-2.5 text-right font-bold text-gray-600" title="Connected / Dialed percentage">
                          Connected Conv.
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {timeBreakdownSlots.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <i className="fi flex fi-rr-clock text-2xl text-gray-300"></i>
                              <p className="text-xs font-semibold text-gray-500">No activity recorded</p>
                              <p className="text-[11px] text-gray-400">
                                No calls or CRM dispositions found between 9:00 AM and 9:00 PM for this period.
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        timeBreakdownSlots.map((slot: any, sIdx: number) => {
                          const hasActivity =
                            slot.disposedLeads > 0 ||
                            slot.dialedLeads > 0 ||
                            slot.connectedLeads > 0 ||
                            slot.followUpLeads > 0;

                          return (
                            <tr
                              key={slot.slotKey || sIdx}
                              className={`transition-colors ${
                                hasActivity
                                  ? "bg-white hover:bg-gray-50/70"
                                  : "hover:bg-gray-50/50 opacity-75"
                              }`}
                            >
                              {/* 1. Slot Index */}
                              <td className="px-3 py-2.5 text-center font-mono text-xs font-semibold text-gray-500">
                                {sIdx + 1}
                              </td>

                              {/* 2. Time Window Label */}
                              <td className="px-3.5 py-2.5 font-semibold text-gray-800">
                                <div className="flex items-center gap-2">
                                  <i
                                    className={`fi flex fi-rr-time-forward text-xs ${
                                      hasActivity ? "text-[#4b33e8]" : "text-gray-300"
                                    }`}
                                  ></i>
                                  <span className="font-mono text-xs text-gray-900 font-medium">
                                    {slot.timeLabel}
                                  </span>
                                  {hasActivity && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  )}
                                </div>
                              </td>

                              {/* 3. Disposed Leads */}
                              <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                                {slot.disposedLeads.toLocaleString()}
                              </td>

                              {/* 4. Dialed Leads */}
                              <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                                {slot.dialedLeads.toLocaleString()}
                              </td>

                              {/* 5. Connected Leads */}
                              <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                                {slot.connectedLeads.toLocaleString()}
                              </td>

                              {/* 6. Follow Ups */}
                              <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                                {slot.followUpLeads.toLocaleString()}
                              </td>

                              {/* 7. Connected Conversion */}
                              <td className="px-3.5 py-2.5 text-right font-mono font-semibold">
                                {slot.dialedLeads > 0 ? (
                                  <span
                                    className={`text-xs ${
                                      slot.connectedLeads > 0 ? "text-emerald-700 font-bold" : "text-gray-500"
                                    }`}
                                  >
                                    {slot.connectedConversion}
                                  </span>
                                ) : (
                                  <span className="text-gray-300 text-xs">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ) : selectedCampaign ? (
            /* ========================================================= */
            /* DRILL-DOWN VIEW: CAMPAIGN VS USERS BREAKDOWN              */
            /* ========================================================= */
            <div>
              {/* Drilldown Header & Toolbar */}
              <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => {
                      setSelectedCampaign(null);
                      setSelectedEmployeeUser(null);
                      setUserSearch("");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 bg-gray-100 hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm group"
                  >
                    <i className="fi flex fi-rr-arrow-small-left text-sm transition-transform group-hover:-translate-x-0.5"></i>
                    <span>Back to Campaigns</span>
                  </button>

                  <div className="h-4 w-px bg-gray-200 hidden sm:block" />

                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <i className="fi flex fi-rr-bullseye-arrow text-[#4b33e8] text-xs"></i>
                      {selectedCampaign.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#4b33e8] border border-indigo-200/60">
                      User Breakdown
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium hidden sm:inline">
                      (Click employee row for 9 AM - 9 PM time breakdown)
                    </span>
                  </div>
                </div>

                {/* Search & Summary Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <i className="fi flex fi-rr-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
                    <input
                      type="text"
                      placeholder="Search user..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="h-8 pl-7 pr-2.5 w-36 sm:w-44 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:ring-2 focus:ring-[#4b33e8]/30 focus:border-[#4b33e8] transition-all"
                    />
                  </div>

                  {userSearch.trim().length > 0 && (
                    <button
                      onClick={() => setUserSearch("")}
                      className="h-8 px-2 rounded-lg text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1 border border-rose-200"
                    >
                      <i className="fi flex fi-rr-cross-small text-xs" /> Reset
                    </button>
                  )}
                </div>
              </div>

              {/* User Breakdown Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-3 py-2.5 w-12 text-center">#</th>
                      <th className="px-3.5 py-2.5 min-w-[180px]">User / Employee</th>
                      <th className="px-3 py-2.5 text-center text-gray-600" title="Assigned leads for this user in this campaign">
                        Assigned Leads
                      </th>
                      <th className="px-3 py-2.5 text-center text-purple-600" title="Disposed leads handled today in CRM Activity">
                        Disposed Leads
                      </th>
                      <th className="px-3 py-2.5 text-center text-blue-600" title="Dialed calls today from mobile history">
                        Dialed Leads
                      </th>
                      <th className="px-3 py-2.5 text-center text-[#4b33e8]" title="Connected calls with duration > 0s">
                        Connected Leads
                      </th>
                      <th className="px-3.5 py-2.5 text-right" title="Connected / Dialed ratio">
                        Connected Conv.
                      </th>
                      <th className="px-2 py-2.5 w-8 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {(() => {
                      let allUsers: any[] = selectedCampaign.userBreakdown || [];

                      // If dashboard has a specific user filter applied
                      if (selectedUserId && selectedUserId !== "all") {
                        allUsers = allUsers.filter((u: any) => u.userId === selectedUserId);
                      }

                      const filteredUsers = allUsers.filter((u: any) => {
                        if (!userSearch.trim()) return true;
                        const query = userSearch.toLowerCase().trim();
                        return (
                          (u.userName || "").toLowerCase().includes(query) ||
                          (u.employeeId || "").toLowerCase().includes(query)
                        );
                      });

                      if (filteredUsers.length === 0) {
                        return (
                          <tr>
                            <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                              <div className="flex flex-col items-center justify-center space-y-2">
                                <i className="fi flex fi-rr-user text-2xl text-gray-300"></i>
                                <p className="text-xs font-semibold text-gray-500">No user activity found</p>
                                <p className="text-[11px] text-gray-400">
                                  {userSearch.trim()
                                    ? "No users matched your search criteria"
                                    : "No users have logged activity or assignments for this campaign today"}
                                </p>
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return filteredUsers.map((userItem: any, idx: number) => {
                        const assignedCount = Number(userItem.assignedLeads) || 0;
                        const disposedCount = Number(userItem.disposedLeads) || 0;
                        const dialedCount = Number(userItem.dialedLeads) || 0;
                        const connCount = Number(userItem.connectedLeads) || 0;
                        const convStr = userItem.connectedConversion || (dialedCount > 0 ? `${((connCount / dialedCount) * 100).toFixed(1)}%` : "0.0%");

                        return (
                          <tr
                            key={userItem.userId || userItem.employeeId || idx}
                            onClick={() => setSelectedEmployeeUser(userItem)}
                            className="hover:bg-indigo-50/50 cursor-pointer transition-colors group"
                            title="Click to view 9 AM - 9 PM time breakdown"
                          >
                            {/* 1. Index */}
                            <td className="px-3 py-2.5 text-center font-mono text-xs font-semibold text-gray-600 group-hover:text-[#4b33e8]">
                              {idx + 1}
                            </td>

                            {/* 2. User Name / Employee ID */}
                            <td className="px-3.5 py-2.5 font-medium text-gray-800">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-xs text-gray-900 group-hover:text-[#4b33e8] transition-colors truncate max-w-[170px]">
                                  {userItem.userName || "Agent"}
                                </span>
                                {userItem.employeeId && (
                                  <span className="font-mono text-[10px] text-gray-500 bg-gray-100 group-hover:bg-indigo-100/70 group-hover:text-indigo-800 px-1.5 py-0.5 rounded transition-colors">
                                    {userItem.employeeId}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* 3. Assigned Leads */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {assignedCount.toLocaleString()}
                            </td>

                            {/* 4. Disposed Leads */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {disposedCount.toLocaleString()}
                            </td>

                            {/* 5. Dialed Leads */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {dialedCount.toLocaleString()}
                            </td>

                            {/* 6. Connected Leads */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {connCount.toLocaleString()}
                            </td>

                            {/* 7. Connected Conversion */}
                            <td className="px-3.5 py-2.5 text-right font-mono font-medium text-gray-700">
                              {convStr}
                            </td>

                            {/* 8. Drill-down arrow indicator */}
                            <td className="px-2 py-2.5 text-center text-gray-400 group-hover:text-[#4b33e8] transition-colors">
                              <i className="fi flex fi-rr-angle-small-right text-sm transition-transform group-hover:translate-x-0.5"></i>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* ========================================================= */
            /* MAIN CAMPAIGN BREAKDOWN TABLE VIEW                         */
            /* ========================================================= */
            <div>
              {/* Header & Filter Toolbar */}
              <div className="px-4 py-3 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-1.5">
                      <i className="fi flex fi-rr-bullseye-arrow text-[#4b33e8] text-xs"></i>
                      Most Used Campaigns Breakdown
                    </h4>
                    <span className="text-[10px] text-gray-400 font-medium">
                      (Click row to view user breakdown)
                    </span>
                  </div>
                </div>

                {/* Campaign Filter Controls */}
                <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
                  {/* Campaign Dropdown */}
                  <div className="relative">
                    <select
                      value={campaignFilter}
                      onChange={(e) => setCampaignFilter(e.target.value)}
                      className="h-8 pl-2.5 pr-7 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 outline-none focus:ring-2 focus:ring-[#4b33e8]/30 focus:border-[#4b33e8] transition-all cursor-pointer"
                    >
                      <option value="All Campaigns">All Campaigns ({validCampaigns.length})</option>
                      {campaignOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick Search */}
                  <div className="relative">
                    <i className="fi flex fi-rr-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[10px]" />
                    <input
                      type="text"
                      placeholder="Search campaign..."
                      value={campaignSearch}
                      onChange={(e) => setCampaignSearch(e.target.value)}
                      className="h-8 pl-7 pr-2.5 w-32 sm:w-40 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700 outline-none focus:ring-2 focus:ring-[#4b33e8]/30 focus:border-[#4b33e8] transition-all"
                    />
                  </div>

                  {/* Reset Filter Button (if active) */}
                  {(campaignFilter !== "All Campaigns" || campaignSearch.trim().length > 0) && (
                    <button
                      onClick={() => {
                        setCampaignFilter("All Campaigns");
                        setCampaignSearch("");
                      }}
                      className="h-8 px-2 rounded-lg text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1 border border-rose-200"
                      title="Reset Filter"
                    >
                      <i className="fi flex fi-rr-cross-small text-xs" /> Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Table View with User-Specified Columns */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="px-3 py-2.5 w-10 text-center">Rank</th>
                      <th className="px-3.5 py-2.5 min-w-[150px]">Campaign Name</th>
                      <th className="px-3 py-2.5 text-center" title="Total leads matching customer page campaign filter">
                        Available Leads
                      </th>
                      <th className="px-3 py-2.5 text-center text-emerald-600" title="Leads with 0 call attempts">
                        Fresh Leads
                      </th>
                      <th className="px-3 py-2.5 text-center text-purple-600" title="Handled leads today from CRM Activity table">
                        Disposed Leads
                      </th>
                      <th className="px-3 py-2.5 text-center text-blue-600" title="Mobile activity dials mapped via customer contact no">
                        Dialed Leads
                      </th>
                      <th className="px-3 py-2.5 text-center text-[#4b33e8]" title="Dialed leads with talk time > 0s">
                        Connected Leads
                      </th>
                      <th className="px-3 py-2.5 text-center" title="Connected leads / Dialed leads ratio">
                        Connected Conv.
                      </th>
                      <th className="px-3.5 py-2.5 text-right" title="Campaign dials vs all campaigns total dials">
                        Utilization
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {filteredCampaigns.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                          <div className="flex flex-col items-center justify-center space-y-2">
                            <i className="fi flex fi-rr-search-alt text-2xl text-gray-300"></i>
                            <p className="text-xs font-semibold text-gray-500">No campaigns found</p>
                            <p className="text-[11px] text-gray-400">
                              Try changing your search or filter criteria
                            </p>
                            <button
                              onClick={() => {
                                setCampaignFilter("All Campaigns");
                                setCampaignSearch("");
                              }}
                              className="mt-1 px-3 py-1 rounded-lg bg-indigo-50 text-[#4b33e8] text-[10px] font-bold hover:bg-indigo-100 transition-colors"
                            >
                              Show All Campaigns
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCampaigns.map((camp, i) => {
                        const totalNum = Number(camp.total) || 0;
                        const freshNum = Number(camp.freshLeads) || 0;
                        const dialedNum = Number(camp.dialedLeads) || 0;
                        const connNum = Number(camp.connectedLeads) || 0;
                        const disposedNum = Number(camp.disposedLeads ?? camp.todayConnected) || 0;

                        const convNum = dialedNum > 0 ? parseFloat(((connNum / dialedNum) * 100).toFixed(1)) : 0;
                        const utilStr = camp.utilizationRate || "0.0%";

                        const rankNum = camp.rank || (i + 1);

                        return (
                          <tr
                            key={camp.id || camp.name || i}
                            onClick={() => setSelectedCampaign(camp)}
                            className="hover:bg-indigo-50/40 cursor-pointer transition-colors group relative"
                          >
                            {/* 1. Global Rank */}
                            <td className="px-3 py-2.5 text-center font-mono text-xs font-semibold text-gray-600">
                              {rankNum}
                            </td>

                            {/* 2. Campaign Name with Custom Dark Tooltip on Hover */}
                            <td className="px-3.5 py-2.5 font-medium text-gray-800 relative">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate max-w-[180px] font-semibold text-xs block group-hover:text-[#4b33e8] transition-colors">
                                  {camp.name}
                                </span>
                                <i className="fi flex fi-rr-arrow-small-right text-[11px] text-gray-300 group-hover:text-[#4b33e8] transition-all opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0" />
                              </div>

                              {/* Custom Dark Tooltip */}
                              <div className="absolute left-6 -top-7 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-gray-900/95 text-white text-[10px] font-medium rounded-md shadow-xl border border-gray-700/60 whitespace-nowrap backdrop-blur-sm">
                                <i className="fi flex fi-rr-users-alt text-[10px] text-indigo-400" />
                                <span>Click to view user breakdown</span>
                                <div className="absolute left-4 -bottom-1 w-2 h-2 bg-gray-900 rotate-45 border-r border-b border-gray-700/60" />
                              </div>
                            </td>

                            {/* 3. Available Leads */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {totalNum.toLocaleString()}
                            </td>

                            {/* 4. Fresh Leads */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {freshNum.toLocaleString()}
                            </td>

                            {/* 5. Disposed Leads */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {disposedNum.toLocaleString()}
                            </td>

                            {/* 6. Dialed Leads */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {dialedNum.toLocaleString()}
                            </td>

                            {/* 7. Connected Leads */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {connNum.toLocaleString()}
                            </td>

                            {/* 8. Connected Conversion */}
                            <td className="px-3 py-2.5 text-center font-mono font-medium text-gray-700">
                              {convNum > 0 ? `${convNum}%` : "0.0%"}
                            </td>

                            {/* 9. Campaign Utilization */}
                            <td className="px-3.5 py-2.5 text-right font-mono font-medium text-gray-700">
                              {utilStr}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
