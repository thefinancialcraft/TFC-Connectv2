import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// TopStats is now dynamically imported below with other chart components

import SecondaryStats from "../components/dashboard/SecondaryStats";
import { supabase } from "../lib/supabase";

// Hooks
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useDashboardCharts } from "../hooks/useDashboardCharts";
import { useAgentPerformance } from "../hooks/useAgentPerformance";
import { DashboardErrorBoundary } from "../components/DashboardErrorBoundary";
import AppLayout, { useUser } from "../components/AppLayout";

import dynamic from "next/dynamic";

// Dynamically import dashboard tabs to prevent Recharts SSR sizing issues
const TopStats = dynamic(() => import("../components/dashboard/TopStats"), { ssr: false });
const ProspectTab = dynamic(() => import("../components/dashboard/ProspectTab"), { ssr: false });
const AgentPerformanceTab = dynamic(() => import("../components/dashboard/AgentPerformanceTab"), { ssr: false });
const HourlyAnalyticsTab = dynamic(() => import("../components/dashboard/HourlyAnalyticsTab"), { ssr: false });



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
          {/* Header / Welcome Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex-1">
              <h1
                className="text-2xl sm:text-3xl font-bold text-[#263238]"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Dashboard Overview
              </h1>
              <p className="text-sm text-[#787E9D] mt-1 line-clamp-1 sm:line-clamp-none">
                Welcome back,{" "}
                <span className="font-semibold text-[#4b33e8]">
                  {mounted ? user?.displayName || "User" : "User"}
                </span>
                . Here's what's happening today.
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Org Filter */}
              <div className="relative flex-1 sm:flex-none min-w-[140px] sm:min-w-[180px]">
                <select
                  value={selectedOrgId}
                  onChange={(e) => setSelectedOrgId(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-[#263238] hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                  disabled={loading}
                >
                  <option value="all">Global (All Orgs)</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.company_name}
                    </option>
                  ))}
                </select>
                <i className="fi fi-rr-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <i className="fi fi-rr-angle-small-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
              </div>

              {/* Date Filter */}
              <div className="relative flex-1 sm:flex-none min-w-[110px] sm:min-w-[140px]">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs sm:text-sm font-bold text-[#263238] hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                  disabled={loading}
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="last_7_days">Last 7 Days</option>
                  <option value="this_month">This Month</option>
                  <option value="last_month">Last Month</option>
                  <option value="this_year">1 Year</option>
                  <option value="multi_year">Multi-Year</option>
                  <option value="all_time">All Time</option>
                </select>
                <i className="fi fi-rr-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <i className="fi fi-rr-angle-small-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 sm:px-4 py-2 bg-[#4b33e8] rounded-xl text-xs sm:text-sm font-bold text-white cursor-default flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full bg-white ${loading ? '' : 'animate-pulse'}`}></span>
                  <span className="hidden sm:inline">{loading ? "Updating..." : "Live Updates"}</span>
                  <span className="sm:hidden">{loading ? "..." : "Live"}</span>
                </div>
                
                <button
                    onClick={() => {
                        const oid = selectedOrgId === "all" ? "all" : selectedOrgId;
                        const dFilter = dateFilter;
                        window.open(`/dashboard_report?orgId=${oid}&dateFilter=${dFilter}`, '_blank');
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#4b33e8] hover:border-[#4b33e8] transition-all"
                    title="Generate Report"
                >
                    <i className="fi flex fi-rr-print"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Top Stats Row */}
          <TopStats stats={stats} chartData={chartData} loading={loading} />

          {/* Secondary Stats Grid */}
          <SecondaryStats stats={stats} secondaryStats={secondaryStats} loading={loading} />

          {/* Analytics Tab Selection */}
          <div className="bg-gray-100/50 p-1 rounded-2xl inline-flex gap-1 w-full sm:w-auto">
            {[
              { id: "prospect", label: "Prospect Wise Performance", short: "Prospects" },
              { id: "callDetails", label: "Call Hourly Analytics", short: "Hours" },
              { id: "agentPerf", label: "Agent Performance", short: "Agents" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? "bg-white text-[#4b33e8] shadow-sm scale-[1.02]"
                    : "text-gray-500 hover:text-gray-900"
                }`}
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.short}</span>
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
              selectedOrgId={selectedOrgId}
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
