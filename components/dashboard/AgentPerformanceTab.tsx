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
}

export default function AgentPerformanceTab({
  agentData: initialAgentData,
  totalDials: initialTotal,
  selectedOrgId,
  selectedUserId,
}: AgentPerformanceTabProps) {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState("all_time");
  
  const { 
    agentData, 
    fetchAgentPerformance, 
    loading,
    totalDuration
  } = useAgentPerformance();
  const [mounted, setMounted] = useState(false);

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

  // Fetch data when filter changes
  useEffect(() => {
    const orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
    const userFilter = selectedUserId === "all" ? undefined : selectedUserId;
    fetchAgentPerformance(orgFilter, dateFilter, undefined, false, userFilter);
  }, [dateFilter, selectedOrgId, selectedUserId, fetchAgentPerformance]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
      const userFilter = selectedUserId === "all" ? undefined : selectedUserId;
      fetchAgentPerformance(orgFilter, dateFilter, undefined, false, userFilter);
    }, 30000); // 30 seconds
    return () => clearInterval(interval);
  }, [dateFilter, selectedOrgId, selectedUserId, fetchAgentPerformance]);

  const totalDials = agentData.reduce((acc, curr) => acc + curr.count, 0);

  const handlePrint = () => {
    window.print();
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

      {/* Date Filter */}
      <div className="flex justify-end">
        <div className="relative group">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-[#263238] hover:bg-gray-50 transition-all cursor-pointer focus:outline-none shadow-sm"
            style={{ minWidth: "140px" }}
            disabled={loading}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Agent Leaderboard Chart */}
        <div 
          id="agent-leaderboard-print-area"
          className="lg:col-span-8 bg-white rounded-[24px] p-8 shadow-sm border border-gray-50 flex flex-col relative"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-[24px] no-print">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b33e8]"></div>
            </div>
          )}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-[#263238] text-xl">
                Agent Productivity Leaderboard
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Total dials and total talktime per agent across all active sessions
              </p>
            </div>
            <div className="flex items-center gap-3 no-print">
              <button
                onClick={handlePrint}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-[#4b33e8] transition-colors"
                title="Print Chart"
              >
                <i className="fi flex fi-rr-print text-sm"></i>
              </button>
              <div className={`px-4 py-2 ${loading ? 'bg-gray-100 text-gray-500' : 'bg-[#4b33e8]/5 text-[#4b33e8]'} rounded-xl text-xs font-bold uppercase tracking-widest transition-colors`}>
                {loading ? "Updating..." : "Live Tracking"}
              </div>
            </div>
          </div>

          <div className="flex-1" style={{ height: '400px', width: '100%', position: 'relative' }}>
            {mounted && (
              <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>

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
                    tick={{
                      fill: "#263238",
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                    width={120}
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
                    dataKey="count"
                    xAxisId="cnt"
                    name="Dials"
                    fill="#4b33e8"
                    radius={[0, 20, 20, 0]}
                    barSize={12}
                  >
                    <LabelList
                      dataKey="count"
                      position="right"
                      content={(props: any) => {
                        const { x, y, width, value } = props;
                        return (
                          <text
                            x={x + width + 5}
                            y={y + 10}
                            fill="#4b33e8"
                            fontSize={10}
                            fontWeight="bold"
                          >
                            {value}
                          </text>
                        );
                      }}
                    />
                  </Bar>
                  <Bar
                    dataKey="duration"
                    xAxisId="dur"
                    name="Talktime"
                    fill="#10b981"
                    radius={[0, 20, 20, 0]}
                    barSize={12}
                  >
                     <LabelList
                      dataKey="duration"
                      position="right"
                      content={(props: any) => {
                        const { x, y, width, value } = props;
                        return (
                          <text
                            x={x + width + 5}
                            y={y + 10}
                            fill="#10b981"
                            fontSize={10}
                            fontWeight="bold"
                          >
                            {formatDuration(value)}
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

        {/* Top Performers Table */}
        <div className="lg:col-span-4 bg-white rounded-[24px] p-8 shadow-sm border border-gray-50 flex flex-col relative">
          {loading && (
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
                    {agent.name.charAt(0)}
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
      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden text-left">
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
                  >
                      <i className={`fi flex fi-rr-refresh ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`}></i>
                      <span>Refresh</span>
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
                      <tr className="bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest">
                          <th className="px-5 py-4 font-bold">Agent</th>
                          <th className="px-2 py-4 font-bold text-center">Last Active</th>
                          <th className="px-2 py-4 font-bold text-center">Status</th>
                          <th className="px-2 py-4 font-bold text-center">Dials</th>
                          <th className="px-2 py-4 font-bold text-center">Connected</th>
                          <th className="px-2 py-4 font-bold text-center">Avg Talk</th>
                          <th className="px-2 py-4 font-bold text-center">Follow Ups</th>
                          <th className="px-2 py-4 font-bold text-center">Deals</th>
                          <th className="px-5 py-4 font-bold text-right">Last Call</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                      {agentData.length === 0 ? (
                          <tr>
                              <td colSpan={9} className="px-8 py-12 text-center">
                                  <div className="flex flex-col items-center gap-2">
                                      <i className="fi fi-rr-search text-3xl text-gray-200"></i>
                                      <p className="text-sm font-bold text-gray-400">No agent activity found for this period</p>
                                  </div>
                              </td>
                          </tr>
                      ) : agentData.map((agent, i) => {
                          const { status, idleTime, isOnline } = calculateStatus(agent.last_active);
                          const connectRate = agent.count > 0 ? ((agent.connected_count / agent.count) * 100).toFixed(1) : "0.0";
                          const avgTalkTime = agent.count > 0 ? formatDuration(Math.floor(agent.duration / agent.count)) : "0s";
                          
                          return (
                              <tr key={agent.id} className="hover:bg-gray-50/50 transition-colors group">
                                  <td className="px-5 py-5">
                                      <div className="flex items-center gap-4">
                                          <div className="w-11 h-11 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center text-[#4b33e8] font-bold group-hover:bg-[#4b33e8] group-hover:text-white transition-all">
                                              {agent.profile_pic_url ? (
                                                  <img src={agent.profile_pic_url} alt="" className="w-full h-full object-cover" />
                                              ) : (
                                                  <span className="text-sm">{agent.name.charAt(0)}</span>
                                              )}
                                          </div>
                                          <div>
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
                                  <td className="px-2 py-5 text-center text-sm font-bold text-[#263238]">
                                      {agent.count.toLocaleString()}
                                  </td>
                                  <td className="px-2 py-5 text-center">
                                      <p className="text-sm font-bold text-[#263238]">{agent.connected_count}</p>
                                      <p className="text-[10px] text-indigo-500 font-bold">{connectRate}% </p>
                                  </td>
                                  <td className="px-2 py-5 text-center text-sm text-gray-600 font-bold">
                                      {avgTalkTime}
                                  </td>
                                  <td className="px-2 py-5 text-center">
                                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#4b33e8] text-[10px] font-bold border border-indigo-100">
                                          {agent.follow_ups_count} PENDING
                                      </span>
                                  </td>
                                  <td className="px-2 py-5 text-center">
                                      {agent.deals_count > 0 ? (
                                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-sm">
                                              <i className="fi flex fi-rr-trophy text-xs"></i> {agent.deals_count}
                                          </span>
                                      ) : <span className="text-gray-300 font-bold">-</span>}
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
