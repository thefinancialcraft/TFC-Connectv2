import { useUser } from "@/context/UserContext";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Search, PhoneIncoming, PhoneOutgoing, PhoneMissed, Trophy, Star, PhoneCall, CheckCircle, ArrowRight, Loader2, LogOut } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useFollowUpLeads } from "@/hooks/useFollowUpLeads";
import { handleLogout } from "@/lib/authService";

// Hooks
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useDashboardCharts } from "@/hooks/useDashboardCharts";
import { useAgentPerformance } from "@/hooks/useAgentPerformance";
import { useActivityData } from "@/hooks/useActivityData";
import { getUserDashboardLevel, DashboardLevel } from "@/lib/dashboardUtils";

export default function NewDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [selectedFilter, setSelectedFilter] = useState("today");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  // Data hooks
  const { stats, secondaryStats, loading: statsLoading, fetchStats } = useDashboardStats();
  const { chartData: rawChartData, pieData, hourlyStats, loading: chartsLoading, fetchChartData } = useDashboardCharts();
  const { agentData, loading: agentLoading, fetchAgentPerformance } = useAgentPerformance();
  const { filteredActivities, mobileActivities, loading: activityLoading, fetchActivities } = useActivityData();
  const { leads: followUpLeads, stats: followUpStats } = useFollowUpLeads();

  const urgencyPercent = useMemo(() => {
    if (!followUpStats || followUpStats.total === 0) return 0;
    return Math.round((followUpStats.overdue / followUpStats.total) * 100);
  }, [followUpStats]);

  const upcomingLeads = useMemo(() => {
    return (followUpLeads || []).filter(l => l.isUpcoming);
  }, [followUpLeads]);

  const userRankData = useMemo(() => {
    if (!agentData || agentData.length === 0 || !user) return null;
    const sorted = [...agentData].sort((a, b) => b.count - a.count);
    const userIndex = sorted.findIndex(a => a.id === user.uid);
    if (userIndex === -1) return null;

    return {
      rank: userIndex + 1,
      aheadEmployee: userIndex > 0 ? sorted[userIndex - 1] : null,
      totalAgents: sorted.length
    };
  }, [agentData, user]);

  const achievementData = useMemo(() => {
    const dialXP = (stats.totalDials || 0) * 5;
    const durationXP = (stats.totalTalktime || 0) * 5;
    const totalXP = dialXP + durationXP;
    
    let level = 1;
    let threshold = 100;
    let accumulatedXP = 0;
    
    // Determine level
    while (totalXP >= accumulatedXP + threshold) {
      accumulatedXP += threshold;
      level++;
      threshold += 200;
    }
    
    const xpInCurrentLevel = totalXP - accumulatedXP;
    const progress = Math.min((xpInCurrentLevel / threshold) * 100, 100);
    
    return {
      totalXP,
      level,
      xpInCurrentLevel,
      threshold,
      progress
    };
  }, [stats.totalDials, stats.totalTalktime]);

  const filterOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 7 Days", value: "last_7_days" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" }
  ];

  const getFilterLabel = (val: string) => filterOptions.find(o => o.value === val)?.label || val;

  // Initialize data fetching
  useEffect(() => {
    if (user) {
      const level = getUserDashboardLevel(user);
      const restrictedIds = level === DashboardLevel.LEVEL_4_AGENT_SALES ? [user.uid] : undefined;
      const orgId = user.organization_id || undefined;
      const userIdFilter = level === DashboardLevel.LEVEL_4_AGENT_SALES ? user.uid : undefined;

      fetchStats(orgId, selectedFilter, userIdFilter, restrictedIds);
      fetchChartData(orgId, selectedFilter, undefined, userIdFilter, restrictedIds);
      fetchAgentPerformance(orgId, selectedFilter, undefined, false, undefined, undefined);
      fetchActivities();
    }
  }, [user, selectedFilter, fetchStats, fetchChartData, fetchAgentPerformance, fetchActivities]);

  // Format Talk Time Helper
  const formatTalkTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) return `${hrs}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const chartData = useMemo(() => {
    // If filter is today, we show hourly trend as requested
    if (selectedFilter === 'today' && hourlyStats && hourlyStats.length > 0) {
      const targetHours = ['10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM'];
      return targetHours.map(h => {
        const found = hourlyStats.find(s => s.hour.trim().toUpperCase() === h.toUpperCase());
        return {
          name: h,
          dials: found ? found.total : 0,
          talkTime: found ? Math.round(found.talktime / 60) : 0 // Talktime in mins
        };
      });
    }

    if (!rawChartData || rawChartData.length === 0) {
      return [
        { name: 'Mon', dials: 0, talkTime: 0 },
        { name: 'Tue', dials: 0, talkTime: 0 },
        { name: 'Wed', dials: 0, talkTime: 0 },
        { name: 'Thu', dials: 0, talkTime: 0 },
        { name: 'Fri', dials: 0, talkTime: 0 },
        { name: 'Sat', dials: 0, talkTime: 0 },
        { name: 'Sun', dials: 0, talkTime: 0 },
      ];
    }
    return rawChartData.map(d => ({
      name: d.name.split('-').length > 2 ? d.name.split('-')[2] : d.name,
      dials: d.dials,
      talkTime: d.connected
    }));
  }, [rawChartData, hourlyStats, selectedFilter]);

  // Sort and pick top 3 performers
  const topPerformers = useMemo(() => {
    return [...agentData]
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map((agent, index) => ({
        rank: (index + 1).toString(),
        name: agent.name,
        dials: agent.count.toString(),
        talktime: formatTalkTime(agent.duration),
        img: agent.profile_pic_url || `/client${(index % 4) + 1}.png`,
        color: index === 0 ? 'bg-amber-400' : index === 1 ? 'bg-slate-300' : 'bg-orange-400',
        size: index === 0 ? 'w-24 h-24' : 'w-20 h-20'
      }));
  }, [agentData]);

  const slideIcons = [PhoneCall, Trophy, Star];

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(' ')
      .filter(Boolean)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayEfficiency = useMemo(() => {
    if (!stats.totalDials || stats.totalDials === 0) return 0;
    // Ratio of talktime (mins) to dials, normalized to a percentage (assuming 1 min/dial is high efficiency)
    const ratio = (stats.totalTalktime / (stats.totalDials * 60)) * 100;
    return Math.min(Math.round(ratio), 100);
  }, [stats.totalDials, stats.totalTalktime]);

  const slides = useMemo(() => [
    `Quick Insight: You have completed ${secondaryStats.todayCalls} calls today`,
    `Performance: Your efficiency score is currently ${displayEfficiency}%`,
    `Action Needed: ${secondaryStats.overdueFollowups} follow-ups require attention`
  ], [secondaryStats.todayCalls, displayEfficiency, secondaryStats.overdueFollowups]);

  useEffect(() => {
    const slideInterval = 5000;
    const progressInterval = 50; 
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlide((curr) => (curr + 1) % slides.length);
          return 0;
        }
        return prev + (progressInterval / slideInterval) * 100;
      });
    }, progressInterval);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="w-full h-screen bg-slate-50 overflow-y-auto overflow-x-hidden hide-scrollbar pb-12 relative">
      {/* Big Ambient Background Blobs (SOLID STYLE) */}
      <div className="absolute top-[-50px] right-[-50px] w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-[60px] pointer-events-none z-[-1]"></div>
      <div className="absolute top-[35%] left-[-100px] w-[500px] h-[500px] bg-rose-400/20 rounded-full blur-[70px] pointer-events-none z-[-1]"></div>
      <div className="absolute bottom-[-50px] right-[-50px] w-[350px] h-[350px] bg-emerald-400/20 rounded-full blur-[50px] pointer-events-none z-[-1]"></div>
      <div className="absolute top-[15%] left-[25%] w-[250px] h-[250px] bg-amber-400/25 rounded-full blur-[40px] pointer-events-none z-[-1]"></div>
      {/* Hero Section ... */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: "linear-gradient(135deg, #2e1f8f, #3b27c2, #4b33e8)", 
          height: "40vh", 
          width: "100%",
          clipPath: "ellipse(120% 100% at 50% 0%)"
        }}
      >
        {/* HDR2.png Background Asset */}
        <div className="absolute top-[25%] -left-15 w-[320px] h-[320px] opacity-100 rotate-0 z-0 pointer-events-none">
          <img src="/hdr2.png" alt="Hero Decoration" className="w-full h-full object-contain" />
        </div>
        {/* Pattern Layer ... */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
            backgroundPosition: "0 0, 15px 15px",
            maskImage: "linear-gradient(to bottom, black 20%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 20%, transparent 90%)"
          }}
        ></div>

        {/* Center Dials and Talk Time - Positioned to the right of the character */}
        <div className="absolute left-[210px] top-[35%] flex flex-col items-start pointer-events-none z-10" style={{ fontFamily: "'Roboto', sans-serif" }}>
          <div className="flex flex-col items-start">
            <span 
              className="text-white text-6xl font-[900] tracking-[-0.05em] leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/100 to-transparent"
              style={{ 
                WebkitTextStroke: '1px rgba(255, 255, 255, 0.01)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 10%, transparent 80%)',
                maskImage: 'linear-gradient(to bottom, black 10%, transparent 80%)'
              }}
            >
              {statsLoading ? <Loader2 className="w-12 h-12 animate-spin text-white/20" /> : stats.totalDials}
            </span>
            <span className="text-white/70 text-[0.9rem] font-black uppercase tracking-[0.3em] -mt-2  ml-1">Total Dial's</span>
          </div>
          <div className="mt-1">
            <span className="text-white/40 text-[1rem] font-medium border-l-2 border-white/20 pl-3">
              Talk time {formatTalkTime(stats.totalTalktime)}
            </span>
          </div>
        </div>

        {/* Top Header Bar (Profile + Search) */}
        <div className="absolute top-8 left-0 w-full px-4 flex items-center justify-between z-10">
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => router.push('/portal/settings')}
          >
            {/* Animated Profile Container */}
            <div className="profile-container relative w-11 h-11">
              <div className="border-anim absolute inset-0 rounded-full"></div>
              <div className="image-flip w-full h-full rounded-full overflow-hidden shadow-sm bg-indigo-600 flex items-center justify-center border border-white/20">
                {user?.profilePicUrl ? (
                  <img 
                    src={user.profilePicUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-[0.8rem] font-black tracking-tighter">
                    {getInitials(user?.displayName || "User")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-white/60 text-[10px] font-normal">Good Afternoon</span>
              <span className="text-white text-md font-bold leading-tight" style={{ fontFamily: "'Lato', sans-serif" }}>
                {user?.displayName || "User"}
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <button 
            onClick={() => handleLogout(router)}
            className="p-2.5 bg-white/10 hover:bg-rose-500/20 backdrop-blur-md rounded-full transition-all border border-white/10 group active:scale-95 flex items-center justify-center"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-white/80 group-hover:text-rose-400 transition-colors" />
          </button>
        </div>
      </div>

      <div className="relative -mt-10 px-4 pb-12">
        <div className="flex overflow-x-auto hide-scrollbar gap-4 pb-4 snap-x">
          {mobileActivities && mobileActivities.length > 0 ? (
            mobileActivities.slice(0, 8).map((activity, i) => (
              <div key={i} className="min-w-[82px] mb-3 flex flex-col items-center gap-1.5 group cursor-pointer snap-start">
                <div className="relative">
                  {/* Profile Image Container */}
                  <div 
                    className="w-[70px] h-[70px] bg-white rounded-[1.4rem] p-1 shadow-[0_8px_20px_rgba(0,0,0,0.04)] border border-slate-100 group-hover:scale-110 transition-all duration-300 relative overflow-visible"
                  >
                    <div className="w-full h-full bg-slate-50 rounded-[1.2rem] flex items-center justify-center overflow-hidden relative">
                      <img 
                        src={`/client${(i % 4) + 1}.png`} 
                        alt="Character" 
                        className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    
                    {/* Status Circle Icon */}
                    <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-md transition-transform group-hover:scale-110
                      ${activity.call_type?.toLowerCase() === 'incoming' ? 'bg-indigo-500' : 
                        activity.call_type?.toLowerCase() === 'outgoing' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    >
                      {activity.call_type?.toLowerCase() === 'incoming' && <PhoneIncoming className="w-3.5 h-3.5 text-white" />}
                      {activity.call_type?.toLowerCase() === 'outgoing' && <PhoneOutgoing className="w-3.5 h-3.5 text-white" />}
                      {activity.call_type?.toLowerCase() === 'missed' && <PhoneMissed className="w-3.5 h-3.5 text-white" />}
                      {!['incoming', 'outgoing', 'missed'].includes(activity.call_type?.toLowerCase() || '') && <PhoneCall className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-[0.65rem] font-black text-slate-700 tracking-tight truncate w-20 text-center">
                    {activity.name || activity.user_name || "Unknown"}
                  </span>
                  <span className="text-[0.55rem] font-bold text-slate-400 leading-none">
                    {formatTalkTime(activity.duration || 0)}
                  </span>
                </div>
              </div>
            ))
          ) : (
             [1,2,3,4,5,6,7,8].map((_, i) => (
                <div key={i} className="min-w-[82px] mb-3 flex flex-col items-center gap-1.5 opacity-20">
                   <div className="w-[70px] h-[70px] bg-slate-200 rounded-[1.4rem] overflow-hidden">
                      <img src="/client1.png" className="w-full h-full object-contain grayscale" alt="Loading" />
                   </div>
                   <div className="h-2 w-12 bg-slate-200 rounded"></div>
                </div>
             ))
          )}
        </div>
      </div>

      {/* Banner / Wide Card Slider Section */}
      <div className="px-4 -mt-12 pb-2">
        <div 
          className="w-full h-[80px] bg-white rounded-2xl overflow-hidden relative"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}
        >
          <div 
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((text, idx) => {
              const Icon = slideIcons[idx];
              return (
                <div 
                  key={idx}
                  className="min-w-full h-full flex items-center px-5"
                >
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl mr-4 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-slate-600 text-[0.8rem] font-bold leading-tight">{text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-3">
          {slides.map((_, idx) => (
            <div 
              key={idx}
              className={`h-1.5 rounded-full overflow-hidden bg-slate-200 transition-all duration-300 ${currentSlide === idx ? 'w-8' : 'w-1.5'}`}
            >
              {currentSlide === idx && (
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-[50ms] linear"
                  style={{ width: `${progress}%` }}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chart Widget Section */}
      <div className="px-4 mt-[30px] pb-0">
        <div className="bg-white rounded-[1.5rem] border border-slate-50 overflow-visible relative" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div className="pt-5 pl-5 pr-5 pb-0 flex justify-between items-center relative z-20">
            <h3 className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Outfit', sans-serif" }}>Dials Analytics</h3>
          </div>

          <div 
            className="h-[260px] w-full outline-none mt-4 pb-4 overflow-hidden relative"
            style={{ userSelect: 'none', WebkitTapHighlightColor: 'transparent', touchAction: 'pan-y' }}
          >
            {chartsLoading && (
              <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[2px] transition-all duration-500">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Data</span>
                </div>
              </div>
            )}
            <ResponsiveContainer width="100%" height="100%" className="recharts-responsive-container outline-none">
              <AreaChart data={chartData} margin={{ top: 0, right: -40, left: -40, bottom: 5 }} className="outline-none focus:outline-none">
                <defs>
                  <linearGradient id="colorDials" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#4b33e8" stopOpacity={0.8}/>
                    <stop offset="50%" stopColor="#3b27c2" stopOpacity={0.6}/>
                    <stop offset="100%" stopColor="#2e1f8f" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="areaDials" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4b33e8" stopOpacity={0.3}/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorTalkTime" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00c6ff" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#0072ff" stopOpacity={0.8}/>
                  </linearGradient>
                  <linearGradient id="areaTalkTime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00c6ff" stopOpacity={0.2}/>
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <Area 
                  type="monotone" 
                  dataKey="dials" 
                  stroke="url(#colorDials)" 
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="url(#areaDials)"
                  fillOpacity={1}
                  isAnimationActive={false}
                  activeDot={{ r: 4, fill: '#3b27c2', strokeWidth: 2, stroke: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="talkTime" 
                  stroke="url(#colorTalkTime)" 
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="url(#areaTalkTime)"
                  fillOpacity={1}
                  isAnimationActive={false}
                  activeDot={{ r: 4, fill: '#0072ff', strokeWidth: 2, stroke: '#fff' }}
                />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  scale="point"
                  interval={0}
                  padding={{ left: 0, right: 0 }}
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                  dy={5}
                />
                <Tooltip 
                  isAnimationActive={false}
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white/40 backdrop-blur-sm text-slate-900 px-3 py-2 rounded-xl text-[10px] shadow-sm border border-white/60 flex flex-col gap-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500 font-medium">Dials:</span>
                            <span className="font-bold">{payload[0].value}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-1">
                            <span className="text-slate-500 font-medium">Talk Time:</span>
                            <span className="font-bold text-indigo-600">{payload[1]?.value}m</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row of 3 Cards Section (Incoming, Outgoing, Missed) */}
      {/* Row of 3 Cards Section (Incoming, Outgoing, Missed) */}
      <div className="px-4 mt-12 pb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { 
              label: 'Incoming', 
              value: secondaryStats.incomingCount.toString(), 
              img: '/in2.png', 
              color: 'text-indigo-600', 
              bg: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)', 
              accent: 'bg-indigo-400/20' 
            },
            { 
              label: 'Outgoing', 
              value: secondaryStats.outgoingCount.toString(), 
              img: '/og1.png', 
              color: 'text-emerald-600', 
              bg: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', 
              accent: 'bg-emerald-400/20' 
            },
            { 
              label: 'Missed', 
              value: secondaryStats.missedCount.toString(), 
              img: '/ms1.png', 
              color: 'text-rose-600', 
              bg: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', 
              accent: 'bg-rose-400/20' 
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="rounded-[1.5rem] p-4 flex flex-col items-center justify-end gap-1 relative transition-all hover:shadow-2xl hover:-translate-y-1 active:scale-95 min-h-[115px] border-[1.2px] border-white"
              style={{ 
                background: item.bg,
                boxShadow: '0 15px 45px #3f3f3f1c' 
              }}
            >
              {/* Mesh accent */}
              <div className={`absolute -top-6 -right-6 w-16 h-16 ${item.accent} rounded-full blur-xl`}></div>
              
              {/* Character Sticker */}
              <div className="absolute -top-8 inset-x-0 flex justify-center z-0 transition-transform group-hover:scale-110 pointer-events-none">
                <img 
                  src={item.img} 
                  alt={item.label} 
                  className="w-24 h-24 object-contain drop-shadow-xl"
                />
              </div>

              <div className="relative z-20 text-center bg-white/40 backdrop-blur-md w-full py-2 rounded-2xl border border-white/50">
                <div className="text-[0.55rem] font-bold text-slate-500 uppercase tracking-widest">{item.label}</div>
                <div className="text-lg font-black text-slate-900 leading-none mt-0.5">{item.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Clients Widget Section */}
      <div className="px-4 mt-6 pb-20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[0.75rem] font-bold text-slate-800 uppercase tracking-widest">Active Clients</h3>
          <button className="text-[0.65rem] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">View All</button>
        </div>

        {/* Circular Client Cards */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {(followUpLeads || []).slice(0, 4).map((customer, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="w-16 h-16 rounded-full p-1 bg-white border border-slate-100 shadow-sm group-hover:scale-110 transition-transform relative overflow-hidden">
                {customer.profile_pic_url ? (
                   <img src={customer.profile_pic_url} alt={customer.customer_name} className="w-full h-full object-cover rounded-full" />
                ) : (
                   <div className="w-full h-full bg-indigo-50 rounded-full flex items-center justify-center">
                      <img src={`/client${(idx % 4) + 1}.png`} alt="Client" className="w-full h-full object-contain" />
                   </div>
                )}
                <div className={`absolute bottom-0 right-1 w-3.5 h-3.5 border-2 border-white rounded-full bg-indigo-500 shadow-sm`}></div>
              </div>
              <span className="text-[0.6rem] font-bold text-slate-600 tracking-tight truncate w-full text-center px-1">
                {customer.customer_name || 'New Client'}
              </span>
            </div>
          ))}
          {(followUpLeads || []).length === 0 && (
             <div className="col-span-4 py-8 flex flex-col items-center justify-center text-slate-400">
                <Star className="w-8 h-8 mb-2 opacity-20" />
                <span className="text-[10px] font-bold uppercase tracking-widest">No Active Follow-ups</span>
             </div>
          )}
        </div>

        {/* Sliding Rectangular Activity Cards */}
        <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 pb-2">
          {/* Card 1: Overdue Follow-ups */}
          <div 
            className="w-[88%] flex-shrink-0 snap-center bg-white rounded-[1.5rem] p-5 relative overflow-hidden border border-slate-100/50 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
          >
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-400/5 rounded-full blur-3xl"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="text-[0.55rem] font-black text-rose-500 uppercase tracking-[0.15em] mb-1">Urgent Action</div>
                <h4 className="text-sm font-bold text-slate-900">Overdue Follow-ups</h4>
                <p className="text-[0.65rem] text-slate-400 mt-1 max-w-[200px]">Immediately follow up with pending clients.</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[0.5rem] font-bold">JD</div>
                <div className="w-7 h-7 rounded-full border-2 border-white bg-rose-100 flex items-center justify-center text-[0.5rem] font-bold text-rose-600">+{followUpStats.overdue}</div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[0.55rem] text-slate-400 uppercase font-bold">Urgency Level</span>
                  <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full transition-all duration-1000" style={{ width: `${urgencyPercent}%` }}></div>
                  </div>
                </div>
                <span className="text-[0.7rem] font-black text-rose-600 mt-3">{urgencyPercent}%</span>
              </div>
              <div 
                className="bg-slate-900 p-2 rounded-xl text-white cursor-pointer hover:bg-slate-800 transition-colors active:scale-90"
                onClick={() => router.push('/portal/followup')}
              >
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Upcoming Clients */}
          <div 
            className="w-[88%] flex-shrink-0 snap-center bg-white rounded-[1.5rem] p-5 relative overflow-hidden border border-slate-100/50 shadow-[0_10px_30px_rgba(0,0,0,0.02)]"
          >
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-400/5 rounded-full blur-3xl"></div>
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="text-[0.55rem] font-black text-emerald-500 uppercase tracking-[0.15em] mb-1">Scheduled</div>
                <h4 className="text-sm font-bold text-slate-900">Upcoming Clients</h4>
                <p className="text-[0.65rem] text-slate-400 mt-1 max-w-[200px]">Next {upcomingLeads.length} appointments are confirmed.</p>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center border border-emerald-100">
                <Star className="w-5 h-5 text-emerald-500 fill-emerald-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {upcomingLeads.slice(0, 3).map((lead, idx) => (
                    <img 
                      key={idx}
                      src={lead.profile_pic_url || `/client${(idx % 4) + 1}.png`} 
                      className="w-7 h-7 rounded-full border-2 border-white object-cover" 
                      alt={lead.customer_name}
                    />
                  ))}
                  {upcomingLeads.length === 0 && (
                    <div className="w-7 h-7 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center">
                      <Star className="w-3 h-3 text-slate-300" />
                    </div>
                  )}
                </div>
                <span className="text-[0.6rem] font-bold text-slate-500 ml-1">{upcomingLeads.length} Meetings</span>
              </div>
              <div className="bg-emerald-600 p-2 rounded-xl text-white">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement XP CTA Card */}
      <div className="px-4 -mt-16 pb-20 relative z-10">
        <div 
          className="w-full h-[80px] bg-[#4b33e8] rounded-2xl relative overflow-hidden flex items-center px-5 gap-3 border border-white/10"
          style={{ 
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)' 
          }}
        >
          {/* Modern Geometric Pattern Overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.15]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.4) 1px, transparent 0)`,
              backgroundSize: '16px 16px'
            }}
          ></div>

          {/* Noise/Texture Overlay */}
          <div 
            className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* Subtle accent light */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-[60px] pointer-events-none"></div>
          
          <div className="relative z-10 w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-white" />
          </div>

          <div className="relative z-10 flex-1">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-white text-xs font-bold tracking-tight">Achievement XP</span>
              <span className="text-white/60 text-[9px] font-medium tracking-wide uppercase">
                {Math.floor(achievementData.xpInCurrentLevel)} / {achievementData.threshold} XP
              </span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full relative">
              <div 
                className="h-full bg-white rounded-full relative shadow-[0_0_12px_rgba(255,255,255,0.4)] transition-all duration-1000" 
                style={{ width: `${achievementData.progress}%` }}
              >
                {/* Glittering Star Effect at the end */}
                <div className="absolute right-0 top-[calc(50%-1px)] -translate-y-1/2 translate-x-1/2 z-20">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 animate-glitter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10 flex flex-col items-center min-w-[45px] backdrop-blur-sm">
            <span className="text-white/60 text-[9px] font-black leading-none uppercase tracking-tighter">Lvl</span>
            <span className="text-white text-sm font-black leading-none mt-1">
              {achievementData.level}
            </span>
          </div>
        </div>
      </div>

      {/* Two Cards Row (Dials + Connected) */}
      <div className="px-4 -mt-10 pb-12 relative z-10">
        <div className="grid grid-cols-2 gap-4">
          {/* Card 1: Dials (Mesh Gradient Style) */}
          <div 
            className="rounded-[1.5rem] p-6 min-h-[190px] relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl active:scale-[0.98]"
            style={{ 
              background: 'linear-gradient(135deg, #f8f9ff 0%, #e0e7ff 100%)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.04)' 
            }}
          >
            {/* Mesh gradient circles ... */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-400/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl"></div>

            {/* HDR.png Background Sticker */}
            <div className="absolute top-2 -right-8 w-44 h-44 opacity-100 rotate-12 z-0">
              <img src="/hdr.png" alt="Decoration" className="w-full h-full object-contain" />
            </div>

            <div className="relative z-10">
              <div className="text-3xl font-black text-slate-900 tracking-tight">{stats.totalDials}</div>
              <div className="text-xs font-semibold text-slate-500 mt-1">Dials made</div>
            </div>

            <button className="relative z-10 w-full bg-white py-3 rounded-xl text-[0.75rem] font-bold text-slate-900 shadow-sm hover:bg-slate-50 transition-colors border border-slate-100/50">
              View Details
            </button>
          </div>

          {/* Card 2: Connected (Sticker Style) */}
          <div 
            className="bg-white rounded-[1.5rem] p-6 min-h-[190px] relative overflow-hidden flex flex-col justify-between transition-all hover:shadow-xl active:scale-[0.98]"
            style={{ 
              boxShadow: '0 10px 40px rgba(0,0,0,0.04)' 
            }}
          >
            {/* Sticker Group Mockup */}
            <div className="relative h-24 flex items-center justify-center">
              <div className="relative w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 z-20">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              {/* Overlapping small 'stickers' */}
              <div className="absolute top-2 right-4 w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100 shadow-sm">
                <PhoneCall className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="absolute bottom-2 left-4 w-7 h-7 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100 shadow-sm">
                <PhoneIncoming className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="absolute top-6 left-2 w-6 h-6 bg-rose-50 rounded-full flex items-center justify-center border border-rose-100 shadow-sm">
                <PhoneMissed className="w-3 h-3 text-rose-500" />
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm font-bold text-slate-800 leading-tight">
                <span className="text-emerald-500">{secondaryStats.todayCalls}+</span> active calls
              </div>
              <div className="text-[0.65rem] font-medium text-slate-400 mt-0.5">Connected today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Pie Chart Performance Insights */}
      <div className="px-4 -mt-4 pb-24 relative z-10">
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-[0.75rem] font-bold text-slate-800 uppercase tracking-widest">Performance Mix</h3>
          {/* Custom Dropdown (Unified with Dials Analytics) */}
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 hover:bg-white transition-colors shadow-sm"
            >
              <span className="text-[0.6rem] font-bold text-slate-600 uppercase tracking-tight">{getFilterLabel(selectedFilter)}</span>
              <svg className={`w-3 h-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 overflow-hidden">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedFilter(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[0.65rem] transition-colors ${selectedFilter === option.value ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="relative overflow-visible">
          <div className="flex flex-col items-center relative z-10">
            {/* Chart Area */}
            <div className="h-[260px] w-full relative">
              {chartsLoading && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-white/60 backdrop-blur-[2px] transition-all duration-500 rounded-full">
                  <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    <linearGradient id="grad-connected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4b33e8" />
                      <stop offset="100%" stopColor="#3b27c2" />
                    </linearGradient>
                    <linearGradient id="grad-rechurn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b27c2" />
                      <stop offset="100%" stopColor="#2e1f8f" />
                    </linearGradient>
                    <linearGradient id="grad-fresh" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="grad-leads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="grad-followups" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                    <linearGradient id="grad-closed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f43f5e" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                    <linearGradient id="grad-rejected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#64748b" />
                      <stop offset="100%" stopColor="#475569" />
                    </linearGradient>
                  </defs>
                  <Pie
                    data={pieData.length > 0 ? pieData : [
                      { name: 'Dials', value: stats.totalDials, color: 'url(#grad-connected)' },
                      { name: 'Connected', value: secondaryStats.todayCalls, color: 'url(#grad-fresh)' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={105}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={false}
                    cornerRadius={10}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || [
                        'url(#grad-connected)', 'url(#grad-rechurn)', 'url(#grad-fresh)', 
                        'url(#grad-leads)', 'url(#grad-followups)', 'url(#grad-closed)', 'url(#grad-rejected)'
                      ][index % 7]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Central Value - Ultra Modern Typography */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="relative">
                  <span className="text-4xl font-[900] text-slate-900 tracking-tighter leading-none drop-shadow-sm">
                    {stats.totalDials}
                  </span>
                  <div className="absolute -inset-2 bg-indigo-500/5 blur-xl rounded-full -z-10"></div>
                </div>
              </div>
            </div>

            {/* Modern Horizontal Scrollable Badges */}
            <div className="flex overflow-x-auto hide-scrollbar gap-3 w-full mt-3 px-1 pb-10">
              {[
                { label: 'Connected', value: secondaryStats.todayCalls.toString(), color: 'bg-indigo-600', icon: CheckCircle },
                { label: 'Dials', value: stats.totalDials.toString(), color: 'bg-blue-600', icon: PhoneCall },
                { label: 'Follow Ups', value: secondaryStats.followupCalls.toString(), color: 'bg-violet-500', icon: PhoneIncoming },
                { label: 'Efficiency', value: `${displayEfficiency}%`, color: 'bg-emerald-500', icon: Trophy }
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex-shrink-0 flex items-center gap-2.5 bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:bg-white transition-all active:scale-95 cursor-pointer"
                >
                  <div className={`w-6 h-6 ${item.color} rounded-full flex items-center justify-center text-white shadow-sm`}>
                    <item.icon className="w-3 h-3" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.5rem] font-bold text-slate-400 uppercase tracking-tighter leading-none">{item.label}</span>
                    <span className="text-[0.8rem] font-black text-slate-900 leading-none mt-0.5">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      {/* Top 3 Performers Leaderboard Section (Moved Above) */}
      <div className="px-4 mb-8 relative z-10">
        <div className="flex items-center justify-between mb-8 px-1">
          <h3 className="text-[0.75rem] font-bold text-slate-800 uppercase tracking-widest">Top Performers</h3>
          <span className="text-[0.6rem] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase">Live</span>
        </div>
        
        <div className="flex justify-between items-end px-2 mt-2">
          {topPerformers.sort((a,b) => (a.rank === '1' ? -1 : 1)).map((performer, i) => (
            <div key={i} className={`flex flex-col items-center gap-3 relative ${performer.rank === '1' ? 'order-2 scale-110 -translate-y-2' : performer.rank === '2' ? 'order-1' : 'order-3'}`}>
              {/* Profile Avatar */}
              <div className={`${performer.size} rounded-full p-0.5 bg-white border border-white shadow-xl relative overflow-visible`}>
                <img src={performer.img} className="w-full h-full object-cover rounded-full border border-slate-50" alt={performer.name} />
                {/* Rank Badge Bubble */}
                <div className={`absolute -top-1 -right-1 w-7 h-7 ${performer.color} rounded-full border-2 border-white flex items-center justify-center shadow-md`}>
                  <span className="text-white text-[0.7rem] font-black">#{performer.rank}</span>
                </div>
              </div>
              
              <div className="text-center flex flex-col items-center">
                <div className="text-[0.75rem] font-bold text-slate-800 leading-none">{performer.name}</div>
                <div className="flex flex-col gap-0.5 mt-1.5">
                  <div className="text-[0.6rem] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block lowercase">
                    {performer.dials} dials
                  </div>
                  <div className="text-[0.55rem] font-bold text-slate-400 tracking-tight lowercase">
                    {performer.talktime}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Race to Rank #12 Gamified Widget */}
      <div className="   mt-20 pb-12 relative z-10">
        <div 
          className="w-full h-[110px] bg-[#4b33e8] rounded-[1.5rem] relative flex items-center px-6  shadow-[0_20px_50px_rgba(75,51,232,0.3)]"
        >
          {/* Internal Race Widget Blobs (SOLID & SHARP STYLE - Background Tones) */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2rem] pointer-events-none">
            <div className="absolute top-[-100px] left-[0%] w-44 h-44 bg-indigo-400/30 rounded-full"></div>
            <div className="absolute bottom-[-120px] right-[0%] w-44 h-44 bg-violet-600/40 rounded-full"></div>
          </div>
          
          {/* Character Sticker Asset (rpt1.png) - LARGER & POP-OUT */}
          <div className="absolute left-[-10px] bottom-0 h-[170px] w-[180px] pointer-events-none z-20">
            <img 
              src="/rpt1.png" 
              alt="Race Character" 
              className="w-full h-full object-contain object-bottom transform drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
            />
          </div>

          {/* Floating Badge - NOW POPS OUT FROM TOP */}
          <div className="absolute top-[-15px] left-[160px] z-30 bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-1.5 rounded-full shadow-[0_8px_20px_rgba(251,191,36,0.3)] flex items-center gap-2 border border-white/20">
            <Trophy className="w-3.5 h-3.5 text-[#fff]" />
            <span className="text-[#fff] text-[0.65rem] font-[900] uppercase tracking-wider">Race to Rank #1</span>
          </div>

          <div className="flex-1 relative z-10 pl-32">
            <h4 className="text-white text-[1rem] font-bold leading-tight drop-shadow-md">
              {userRankData?.rank === 1 ? "Hurray! You are the top performer!" : "Hurray! You're near to win..."}
            </h4>
            <p className="text-white/60 text-[0.65rem] font-bold mt-1 tracking-tight">
              {userRankData?.rank === 1 ? (
                <>Keep it up to maintain <span className="text-amber-400">Rank #1</span></>
              ) : (
                <>Beat <span className="text-white underline decoration-amber-400 underline-offset-2">{userRankData?.aheadEmployee?.name || 'Top Dialer'}</span> to win <span className="text-amber-400">Rank #{userRankData?.rank ? userRankData.rank - 1 : '1'}</span></>
              )}
            </p>
          </div>



        </div>
      </div>

      <div 
        className={`fixed inset-0 z-[100] bg-white transition-transform duration-500 ease-out flex flex-col ${isSearchOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Search Header */}
        <div className="px-5 pt-8 pb-4 flex items-center gap-4">
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="p-2 hover:bg-slate-50 rounded-full transition-colors active:scale-90"
          >
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input 
              autoFocus={isSearchOpen}
              type="text" 
              placeholder="Search anything..." 
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Search Content (Recent Searches Mockup) */}
        <div className="flex-1 px-6 pt-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Recent Searches</h4>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Clear All</button>
          </div>

          <div className="flex flex-col gap-5">
            {['Dial performance report', 'Team productivity', 'Active leads', 'Monthly targets'].map((term, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                    <Search className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <span className="text-slate-700 font-semibold text-[0.95rem] group-hover:text-indigo-600 transition-colors">{term}</span>
                </div>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>

          {/* Quick Suggestions */}
          <div className="mt-12">
            <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Quick Suggestions</h4>
            <div className="flex flex-wrap gap-2.5">
              {['Reports', 'Analytics', 'Team', 'Leads', 'Calls'].map((tag) => (
                <button key={tag} className="px-5 py-2 bg-slate-50 rounded-full text-sm font-bold text-slate-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm border border-slate-100">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .profile-container { perspective: 1000px; animation: flip-anim 8s infinite ease-in-out; }
        .border-anim { animation: border-draw 2s infinite ease-in-out; border-color: white; border-style: solid; }
        .image-flip { backface-visibility: hidden; }
        
        /* Force remove all focus outlines */
        :global(*:focus) {
          outline: none !important;
          box-shadow: none !important;
        }

        @keyframes border-draw {
          0% { transform: scale(1); opacity: 1; border-width: 1.5px; }
          50% { transform: scale(1.15); opacity: 0.5; border-width: 0.5px; }
          100% { transform: scale(1); opacity: 1; border-width: 1.5px; }
        }
        @keyframes flip-anim {
          0%, 80% { transform: rotateY(0deg); }
          90%, 100% { transform: rotateY(360deg); }
        }
        @keyframes glitter {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; filter: brightness(1); }
          50% { transform: scale(1.2) rotate(15deg); opacity: 0.9; filter: brightness(1.4); }
        }
        .animate-glitter {
          animation: glitter 1.5s infinite ease-in-out !important;
        }
      `}</style>
      </div>
    </div>
  );
}
