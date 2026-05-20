import { useState, useEffect, useRef, useMemo } from "react";
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

// Modern Dashboard V2
import NewDashboard from "./dashboard_v2";



export default function Dashboard() {
  const router = useRouter();
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
  const [syncedTotals, setSyncedTotals] = useState<{ totalDials: number; totalDuration: number } | null>(null);
  const [activeTab, setActiveTab] = useSessionState<string>("dash_activeTab", "prospect");
  
  // Security Restrictions
  const [restrictedUserIds, setRestrictedUserIds] = useState<string[] | null>(null);

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
  const [isMobile, setIsMobile] = useState(false);
  const [hasCheckedDevice, setHasCheckedDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Covering both mobile and tablets for the new UI
      setHasCheckedDevice(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldShowNewDashboard = useMemo(() => {
    if (!user || !isMobile) return false;
    
    // Exact criteria provided by user
    const hasCorrectRole = user.role?.toLowerCase() === 'user';
    const hasCorrectClientStatus = user.isClient === true;
    const hasCorrectDesignation = user.designation?.toLowerCase() === 'agent';
    
    return hasCorrectRole && hasCorrectClientStatus && hasCorrectDesignation;
  }, [user, isMobile]);

  // Initialize Dashboard Level Logic & Constraints
  useEffect(() => {
    if (!mounted || !user || !hasCheckedDevice) return;

    const level = getUserDashboardLevel(user);
    const currentId = user.uid || (user as any).id || (user as any).user_id;
    
    setDashboardLevel(level);

    // Apply Constraints based on level
    if (level === DashboardLevel.LEVEL_1_ADMIN) {
      // Level 1: Full Access, default to ALL stats
      setIsOrgLocked(false);
      setIsUserLocked(false);
      setSelectedOrgId("all");
      setSelectedUserId("all");
      setRestrictedUserIds(null);
    } else if (level === DashboardLevel.LEVEL_2_CLIENT_CEO) {
      // Level 2: Locked to Org, Full Access within Org
      setIsOrgLocked(true);
      setIsUserLocked(false);
      if (user.organization_id) setSelectedOrgId(user.organization_id);
      setSelectedUserId("all");
      setRestrictedUserIds(null);
    } else if (level === DashboardLevel.LEVEL_3_TL_SALES) {
      // Level 3: Locked to Org, User selection available but restricted to team
      setIsOrgLocked(true);
      setIsUserLocked(false);
      if (user.organization_id) setSelectedOrgId(user.organization_id);
      setSelectedUserId("all");
      // Fail secure: Default to self only until team members are fetched
      setRestrictedUserIds([currentId]);
    } else if (level === DashboardLevel.LEVEL_4_AGENT_SALES) {
      // Level 4: Completely Locked to self
      setIsOrgLocked(true);
      setIsUserLocked(true);
      if (user.organization_id) setSelectedOrgId(user.organization_id);
      if (currentId) {
        setSelectedUserId(currentId);
        setRestrictedUserIds([currentId]);
      }
    }
    
    hasInitialized.current = true;
  }, [mounted, user?.uid, user?.organization_id, user?.role, user?.designation, user?.isClient, hasCheckedDevice]); // Trigger when key user info changes

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
      // EXPLICIT LOGIC FOR LEVEL 2 (CLIENT CEO)
      if (dashboardLevel === DashboardLevel.LEVEL_2_CLIENT_CEO && user?.organization_id) {
          const { data, error } = await supabase
              .from("user_profiles")
              .select("user_id, user_name, role, designation")
              .eq("organization_id", user.organization_id)
              .neq("approval_status", "rejected")
              .order("user_name");
              
          if (error) {
              console.error("[Dashboard] Error fetching Level 2 users:", error);
              setUsers([]);
          } else {
              setUsers(data || []);
          }
          setRestrictedUserIds(null);
          return;
      }

      // EXPLICIT LOGIC FOR LEVEL 3 (TEAM LEADER)
      if (dashboardLevel === DashboardLevel.LEVEL_3_TL_SALES && user?.uid) {
        console.log(`[Dashboard] Filtering users for TL:`, user.uid);
        const { data: teamData, error: teamError } = await supabase
          .from('teams')
          .select('members')
          .eq('leader_id', user.uid)
          .eq('is_active', true);
        
        if (teamError) console.error("[Dashboard] Error fetching TL teams:", teamError);

        const memberIds = new Set<string>();
        memberIds.add(user.uid);
        
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
        setRestrictedUserIds(finalIds);

        const { data, error } = await supabase
          .from("user_profiles")
          .select("user_id, user_name, role, designation")
          .in("user_id", finalIds)
          .neq("approval_status", "rejected")
          .order("user_name");

        if (error) {
            console.error("[Dashboard] Error fetching Level 3 users:", error);
            setUsers([]);
        } else {
            setUsers(data || []);
        }
        return;
      }

      // FALLBACK FOR LEVEL 1 (ADMIN)
      let queryBase = supabase
        .from("user_profiles")
        .select("user_id, user_name, role, designation")
        .neq("approval_status", "rejected");

      let finalQuery = queryBase;
      if (selectedOrgId !== "all") {
        finalQuery = queryBase.eq("organization_id", selectedOrgId);
      }

      const { data, error: userError } = await finalQuery.order("user_name");
      
      if (userError) {
        console.error("[Dashboard] Error fetching Admin users:", userError);
        setUsers([]);
      } else {
        setUsers(data || []);
      }
      setRestrictedUserIds(null);
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

  useEffect(() => {
    if (mounted && user && dashboardLevel !== DashboardLevel.UNKNOWN) {
      if (dashboardLevel === DashboardLevel.LEVEL_4_AGENT_SALES) {
        setRestrictedUserIds(prev => {
          if (prev && prev.length === 1 && prev[0] === user.uid) return prev;
          return [user.uid];
        });
      }
    }
  }, [mounted, user?.uid, dashboardLevel]);

  // Fetch all dashboard data when filters change
  useEffect(() => {
    if (mounted && user) {
      const currentId = user.uid || (user as any).id || (user as any).user_id;
      
      let orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
      let userFilter = selectedUserId === "all" ? undefined : selectedUserId;
      
      // --- CRITICAL OVERRIDE FOR NON-ADMINS ---
      // This ensures that even if UI state is in transition or reset, the data fetched is always strictly bound to their own org.
      if (dashboardLevel !== DashboardLevel.LEVEL_1_ADMIN) {
          orgFilter = user.organization_id || undefined;
      }
      
      // --- CRITICAL OVERRIDE FOR LEVEL 4 (AGENT) ---
      if (dashboardLevel === DashboardLevel.LEVEL_4_AGENT_SALES) {
          userFilter = currentId || undefined;
      }
      
      // Fetch all data in parallel
      Promise.all([
        fetchStats(orgFilter, dateFilter, userFilter, restrictedUserIds),
        fetchChartData(orgFilter, dateFilter, undefined, userFilter, restrictedUserIds),
        fetchAgentPerformance(orgFilter, dateFilter, undefined, false, userFilter, restrictedUserIds),
      ]);
    }
  }, [selectedOrgId, selectedUserId, dateFilter, user?.uid, user?.organization_id, mounted, dashboardLevel, fetchStats, fetchChartData, fetchAgentPerformance, restrictedUserIds]);

  const loading = statsLoading || chartsLoading || agentLoading;

  useEffect(() => {
    if (!loading) {
      setIsInitialLoad(false);
    }
  }, [loading]);

  if (!mounted || !hasCheckedDevice) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-[#f6f5ff]">
        <div className="w-12 h-12 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (shouldShowNewDashboard) {
    return <NewDashboard />;
  }

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
                <p className="text-sm text-gray-500 mt-1">
                  Here's what's happening with your business today.
                </p>
                </p>
            </div>
            
            <div className="flex items-center justify-start lg:justify-end gap-3 w-full lg:w-auto">
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
                  <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:absolute sm:inset-auto sm:top-full sm:right-0 sm:translate-y-0 mt-2 w-auto sm:w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 sm:p-4 z-[100] animate-in fade-in zoom-in duration-200 origin-center sm:origin-top-right">
                    <div className="space-y-4">
                      {/* Org Filter */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Organization</label>
                        <div className="relative">
                          <select
                            value={selectedOrgId}
                            onChange={(e) => setSelectedOrgId(e.target.value)}
                            className={`w-full appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm font-bold text-[#263238] focus:outline-none focus:border-[#4b33e8] transition-all ${dashboardLevel !== DashboardLevel.LEVEL_1_ADMIN ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                            disabled={dashboardLevel !== DashboardLevel.LEVEL_1_ADMIN}
                          >
                            {dashboardLevel === DashboardLevel.LEVEL_1_ADMIN && <option value="all">Global (All Orgs)</option>}
                            {dashboardLevel !== DashboardLevel.LEVEL_1_ADMIN && selectedOrgId === "all" && <option value="all">Your Organization</option>}
                            {organizations
                              .filter((org) => dashboardLevel === DashboardLevel.LEVEL_1_ADMIN || org.id === user?.organization_id)
                              .map((org) => (
                              <option key={org.id} value={org.id}>
                                {org.company_name}
                              </option>
                            ))}
                          </select>
                          <i className="fi fi-rr-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                          <i className={`fi ${dashboardLevel !== DashboardLevel.LEVEL_1_ADMIN ? 'fi-rr-lock' : 'fi-rr-angle-small-down'} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none`}></i>
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
                            {!isUserLocked && (
                              <option value="all">
                                {dashboardLevel === DashboardLevel.LEVEL_3_TL_SALES ? "All Team Members" : "All Users"}
                              </option>
                            )}
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
                            if (dashboardLevel === DashboardLevel.LEVEL_1_ADMIN) {
                                setSelectedOrgId("all");
                                setSelectedUserId("all");
                            } else if (dashboardLevel === DashboardLevel.LEVEL_4_AGENT_SALES) {
                                setSelectedOrgId(user?.organization_id || "all");
                                setSelectedUserId(user?.uid || "all");
                            } else {
                                // Level 2 & 3
                                setSelectedOrgId(user?.organization_id || "all");
                                setSelectedUserId("all");
                            }
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
          <TopStats 
            stats={{
              ...stats,
              totalDials: syncedTotals ? syncedTotals.totalDials : stats.totalDials,
              totalTalktime: syncedTotals ? syncedTotals.totalDuration : stats.totalTalktime,
            }} 
            chartData={chartData} 
            loading={statsLoading || chartsLoading} 
          />

          {/* Team Management CTA (Compact Modern Look - Mobile Only) */}
          {dashboardLevel !== DashboardLevel.LEVEL_4_AGENT_SALES && (
            <div className="md:hidden relative overflow-hidden bg-gradient-to-r from-[#4b33e8] via-[#6366f1] to-[#8b5cf6] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl shadow-indigo-100/20 group">
              {/* Enhanced Graphic Patterns Layer */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {/* Tilted SVG Dotted Pattern */}
                <div className="absolute inset-[-100%] opacity-[0.7] rotate-[-12deg]" 
                    style={{ 
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
                      backgroundRepeat: 'repeat'
                    }}>
                </div>
                {/* Modern Abstract Shapes */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/20 rounded-full blur-[60px] animate-pulse"></div>
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-[50px]"></div>
              </div>
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 hidden md:flex shrink-0">
                  <i className="fi fi-rr-users-alt text-white text-lg"></i>
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Empower Your Team’s Performance
                  </h3>
                  <p className="text-white/70 text-[10px] font-medium hidden lg:block tracking-wide">
                    Real-time monitoring and workforce optimization simplified.
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => router.push("/portal/team")}
                className="relative z-10 flex items-center gap-2.5 px-6 py-2.5 bg-white text-[#4b33e8] rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all hover:shadow-lg hover:shadow-white/20 active:scale-95 shrink-0"
              >
                <span>Manage Team</span>
                 </button>
            </div>
          )}

          {/* Secondary Stats Grid (Only depends on stats) */}
          <SecondaryStats stats={stats} secondaryStats={secondaryStats} loading={statsLoading} />

          {/* Analytics Segmented Toggle Selector */}
          <div className="flex justify-center lg:justify-start">
            <div className="bg-white border border-gray-100 p-1 rounded-xl inline-flex w-full sm:w-auto relative overflow-hidden">
              {/* Sliding Background Indicator */}
              <div 
                className="absolute top-1 bottom-1 transition-all duration-300 ease-out bg-[#4b33e8] rounded-lg z-0"
                style={{
                  width: 'calc((100% - 8px) / 3)', // Assuming 3 tabs
                  left: `calc(4px + (${["prospect", "callDetails", "agentPerf"].indexOf(activeTab)} * (100% - 8px) / 3))`
                }}
              />
              
              {[
                { id: "prospect", label: "Prospect Wise ", short: "Prospects" },
                { id: "callDetails", label: "Call Hourly Analytics", short: "Hours" },
                { id: "agentPerf", label: "Agent Performance", short: "Agents" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:w-56 px-4 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 relative z-10 ${
                    activeTab === tab.id
                      ? "text-white"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50/50"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.short}</span>
                </button>
              ))}
            </div>
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
              restrictedUserIds={restrictedUserIds}
              loading={agentLoading}
              onTotalsChange={setSyncedTotals}
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
