import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
} from "recharts";
import { AgentDataPoint, useAgentPerformance } from "../../hooks/useAgentPerformance";

interface AgentPerformanceTabProps {
  agentData?: AgentDataPoint[];
  totalDials?: number;
  selectedOrgId?: string;
  selectedUserId?: string;
  dateFilter?: string;
  loading?: boolean;
}

export default function AgentPerformanceTab({
  agentData: initialAgentData,
  totalDials: initialTotal,
  selectedOrgId,
  selectedUserId,
  dateFilter: propDateFilter = "today",
  loading = false,
}: AgentPerformanceTabProps) {
  const router = useRouter();
  
  // Date states for local filtration
  const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD format
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(todayStr);
  const [isFiltered, setIsFiltered] = useState(false);

  const dateFilter = propDateFilter;
  
  const { 
    agentData, 
    fetchAgentPerformance, 
    loading: internalLoading,
    totalDuration
  } = useAgentPerformance();

  const handleApplyFilter = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      const orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
      const userFilter = selectedUserId === "all" ? undefined : selectedUserId;
      
      setIsFiltered(true);
      fetchAgentPerformance(orgFilter, "custom", {
        start: start.toISOString(),
        end: end.toISOString()
      }, false, userFilter);
    }
  };

  // Reset local filter if parent dateFilter changes
  useEffect(() => {
    setIsFiltered(false);
  }, [dateFilter]);

  const isLoading = loading || internalLoading;
  const [mounted, setMounted] = useState(false);
  const [metric, setMetric] = useState<'dials' | 'talktime'>('dials');

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 150);
    return () => clearTimeout(timer);
  }, []);



  // Helper to format duration (seconds to HH:MM:SS)
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateStatus = (lastActive: string | null) => {
    if (!lastActive) return { status: 'Idle', idleTime: 'N/A', isOnline: false };
    const now = new Date();
    const active = new Date(lastActive);
    const diffMs = now.getTime() - active.getTime();
    
    // Convert to seconds for precision
    const diffSec = Math.floor(diffMs / 1000);
    
    let idleTimeStr = "N/A";
    if (diffSec < 60) {
      idleTimeStr = `${diffSec}s`;
    } else if (diffSec < 3600) {
      idleTimeStr = `${Math.floor(diffSec / 60)}m`;
    } else {
      const h = Math.floor(diffSec / 3600);
      const m = Math.floor((diffSec % 3600) / 60);
      idleTimeStr = `${h}h ${m}m`;
    }

    // New 30 second threshold for Active vs Idle
    const isOnline = diffSec >= 0 && diffSec < 30;
    return { 
      status: isOnline ? 'Active' : 'Idle', 
      idleTime: idleTimeStr,
      isOnline
    };
  };

  // Fetch data when filter changes (Only if not using local custom filter)
  useEffect(() => {
    if (!isFiltered) {
        const orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
        const userFilter = selectedUserId === "all" ? undefined : selectedUserId;
        fetchAgentPerformance(orgFilter, dateFilter, undefined, false, userFilter);
    }
  }, [dateFilter, selectedOrgId, selectedUserId, fetchAgentPerformance, isFiltered]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
        const orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
        const userFilter = selectedUserId === "all" ? undefined : selectedUserId;
        
        if (isFiltered && startDate && endDate) {
             const start = new Date(startDate);
             start.setHours(0, 0, 0, 0);
             const end = new Date(endDate);
             end.setHours(23, 59, 59, 999);
             fetchAgentPerformance(orgFilter, "custom", { start: start.toISOString(), end: end.toISOString() }, false, userFilter);
        } else {
             fetchAgentPerformance(orgFilter, dateFilter, undefined, false, userFilter);
        }
    }, 30000); 
    return () => clearInterval(interval);
  }, [dateFilter, selectedOrgId, selectedUserId, fetchAgentPerformance, isFiltered, startDate, endDate]);

  const totalDials = agentData.reduce((acc, curr) => acc + curr.count, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadExcel = () => {
    if (!agentData || agentData.length === 0) return;

    // Excel-friendly CSV with BOM for special characters
    const BOM = "\uFEFF";
    const headers = ["Agent Name", "Employee ID", "Status", "Total Dials", "Connected Calls", "Talk Time (Total)", "Avg Talk Time", "Follow Ups", "Streak/Gap", "Utilization", "Last Active"];
        
    const rows = agentData.map(agent => {
        const { status } = calculateStatus(agent.last_active);
        const avgTalkTime = agent.connected_count > 0 ? formatDuration(Math.floor(agent.duration / agent.connected_count)) : "0s";
        
        return [
            agent.name,
            agent.employee_id || "N/A",
            agent.on_call ? (agent.is_personal ? "PERSONAL CALL" : "ON CALL") : status,
            agent.count,
            agent.connected_count,
            formatDuration(agent.duration || 0),
            avgTalkTime,
            agent.follow_ups_count || 0,
            agent.consecutive_failed_stats || "0/0s",
            `${((((agent.duration || 0) / 60) * 1.67 + (agent.count || 0)) / 3).toFixed(1)}%`,
            agent.last_active ? new Date(agent.last_active).toLocaleString() : "Never"
        ];
    });

    const csvContent = [
        headers.join(","),
        ...rows.map(row => row.map(cell => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
    ].join("\r\n");

    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Agent_Performance_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <style>{`
        @media print {
          /* Hide everything by default */
          body * {
            visibility: hidden;
          }
          
          /* Only show the leaderboard chart container */
          #agent-leaderboard-print-area, #agent-leaderboard-print-area * {
            visibility: visible;
          }
          
          /* Position the container at the top left */
          #agent-leaderboard-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }

          /* Hide UI elements within the container that shouldn't print */
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Date Range Filter Controls */}
      <div className="flex justify-end items-center gap-3">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-500 focus:outline-none focus:border-[#4b33e8] shadow-sm transition-all cursor-pointer"
          />
          <span className="text-gray-400 font-bold">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-500 focus:outline-none focus:border-[#4b33e8] shadow-sm transition-all cursor-pointer"
          />
        </div>
        <button
          onClick={handleApplyFilter}
          disabled={isLoading || !startDate || !endDate}
          className="px-5 py-2 bg-[#4b33e8] hover:bg-[#3b25b8] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <>
              <i className="fi fi-rr-filter flex text-xs"></i>
              <span>Apply Filter</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Leaderboard Chart */}
        <div 
          id="agent-leaderboard-print-area"
          className="lg:col-span-8 bg-white rounded-[24px] p-8 flex flex-col relative h-[550px]"
        >
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-[24px] no-print">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b33e8]"></div>
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-[#263238] text-xl">
                Agent Productivity Leaderboard
              </h3>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                Dials & Talktime per agent
              </p>
            </div>
              <div className="flex items-center gap-3 no-print">
                <div className="flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50">
                  <button
                    onClick={() => setMetric('dials')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${
                      metric === 'dials' 
                        ? 'bg-white shadow-sm text-[#4b33e8]' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Dials
                  </button>
                  <button
                    onClick={() => setMetric('talktime')}
                    className={`px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${
                      metric === 'talktime' 
                        ? 'bg-white shadow-sm text-[#10b981]' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    Talktime
                  </button>
                </div>
                <button
                  onClick={handlePrint}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-[#4b33e8] transition-colors"
                  title="Print Chart"
                >
                  <i className="fi flex fi-rr-print text-sm"></i>
                </button>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-100 scrollbar-track-transparent no-print-scroll">
            <div style={{ height: `${Math.max(400, agentData.length * 40)}px`, width: '100%', position: 'relative' }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  layout="vertical"
                  data={agentData}
                  margin={{ top: 0, right: 40, left: 20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    horizontal={false}
                    stroke="#F1F1F1"
                  />
                  <XAxis type="number" hide xAxisId="cnt" />
                  <XAxis type="number" hide xAxisId="dur" />
                  <Legend 
                    verticalAlign="top" 
                    align="right" 
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', fontWeight: 'bold' }}
                  />
                   <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    interval={0}
                    tick={{
                      fill: "#263238",
                      fontSize: 11,
                      fontWeight: 700,
                      textAnchor: "end"
                    }}
                    width={110}
                    dx={-8}
                  />
                  <Tooltip
                    cursor={{ fill: "#F9FAFB", radius: 8 }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-[#111827] p-3 rounded-xl border-none shadow-xl">
                            <p className="text-white font-bold text-xs mb-1">{data.name}</p>
                            <div className="flex flex-col gap-0.5">
                              <p className="text-[#4b33e8] text-[10px] font-bold">Dials: {data.count}</p>
                              <p className="text-green-400 text-[10px] font-bold">Talktime: {formatDuration(data.duration)}</p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey={metric === 'dials' ? 'count' : 'duration'}
                    xAxisId={metric === 'dials' ? 'cnt' : 'dur'}
                    name={metric === 'dials' ? 'Dials' : 'Talktime'}
                    fill={metric === 'dials' ? '#4b33e8' : '#10b981'}
                    radius={[0, 20, 20, 0]}
                    barSize={26}
                  >
                    <LabelList
                      dataKey={metric === 'dials' ? 'count' : 'duration'}
                      position="right"
                      content={(props: any) => {
                        const { x, y, width, value } = props;
                        return (
                          <text
                            x={x + width + 5}
                            y={y + 13}
                            fill={metric === 'dials' ? '#4b33e8' : '#10b981'}
                            fontSize={10}
                            fontWeight="bold"
                          >
                            {metric === 'dials' ? value : formatDuration(value)}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
            </div>
          </div>
        </div>

        {/* Top Performers Table */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-8 flex flex-col relative h-[550px]">
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-[24px]">
               {/* Minimal spinner or just opacity */}
            </div>
          )}
          <h3 className="font-bold text-[#263238] mb-6">
            Activity Contribution
          </h3>
          <div className="space-y-6 flex-1 overflow-y-auto max-h-[450px] pr-2">
            {agentData.map((agent, i) => (
              <div
                key={i}
                className="flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#4b33e8] font-bold text-xs border border-gray-100 group-hover:bg-[#4b33e8] group-hover:text-white transition-all">
                    {(agent.name || "Unknown").charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#263238]">
                      {agent.name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Rank #{i + 1} in team
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#263238]">
                    {(agent.count || 0).toLocaleString()} <span className="text-[10px] text-gray-400 font-medium ml-1">dials</span>
                  </p>
                  <p className="text-[11px] font-bold text-[#4b33e8]">
                    {formatDuration(agent.duration || 0)}
                  </p>
                  <p className="text-[9px] text-green-500 font-bold uppercase tracking-tighter">
                    {(
                      ((agent.count || 0) / (totalDials || 1)) *
                      100
                    ).toFixed(1)}
                    % share
                  </p>
                </div>
              </div>
            ))}
            {agentData.length === 0 && (
              <div className="text-center py-10">
                <i className="fi fi-rr-user-robot text-4xl text-gray-200"></i>
                <p className="text-xs text-gray-400 mt-2 font-bold">
                  No active agent data
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => router.push("/team")}
            className="mt-8 w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-[#4b33e8] hover:text-white hover:border-[#4b33e8] transition-all"
          >
            View All Team Insights
          </button>
        </div>
      </div>

      {/* Detailed Member Performance Table */}
      <div className="bg-white rounded-[24px] overflow-hidden text-left">
          <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                  <h3 className="font-bold text-[#263238] text-xl">Member Performance Breakdown</h3>
                  <p className="text-sm text-gray-400 mt-1">Granular metrics for individual agent activity</p>
              </div>
              <div className="flex items-center gap-4">
                  <button 
                      onClick={() => {
                        const orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
                        const userFilter = selectedUserId === "all" ? undefined : selectedUserId;
                        fetchAgentPerformance(orgFilter, dateFilter, undefined, true, userFilter);
                      }}
                      disabled={loading}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all border border-indigo-100 translate-y-[1px]"
                      title="Refresh Data"
                  >
                      <i className={`fi flex fi-rr-refresh ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}></i>
                      <span>Refresh</span>
                  </button>

                  <button 
                      onClick={handleDownloadExcel}
                      disabled={loading || agentData.length === 0}
                      className="group flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all border border-emerald-100 translate-y-[1px]"
                      title="Download Excel Report"
                  >
                      <i className="fi flex fi-rr-download text-emerald-500 group-hover:translate-y-0.5 transition-transform"></i>
                      <span>Download Excel</span>
                  </button>
                  <div className="flex gap-4 text-xs font-bold">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> ACTIVE
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-500 rounded-xl border border-gray-100">
                        <span className="w-2 h-2 rounded-full bg-gray-400"></span> IDLE
                      </span>
                  </div>
              </div>
          </div>
          
          <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                  <thead>
                      <tr className="bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100">
                          <th className="px-5 py-4 font-bold">Agent</th>
                          <th className="px-2 py-4 font-bold text-center">Last Active</th>
                          <th className="px-2 py-4 font-bold text-center">Status</th>
                          <th className="px-2 py-4 font-bold text-center text-[#4b33e8]">Total Dials</th>
                          <th className="px-2 py-4 font-bold text-center">Connected</th>
                          <th className="px-2 py-4 font-bold text-center">Talk Time</th>
                          <th className="px-2 py-4 font-bold text-center">Avg Talk</th>
                          <th className="px-2 py-4 font-bold text-center text-indigo-600">Follow Ups</th>
                          <th className="px-2 py-4 font-bold text-center">Streak/Gap</th>
                          <th className="px-2 py-4 font-bold text-center text-rose-600">Utilization</th>
                          <th className="px-5 py-4 font-bold text-right">Last Call</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {agentData.length === 0 ? (
                          <tr>
                              <td colSpan={10} className="px-8 py-12 text-center">
                                  <div className="flex flex-col items-center gap-2">
                                      <i className="fi fi-rr-search text-3xl text-gray-200"></i>
                                      <p className="text-sm font-bold text-gray-400">No agent activity found for this period</p>
                                  </div>
                              </td>
                          </tr>
                      ) : [...agentData]
                          .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
                          .map((agent, i) => {
                          const { status, idleTime, isOnline } = calculateStatus(agent.last_active);
                          const connectRate = agent.count > 0 ? ((agent.connected_count / agent.count) * 100).toFixed(1) : "0.0";
                          const avgTalkTime = agent.connected_count > 0 ? formatDuration(Math.floor(agent.duration / agent.connected_count)) : "0s";
                          
                          return (
                              <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors group">
                                  <td className="px-5 py-5">
                                      <div className="flex items-center gap-4">
                                          <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center text-[#4b33e8] font-bold group-hover:bg-[#4b33e8] group-hover:text-white transition-all cursor-pointer">
                                              {agent.profile_pic_url ? (
                                                  <img src={agent.profile_pic_url} alt="" className="w-full h-full object-cover" />
                                              ) : (
                                                  <span className="text-sm">{(agent.name || "U").charAt(0)}</span>
                                              )}
                                          </div>
                                          <div className="cursor-pointer">
                                              <p className="text-sm font-bold text-[#263238]">{agent.name}</p>
                                              <p className="text-[10px] text-gray-400 font-medium">ID: {agent.employee_id || i + 101}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-2 py-5 text-center">
                                      {agent.last_online ? (() => {
                                          const diff = Date.now() - new Date(agent.last_online).getTime();
                                          const diffMins = diff / 60000;
                                          let dotColor = "bg-gray-400";
                                          let textColor = "text-gray-500";
                                          let bgColor = "bg-gray-50";
                                          let borderColor = "border-gray-100";
                                          let statusText = "OFFLINE";

                                          if (diffMins <= 1) {
                                              dotColor = "bg-emerald-500 animate-pulse";
                                              textColor = "text-emerald-700";
                                              bgColor = "bg-emerald-50";
                                              borderColor = "border-emerald-100";
                                              statusText = "ONLINE";
                                          } else if (diffMins <= 3) {
                                              dotColor = "bg-amber-500";
                                              textColor = "text-amber-700";
                                              bgColor = "bg-amber-50";
                                              borderColor = "border-amber-100";
                                              statusText = "IDLE";
                                          }

                                          return (
                                              <div className="flex flex-col items-center gap-1">
                                                  <p className="text-[10px] font-bold text-gray-500">{formatTime(agent.last_online)}</p>
                                                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold border ${bgColor} ${textColor} ${borderColor}`}>
                                                      <span className={`w-1 h-1 rounded-full ${dotColor}`}></span>
                                                      {statusText}
                                                  </div>
                                              </div>
                                          );
                                      })() : (
                                          <span className="text-gray-300 font-bold">-</span>
                                      )}
                                  </td>
                                  <td className="px-2 py-5 text-center">
                                      {agent.on_call ? (
                                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold border ${agent.is_personal ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}>
                                              <i className={`fi flex ${agent.is_personal ? 'fi-rr-book-user text-amber-500' : 'fi-rr-headset text-indigo-500'} text-[10px] animate-pulse`}></i>
                                              {agent.is_personal ? 'PERSONAL CALL' : 'ON CALL'}
                                          </div>
                                      ) : (
                                          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                              <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                                              {isOnline ? 'ACTIVE' : `IDLE ${idleTime !== 'N/A' ? idleTime : ''}`}
                                          </div>
                                      )}
                                  </td>
                                  <td className="px-2 py-5 text-center">
                                      <span className="px-2 py-1 rounded-lg bg-indigo-50 text-[#4b33e8] text-[10px] font-bold border border-indigo-100/50">
                                          {agent.count.toLocaleString()} CALLS
                                      </span>
                                  </td>
                                  <td className="px-2 py-5 text-center">
                                      <p className="text-sm font-bold text-[#263238]">{agent.connected_count}</p>
                                      <p className="text-[10px] text-indigo-500 font-bold">{connectRate}% </p>
                                  </td>
                                  <td className="px-2 py-5 text-center text-sm font-bold text-[#263238]">
                                      {formatDuration(agent.duration || 0)}
                                  </td>
                                  <td className="px-2 py-5 text-center text-sm text-gray-600 font-bold">
                                      {avgTalkTime}
                                  </td>
                                  <td className="px-2 py-5 text-center text-sm text-indigo-600 font-bold">
                                      {agent.follow_ups_count || 0}
                                  </td>
                                  <td className="px-2 py-5 text-center text-sm text-amber-600 font-bold">
                                      {agent.consecutive_failed_stats}
                                  </td>
                                  <td className="px-2 py-5 text-center">
                                      <div className="flex flex-col items-center">
                                          <span className="text-sm font-bold text-rose-600">
                                              {((((agent.duration || 0) / 60) * 1.67 + (agent.count || 0)) / 3).toFixed(1)}%
                                          </span>
                                          <div className="w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                              <div 
                                                  className="h-full bg-rose-500" 
                                                  style={{ width: `${Math.min(100, (((agent.duration || 0) / 60) * 1.67 + (agent.count || 0)) / 3)}%` }}
                                              ></div>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-5 py-5 text-right">
                                      <p className="text-sm font-bold text-[#263238]">{formatTime(agent.last_active)}</p>
                                      <p className="text-[10px] text-gray-400 font-medium">
                                          {agent.last_active ? new Date(agent.last_active).toLocaleDateString() : 'N/A'}
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
  );
}
