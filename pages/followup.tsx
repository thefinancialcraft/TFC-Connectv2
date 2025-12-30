import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../lib/authService";
import { supabase } from "../lib/supabase";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";
import BottomNav from "../components/BottomNav";

export default function FollowUp() {
  const router = useRouter();
  // Initialize with cached data from localStorage
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cachedData = getStoredUserData();
    if (cachedData) {
      return {
        uid: cachedData.user_id || '',
        displayName: cachedData.user_name || cachedData.displayName || null,
        email: cachedData.email || '',
        phone: null,
        providers: [],
        providerType: null,
        createdAt: '',
        lastSignInAt: null,
        employeeId: cachedData.employee_id || null,
        role: cachedData.role || null,
        approvalStatus: null,
        accountStatus: null,
        updatedAt: null,
        profilePicUrl: cachedData.profile_pic_url || null,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("followup");
  const [mounted, setMounted] = useState(false);

  // Data States
  const [leads, setLeads] = useState<any[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    overdue: 0,
    upcoming: 0
  });

  const fetchAuth = async () => {
    const result = await checkAuthAndFetchProfile();
    
    if (result.shouldRedirect) {
      router.push("/login");
      return;
    }

    if (result.error) {
      setError(result.error);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      return;
    }

    if (result.user) {
      setUser(result.user);
      fetchLeads(result.user);
    }
  };

  const fetchLeads = async (currentUser: UserProfile) => {
    try {
      setLoadingLeads(true);

      // 1. Fetch leads (customers) first
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .in('disposition', ['Callback', 'Call Back', 'Follow Up', 'FollowUp'])
        .order('next_called_at', { ascending: true });

      if (customerError) throw customerError;

      if (customerData) {
        const now = new Date();
        let overdueCount = 0;
        let upcomingCount = 0;

        // 2. Extract IDs for bulk fetching
        const campaignIds = [...new Set(customerData.map(c => c.campaign_id).filter(Boolean))];
        const orgIds = [...new Set(customerData.map(c => c.organization_id).filter(Boolean))];
        const userIds = [...new Set(customerData.map(c => c.assigned_to).filter(Boolean))];

        // 3. Fetch related data in parallel
        const [campaignsResult, orgsResult, usersResult] = await Promise.all([
          campaignIds.length > 0 ? supabase.from('campaigns').select('id, name').in('id', campaignIds) : { data: [] },
          orgIds.length > 0 ? supabase.from('organizations').select('id, company_name').in('id', orgIds) : { data: [] },
          userIds.length > 0 ? supabase.from('user_profiles').select('user_id, user_name').in('user_id', userIds) : { data: [] }
        ]);

        // 4. Create Lookup Maps
        const campaignMap = Object.fromEntries(campaignsResult.data?.map((c: any) => [c.id, c.name]) || []);
        const orgMap = Object.fromEntries(orgsResult.data?.map((o: any) => [o.id, o.company_name]) || []);
        const userMap = Object.fromEntries(usersResult.data?.map((u: any) => [u.user_id, u.user_name]) || []);

        // 5. Enrich Data
        const enrichedLeads = customerData.map((lead) => {
          let isOverdue = false;
          let isUpcoming = false;
          
          if (lead.next_called_at) {
            const nextCallDate = new Date(lead.next_called_at);
            if (nextCallDate < now) {
              isOverdue = true;
              overdueCount++;
            } else {
              isUpcoming = true;
              upcomingCount++;
            }
          } else {
             isOverdue = true; 
             overdueCount++;
          }

          return {
            ...lead,
            isOverdue,
            isUpcoming,
            campaign_name: campaignMap[lead.campaign_id] || 'Unknown Campaign',
            organization_name: orgMap[lead.organization_id] || '—',
            assigned_name: userMap[lead.assigned_to] || 'Unassigned',
            status_label: isOverdue ? 'Overdue' : 'Upcoming'
          };
        });

        setLeads(enrichedLeads);
        setStats({
          total: customerData.length,
          overdue: overdueCount,
          upcoming: upcomingCount
        });
      }

    } catch (err: any) {
      console.error("Error fetching follow-up leads:", err);
    } finally {
      setLoadingLeads(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAuth();
    
    // Auto-refresh periodically?
    const interval = setInterval(() => {
        if(user) fetchLeads(user);
    }, 60000); // 1 min

    return () => clearInterval(interval);
  }, [router.isReady]);

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '—';
        return date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
    } catch (e) {
        return '—';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#4b33e8' }}></div>
          <div className="text-lg" style={{ color: "#4b33e8" }}>Loading Follow Ups...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}>
      {/* Left Sidebar */}
      <Sidebar
        user={{
          displayName: user?.displayName || null,
          email: user?.email || "",
          employeeId: user?.employeeId || null,
          lastSignInAt: user?.lastSignInAt || null,
          profilePicUrl: user?.profilePicUrl || null,
        }}
        activeNav={activeNav}
        onNavChange={setActiveNav}
        userRole={user?.role || null}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <Header
          user={{
            displayName: user?.displayName || null,
            email: user?.email || "",
            employeeId: user?.employeeId || null,
            profilePicUrl: user?.profilePicUrl || null,
          }}
          onLogout={handleLogoutClick}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#f6f5f7" }}>
          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            
            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}>
                Follow Up Scheduler
              </h1>
              <p className="text-sm text-gray-500 mt-1" style={{ fontFamily: "'Roboto', sans-serif" }}>
                Manage upcoming calls and overdue tasks spanning all your campaigns.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8">
                {/* Total Card */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md h-40"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(75, 51, 232, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-indigo-100/30 blur-2xl" />
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-indigo-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-indigo-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-calendar-clock text-5xl sm:text-6xl"
                      style={{ color: "#4b33e8" }}
                    ></i>
                  </div>
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Total Follow Ups
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-calendar-clock text-lg sm:text-xl"
                          style={{ color: "#4b33e8" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {stats.total}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Active Callbacks
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overdue Card */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md h-40"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(239, 68, 68, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-red-100/30 blur-2xl" />
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-red-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-red-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-time-past text-5xl sm:text-6xl"
                      style={{ color: "#ef4444" }}
                    ></i>
                  </div>
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #ef4444 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Overdue
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-time-past text-lg sm:text-xl"
                          style={{ color: "#ef4444" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {stats.overdue}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Action Required
                      </p>
                    </div>
                  </div>
                </div>

                {/* Upcoming Card */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md h-40"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-blue-100/30 blur-2xl" />
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-blue-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-blue-300/15 blur-lg" />
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-calendar-lines text-5xl sm:text-6xl"
                      style={{ color: "#3b82f6" }}
                    ></i>
                  </div>
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Upcoming
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-calendar-lines text-lg sm:text-xl"
                          style={{ color: "#3b82f6" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {stats.upcoming}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                         Scheduled for Later
                      </p>
                    </div>
                  </div>
                </div>
            </div>

            {/* Leads Table Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
                
                {/* Mobile Header (similar to provided snippet) */}
                <div className="mb-4 sm:hidden">
                    <h2 className="text-lg font-bold mb-1" style={{ color: "rgb(38, 50, 56)", fontFamily: "'Poppins', sans-serif" }}>
                        Scheduled Leads
                    </h2>
                    <p className="text-xs" style={{ color: "rgb(120, 126, 157)", fontFamily: "'Roboto', sans-serif" }}>
                        Manage upcoming and overdue calls
                    </p>
                </div>

                {/* Mobile Search & Actions */}
                <div className="mb-4 sm:hidden space-y-3">
                     <div className="relative w-full">
                        <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input 
                            placeholder="Search leads..." 
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                            type="text" 
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                     </div>
                     {/* Mobile Filters could go here */}
                </div>

                {/* Desktop Header & Controls */}
                <div className="hidden sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold mb-1" style={{ color: "rgb(38, 50, 56)", fontFamily: "'Poppins', sans-serif" }}>
                            Scheduled Leads
                        </h2>
                        <p className="text-sm" style={{ color: "rgb(120, 126, 157)", fontFamily: "'Roboto', sans-serif" }}>
                            Manage upcoming and overdue calls
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                            <input 
                                placeholder="Search leads..." 
                                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" 
                                type="text" 
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        {/* Additional Filter Buttons (Visual only for now matching style) */}
                         <button className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center" title="Filter">
                            <i className="fi flex fi-rr-filter text-sm text-gray-600"></i>
                        </button>
                        <button 
                            onClick={() => user && fetchLeads(user)}
                            disabled={loadingLeads}
                            className={`h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center ${loadingLeads ? 'opacity-50 cursor-not-allowed' : ''}`} 
                            title="Refresh Data"
                        >
                            <i className={`fi flex fi-rr-refresh text-sm text-gray-600 ${loadingLeads ? 'animate-spin' : ''}`}></i>
                        </button>
                    </div>
                </div>

                {loadingLeads ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"></div>
                        <p className="text-xs text-gray-400 font-bold">Syncing schedule...</p>
                    </div>
                ) : leads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <i className="fi fi-rr-calendar-check text-2xl text-gray-300"></i>
                        </div>
                        <h3 className="text-gray-500 font-bold text-sm mb-1">All Caught Up!</h3>
                        <p className="text-xs text-gray-400">You have no pending follow-up calls matching your criteria.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-gray-50">
                                    <th className="px-4 py-4 w-10">
                                        <div className="flex items-center justify-center">
                                            <input className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer" type="checkbox" />
                                        </div>
                                    </th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Customer Name</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Contact Info</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">Status</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Organization</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Campaign</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Scheduled Time</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">Assigned To</th>
                                    <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {leads
                                  .filter(lead => 
                                    lead.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                    lead.phone_no?.includes(searchQuery)
                                  )
                                  .map((lead) => (
                                    <tr key={lead.id} className="group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0" onClick={() => router.push(`/campaign/${lead.campaign_id}/${lead.id}`)}>
                                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-center">
                                                <input className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer" type="checkbox" />
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase">
                                                    {lead.customer_name?.charAt(0) || 'C'}
                                                </div>
                                                <span className="text-xs font-medium text-gray-800" style={{ fontFamily: "'Poppins', sans-serif", color: "rgb(38, 50, 56)" }}>
                                                    {lead.customer_name || 'Anonymous'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-medium text-gray-700 leading-none mb-1">{lead.phone_no}</span>
                                                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Verified Lead</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <div className="flex justify-center">
                                                {lead.isOverdue ? (
                                                    <div className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100">
                                                        Overdue
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100">
                                                        Upcoming
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <i className="fi flex fi-rr-building text-[#4b33e8] text-xs"></i>
                                                <span className="text-[12px] font-medium text-gray-700" style={{ fontFamily: "'Roboto', sans-serif" }}>
                                                    {lead.organization_name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
                                                {lead.campaign_name}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex flex-col">
                                                <span className={`text-xs font-medium leading-none mb-1 ${lead.isOverdue ? 'text-red-500' : 'text-gray-700'}`}>
                                                    {formatDate(lead.next_called_at)}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">Scheduled</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="text-xs font-medium text-gray-600">
                                                {lead.assigned_name || 'Unassigned'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                                                <button 
                                                    onClick={() => router.push(`/campaign/${lead.campaign_id}/${lead.id}`)}
                                                    className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#4b33e8] text-white rounded-lg text-[10px] font-bold shadow-md hover:bg-[#3f2bc2] transition-colors"
                                                >
                                                    <i className="fi fi-rr-phone-call text-xs"></i>
                                                    <span>Call</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav activeNav="followup" userRole={user?.role || null} />
    </div>
  );
}
