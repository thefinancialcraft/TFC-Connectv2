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
} from "recharts";
import { AgentDataPoint, useAgentPerformance } from "../../hooks/useAgentPerformance";

interface AgentPerformanceTabProps {
  agentData?: AgentDataPoint[];
  totalDials?: number;
}

export default function AgentPerformanceTab({
  agentData: initialAgentData,
  totalDials: initialTotal,
}: AgentPerformanceTabProps) {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState("all_time");
  
  const { 
    agentData, 
    fetchAgentPerformance, 
    loading 
  } = useAgentPerformance();

  // Fetch data when filter changes
  useEffect(() => {
    fetchAgentPerformance(undefined, dateFilter);
  }, [dateFilter, fetchAgentPerformance]);

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
                Total dials per agent across all active sessions
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

          <div className="flex-1 min-h-[400px]">
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
                <XAxis type="number" hide />
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
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    background: "#111827",
                    color: "#fff",
                  }}
                  itemStyle={{
                    color: "#fff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
                <Bar
                  dataKey="count"
                  name="Total Activities"
                  fill="#4b33e8"
                  radius={[0, 20, 20, 0]}
                  barSize={24}
                >
                  <LabelList
                    dataKey="count"
                    position="right"
                    fill="#263238"
                    fontSize={12}
                    fontWeight="bold"
                    offset={15}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
                    {agent.count.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">
                    {(
                      (agent.count / (totalDials || 1)) *
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
    </div>
  );
}
