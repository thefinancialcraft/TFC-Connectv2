import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { useDashboardReportData } from "../hooks/useDashboardReportData";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from "recharts";

const COLORS = ["#4b33e8", "#4f46e5", "#818cf8", "#c7d2fe"];

export default function DashboardReport() {
  const { user, loading: authLoading } = useAuthGuard();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { orgId, dateFilter } = router.query;
  
  const {
    stats,
    secondaryStats,
    performanceMetrics,
    chartData,
    pieData,
    campaignData,
    agentData,
    loading,
    fetchReportData,
    getDateRangeLabel
  } = useDashboardReportData();

  useEffect(() => {
    setMounted(true);
    if (user && router.isReady) {
      const oid = orgId === "all" ? undefined : (orgId as string);
      const dFilter = (dateFilter as string) || "this_month";
      fetchReportData(oid, dFilter);
    }
  }, [user, router.isReady, orgId, dateFilter, fetchReportData]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4b33e8] mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Generating Report...</p>
        </div>
      </div>
    );
  }

  const currentDateLabel = getDateRangeLabel((dateFilter as string) || "this_month");

  return (
    <div className="min-h-screen bg-white text-[#263238] p-8 print:p-0">
        <style>{`
            @media print {
                @page { margin: 1cm; size: A4; }
                body { -webkit-print-color-adjust: exact; }
                .no-print { display: none !important; }
            }
        `}</style>

      {/* Report Header */}
      <div className="mb-8 border-b border-gray-100 pb-6 flex justify-between items-start">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <div className="w-8 h-8 rounded-lg bg-[#4b33e8] flex items-center justify-center">
                <i className="fi fi-rr-chart-histogram text-white text-sm"></i>
             </div>
             <h1 className="text-2xl font-bold">Analytics Report</h1>
           </div>
           <p className="text-sm text-gray-500" suppressHydrationWarning>
             Generated on {mounted ? `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}` : '-'}
           </p>
           <p className="text-sm text-gray-500 mt-1">
             Prepared for: <span className="font-bold text-[#263238]">{user?.displayName}</span> ({user?.email})
           </p>
        </div>
        <div className="text-right">
            <div className="inline-block px-4 py-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Date Range</p>
                <p className="text-sm font-bold text-[#4b33e8]">{currentDateLabel}</p>
            </div>
            <div className="mt-4 no-print space-x-3">
                <button 
                    onClick={() => window.print()} 
                    className="px-4 py-2 bg-[#4b33e8] text-white rounded-lg text-sm font-bold hover:bg-[#3b27b8] transition-colors"
                >
                    <i className="fi fi-rr-print mr-2"></i> Print Report
                </button>
                 <button 
                    onClick={() => router.back()} 
                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
      </div>

      {/* 1. Key Performance Indicators */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#4b33e8] rounded-full"></span>
            Key Performance Metrics
        </h2>
        <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Customers" value={stats.totalCustomers.toLocaleString()} icon="users" />
            <StatCard label="Total Premium" value={`$${stats.totalPremium.toLocaleString()}`} icon="badge-dollar" color="text-green-600" />
            <StatCard label="Conversions" value={stats.totalConverted} subValue={`${stats.conversionRate}% Rate`} icon="arrow-trend-up" />
            <StatCard label="Total Dials" value={stats.totalDials.toLocaleString()} icon="phone-call" />
            
            <StatCard label="Avg Duration" value={performanceMetrics.avgDuration} icon="clock" secondary />
            <StatCard label="Review Score" value={secondaryStats.freshProspects} icon="star" secondary suffix="Fresh Leads" />
            <StatCard label="Follow Ups" value={secondaryStats.followupCalls} icon="calendar-clock" secondary color="text-orange-500" />
            <StatCard label="Efficiency" value={`${stats.efficiencyScore}%`} icon="chart-pie-alt" secondary />
        </div>
      </div>

      {/* 2. Charts Row */}
      <div className="grid grid-cols-2 gap-8 mb-10 break-inside-avoid">
         {/* Trend Chart */}
         <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
            <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4">6 Month Trend</h3>
            <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                        <Tooltip />
                        <Line type="monotone" dataKey="dials" stroke="#4b33e8" strokeWidth={2} dot={{r: 3}} />
                        <Line type="monotone" dataKey="connected" stroke="#22c55e" strokeWidth={2} dot={{r: 3}} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution Chart */}
         <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50/50">
            <h3 className="font-bold text-sm text-gray-500 uppercase tracking-wider mb-4">Lead Status Distribution</h3>
            <div className="grid grid-cols-2 gap-4 items-center h-[250px]">
                 <div className="h-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                innerRadius={40}
                                outerRadius={70}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="space-y-3">
                    {pieData.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i % COLORS.length]}}></div>
                                <span className="font-medium">{item.name}</span>
                            </div>
                            <span className="font-bold">{item.value}</span>
                        </div>
                    ))}
                 </div>
            </div>
         </div>
      </div>

      {/* 3. Campaign Performance */}
      <div className="mb-10 break-inside-avoid">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#4b33e8] rounded-full"></span>
            Campaign Impact
        </h2>
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                    <tr>
                        <th className="px-6 py-3">Campaign Name</th>
                        <th className="px-6 py-3 text-right">Total Leads</th>
                        <th className="px-6 py-3 text-right">Successful</th>
                        <th className="px-6 py-3 text-right">Conv. Rate</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {campaignData.map((camp, i) => (
                        <tr key={i}>
                            <td className="px-6 py-3 font-medium">{camp.name}</td>
                            <td className="px-6 py-3 text-right">{camp.total}</td>
                            <td className="px-6 py-3 text-right text-green-600 font-bold">{camp.success}</td>
                            <td className="px-6 py-3 text-right">
                                {((camp.success / (camp.total || 1)) * 100).toFixed(1)}%
                            </td>
                        </tr>
                    ))}
                     {campaignData.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-6 text-gray-400">No campaign data available</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* 4. Agent Leaderboard (Full) */}
      <div className="break-inside-avoid">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-[#4b33e8] rounded-full"></span>
            Team Performance Leaderboard
        </h2>
        <div className="border border-gray-100 rounded-2xl overflow-hidden">
             <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                    <tr>
                        <th className="px-6 py-3 w-16">Rank</th>
                        <th className="px-6 py-3">Agent Name</th>
                        <th className="px-6 py-3">Role</th>
                        <th className="px-6 py-3 text-right">Total Activities</th>
                        <th className="px-6 py-3 text-right">Share</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {agentData.map((agent, i) => (
                        <tr key={i} className={i < 3 ? "bg-blue-50/10" : ""}>
                            <td className="px-6 py-3 font-bold text-gray-400">#{i + 1}</td>
                            <td className="px-6 py-3 font-bold text-[#263238] flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-500">
                                    {agent.name.charAt(0)}
                                </div>
                                {agent.name}
                            </td>
                            <td className="px-6 py-3 text-xs text-gray-400">Agent</td>
                            <td className="px-6 py-3 text-right font-bold">{(agent.count || 0).toLocaleString()}</td>
                             <td className="px-6 py-3 text-right text-xs">
                                {(((agent.count || 0) / (agentData.reduce((a, b) => a + (b.count || 0), 0) || 1)) * 100).toFixed(1)}%
                            </td>
                        </tr>
                    ))}
                    {agentData.length === 0 && (
                        <tr><td colSpan={5} className="text-center py-6 text-gray-400">No active agents found</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, subValue, icon, secondary = false, color = "text-[#263238]", suffix = "" }: any) {
    return (
        <div className={`p-4 rounded-xl border ${secondary ? 'border-gray-100 bg-white' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
                <i className={`fi fi-rr-${icon} text-gray-400`}></i>
            </div>
            <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
            {subValue && <p className="text-xs text-gray-500 mt-1">{subValue}</p>}
            {suffix && <p className="text-xs text-gray-400 mt-1">{suffix}</p>}
        </div>
    )
}
