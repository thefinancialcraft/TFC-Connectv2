import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../lib/authService";
import { supabase } from "../lib/supabase";
import { getStoredUserData, storeUserData } from "../lib/localStorageUtils";
import BottomNav from "../components/BottomNav";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, Label, LabelList,
  RadialBarChart, RadialBar, Legend
} from 'recharts';


export default function Dashboard() {
  const router = useRouter();
  // Initialize with cached data from localStorage to show previous data immediately (ghost update)
  const [user, setUser] = useState<UserProfile | null>(() => {
    const cachedData = getStoredUserData();
    if (cachedData) {
      return {
        uid: cachedData.user_id || '',
        displayName: cachedData.user_name || cachedData.displayName || null,
        email: cachedData.email || '',
        phone: null, // Will be updated from API
        providers: [],
        providerType: null,
        createdAt: '',
        lastSignInAt: null,
        employeeId: cachedData.employee_id || null,
        role: cachedData.role || null,
        approvalStatus: null, // Will be updated from API
        accountStatus: null, // Will be updated from API
        updatedAt: null, // Will be updated from API
        profilePicUrl: cachedData.profile_pic_url || null,
      };
    }
    return null;
  });
  const [loading, setLoading] = useState(false); // Start with false to avoid spinner on page change
  const [error, setError] = useState("");
  const [activeNav, setActiveNav] = useState("dashboard");
  const [mounted, setMounted] = useState(false);

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
      // Fetch latest profile data from API to ensure we have the most up-to-date information
      const { data: { session } } = await supabase.auth.getSession();
      let latestUserData = result.user;
      
      if (session) {
        try {
          const profileResponse = await fetch("/api/auth/user-profile", {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          });
          const profileData = await profileResponse.json();
          
          if (profileData.success && profileData.user) {
            // Use the latest data from API
            latestUserData = {
              ...profileData.user,
              profilePicUrl: profileData.user.profile_pic_url || null,
            };
            
            if (profileData.user.profile_complete === false) {
              router.push("/profile-completion");
              return;
      }
          }
        } catch (err) {
          console.error('Error fetching latest profile:', err);
          // Continue with result.user if API call fails
        }
      }

      // Compare existing data with fetched data - only update if there's a change
      setUser(prevUser => {
        // If no previous user, set the new user
        if (!prevUser) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || '',
              user_name: latestUserData.displayName || cachedData?.user_name || '',
              employee_id: latestUserData.employeeId || cachedData?.employee_id || '',
              role: latestUserData.role || cachedData?.role || 'user',
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }
        
        // Check if user data has actually changed (compare critical fields)
        const hasChanged = 
          prevUser.displayName !== latestUserData.displayName ||
          prevUser.employeeId !== latestUserData.employeeId ||
          prevUser.email !== latestUserData.email ||
          prevUser.approvalStatus !== latestUserData.approvalStatus ||
          prevUser.accountStatus !== latestUserData.accountStatus ||
          prevUser.role !== latestUserData.role ||
          prevUser.phone !== latestUserData.phone ||
          prevUser.profilePicUrl !== latestUserData.profilePicUrl;
        
        // Only update if data has actually changed (prevents unnecessary re-renders and UI flickering)
        if (hasChanged) {
          // Update localStorage with the new user data (including profile_pic_url)
          if (latestUserData.uid) {
            const cachedData = getStoredUserData();
            const userDataToStore = {
              user_id: latestUserData.uid,
              email: latestUserData.email || '',
              user_name: latestUserData.displayName || cachedData?.user_name || '',
              employee_id: latestUserData.employeeId || cachedData?.employee_id || '',
              role: latestUserData.role || cachedData?.role || 'user',
              profile_pic_url: latestUserData.profilePicUrl || null,
              displayName: latestUserData.displayName || undefined,
              session_token: cachedData?.session_token,
              refresh_token: cachedData?.refresh_token,
            };
            storeUserData(userDataToStore);
          }
          return latestUserData;
        }
        
        // Return previous user object to prevent unnecessary re-render and UI update
        return prevUser;
      });

      // Redirect based on approval status and account status
      // Priority order: rejected → pending → suspend/hold (direct or via status) → approved+active
      if (latestUserData.approvalStatus === 'rejected') {
        router.push("/rejected");
        return;
      } else if (latestUserData.approvalStatus === 'pending') {
        router.push("/pending");
        return;
      } else if (latestUserData.approvalStatus === 'suspend' || latestUserData.accountStatus === 'suspend') {
        router.push("/suspended");
        return;
      } else if (latestUserData.approvalStatus === 'hold' || latestUserData.accountStatus === 'hold') {
        router.push("/hold");
        return;
      }
      // If approved + active, stay on dashboard (user already set above)
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAuth();
    
    // Fetch Organizations for filtering
    const fetchOrgs = async () => {
      const { data } = await supabase.from('organizations').select('id, company_name').order('company_name');
      if (data) setOrganizations(data);
    };
    fetchOrgs();

    fetchDashboardData(selectedOrgId);
    
    // Refresh user data when page comes into focus (in case it was updated)
    const handleFocus = () => {
      fetchAuth();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router]);

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
    const date = new Date(dateString);
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${month}/${day}/${year}, ${hours}:${minutes}`;
    } catch (e) {
      return "N/A";
    }
  };

  const getLastLoginText = () => {
    if (!user?.lastSignInAt) return "Just now";
    const now = new Date();
    const lastLogin = new Date(user.lastSignInAt);
    const diffMs = now.getTime() - lastLogin.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalPremium: 0,
    totalConverted: 0,
    conversionRate: 0,
    totalDials: 0,
    activeCampaigns: 0,
    teamSize: 0,
    efficiencyScore: 75,
  });

  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<any[]>([]);
  const [agentData, setAgentData] = useState<any[]>([]);
  const [campaignData, setCampaignData] = useState<any[]>([]);
  const [hourlyStats, setHourlyStats] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    avgDuration: "0m 0s",
    connectedRate: "0%",
    roi: "1.0x"
  });
  const [secondaryStats, setSecondaryStats] = useState({
    todayCalls: 0,
    freshProspects: 0,
    followupCalls: 0,
    overdueFollowups: 0,
    newProspects: 0,
    assignedMembers: 0,
  });
  const [activeTab, setActiveTab] = useState("prospect"); // "prospect", "callDetails", or "agentPerf"
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("this_month");

  const getDateRange = (filter: string) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
    
    let start = todayStart;
    let end = todayEnd;

    if (filter === 'yesterday') {
      const y = new Date(now);
      y.setDate(y.getDate() - 1);
      start = new Date(y.getFullYear(), y.getMonth(), y.getDate()).toISOString();
      end = new Date(y.getFullYear(), y.getMonth(), y.getDate(), 23, 59, 59).toISOString();
    }
    else if (filter === 'this_week') {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      const monday = new Date(d.setDate(diff));
      start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()).toISOString();
    }
    else if (filter === 'last_7_days') {
      const d = new Date(now);
      d.setDate(d.getDate() - 7);
      start = d.toISOString();
    }
    else if (filter === 'this_month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    }
    else if (filter === 'last_month') {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
      end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString();
    }
    else if (filter === 'all_time') {
      start = '2000-01-01T00:00:00.000Z'; // Far past
    }
    
    return { start, end };
  };

  const fetchDashboardData = async (orgId?: string, dateFilter: string = "this_month") => {
    try {
      setLoading(true);
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
      
      const range = getDateRange(dateFilter);
      
      // Helper to fetch all rows beyond 1000 limit with optional date filter
      const fetchAllRows = async (tableName: string, selectQuery: string = '*', filterOrgId?: string, useDateFilter: boolean = true) => {
        let allData: any[] = [];
        let from = 0;
        let limit = 1000;
        
        while (true) {
          let query = supabase
            .from(tableName)
            .select(selectQuery);
          
          if (filterOrgId && filterOrgId !== 'all') {
            query = query.eq('organization_id', filterOrgId);
          }

          if (useDateFilter && dateFilter !== 'all_time') {
            query = query.gte('created_at', range.start).lte('created_at', range.end);
          }
          
          const { data, error } = await query.range(from, from + limit - 1);
          
          if (error) throw error;
          if (!data || data.length === 0) break;
          
          allData = [...allData, ...data];
          if (data.length < limit) break;
          from += limit;
        }
        return allData;
      };

      // 1. Fetch Basic Totals (Un-limited)
      // Note: We might want 'totalCustomers' to be ALL time, but 'Active Leads' in period?
      // For now, let's keep customers ALL TIME unless specifically asked, but logs definitely filtered.
      // Actually, standard dashboard practice: Dashboard Date Filter applies to EVERYTHING visible.
      const allCustomers = await fetchAllRows('customers', '*', orgId, true);

      // Fetch all campaigns and organizations for mapping
      const { data: allCampaigns } = await supabase.from('campaigns').select('id, name');
      const campaignMapLookup: Record<string, string> = {};
      allCampaigns?.forEach(c => campaignMapLookup[c.id] = c.name);

      const totalCount = allCustomers?.length || 0;
      const converted = allCustomers?.filter(c => 
        ['Sold', 'Success', 'Converted', 'Closed'].some(s => 
          c.disposition?.toLowerCase().includes(s.toLowerCase())
        )
      ) || [];

      // Secondary Stats Calculation
      const todayCallsQuery = supabase.from('call_logs').select('*', { count: 'exact', head: true }).gte('created_at', todayStart).lte('created_at', todayEnd);
      if (orgId) todayCallsQuery.eq('organization_id', orgId);
      const { count: todayCallsCount } = await todayCallsQuery;

      const freshProspectsCount = allCustomers?.filter(c => !c.disposition || c.disposition.toLowerCase() === 'fresh').length || 0;
      const followupCount = allCustomers?.filter(c => c.next_called_at && c.next_called_at >= todayStart && c.next_called_at <= todayEnd).length || 0;
      const overdueCount = allCustomers?.filter(c => c.next_called_at && c.next_called_at < now.toISOString() && c.status === 'active').length || 0;
      const newProspectsCount = allCustomers?.filter(c => c.created_at >= todayStart && c.created_at <= todayEnd).length || 0;
      
      const premium = converted.reduce((acc, curr) => acc + (Number(curr.premium) || 0), 0);
      const convRate = totalCount ? (converted.length / totalCount) * 100 : 0;

      // 2. Fetch Teams & Campaigns
      const { count: teamCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true }).eq('status', 'active');
      const { count: campCount } = await supabase.from('campaigns').select('*', { count: 'exact', head: true }).eq('is_active', true);

      // 3. Fetch Analytics & Agent Performance (Un-limited)
      let allLogs: any[] = [];
      let lFrom = 0;
      let lLimit = 1000;
      while (true) {
        let query = supabase
          .from('call_logs')
          .select('*, agent:user_profiles!agent_id(user_name)');
        
        if (orgId && orgId !== 'all') {
          query = query.eq('organization_id', orgId);
        }

        if (dateFilter !== 'all_time') {
          query = query.gte('created_at', range.start).lte('created_at', range.end);
        }

        const { data: logBatch, error: logsErr } = await query
          .range(lFrom, lFrom + lLimit - 1);
        
        if (logsErr) {
          console.error("Logs Fetch Error:", logsErr);
          break;
        }
        if (!logBatch || logBatch.length === 0) break;
        allLogs = [...allLogs, ...logBatch];
        if (logBatch.length < lLimit) break;
        lFrom += lLimit;
      }
      const logs = allLogs;
      
      // Process agent data
      const agentMap: Record<string, { name: string, count: number }> = {};
      logs?.forEach(log => {
        const agentName = log.agent?.user_name || 'System';
        if (!agentMap[agentName]) agentMap[agentName] = { name: agentName, count: 0 };
        agentMap[agentName].count++;
      });
      const formattedAgentData = Object.values(agentMap).sort((a, b) => b.count - a.count).slice(0, 8);

      // Process hourly stats
      const hourMap: Record<number, any> = {};
      for(let i=8; i<=20; i++) hourMap[i] = { hour: `${i > 12 ? i-12 : i} ${i >= 12 ? 'pm' : 'am'}`, total: 0, connected: 0, outgoing: 0, incoming: 0, missed: 0, talktime: 0 };
      
      logs?.forEach(log => {
        const hour = new Date(log.created_at).getHours();
        if (hourMap[hour]) {
          hourMap[hour].total++;
          if (log.is_connected === 'contactable' || log.is_connected === true) hourMap[hour].connected++;
          hourMap[hour].outgoing++; // Assuming all are outgoing for now
          hourMap[hour].talktime += (log.duration || 0);
        }
      });
      const formattedHourly = Object.values(hourMap);

      // Process chart data (Last 6 months)
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const last6Months = Array.from({length: 6}, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return { name: months[d.getMonth()], dials: 0, connected: 0, monthIndex: d.getMonth() };
      }).reverse();

      logs?.forEach(log => {
        const date = new Date(log.created_at);
        const mIdx = date.getMonth();
        const found = last6Months.find(m => m.monthIndex === mIdx);
        if (found) {
          found.dials++;
          if (log.is_connected === 'contactable' || log.is_connected === true) found.connected++;
        }
      });

      // 4. Heatmap Data (Day vs Hour) - Using Requested Slots
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const timeSlots = [
        '8 AM - 10 AM',
        '10 AM - 12 PM',
        '12 PM - 2 PM',
        '2 PM - 4 PM',
        '4 PM - 6 PM',
        '6 PM - 8 PM',
        '8 PM - 10 PM'
      ];

      // Initialize heatmap with 0s
      const heatmapMap: Record<string, Record<string, number>> = {};
      days.forEach(d => {
        heatmapMap[d] = {};
        timeSlots.forEach(t => heatmapMap[d][t] = 0);
      });

      logs?.forEach(log => {
        const date = new Date(log.created_at);
        const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjusting for Mon-Sun (0 is Sun)
        const hour = date.getHours();
        
        let slot = '';
        if (hour >= 8 && hour < 10) slot = '8 AM - 10 AM';
        else if (hour >= 10 && hour < 12) slot = '10 AM - 12 PM';
        else if (hour >= 12 && hour < 14) slot = '12 PM - 2 PM';
        else if (hour >= 14 && hour < 16) slot = '2 PM - 4 PM';
        else if (hour >= 16 && hour < 18) slot = '4 PM - 6 PM';
        else if (hour >= 18 && hour < 20) slot = '6 PM - 8 PM';
        else if (hour >= 20 && hour < 22) slot = '8 PM - 10 PM';

        if (slot && heatmapMap[dayName]) {
          heatmapMap[dayName][slot]++;
        }
      });

      const heatmap = days.map(day => ({
        day,
        ...heatmapMap[day]
      }));

      // 5. Pie Data (Latest Responses Distribution from Dispositions)
      const dispositionMap: Record<string, number> = {};
      allCustomers?.forEach(c => {
        const disp = c.disposition || 'Fresh Lead';
        dispositionMap[disp] = (dispositionMap[disp] || 0) + 1;
      });
      const formattedPie = Object.entries(dispositionMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      // 6. Campaign-wise Performance Data
      const campPerfMap: Record<string, { name: string, total: number, success: number }> = {};
      allCustomers?.forEach(c => {
        const name = campaignMapLookup[c.campaign_id] || c.campaign_id;
        if (!name || name === 'Unknown Campaign') return; // Skip unknown
        
        if (!campPerfMap[name]) campPerfMap[name] = { name: name, total: 0, success: 0 };
        campPerfMap[name].total++;
        if (['Sold', 'Success', 'Converted', 'Closed'].some(s => c.disposition?.toLowerCase().includes(s.toLowerCase()))) {
          campPerfMap[name].success++;
        }
      });
      const formattedCampaignData = Object.values(campPerfMap)
        .filter(item => item.name !== 'Unknown Campaign')
        .sort((a, b) => b.total - a.total)
        .slice(0, 6);

      setStats({
        totalCustomers: totalCount || 0,
        totalPremium: premium,
        totalConverted: converted.length,
        conversionRate: Number(convRate.toFixed(1)),
        totalDials: logs?.length || 0,
        activeCampaigns: campCount || 0,
        teamSize: teamCount || 0,
        efficiencyScore: Math.min(100, Math.floor(convRate * 5 + 50)), // Arbitrary logic
      });

      setSecondaryStats({
        todayCalls: todayCallsCount || 0,
        freshProspects: freshProspectsCount,
        followupCalls: followupCount,
        overdueFollowups: overdueCount,
        newProspects: newProspectsCount,
        assignedMembers: teamCount || 0,
      });

      setChartData(last6Months);
      setPieData(formattedPie);
      setHeatmapData(heatmap);
      setAgentData(formattedAgentData);
      setCampaignData(formattedCampaignData);
      setHourlyStats(formattedHourly);

      // 7. Performance Metrics Calculation
      const totalConnectedCalls = logs?.filter(l => l.is_connected === 'contactable' || l.is_connected === true).length || 0;
      const connRate = logs?.length ? (totalConnectedCalls / logs.length) * 100 : 0;
      const totalTalkSeconds = logs?.reduce((acc, curr) => acc + (Number(curr.duration) || 0), 0) || 0;
      const avgSecs = logs?.length ? totalTalkSeconds / logs.length : 0;
      const mins = Math.floor(avgSecs / 60);
      const secs = Math.floor(avgSecs % 60);

      setPerformanceMetrics({
        avgDuration: `${mins}m ${secs}s`,
        connectedRate: `${connRate.toFixed(1)}%`,
        roi: `${(convRate / 2 + 1).toFixed(1)}x` // Calculated mock ROI
      });

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAuth();
    
    // Fetch Organizations for filtering
    const fetchOrgs = async () => {
      const { data } = await supabase.from('organizations').select('id, company_name').order('company_name');
      if (data) setOrganizations(data);
    };
    fetchOrgs();
    
    // Initial fetch
    fetchDashboardData(selectedOrgId, selectedDateFilter);
  }, [user?.uid]);

  // Refetch when org filter changes or component mounts
  useEffect(() => {
    if (mounted && user?.uid) {
      fetchDashboardData(selectedOrgId, selectedDateFilter);
    }
  }, [selectedOrgId, selectedDateFilter, user?.uid, mounted]);

  if (loading && !mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4" style={{ borderColor: '#4b33e8' }}></div>
          <div className="text-lg" style={{ color: "#4b33e8" }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: "#f6f5f7" }}>
        <div className="text-center">
          <div className="text-lg mb-4 text-red-500">{error}</div>
          <div className="text-sm" style={{ color: "#4b33e8" }}>Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}>
      <style>{`
        .recharts-wrapper:focus, .recharts-surface:focus { outline: none !important; }
        button:focus { outline: none !important; }
        .recharts-area-rectangle:focus, .recharts-bar-rectangle:focus, .recharts-pie-sector:focus { outline: none !important; }
      `}</style>
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
          <div className="container mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 sm:space-y-8 max-w-[1400px]">
            
            {/* Header / Welcome Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263238]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Dashboard Overview
                </h1>
                <p className="text-sm text-[#787E9D] mt-1">
                  Welcome back, <span className="font-semibold text-[#4b33e8]">{user?.displayName || "User"}</span>. Here's what's happening today.
                </p>
              </div>
              <div className="flex items-center gap-3">
                {/* Date Filter */}
                <div className="relative group">
                  <select 
                    value={selectedDateFilter}
                    onChange={(e) => setSelectedDateFilter(e.target.value)}
                    className="appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#263238] hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                    style={{ minWidth: '140px' }}
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="this_week">This Week</option>
                    <option value="last_7_days">Last 7 Days</option>
                    <option value="this_month">This Month</option>
                    <option value="last_month">Last Month</option>
                    <option value="all_time">All Time</option>
                  </select>
                  <i className="fi fi-rr-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <i className="fi fi-rr-angle-small-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>

                {/* Org Filter */}
                <div className="relative group">
                  <select 
                    value={selectedOrgId}
                    onChange={(e) => setSelectedOrgId(e.target.value)}
                    className="appearance-none pl-10 pr-10 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#263238] hover:bg-gray-50 transition-all cursor-pointer focus:outline-none"
                    style={{ minWidth: '180px' }}
                  >
                    <option value="all">Global (All Orgs)</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>{org.company_name}</option>
                    ))}
                  </select>
                  <i className="fi fi-rr-building absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <i className="fi fi-rr-angle-small-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                </div>

                <div className="px-4 py-2 bg-[#4b33e8] rounded-xl text-sm font-bold text-white  cursor-default flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                  Live Updates
                </div>
              </div>
            </div>
                    
            {/* Top Stats Row (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Active Leads', value: stats.totalCustomers.toLocaleString(), sub: '+12%', color: '#4b33e8', icon: 'fi-rr-users', chartType: 'bar' },
                { label: 'Total Premium', value: `₹${stats.totalPremium.toLocaleString()}`, sub: '+9%', color: '#f97316', icon: 'fi-rr-earnings', chartType: 'area' },
                { label: 'Deals Closed', value: stats.totalConverted.toLocaleString(), sub: '+7%', color: '#10b981', icon: 'fi-rr-check-circle', chartType: 'bar' },
                { label: 'Conversion Rate', value: `${stats.conversionRate}%`, sub: '-2%', color: '#ef4444', icon: 'fi-rr-chart-pie', chartType: 'area' },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 flex flex-col justify-between group hover:shadow-md transition-all duration-300">
                  <div className="flex justify-between items-start mb-3">
                    <div className="space-y-0.5">
                      <p className="text-xs font-medium text-[#787E9D] flex items-center gap-1.5">
                        {card.label} 
                        <i className="fi fi-rr-info text-[9px]"></i>
                      </p>
                      <h2 className="text-xl font-bold text-[#263238] font-poppins">{card.value}</h2>
                      <p className={`text-[10px] font-bold ${card.sub.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        vs last month <span className="ml-1">{card.sub}</span>
                      </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all bg-gray-50 group-hover:scale-110" style={{ color: card.color }}>
                      <i className={`fi ${card.icon} flex text-base`}></i>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <div className="w-24 h-10">
                      {card.chartType === 'bar' ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <Bar dataKey="dials" fill={card.color} radius={[2, 2, 0, 0]} opacity={0.6} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData}>
                            <Area type="monotone" dataKey="dials" stroke={card.color} fill={card.color} fillOpacity={0.1} strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <button onClick={() => router.push('/activity')} className="text-xs font-bold text-gray-400 hover:text-[#4b33e8] transition-colors flex items-center gap-1 group/btn">
                      See Details <i className="fi fi-rr-arrow-right text-[10px] mt-0.5 group-hover/btn:translate-x-1 transition-transform"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Secondary Granular Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
               {[
                 { label: 'Active Campaigns', value: stats.activeCampaigns, icon: 'fi-rr-bullhorn', color: '#6366f1', bg: '#eef2ff' },
                 { label: 'Team Members', value: secondaryStats.assignedMembers, icon: 'fi-rr-users', color: '#ec4899', bg: '#fdf2f8' },
                 { label: 'Fresh Prospects', value: secondaryStats.freshProspects, icon: 'fi-rr-address-card', color: '#10b981', bg: '#ecfdf5' },
                 { label: 'Total Followups', value: secondaryStats.followupCalls, icon: 'fi-rr-phone-call', color: '#f59e0b', bg: '#fffbeb' },
                 { label: 'New Today', value: secondaryStats.newProspects, icon: 'fi-rr-user-add', color: '#8b5cf6', bg: '#f5f3ff' },
                 { label: 'Overdue', value: secondaryStats.overdueFollowups, icon: 'fi-rr-calendar-exclamation', color: '#ef4444', bg: '#fef2f2' },
               ].map((item, i) => (
                 <div key={i} className="bg-white rounded-[16px] p-3.5 border border-gray-50 flex flex-col gap-2.5 hover:shadow-md transition-all">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: item.bg, color: item.color }}>
                      <i className={`fi ${item.icon} text-xs flex`}></i>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#263238] leading-tight">{item.value.toLocaleString()}</h4>
                      <p className="text-[9px] font-bold text-[#787E9D] uppercase tracking-wider">{item.label}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Analytics Tab Selection */}
            <div className="bg-gray-100/50 p-1 rounded-2xl inline-flex gap-1 w-full sm:w-auto">
              {[
                { id: 'prospect', label: 'Prospect Wise Performance' },
                { id: 'callDetails', label: 'Call Hourly Analytics' },
                { id: 'agentPerf', label: 'Agent Performance' }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'prospect' ? (
              <>


                {/* Middle Row (Analytics & Performance) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Sales Performance (Guage) */}
                  <div className="lg:col-span-4 bg-white rounded-[20px] p-6 shadow-sm border border-gray-50 flex flex-col relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-[#263238] text-sm flex items-center gap-2">
                         Efficiency Score
                         <i className="fi fi-rr-info text-[10px] text-gray-300"></i>
                       </h3>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center">
                      <div className="relative w-full h-40 pb-3 sm:h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadialBarChart 
                            cx="50%" cy="100%" 
                            innerRadius="150%" outerRadius="130%" 
                            startAngle={180} endAngle={0} 
                            data={[{ name: 'Score', value: stats.efficiencyScore, fill: '#f97316' }]}
                          >
                            <RadialBar background={{ fill: '#f5f5f5' }} dataKey="value" cornerRadius={30} />
                          </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                          <h4 className="text-3xl font-bold text-[#263238]">{stats.efficiencyScore} <span className="text-base text-green-500 font-medium">+1</span></h4>
                          <p className="text-[9px] text-[#787E9D] font-medium mt-0.5 uppercase tracking-tighter">of 100 points</p>
                        </div>
                      </div>

                      <div className="mt-6 text-center px-4">
                        <p className="text-sm font-bold text-[#263238]">Team Momentum is high ✨</p>
                      </div>
                    </div>
                  </div>

                  {/* Summary Details */}
                  <div className="lg:col-span-8 bg-white rounded-[20px] p-6 shadow-sm border border-gray-50 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-bold text-[#263238] text-sm">Engagement Summary</h3>
                      <span className="px-2.5 py-0.5 bg-green-50 text-green-600 rounded-lg text-[10px] font-bold uppercase tracking-wider">On Target</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
                      {[
                        { title: 'Connected', val: performanceMetrics.connectedRate, desc: 'Ratio', color: 'blue' },
                        { title: 'Duration', val: performanceMetrics.avgDuration, desc: 'Avg talk', color: 'purple' },
                        { title: 'ROI', val: performanceMetrics.roi, desc: 'Performance', color: 'orange' },
                        { title: 'Response', val: stats.totalDials.toLocaleString(), desc: 'Tracked', color: 'emerald' },
                      ].map((box, idx) => (
                        <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-between">
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{box.title}</p>
                          <div className="mt-1.5">
                            <h5 className="text-xl font-bold text-[#263238] leading-tight">{box.val}</h5>
                            <p className="text-[8px] text-gray-500 mt-0.5">{box.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Row (Heatmap & Pie) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 pb-4">
                  {/* Campaign-wise Analysis */}
                  <div className="lg:col-span-8 bg-white rounded-[20px] p-6 border border-gray-50 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-[#263238] text-sm flex items-center gap-2">
                         Campaign Responses
                         <i className="fi fi-rr-info text-[10px] text-gray-300"></i>
                       </h3>
                    </div>
                    <div className="flex-1 min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={campaignData} barGap={8}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F1F1" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#787E9D', fontSize: 10, fontWeight: 600 }} dy={5} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fill: '#787E9D', fontSize: 10, fontWeight: 600 }} />
                           <Tooltip cursor={{fill: '#F9FAFB', radius: 8}} contentStyle={{ borderRadius: '12px', border: 'none', background: '#111827', color: '#fff', fontSize: '11px' }} />
                           <Bar dataKey="total" name="Total" fill="#4b33e8" radius={[4, 4, 4, 4]} barSize={20}>
                             <LabelList dataKey="total" position="center" fill="#fff" fontSize={8} fontWeight="bold" />
                           </Bar>
                           <Bar dataKey="success" name="Conv" fill="#10b981" radius={[4, 4, 4, 4]} barSize={20}>
                             <LabelList dataKey="success" position="center" fill="#fff" fontSize={8} fontWeight="bold" />
                           </Bar>
                         </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Latest Responses Distribution */}
                  <div className="lg:col-span-4 bg-white rounded-[20px] p-6 border border-gray-50 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                       <h3 className="font-bold text-[#263238] text-sm flex items-center gap-2">
                         Latest Status
                         <i className="fi fi-rr-info text-[10px] text-gray-300"></i>
                       </h3>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                      <div className="h-[180px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData.length > 0 ? pieData : [{name: 'Fresh Lead', value: 1}]}
                              cx="50%" cy="50%"
                              innerRadius={55}
                              outerRadius={75}
                              paddingAngle={6}
                              dataKey="value"
                              stroke="none"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#f97316', '#4b33e8', '#10b981', '#facc15', '#6366f1'][index % 5]} />
                              ))}
                              <Label 
                                  content={(props: any) => {
                                  const { cx, cy } = props.viewBox;
                                  return (
                                    <g>
                                      <text x={cx} y={cy - 5} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '20px', fontWeight: 'bold', fill: '#263238', fontFamily: 'Poppins' }}>
                                        {stats.totalCustomers}
                                      </text>
                                      <text x={cx} y={cy + 12} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: '8px', fontWeight: 'bold', fill: '#787E9D', fontFamily: 'Poppins', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Leads
                                      </text>
                                    </g>
                                  );
                                }}
                              />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="mt-4 space-y-3.5">
                        {pieData.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                              <span className="truncate max-w-[120px]">{item.name}</span>
                              <span>{((item.value / (stats.totalCustomers || 1)) * 100).toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-50 h-1.5 rounded-full overflow-hidden border border-gray-100/50">
                              <div 
                                className="h-full rounded-full transition-all duration-1000" 
                                style={{ 
                                  width: `${(item.value / (stats.totalCustomers || 1)) * 100}%`,
                                  backgroundColor: ['#f97316', '#4b33e8', '#10b981', '#facc15', '#6366f1'][idx % 5] 
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : activeTab === 'agentPerf' ? (
              /* Agent Performance Tab */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Agent Leaderboard Chart */}
                <div className="lg:col-span-8 bg-white rounded-[24px] p-8 shadow-sm border border-gray-50 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-[#263238] text-xl">Agent Productivity Leaderboard</h3>
                      <p className="text-sm text-gray-400 mt-1">Total dials per agent across all active sessions</p>
                    </div>
                    <div className="px-4 py-2 bg-[#4b33e8]/5 text-[#4b33e8] rounded-xl text-xs font-bold uppercase tracking-widest">
                       Live Tracking
                    </div>
                  </div>

                  <div className="flex-1 min-h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={agentData} margin={{ top: 0, right: 40, left: 20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#F1F1F1" />
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#263238', fontSize: 12, fontWeight: 700 }} 
                          width={120}
                        />
                        <Tooltip 
                           cursor={{fill: '#F9FAFB', radius: 8}} 
                           contentStyle={{ borderRadius: '12px', border: 'none', background: '#111827', color: '#fff' }}
                           itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Bar 
                          dataKey="count" 
                          name="Total Activities" 
                          fill="#4b33e8" 
                          radius={[0, 20, 20, 0]} 
                          barSize={24}
                        >
                          <LabelList dataKey="count" position="right" fill="#263238" fontSize={12} fontWeight="bold" offset={15} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Performers Table */}
                <div className="lg:col-span-4 bg-white rounded-[24px] p-8 shadow-sm border border-gray-50 flex flex-col">
                   <h3 className="font-bold text-[#263238] mb-6">Activity Contribution</h3>
                   <div className="space-y-6 flex-1 overflow-y-auto max-h-[450px] pr-2">
                     {agentData.map((agent, i) => (
                       <div key={i} className="flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#4b33e8] font-bold text-xs border border-gray-100 group-hover:bg-[#4b33e8] group-hover:text-white transition-all">
                             {agent.name.charAt(0)}
                           </div>
                           <div>
                             <p className="text-sm font-bold text-[#263238]">{agent.name}</p>
                             <p className="text-[10px] text-gray-400 font-medium">Rank #{i+1} in team</p>
                           </div>
                         </div>
                         <div className="text-right">
                           <p className="text-sm font-bold text-[#263238]">{agent.count.toLocaleString()}</p>
                           <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">
                             {((agent.count / (stats.totalDials || 1)) * 100).toFixed(1)}% share
                           </p>
                         </div>
                       </div>
                     ))}
                     {agentData.length === 0 && (
                       <div className="text-center py-10">
                         <i className="fi fi-rr-user-robot text-4xl text-gray-200"></i>
                         <p className="text-xs text-gray-400 mt-2 font-bold">No active agent data</p>
                       </div>
                     )}
                   </div>
                   <button onClick={() => router.push('/team')} className="mt-8 w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-[#4b33e8] hover:text-white hover:border-[#4b33e8] transition-all">
                      View All Team Insights
                   </button>
                </div>
              </div>
            ) : (
              /* Call Hourly Analytics Tab */
              <div className="space-y-6">
                {/* Heatmap Widget */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-50 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                       <h3 className="font-bold text-[#263238] text-sm">Visit by Time</h3>
                       <i className="fi fi-rr-info text-[10px] text-gray-300"></i>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-bold text-gray-400">0</span>
                       <div className="flex gap-1">
                         {[0.1, 0.3, 0.5, 0.7, 1].map((op, i) => (
                           <div key={i} className="w-4 h-2 rounded-full bg-[#f97316]" style={{ opacity: op }}></div>
                         ))}
                       </div>
                       <span className="text-[10px] font-bold text-gray-400 tracking-tighter">1,000+</span>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full border-separate border-spacing-x-3">
                      <thead>
                        <tr>
                          <th className="w-32"></th>
                          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                            <th key={day} className="pb-6 text-[10px] font-bold text-gray-400 tracking-widest text-center">{day}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          '8 AM - 10 AM',
                          '10 AM - 12 PM',
                          '12 PM - 2 PM',
                          '2 PM - 4 PM',
                          '4 PM - 6 PM',
                          '6 PM - 8 PM',
                          '8 PM - 10 PM'
                        ].map((timeslot, idx) => (
                          <tr key={idx}>
                            <td className="pr-3 py-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-tighter whitespace-nowrap text-right align-middle">
                              {timeslot}
                            </td>
                            {heatmapData.map((dayData, i) => {
                              const val = dayData[timeslot] || 0;
                              const intensity = Math.min(1, val / 100); 
                              return (
                                <td key={i} className="p-0.5">
                                  <div 
                                    className="h-8 min-w-[60px] rounded-[16px] transition-all duration-300 cursor-pointer hover:scale-[1.05]"
                                    title={`${dayData.day}, ${timeslot}: ${val} calls`}
                                    style={{ 
                                      backgroundColor: val > 0 ? '#f97316' : '#F9FBFE',
                                      opacity: val > 0 ? (0.1 + intensity * 0.9) : 1
                                    }}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hourly Table */}
                <div className="bg-white rounded-[20px] p-6 shadow-sm border border-gray-50 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                     <div>
                       <h3 className="font-bold text-[#263238] text-lg">Hourly Analysis</h3>
                       <p className="text-xs text-gray-400 mt-0.5">Time interval tracking</p>
                     </div>
                     <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-100 transition-all">
                        <i className="fi fi-rr-download flex text-[10px]"></i>
                        Export
                     </button>
                  </div>

                <div className="overflow-x-auto">
                   <table className="w-full border-separate border-spacing-y-2">
                      <thead>
                        <tr className="text-left">
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hour Interval</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Total Calls</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Connected</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Outgoing</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Missed</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Talktime</th>
                          <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Activity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hourlyStats.map((row, i) => (
                          <tr key={i} className="bg-white hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4 rounded-l-2xl border-y border-l border-gray-50">
                              <span className="text-sm font-bold text-[#263238]">{row.hour}</span>
                            </td>
                            <td className="px-6 py-4 border-y border-gray-50">
                              <span className="text-sm font-bold text-gray-600">{row.total}</span>
                            </td>
                            <td className="px-6 py-4 border-y border-gray-50">
                              <span className="text-sm font-bold text-green-600">{row.connected}</span>
                            </td>
                            <td className="px-6 py-4 border-y border-gray-50">
                              <span className="text-sm font-bold text-gray-600">{row.outgoing}</span>
                            </td>
                            <td className="px-6 py-4 border-y border-gray-50">
                              <span className="text-sm font-bold text-red-500">{row.missed}</span>
                            </td>
                            <td className="px-6 py-4 border-y border-gray-50">
                              <span className="text-sm font-bold text-gray-600">
                                {Math.floor(row.talktime / (row.total || 1))}s
                              </span>
                            </td>
                            <td className="px-6 py-4 rounded-r-2xl border-y border-r border-gray-50 text-right">
                              <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[100px] ml-auto overflow-hidden">
                                <div 
                                  className="bg-[#4b33e8] h-full rounded-full" 
                                  style={{ width: `${Math.min(100, (row.total / 100) * 100)}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
                </div>
              </div>
            )}
          </div>
        </main>

      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav activeNav="dashboard" userRole={user?.role || null} />
    </div>
  );
}
