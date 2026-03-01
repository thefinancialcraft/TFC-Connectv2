import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
// TopStats is now dynamically imported below with other chart components

import SecondaryStats from "@/components/dashboard/SecondaryStats";
import { supabase } from "@/lib/supabase";

// Hooks
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useDashboardCharts } from "@/hooks/useDashboardCharts";
import { useAgentPerformance } from "@/hooks/useAgentPerformance";
import { DashboardErrorBoundary } from "@/components/DashboardErrorBoundary";
import { useUser } from "@/components/AppLayout";
import { DashboardLevel, getUserDashboardLevel } from "@/lib/dashboardUtils";
import { useSessionState } from "@/hooks/useSessionState";

import dynamic from "next/dynamic";

// Dynamically import dashboard tabs to prevent Recharts SSR sizing issues
const TopStats = dynamic(() => import("@/components/dashboard/TopStats"), { ssr: false });
const ProspectTab = dynamic(() => import("@/components/dashboard/ProspectTab"), { ssr: false });
const AgentPerformanceTab = dynamic(() => import("@/components/dashboard/AgentPerformanceTab"), { ssr: false });
const HourlyAnalyticsTab = dynamic(() => import("@/components/dashboard/HourlyAnalyticsTab"), { ssr: false });



export default function Dashboard() {
  const { user, mounted } = useUser();
  
  // Organization filter
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useSessionState<string>("dash_selectedOrgId", "all");

  // User filter
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useSessionState<string>("dash_selectedUserId", "all");
  
  // Filters Dropdown state
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useSessionState<string>("dash_activeTab", "prospect");

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Data hooks
  const { stats, secondaryStats, performanceMetrics, loading: statsLoading, fetchStats } = useDashboardStats();
  const { chartData, pieData, heatmapData, campaignData, hourlyStats, loading: chartsLoading, fetchChartData } = useDashboardCharts();
  const { agentData, loading: agentLoading, fetchAgentPerformance } = useAgentPerformance();

  // Dashboard Level State
  const [dashboardLevel, setDashboardLevel] = useState<DashboardLevel>(DashboardLevel.UNKNOWN);
  const [isOrgLocked, setIsOrgLocked] = useState(false);
  const [isUserLocked, setIsUserLocked] = useState(false);
  const hasInitialized = useRef(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initialize Dashboard Level Logic & Constraints
  useEffect(() => {
    if (!mounted || !user) return;

    const level = getUserDashboardLevel(user);
    const currentId = user.uid || (user as any).id || (user as any).user_id;
    
    setDashboardLevel(level);

    // Apply Constraints based on level
    // Apply Constraints based on level
    if (level === DashboardLevel.LEVEL_1_ADMIN) {
      // Level 1: Full Access, default to ALL stats
      setIsOrgLocked(false);
      setIsUserLocked(false);
      setSelectedUserId("all"); 
    } else if (level === DashboardLevel.LEVEL_2_CLIENT_CEO) {
      setIsOrgLocked(true);
      setIsUserLocked(false);
      if (user.organization_id) setSelectedOrgId(user.organization_id);
    } else if (level === DashboardLevel.LEVEL_3_TL_SALES) {
      setIsOrgLocked(true);
      setIsUserLocked(false);
      if (user.organization_id) setSelectedOrgId(user.organization_id);
    } else if (level === DashboardLevel.LEVEL_4_AGENT_SALES) {
      setIsOrgLocked(true);
      setIsUserLocked(true);
      
      // FORCE selections immediately for Level 4
      if (user.organization_id) setSelectedOrgId(user.organization_id);
      if (currentId) setSelectedUserId(currentId);
      
      console.log(`[Dashboard] Level 4 Lockdown Applied: Org=${user.organization_id}, User=${currentId}`);
    }
    
    hasInitialized.current = true;
  }, [mounted, user?.uid, user?.organization_id]); // Trigger when key user info changes

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

  // Fetch users when org changes
  useEffect(() => {
    // Skip if level isn't determined yet
    if (dashboardLevel === DashboardLevel.UNKNOWN) return;

    // Skip if user is locked to self (Level 4)
    if (isUserLocked) return;

    const fetchUsers = async () => {
      // Basic query for profiles
      const queryBase = supabase
        .from("user_profiles")
        .select("user_id, user_name, role")
        .neq("approval_status", "rejected");

      let finalQuery;

      // Stage for Level 3: Strictly Fetch Team Members
      if (dashboardLevel === DashboardLevel.LEVEL_3_TL_SALES && user?.uid) {
        console.log(`[Dashboard] Filtering users for TL:`, user.uid);
        
        // Fetch teams where current user is leader
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('members')
          .eq('leader_id', user.uid)
          .eq('is_active', true);
        
        if (teamError) {
          console.error("[Dashboard] Error fetching TL teams:", teamError);
        }

        const memberIds = new Set<string>();
        memberIds.add(user.uid); // Always include the TL themself
        
        if (teamData && teamData.length > 0) {
          teamData.forEach(team => {
            if (Array.isArray(team.members)) {
              team.members.forEach((id: string) => {
                if (id && typeof id === 'string') memberIds.add(id);
              });
            }
          });
        }

        const finalIds = Array.from(memberIds);
        console.log(`[Dashboard] Restricting User Selection to ${finalIds.length} members`);

        // Apply membership filter
        finalQuery = queryBase.in("user_id", finalIds);

      } else if (selectedOrgId !== "all") {
        // Fallback for CEO (Level 2) or Admin (Level 1) selecting an org
        finalQuery = queryBase.eq("organization_id", selectedOrgId);
      } else {
        // Global view for Admin (Level 1)
        finalQuery = queryBase;
      }

      const { data, error: userError } = await finalQuery.order("user_name");
      
      if (userError) {
        console.error("[Dashboard] Error fetching users:", userError);
      }
      
      if (data) {
        setUsers(data);
      } else {
        setUsers([]);
      }
    };

    if (mounted) {
        // For Level 4, we don't fetch users list, stay locked to self
        if (dashboardLevel !== DashboardLevel.LEVEL_4_AGENT_SALES) {
            fetchUsers();
            
            // Only reset to "all" if NOT locked
            if (!isUserLocked) {
                setSelectedUserId("all");
            }
        }
    }
  }, [selectedOrgId, isUserLocked, dashboardLevel, mounted, user?.uid]);

  // Date filter state
  const [dateFilter, setDateFilter] = useSessionState<string>("dash_dateFilter", "today");

  // Fetch all dashboard data when filters change
  useEffect(() => {
    if (mounted && user) {
      const currentId = user.uid || (user as any).id || (user as any).user_id;
      
      let orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
      let userFilter = selectedUserId === "all" ? undefined : selectedUserId;
      
      // --- CRITICAL OVERRIDE FOR LEVEL 4 (AGENT) ---
      // This ensures that even if UI state is in transition, the data fetched is always their own.
      if (dashboardLevel === DashboardLevel.LEVEL_4_AGENT_SALES) {
          orgFilter = user.organization_id || undefined;
          userFilter = currentId || undefined;
      }
      
      // Fetch all data in parallel
      Promise.all([
        fetchStats(orgFilter, dateFilter, userFilter),
        fetchChartData(orgFilter, dateFilter, undefined, userFilter),
        fetchAgentPerformance(orgFilter, dateFilter, undefined, false, userFilter),
      ]);
    }
  }, [selectedOrgId, selectedUserId, dateFilter, user?.uid, user?.organization_id, mounted, dashboardLevel, fetchStats, fetchChartData, fetchAgentPerformance]);

  const loading = statsLoading || chartsLoading || agentLoading;

  useEffect(() => {
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [loading]);

  return (
    <>
      <DashboardErrorBoundary>
        {isInitialLoad && (statsLoading && chartsLoading && agentLoading) ? (
          <div className="flex flex-col min-h-[80vh] items-center justify-center animate-in fade-in duration-300">
            <div className="w-12 h-12 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-[#263238] font-bold text-lg animate-pulse" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Loading Dashboard...
            </p>
            <p className="text-[#787E9D] text-sm font-medium mt-1">Please wait while we gather your statistics</p>
          </div>
        ) : (
          <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 sm:space-y-8 max-w-[1400px]">
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
            
            <div className="flex items-center gap-3">
              {/* Consolidated Filters Dropdown */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`h-10 px-4 rounded-xl border flex items-center gap-2 transition-all  font-bold text-sm ${
                    showFilters
                      ? "border-[#4b33e8] bg-[#4b33e8] text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <i className="fi flex fi-rr-filter"></i>
                  <span className="hidden sm:inline">Filters</span>
                  {(selectedOrgId !== "all" || selectedUserId !== "all" || dateFilter !== "today") && (
                    <span className={`flex items-center justify-center w-2 h-2 rounded-full ${showFilters ? 'bg-white' : 'bg-[#4b33e8]'}`}></span>
                  )}
                </button>

                {showFilters && (
                  <div className="absolute top-full right-0 mt-2 w-[240px] sm:w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[100] animate-in fade-in zoom-in duration-200">
                    <div className="space-y-4">
                      {/* Org Filter */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Organization</label>
                        <div className="relative">
                          <select
                            value={selectedOrgId}
                            onChange={(e) => setSelectedOrgId(e.target.value)}
                            className={`w-full appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm font-bold text-[#263238] focus:outline-none focus:border-[#4b33e8] transition-all ${isOrgLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={isOrgLocked}
                          >
                            <option value="all" disabled={isOrgLocked}>Global (All Orgs)</option>
                            {organizations.map((org) => (
                              <option key={org.id} value={org.id} disabled={isOrgLocked && selectedOrgId !== org.id}>
                                {org.company_name}
                              </option>
                            ))}
                          </select>
                          <i className="fi fi-rr-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                          <i className={`fi ${isOrgLocked ? 'fi-rr-lock' : 'fi-rr-angle-small-down'} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none`}></i>
                        </div>
                      </div>

                      {/* User Filter */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">User Selection</label>
                        <div className="relative">
                          <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className={`w-full appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm font-bold text-[#263238] focus:outline-none focus:border-[#4b33e8] transition-all ${isUserLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={isUserLocked}
                          >
                            <option value="all" disabled={isUserLocked}>
                              {dashboardLevel === DashboardLevel.LEVEL_3_TL_SALES ? "All Team Members" : "All Users"}
                            </option>
                            {isUserLocked ? (
                                <option value={user?.uid}>{user?.displayName || 'Me'}</option>
                            ) : (
                              users.map((u) => (
                                  <option key={u.user_id} value={u.user_id}>
                                  {u.user_name || "Unknown User"}
                                  </option>
                              ))
                            )}
                          </select>
                          <i className="fi fi-rr-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                          <i className={`fi ${isUserLocked ? 'fi-rr-lock' : 'fi-rr-angle-small-down'} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none`}></i>
                        </div>
                      </div>

                      {/* Date Filter */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Time Period</label>
                        <div className="relative">
                          <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="w-full appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm font-bold text-[#263238] focus:outline-none focus:border-[#4b33e8] transition-all cursor-pointer"
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
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            setSelectedOrgId(isOrgLocked ? selectedOrgId : "all");
                            setSelectedUserId(isUserLocked ? selectedUserId : "all");
                            setDateFilter("all_time");
                            setShowFilters(false);
                          }}
                          className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="px-3 h-10 bg-[#4b33e8] rounded-xl text-xs font-bold text-white cursor-default flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full bg-white ${(statsLoading || chartsLoading || agentLoading) ? '' : 'animate-pulse'}`}></span>
                  <span className="hidden sm:inline">{(statsLoading || chartsLoading || agentLoading) ? "Updating..." : "Live Updates"}</span>
                  <span className="sm:hidden">{(statsLoading || chartsLoading || agentLoading) ? "..." : "Live"}</span>
                </div>
                
                <button
                    onClick={() => {
                        const oid = selectedOrgId === "all" ? "all" : selectedOrgId;
                        const uid = selectedUserId === "all" ? "all" : selectedUserId;
                        const dFilter = dateFilter;
                        window.open(`/dashboard_report?orgId=${oid}&userId=${uid}&dateFilter=${dFilter}`, '_blank');
                    }}
                    className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#4b33e8] hover:border-[#4b33e8] transition-all"
                    title="Generate Report"
                >
                    <i className="fi flex fi-rr-print"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Top Stats Row (Only depends on stats and charts) */}
          <TopStats stats={stats} chartData={chartData} loading={statsLoading || chartsLoading} />

          {/* Secondary Stats Grid (Only depends on stats) */}
          <SecondaryStats stats={stats} secondaryStats={secondaryStats} loading={statsLoading} />

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
              loading={statsLoading || chartsLoading}
            />
          )}

          {activeTab === "agentPerf" && (
            <AgentPerformanceTab
              agentData={agentData}
              totalDials={stats.totalDials}
              selectedOrgId={selectedOrgId}
              selectedUserId={selectedUserId}
              dateFilter={dateFilter}
              loading={agentLoading}
            />
          )}

          {activeTab === "callDetails" && (
            <HourlyAnalyticsTab
              heatmapData={heatmapData}
              hourlyStats={hourlyStats}
              selectedOrgId={selectedOrgId}
              selectedUserId={selectedUserId}
              dateFilter={dateFilter}
              loading={chartsLoading}
            />
          )}

        </div>
        )}
      </DashboardErrorBoundary>
    </>
  );
}
