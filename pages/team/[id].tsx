
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { checkAuthAndFetchProfile, handleLogout, UserProfile } from "../../lib/authService";
import { supabase } from "../../lib/supabase";
import { getStoredUserData } from "../../lib/localStorageUtils";
import { PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TeamDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("team");
  const [team, setTeam] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [memberStats, setMemberStats] = useState<Record<string, any>>({});
  const [dateFilter, setDateFilter] = useState("today");
  const [outcomeData, setOutcomeData] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [dailyTrendData, setDailyTrendData] = useState<any[]>([]);
  const [dispositionData, setDispositionData] = useState<any[]>([]);
  const [topAgents, setTopAgents] = useState<any[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const COLORS = ['#4b33e8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];
  
  // Initialize user from local storage
  useEffect(() => {
    const cachedData = getStoredUserData();
    if (cachedData) {
        setUser({
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
        });
    }
  }, []);

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
    } else if (filter === 'this_week') {
      const d = new Date(now);
      const day = d.getDay();
      const diff = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.setDate(diff));
      start = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate()).toISOString();
    } else if (filter === 'this_month') {
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    } else if (filter === 'all_time') {
      start = '2000-01-01T00:00:00.000Z';
    }
    
    return { start, end };
  };

  const fetchTeamData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      
      // 1. Fetch Team Details
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select(`*, organization:organizations(company_name), leader:user_profiles!leader_id(user_name)`)
        .eq('id', id)
        .single();
        
      if (teamError) throw teamError;
      setTeam(teamData);

      // 2. Fetch Members
      const memberIds = teamData.members || [];
      if (memberIds.length > 0) {
          const { data: membersData } = await supabase
            .from('user_profiles')
            .select('*')
            .in('user_id', memberIds);
          setMembers(membersData || []);

          // 3. Fetch Stats for Members based on Date Filter
          const { start, end } = getDateRange(dateFilter);
          
          let logsQuery = supabase.from('call_logs').select('*').in('agent_id', memberIds);
          if (dateFilter !== 'all_time') {
             logsQuery = logsQuery.gte('created_at', start).lte('created_at', end);
          }
          const { data: logs } = await logsQuery;
          
          const { data: customers } = await supabase
            .from('customers')
            .select('assigned_to, disposition, next_called_at, premium, created_at')
            .in('assigned_to', memberIds);
            
          // Process Stats per Member
          const stats: Record<string, any> = {};
          
          memberIds.forEach((mId: string) => {
             const userLogs = logs?.filter((l: any) => l.agent_id === mId) || [];
             const userCustomers = customers?.filter((c: any) => c.assigned_to === mId) || [];
             
             // Metrics
             const totalCalls = userLogs.length;
             const connected = userLogs.filter((l: any) => l.is_connected === true || l.is_connected === 'contactable').length;
             const connectedRate = totalCalls ? ((connected / totalCalls) * 100).toFixed(1) : 0;
             const totalDuration = userLogs.reduce((acc: number, curr: any) => acc + (Number(curr.duration) || 0), 0);
             const avgDuration = totalCalls ? Math.floor(totalDuration / totalCalls) : 0;
             
             // Deals & Followups (These are usually "Current" state, not strictly date-range filtered, but Deals Closed *could* be date filtered if we had a closed_at date. We use created_at of customer for now or just current disposition?)
             // For "Deals Closed", if we want "in this period", we'd need a status change log. For now, let's show TOTAL active deals for the user, or filter by created_at if implicit.
             // Let's stick to "Current Snapshot" for deals/followups, and "Activity" for logs.
             
             const deals = userCustomers.filter((c: any) => ['Sold', 'Converted', 'Success', 'Closed'].some(s => c.disposition?.toLowerCase().includes(s.toLowerCase()))).length;
             
             const now = new Date();
             const followUps = userCustomers.filter((c: any) => c.next_called_at && new Date(c.next_called_at) > now).length;
             
             // Idle Time & Last Active
             let lastActive = null;
             let idleTimeStr = "N/A";
             if (userLogs.length > 0) {
                 const sortedLogs = [...userLogs].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
                 const lastLog = sortedLogs[0];
                 lastActive = lastLog.created_at;
                 
                 const diffMs = now.getTime() - new Date(lastLog.created_at).getTime();
                 const diffMins = Math.floor(diffMs / 60000);
                 if (diffMins < 60) idleTimeStr = `${diffMins}m`;
                 else {
                     const h = Math.floor(diffMins/60);
                     const m = diffMins % 60;
                     idleTimeStr = `${h}h ${m}m`;
                 }
             }

             stats[mId] = {
                 totalCalls,
                 connected,
                 connectedRate,
                 avgDuration: `${Math.floor(avgDuration/60)}m ${avgDuration%60}s`,
                 deals,
                 followUps,
                 lastActive,
                 idleTime: idleTimeStr,
                 status: (idleTimeStr !== "N/A" && (idleTimeStr.includes("m") && !idleTimeStr.includes("h") && parseInt(idleTimeStr) < 15)) ? 'Online' : 'Idle' // Simple logic: <15m idle = online
             };
          });
          
           
           setMemberStats(stats);
           
           // 4. Process Aggregated Charts Data
           
           // Outcome Distribution
           const outcomeCounts: Record<string, number> = {};
           logs?.forEach((l: any) => {
               const status = l.status || 'Unknown'; 
               outcomeCounts[status] = (outcomeCounts[status] || 0) + 1;
           });
           const outcomes = Object.entries(outcomeCounts).map(([name, value]) => ({ name, value }));
           setOutcomeData(outcomes);

           // Hourly Activity
           const hours: Record<string, number> = {};
           // Initialize hours
           for(let i=8; i<=20; i+=2) {
               const label = `${i > 12 ? i-12 : i}${i>=12 ? 'pm' : 'am'} - ${i+2 > 12 ? i+2-12 : i+2}${i+2>=12 ? 'pm' : 'am'}`;
               hours[label] = 0;
           }
           
           logs?.forEach((l: any) => {
               const h = new Date(l.created_at).getHours();
               // Find bucket
               for(let i=8; i<=20; i+=2) {
                   if(h >= i && h < i+2) {
                       const label = `${i > 12 ? i-12 : i}${i>=12 ? 'pm' : 'am'} - ${i+2 > 12 ? i+2-12 : i+2}${i+2>=12 ? 'pm' : 'am'}`;
                       hours[label]++;
                       break;
                   }
               }
           });
           const hourly = Object.entries(hours).map(([name, count]) => ({ name, count }));
           setHourlyData(hourly);

           // Disposition Data
           const dispCounts: Record<string, number> = {};
           customers?.forEach((c: any) => {
               const d = c.disposition || 'Fresh';
               dispCounts[d] = (dispCounts[d] || 0) + 1;
           });
           setDispositionData(Object.entries(dispCounts).map(([name, count]) => ({ name, count })).sort((a,b) => b.count - a.count).slice(0, 5));

           // Daily Trend (Last 7 Days or Selected Range)
           const dailyCounts: Record<string, number> = {};
           logs?.forEach((l: any) => {
              const dateKey = new Date(l.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
              dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
           });
           // Sort by Date logic roughly
           setDailyTrendData(Object.entries(dailyCounts).map(([name, count]) => ({ name, count })));

           // Top Agents (by connected calls)
           const agentsArr = memberIds.map((mId: string) => {
               const s = stats[mId];
               const member = membersData?.find(m => m.user_id === mId);
               return {
                   name: member?.user_name || 'Unknown',
                   connected: s.connected,
                   profilePic: member?.profile_pic_url
               };
           }).sort((a: any, b: any) => b.connected - a.connected).slice(0, 3);
           setTopAgents(agentsArr);
      }
      
    } catch (err) {
      console.error("Error fetching team data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && id) {
        checkAuthAndFetchProfile().then(res => {
            if (res.user) {
                fetchTeamData();
            } else {
                router.push('/login');
            }
        });
    }
  }, [router.isReady, id, dateFilter]);

  const handleLogoutClick = async () => {
    await handleLogout(router);
  };
  
  const formatTime = (dateStr: string) => {
    if (!dateStr) return "Never";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden" style={{ backgroundColor: "#f6f5f7", maxWidth: "100vw" }}>
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

      <div className="flex-1 flex flex-col lg:ml-56 w-full min-w-0 overflow-x-hidden">
        <Header
          user={{
            displayName: user?.displayName || null,
            email: user?.email || "",
            employeeId: user?.employeeId || null,
            profilePicUrl: user?.profilePicUrl || null,
          }}
          onLogout={handleLogoutClick}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full pt-[60px] lg:pt-[60px]" style={{ backgroundColor: "#f6f5f7" }}>
          <div className="container mx-auto px-4 py-8 max-w-7xl pb-24">
            
            {/* Breadcrumb & Header */}
            <div className="mb-6">
                <button 
                    onClick={() => router.push('/team')}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#4b33e8] mb-4 transition-colors"
                >
                    <i className="fi flex   fi-rr-arrow-left"></i> Back to Teams
                </button>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                           <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                              {team?.name || 'Loading Team...'}
                           </h1>
                           <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${team?.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                             {team?.is_active ? 'Active' : 'Inactive'}
                           </span>
                        </div>
                        <p className="text-gray-500 text-sm flex items-center gap-2">
                            <i className="fi flex  fi-rr-building"></i> {team?.organization?.company_name}
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>Leader: <span className="font-semibold text-gray-700">{team?.leader?.user_name || 'N/A'}</span></span>
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <select 
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 font-medium"
                        >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="this_week">This Week</option>
                            <option value="this_month">This Month</option>
                            <option value="all_time">All Time</option>
                        </select>
                        <button className="bg-[#4b33e8] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">
                            Download Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Team Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                {[
                   { label: 'Total Members', value: members.length, icon: 'fi-rr-users-alt', color: 'text-blue-600', bg: 'bg-blue-50' },
                   { label: 'Total Calls', value: Object.values(memberStats).reduce((acc, s) => acc + s.totalCalls, 0), icon: 'fi-rr-phone-call', color: 'text-indigo-600', bg: 'bg-indigo-50' },
                   { label: 'Deals Closed', value: Object.values(memberStats).reduce((acc, s) => acc + s.deals, 0), icon: 'fi-rr-trophy', color: 'text-yellow-600', bg: 'bg-yellow-50' },
                   { label: 'Revenue', value: `$${totalRevenue.toLocaleString()}`, icon: 'fi-rr-dollar', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                   { label: 'Avg Connect Rate', value: `${(Object.values(memberStats).reduce((acc, s) => acc + parseFloat(s.connectedRate || 0), 0) / (members.length || 1)).toFixed(1)}%`, icon: 'fi-rr-chart-histogram', color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.bg} ${stat.color}`}>
                            <i className={`fi ${stat.icon}`}></i>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 1. Outcome Distribution */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-gray-800 font-bold mb-4">Call Outcomes</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={outcomeData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {outcomeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Hourly Activity */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:col-span-2">
                    <h3 className="text-gray-800 font-bold mb-4">Hourly Activity</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={hourlyData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="count" fill="#4b33e8" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Expanded Analytics Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* 3. Daily Trend */}
                 <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:col-span-2">
                    <h3 className="text-gray-800 font-bold mb-4">Daily Call Trend</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={dailyTrendData}
                                margin={{
                                    top: 10,
                                    right: 30,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <defs>
                                    <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4b33e8" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#4b33e8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Area type="monotone" dataKey="count" stroke="#4b33e8" fillOpacity={1} fill="url(#colorCalls)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 4. Top Lead Dispositions */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                    <h3 className="text-gray-800 font-bold mb-4">Lead Status</h3>
                     <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={dispositionData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 40,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#4b5563'}} />
                                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Agents Row */}
            <div className="mb-8">
               <h3 className="text-gray-800 font-bold mb-4 text-lg">Top Performers</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {topAgents.map((agent, i) => (
                      <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden">
                          <div className={`absolute top-0 right-0 p-2 font-bold text-6xl text-gray-100 -z-0 pointer-events-none select-none`}>
                              #{i+1}
                          </div>
                          <div className="w-14 h-14 rounded-full border-2 border-[#4b33e8]/20 p-0.5 z-10 bg-white flex items-center justify-center overflow-hidden">
                              {agent.profilePic ? (
                                <img src={agent.profilePic} className="w-full h-full rounded-full object-cover" alt={agent.name} />
                              ) : (
                                <i className="fi flex  fi-rr-user text-2xl text-gray-400"></i>
                              )}
                          </div>
                          <div className="z-10">
                              <p className="font-bold text-gray-800">{agent.name}</p>
                              <p className="text-sm text-gray-500">{agent.connected} Connected Calls</p>
                          </div>
                      </div>
                  ))}
                  {topAgents.length === 0 && <p className="text-gray-400 text-sm col-span-3">No data available for leaderboard.</p>}
               </div>
            </div>

            {/* Detailed Member Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800 text-lg">Member Performance</h3>
                    <div className="flex gap-2 text-xs font-medium">
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md"><span className="w-2 h-2 rounded-full bg-green-500"></span> Online</span>
                        <span className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-500 rounded-md"><span className="w-2 h-2 rounded-full bg-gray-400"></span> Idle</span>
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-3 font-semibold">Agent</th>
                                <th className="px-6 py-3 font-semibold text-center">Status</th>
                                <th className="px-6 py-3 font-semibold text-center">Calls</th>
                                <th className="px-6 py-3 font-semibold text-center">Connected</th>
                                <th className="px-6 py-3 font-semibold text-center">Avg Talk</th>
                                <th className="px-6 py-3 font-semibold text-center">Follow Ups</th>
                                <th className="px-6 py-3 font-semibold text-center">Deals</th>
                                <th className="px-6 py-3 font-semibold text-right">Last Active</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {members.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500 text-sm">No members in this team</td>
                                </tr>
                            ) : members.map(member => {
                                const stats = memberStats[member.user_id] || { totalCalls: 0, connected: 0, connectedRate: 0, avgDuration: '0m 0s', deals: 0, followUps: 0, lastActive: null, idleTime: 'N/A', status: 'Idle' };
                                const isOnline = stats.status === 'Online';
                                
                                return (
                                    <tr key={member.user_id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-white shadow-sm overflow-hidden flex items-center justify-center text-gray-500 font-bold text-xs">
                                                    {member.profile_pic_url ? (
                                                        <img src={member.profile_pic_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <i className="fi flex  fi-rr-user text-lg text-gray-400"></i>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-800">{member.user_name || 'Unknown'}</p>
                                                    <p className="text-xs text-gray-400">{member.employee_id || 'ID: --'}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isOnline ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                                {isOnline ? 'Active' : `Idle ${stats.idleTime !== 'N/A' ? stats.idleTime : ''}`}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-gray-700">
                                            {stats.totalCalls}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <p className="text-sm font-semibold text-gray-700">{stats.connected}</p>
                                            <p className="text-[10px] text-gray-400">{stats.connectedRate}% Rate</p>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600 font-medium">
                                            {stats.avgDuration}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-xs font-bold">
                                                {stats.followUps} Pending
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {stats.deals > 0 ? (
                                                <span className="flex items-center justify-center gap-1 text-green-600 font-bold text-sm">
                                                    <i className="fi flex  fi-rr-trophy text-xs"></i> {stats.deals}
                                                </span>
                                            ) : <span className="text-gray-400 text-sm">-</span>}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm text-gray-500">
                                            {formatTime(stats.lastActive)}
                                            <p className="text-[10px] text-gray-400">
                                                 {stats.lastActive ? new Date(stats.lastActive).toLocaleDateString() : ''}
                                            </p>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
