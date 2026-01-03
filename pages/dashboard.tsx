import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import TopStats from "../components/dashboard/TopStats";
import SecondaryStats from "../components/dashboard/SecondaryStats";
import { supabase } from "../lib/supabase";

// Hooks
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useDashboardCharts } from "../hooks/useDashboardCharts";
import { useAgentPerformance } from "../hooks/useAgentPerformance";
import { DashboardErrorBoundary } from "../components/DashboardErrorBoundary";
import AppLayout, { useUser } from "../components/AppLayout";

// Import existing tab components
import ProspectTab from "../components/dashboard/ProspectTab";
import AgentPerformanceTab from "../components/dashboard/AgentPerformanceTab";
import HourlyAnalyticsTab from "../components/dashboard/HourlyAnalyticsTab";

export default function Dashboard() {
  const { user, mounted } = useUser();
  
  // Organization filter
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("all");
  
  // Tab management
  const [activeTab, setActiveTab] = useState("prospect");
  
  // Data hooks
  const { stats, secondaryStats, performanceMetrics, loading: statsLoading, fetchStats } = useDashboardStats();
  const { chartData, pieData, heatmapData, campaignData, hourlyStats, loading: chartsLoading, fetchChartData } = useDashboardCharts();
  const { agentData, loading: agentLoading, fetchAgentPerformance } = useAgentPerformance();

  // Fetch organizations
  useEffect(() => {
    const fetchOrgs = async () => {
      const { data } = await supabase
        .from("organizations")
        .select("id, company_name")
        .order("company_name");
      if (data) setOrganizations(data);
    };
    fetchOrgs();
  }, []);

  // Date filter state
  const [dateFilter, setDateFilter] = useState("all_time");

  // Fetch all dashboard data when filters change
  useEffect(() => {
    if (mounted && user?.uid) {
      const orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
      
      // Fetch all data in parallel
      Promise.all([
        fetchStats(orgFilter, dateFilter),
        fetchChartData(orgFilter, dateFilter),
        fetchAgentPerformance(orgFilter, dateFilter),
      ]);
    }
  }, [selectedOrgId, dateFilter, user?.uid, mounted, fetchStats, fetchChartData, fetchAgentPerformance]);

  const loading = statsLoading || chartsLoading || agentLoading;

  return (
    <AppLayout>
      <DashboardErrorBoundary>
        <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 sm:space-y-8 max-w-[1400px]">
          {/* Header / Welcome Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#263238]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Dashboard Overview
              </h1>
              <p className="text-sm text-[#787E9D] mt-1">
                Welcome back,{" "}
                <span className="font-semibold text-[#4b33e8]">
                  {mounted ? user?.displayName || "User" : "User"}
                </span>
                . Here's what's happening today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Org Filter */}
              <div className="relative group">
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#263238] hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                  style={{ minWidth: "180px" }}
                  disabled={loading}
                >
                  <option value="all">Global (All Orgs)</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.company_name}
                    </option>
                  ))}
                </select>
                <i className="fi fi-rr-building absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <i className="fi fi-rr-angle-small-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
              </div>

              {/* Date Filter */}
              <div className="relative group">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#263238] hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                  style={{ minWidth: "140px" }}
                  disabled={loading}
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="all_time">All Time</option>
                </select>
                <i className="fi fi-rr-calendar absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <i className="fi fi-rr-angle-small-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
              </div>

              <div className="px-4 py-2 bg-[#4b33e8] rounded-xl text-sm font-bold text-white cursor-default flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full bg-white ${loading ? '' : 'animate-pulse'}`}></span>
                {loading ? "Updating..." : "Live Updates"}
              </div>
              
              <button
                  onClick={() => {
                      const oid = selectedOrgId === "all" ? "all" : selectedOrgId;
                      const dFilter = dateFilter;
                      window.open(`/dashboard_report?orgId=${oid}&dateFilter=${dFilter}`, '_blank');
                  }}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#4b33e8] hover:border-[#4b33e8] transition-all"
                  title="Generate Report"
              >
                  <i className="fi flex fi-rr-print"></i>
              </button>
            </div>
          </div>

          {/* Top Stats Row */}
          <TopStats stats={stats} chartData={chartData} loading={loading} />

          {/* Secondary Stats Grid */}
          <SecondaryStats stats={stats} secondaryStats={secondaryStats} loading={loading} />

          {/* Analytics Tab Selection */}
          <div className="bg-gray-100/50 p-1 rounded-2xl inline-flex gap-1 w-full sm:w-auto">
            {[
              { id: "prospect", label: "Prospect Wise Performance" },
              { id: "callDetails", label: "Call Hourly Analytics" },
              { id: "agentPerf", label: "Agent Performance" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[#4b33e8] shadow-sm"
                    : "text-gray-500 hover:bg-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "prospect" && (
            <ProspectTab
              stats={stats}
              performanceMetrics={performanceMetrics}
              campaignData={campaignData}
              pieData={pieData}
            />
          )}

          {activeTab === "agentPerf" && (
            <AgentPerformanceTab
              agentData={agentData}
              totalDials={stats.totalDials}
            />
          )}

          {activeTab === "callDetails" && (
            <HourlyAnalyticsTab
              heatmapData={heatmapData}
              hourlyStats={hourlyStats}
            />
          )}
        </div>
      </DashboardErrorBoundary>
    </AppLayout>
  );
}
