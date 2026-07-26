// Updated Source Logs Detail Page - HMR Refresh
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useUser } from '@/components/AppLayout';
import { supabase } from '@/lib/supabase';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

const renderCustomizedPieLabel = (props: any) => {
  const { cx, cy, midAngle, outerRadius, name, value, fill, payload } = props;
  const baseTotal = payload?.baseTotal || 2312;
  const pctString = ((value / baseTotal) * 100).toFixed(1);

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 18;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  const textAnchor = x > cx ? 'start' : 'end';

  return (
    <text
      x={x}
      y={y}
      fill={fill || '#374151'}
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize={10}
      fontWeight="bold"
    >
      {`${name}: ${value} (${pctString}%)`}
    </text>
  );
};

function getCustomerDetailsSummary(rawDetails: any): string {
  if (!rawDetails) return '—';
  try {
    let raw = rawDetails;
    if (typeof raw === 'string') raw = JSON.parse(raw);
    let parsed: any = {};
    if (raw?.history) {
      const activeKey = raw.active_details || Object.keys(raw.history)[0];
      if (activeKey && raw.history[activeKey]) parsed = raw.history[activeKey];
    } else {
      parsed = raw || {};
    }
    const policy = parsed['POLICY NUMBER_checked'] || parsed['POLICY NUMBER'] || '';
    const plan = parsed['PLAN_checked'] || parsed['PLAN'] || '';
    const premium = parsed['PREMIUM_checked'] || parsed['PREMIUM'] || '';
    const company = parsed['COMPANY_checked'] || parsed['COMPANY'] || '';

    const parts = [];
    if (policy) parts.push(`Pol: ${policy}`);
    if (plan) parts.push(`Plan: ${plan}`);
    if (premium) parts.push(`Prem: ₹${premium}`);
    if (company) parts.push(`${company}`);

    return parts.length > 0 ? parts.join(' | ') : '—';
  } catch (e) {
    return '—';
  }
}

export default function SourceLogsDetail() {
  const router = useRouter();
  const { sourceId } = router.query;
  const { user } = useUser();

  const [activeTab, setActiveTab] = useState<'overview' | 'churnability' | 'leads' | 'agents' | 'analytics'>('overview');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFilterUpdating, setIsFilterUpdating] = useState(false);
  const [error, setError] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filters & Modal State
  const [dialModalLead, setDialModalLead] = useState<any>(null);
  const [overviewTimeRange, setOverviewTimeRange] = useState('7d');
  const [searchQuery, setSearchQuery] = useState('');
  const [agentFilter, setAgentFilter] = useState('all');
  const [dispositionFilter, setDispositionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [callbackLossPage, setCallbackLossPage] = useState(1);
  const itemsPerPage = 15;

  const fetchAnalytics = async () => {
    if (!sourceId) return;
    if (!data) {
      setLoading(true);
    } else {
      setIsFilterUpdating(true);
    }
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Unauthorized: No active session');
        setLoading(false);
        setIsFilterUpdating(false);
        return;
      }

      const res = await fetch(`/api/customer/source-analytics?sourceId=${sourceId}&timeRange=${overviewTimeRange}`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const resData = await res.json();
      if (resData.success) {
        setData(resData.data);
      } else {
        setError(resData.error || 'Failed to load system log details.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching log analytics');
    } finally {
      setLoading(false);
      setIsFilterUpdating(false);
    }
  };

  useEffect(() => {
    if (sourceId) {
      fetchAnalytics();
    }
  }, [sourceId, overviewTimeRange]);

  // Handle Export CSV
  const handleExportCSV = () => {
    if (!filteredLeads || filteredLeads.length === 0) return;
    const headers = ['Customer Name', 'Phone Number', 'Assigned Agent', 'Attempts', 'Last Call', 'Disposition', 'Status'];
    const rows = filteredLeads.map((lead: any) => [
      lead.customerName || 'N/A',
      lead.phoneNo || '',
      lead.assignedAgent || 'Unassigned',
      lead.attempts || 0,
      lead.lastCall ? new Date(lead.lastCall).toLocaleString() : '',
      lead.disposition || '',
      lead.status || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map((e: any[]) => e.map((val: any) => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `source_leads_${sourceId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Leads list
  const filteredLeads = useMemo(() => {
    if (!data?.leads) return [];
    return data.leads.filter((lead: any) => {
      const matchSearch = searchQuery ? (
        (lead.customerName && lead.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (lead.phoneNo && lead.phoneNo.includes(searchQuery))
      ) : true;

      const matchAgent = agentFilter !== 'all' ? lead.assignedAgent === agentFilter : true;
      const matchDisp = dispositionFilter !== 'all' ? lead.disposition === dispositionFilter : true;
      const matchStatus = statusFilter !== 'all' ? lead.status === statusFilter : true;

      return matchSearch && matchAgent && matchDisp && matchStatus;
    });
  }, [data?.leads, searchQuery, agentFilter, dispositionFilter, statusFilter]);

  // Paginated leads
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  // Percentage Pie Chart data relative to Net Uploaded Leads base (2,312)
  const pieChartData = useMemo(() => {
    if (!data?.stats) return [];
    const isFiltered = data?.filteredStats;
    const called = isFiltered ? (data.filteredStats.uniqueCalledLeadsInWindow ?? data.stats.totalCalls) : (data.stats.totalCalls || 0);
    const active = data.stats.activeLeads || 0;
    const rejected = data.stats.rejectedLeads || 0;
    const fresh = data.stats.freshLeads || 0;
    const callbacks = data.callbacks?.pending || 0;
    const closed = data.stats.closedLeads || 0;

    const dupes = data.systemLogDetails?.duplicateCount || 0;
    const baseTotal = Math.max(1, (data.stats.totalLeads || 2312) - dupes);

    const list = [
      { name: 'Called Leads', value: called, baseTotal, color: '#3b82f6' },
      { name: 'Active CRM Leads', value: active, baseTotal, color: '#4b33e8' },
      { name: 'Rejected Leads', value: rejected, baseTotal, color: '#f97316' },
      { name: 'Fresh Leads', value: fresh, baseTotal, color: '#8b5cf6' },
      { name: 'Pending Callbacks', value: callbacks, baseTotal, color: '#06b6d4' },
      { name: 'Closed Deals', value: closed, baseTotal, color: '#10b981' },
    ];

    const valid = list.filter((item) => item.value > 0);
    return valid.length > 0 ? valid : list;
  }, [data]);

  // Top 10 Highest Churn Risk Customers
  const top10ChurnLeads = useMemo(() => {
    if (data?.top10ActiveFatigueLeads && data.top10ActiveFatigueLeads.length > 0) {
      return data.top10ActiveFatigueLeads;
    }
    if (!data?.leads) return [];
    return [...data.leads]
      .filter((lead: any) => {
        if (lead.status === 'rejected' || lead.status === 'closed') return false;
        const disp = (lead.disposition || '').toLowerCase();
        return disp.includes('call back') || disp.includes('callback') || lead.status === 'followup';
      })
      .sort((a, b) => b.attempts - a.attempts || new Date(b.lastCall || 0).getTime() - new Date(a.lastCall || 0).getTime())
      .slice(0, 10);
  }, [data]);

  // Followup count per attempt bucket (status=followup or disposition includes 'call back')
  const followupByAttemptBucket = useMemo(() => {
    if (!data?.leads) return { zero: 0, one: 0, two: 0, three: 0, fourPlus: 0 };
    const isFollowup = (lead: any) => {
      const disp = (lead.disposition || '').toLowerCase();
      return disp.includes('call back') || disp.includes('callback') || lead.status === 'followup';
    };
    return data.leads.reduce(
      (acc: any, lead: any) => {
        if (!isFollowup(lead)) return acc;
        const a = lead.attempts || 0;
        if (a === 0) acc.zero++;
        else if (a === 1) acc.one++;
        else if (a === 2) acc.two++;
        else if (a === 3) acc.three++;
        else acc.fourPlus++;
        return acc;
      },
      { zero: 0, one: 0, two: 0, three: 0, fourPlus: 0 }
    );
  }, [data]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"></div>
        <p className="text-xs text-gray-500 font-medium">Loading system log details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-7xl text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <i className="fi fi-rr-cross-circle text-2xl"></i>
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-1">Failed to load log data</h3>
        <p className="text-xs text-gray-500 mb-6">{error || 'Log details not available.'}</p>
        <button
          onClick={fetchAnalytics}
          className="px-4 py-2 bg-[#4b33e8] hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { meta, stats, funnel, dispositions, agentPerformance, systemLogDetails, callbacks } = data;

  return (
    <>
      <Head>
        <title>{meta.sourceName} | System Log Details</title>
      </Head>

      <div className="container mx-auto px-4 py-6 pb-20 max-w-7xl">
        {/* Header Navigation & Info */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            <Link href="/portal/system-logs" className="text-[#4b33e8] font-medium hover:underline flex items-center gap-1">
              <i className="fi fi-rr-arrow-left text-xs"></i> Back to System Logs
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-gray-200">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-xl font-bold text-gray-800">{meta.sourceName}</h1>
                <span className="bg-gray-100 text-gray-700 text-xs font-mono px-2.5 py-0.5 rounded border border-gray-200">
                  {meta.sourceId}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                <span>Campaign: <strong className="text-gray-700">{meta.campaign}</strong></span>
                <span>•</span>
                <span>Organization: <strong className="text-gray-700">{meta.organization}</strong></span>
                <span>•</span>
                <span>Uploaded: <strong className="text-gray-700">{new Date(meta.createdAt).toLocaleString()}</strong></span>
                {systemLogDetails?.duplicateCount > 0 && (
                  <>
                    <span>•</span>
                    <span className="text-amber-600 font-medium">Duplicates Removed: {systemLogDetails.duplicateCount}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={fetchAnalytics}
                className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200 transition-colors flex items-center gap-1.5"
              >
                <i className="fi fi-rr-refresh text-xs"></i> Refresh
              </button>
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-[#4b33e8] hover:bg-indigo-700 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
              >
                <i className="fi fi-rr-download text-xs"></i> Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* 10 KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Total Uploaded Leads</p>
            <p className="text-2xl font-bold text-gray-800">{stats.totalLeads}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Active CRM Leads</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.activeLeads}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Closed Deals</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.closedLeads}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Connectivity Rate</p>
            <p className="text-2xl font-bold text-amber-600">{stats.connectivityRate}%</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Conversion Rate</p>
            <p className="text-2xl font-bold text-purple-600">{stats.conversionRate}%</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Total Called Leads</p>
            <p className="text-2xl font-bold text-blue-600">{stats.totalCalls}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Rejected Leads</p>
            <p className="text-2xl font-bold text-orange-600">{stats.rejectedLeads ?? 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Fresh Leads (0 Attempts)</p>
            <p className="text-2xl font-bold text-teal-600">{stats.freshLeads ?? 0}</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Avg Talk Time</p>
            <p className="text-2xl font-bold text-rose-600">
              {Math.floor((stats.avgTalkTime || 0) / 60)}m {((stats.avgTalkTime || 0) % 60)}s
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-500 font-medium mb-1">Pending Callbacks</p>
            <p className="text-2xl font-bold text-cyan-600">{callbacks?.pending || 0}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6 flex gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'overview'
                ? 'text-[#4b33e8] border-b-2 border-[#4b33e8] font-semibold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('churnability')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'churnability'
                ? 'text-[#4b33e8] border-b-2 border-[#4b33e8] font-semibold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Churnability
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'leads'
                ? 'text-[#4b33e8] border-b-2 border-[#4b33e8] font-semibold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Leads List ({filteredLeads.length})
          </button>
          <button
            onClick={() => setActiveTab('agents')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'agents'
                ? 'text-[#4b33e8] border-b-2 border-[#4b33e8] font-semibold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Agent Performance
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 transition-colors relative ${
              activeTab === 'analytics'
                ? 'text-[#4b33e8] border-b-2 border-[#4b33e8] font-semibold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Funnel & Call Analytics
          </button>
        </div>

        {/* TAB 0: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overview Time Range Filter Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
              <div>
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <i className="fi fi-rr-clock-three text-[#4b33e8]"></i> Overview Time Window Filter
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Filter trend charts, dial volume, and ratios by custom time window</p>
              </div>

              <div className="flex items-center gap-2">
                {isFilterUpdating && (
                  <div className="flex items-center gap-1.5 bg-indigo-50 text-[#4b33e8] text-xs font-semibold px-2.5 py-1 rounded-md border border-indigo-100 animate-pulse">
                    <svg className="animate-spin h-3.5 w-3.5 text-[#4b33e8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </div>
                )}
                <span className="text-xs font-semibold text-gray-600">Time Window:</span>
                <select
                  value={overviewTimeRange}
                  onChange={(e) => setOverviewTimeRange(e.target.value)}
                  disabled={isFilterUpdating}
                  className={`bg-gray-50 border border-gray-300 text-gray-800 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#4b33e8] cursor-pointer transition-all ${
                    isFilterUpdating ? 'opacity-60 cursor-wait' : ''
                  }`}
                >
                  <option value="1h">In Last 1 Hour</option>
                  <option value="5h">In Last 5 Hours</option>
                  <option value="12h">In Last 12 Hours</option>
                  <option value="24h">In Last 24 Hours</option>
                  <option value="7d">In Last 7 Days (Week)</option>
                  <option value="10d">In Last 10 Days</option>
                  <option value="15d">In Last 15 Days</option>
                  <option value="30d">In Last 30 Days</option>
                  <option value="1m">In Last Month</option>
                </select>
              </div>
            </div>

            {/* Chart 1: Connectivity Rate Trend (Full-width Row 1) */}
            <div className={`bg-white rounded-xl border border-gray-200 p-5 transition-opacity duration-300 ${isFilterUpdating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Connectivity Rate Trend (Latest 10 Days)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Unique connected leads vs Net Uploaded Leads ratio</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-md text-xs font-semibold">
                    Rate: {stats.connectivityRate}%
                  </span>
                </div>
              </div>

              {isMounted && data?.connectivityTrend ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.connectivityTrend}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4b33e8" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#4b33e8" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        unit="%"
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const pData = payload[0].payload;
                            return (
                              <div className="bg-gray-900 text-white p-3.5 rounded-lg text-xs shadow-lg space-y-1">
                                <p className="text-gray-300 font-medium pb-1 border-b border-gray-800">{pData.displayDate}</p>
                                <div className="pt-1 space-y-1">
                                  <p className="text-gray-200 font-semibold">
                                    Total Calls Made: <span className="text-white font-bold">{pData.totalCalls ?? pData.total}</span>
                                  </p>
                                  <p className="text-emerald-400 font-semibold">
                                    Unique Connected Leads: <span className="font-bold">{pData.uniqueConnectedLeads ?? pData.contactable}</span>
                                  </p>
                                  <p className="text-gray-300 text-[11px]">
                                    (Connected Call Logs: {pData.connectedCalls})
                                  </p>
                                  <p className="text-indigo-300 font-semibold pt-0.5 border-t border-gray-800">
                                    Connectivity Rate: <span className="font-bold">{pData.rate}%</span>
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="rate"
                        name="Connectivity Rate (%)"
                        stroke="#4b33e8"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorRate)"
                        dot={{ r: 4, fill: '#4b33e8', strokeWidth: 2, stroke: '#ffffff' }}
                        activeDot={{ r: 6, fill: '#4b33e8', strokeWidth: 2, stroke: '#ffffff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-xs text-gray-400">
                  Loading trend chart...
                </div>
              )}
            </div>

            {/* Chart 2: Dials vs Connected Trend (Full-width Row 2) */}
            <div className={`bg-white rounded-xl border border-gray-200 p-5 transition-opacity duration-300 ${isFilterUpdating ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Dials vs Connected Trend (Latest 10 Days)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Total calls dialled vs connected calls count per day</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-md text-xs font-semibold">
                    Dials & Connected Volume
                  </span>
                </div>
              </div>

              {isMounted && data?.connectivityTrend ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data.connectivityTrend}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorDials" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#64748b" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#64748b" stopOpacity={0.0} />
                        </linearGradient>
                        <linearGradient id="colorConnected" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const pData = payload[0].payload;
                            return (
                              <div className="bg-gray-900 text-white p-3.5 rounded-lg text-xs shadow-lg space-y-1">
                                <p className="text-gray-300 font-medium pb-1 border-b border-gray-800">{pData.displayDate}</p>
                                <div className="pt-1 space-y-1">
                                  <p className="text-gray-200 font-semibold">
                                    Total Dials Made: <span className="text-white font-bold">{pData.totalCalls ?? pData.total}</span>
                                  </p>
                                  <p className="text-emerald-400 font-semibold">
                                    Connected Calls: <span className="font-bold">{pData.connectedCalls}</span>
                                  </p>
                                  <p className="text-indigo-300 font-semibold">
                                    Unique Connected Leads: <span className="font-bold">{pData.uniqueConnectedLeads}</span>
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                      <Area
                        type="monotone"
                        dataKey="totalCalls"
                        name="Total Dials"
                        stroke="#64748b"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorDials)"
                        dot={{ r: 3, fill: '#64748b' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="connectedCalls"
                        name="Connected Calls"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#colorConnected)"
                        dot={{ r: 4, fill: '#10b981' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center text-xs text-gray-400">
                  Loading trend chart...
                </div>
              )}
            </div>

            {/* Row 3: 7-Day Volume Bar Chart & Lead Category Share Pie Chart (2-Column Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 3: Daily Call Volume Bar Chart (Latest 7 Days) */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Daily Call Volume (Latest 7 Days)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Total call attempts/dials made per day for this source</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-md text-xs font-semibold">
                    7-Day Volume Bar Chart
                  </span>
                </div>
              </div>

              {isMounted && (data?.dailyDialsTrend || data?.connectivityTrend) ? (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data?.dailyDialsTrend || data?.connectivityTrend || []}
                      margin={{ top: 25, right: 10, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis
                        dataKey="displayDate"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                      />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const pData = payload[0].payload;
                            return (
                              <div className="bg-gray-900 text-white p-3 rounded-lg text-xs shadow-lg space-y-1">
                                <p className="text-gray-300 font-medium pb-1 border-b border-gray-800">{pData.displayDate}</p>
                                <p className="text-blue-400 font-semibold pt-1">
                                  Total Dials Made: <span className="text-white font-bold">{pData.totalCalls ?? pData.total}</span>
                                </p>
                                <p className="text-emerald-400 font-semibold">
                                  Connected Calls: <span className="font-bold">{pData.connectedCalls}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar
                        dataKey="totalCalls"
                        name="Total Dials"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                        label={{ position: 'top', fill: '#1e293b', fontSize: 11, fontWeight: 'bold' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-xs text-gray-400">
                  Loading 7-day volume chart...
                </div>
              )}
            </div>
            {/* Chart 4: Lead Status Distribution Percentage Pie Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Lead Category Share (% Pie Chart)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Percentage distribution of leads across all status tiers</p>
                </div>
                <span className="bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1 rounded-md text-xs font-semibold">
                  Category Share (%)
                </span>
              </div>

              {isMounted && data && pieChartData.length > 0 ? (
                <div className="h-80 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={82}
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        isAnimationActive={false}
                        label={renderCustomizedPieLabel}
                        labelLine={{ stroke: '#94a3b8', strokeWidth: 1.5 }}
                      >
                        {pieChartData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const pData = payload[0];
                            const baseTotal = pData.payload?.baseTotal || 2312;
                            const pct = (((pData.value as number) / baseTotal) * 100).toFixed(1);
                            return (
                              <div className="bg-gray-900 text-white p-3 rounded-lg text-xs shadow-lg space-y-1">
                                <p className="font-bold border-b border-gray-800 pb-1" style={{ color: pData.payload?.color || '#3b82f6' }}>
                                  {pData.name}
                                </p>
                                <p className="text-gray-200">
                                  Count: <span className="font-bold text-white">{pData.value}</span> / {baseTotal} Net Leads
                                </p>
                                <p className="text-gray-300">
                                  Coverage Ratio: <span className="font-bold text-white">{pct}%</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-80 flex items-center justify-center text-xs text-gray-400">
                  Loading percentage pie chart...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

        {/* TAB: CHURNABILITY ANALYTICS */}
        {activeTab === 'churnability' && (
          <div className="space-y-6">
            {/* Churnability Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Exhausted Leads (4+ Dials)</span>
                  <span className="p-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100">
                    <i className="fi fi-rr-flame text-xs"></i>
                  </span>
                </div>
                <p className="text-2xl font-bold text-rose-600">{data?.attemptsDist?.fourPlus || 0}</p>
                <p className="text-[11px] text-gray-500 mt-1">High fatigue leads with repeated dials</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Medium Friction (2-3 Dials)</span>
                  <span className="p-2 bg-amber-50 text-amber-600 rounded-lg border border-amber-100">
                    <i className="fi fi-rr-time-fast text-xs"></i>
                  </span>
                </div>
                <p className="text-2xl font-bold text-amber-600">
                  {(data?.attemptsDist?.two || 0) + (data?.attemptsDist?.three || 0)}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">Leads requiring time slot optimization</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Callback Loss Ratio</span>
                  <span className="p-2 bg-orange-50 text-orange-600 rounded-lg border border-orange-100">
                    <i className="fi fi-rr-cross-circle text-xs"></i>
                  </span>
                </div>
                <p className="text-2xl font-bold text-orange-600">
                  {data?.callbacks?.callbackToNotContactable || 0}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">Rejected leads with prior Callback & 2+ Dials</p>
              </div>

              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Source Health Index</span>
                  <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg border border-indigo-100">
                    <i className="fi fi-rr-pulse text-xs"></i>
                  </span>
                </div>
                <p className="text-2xl font-bold text-indigo-600">{data?.meta?.qualityScore || 85}/100</p>
                <p className="text-[11px] text-gray-500 mt-1">Overall AI Lead Quality Rating</p>
              </div>
            </div>

            {/* Churnability & Attempt Fatigue Distribution Tiles */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">Lead Churnability &amp; Fatigue Risk Matrix</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Attempt distribution and recommended recovery actions</p>
                </div>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-md text-xs font-semibold">
                  Fatigue Score Analysis
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {/* 0 Attempts - Fresh */}
                <div className="relative rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Zero Risk</span>
                    <i className="fi fi-rr-seedling text-emerald-500 text-base leading-none"></i>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700 font-semibold">0 Attempts</p>
                    <p className="text-2xl font-extrabold text-gray-900 leading-tight">{data?.stats?.freshLeads || 0}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {data?.stats?.totalLeads ? ((data.stats.freshLeads / data.stats.totalLeads) * 100).toFixed(1) : 0}% of total leads
                    </p>
                  </div>
                  <div className="border-t border-emerald-100 pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-emerald-700 font-medium">Follow-ups</p>
                    <span className="text-sm font-extrabold text-emerald-700">{followupByAttemptBucket.zero}</span>
                  </div>
                </div>

                {/* 1 Attempt - Low Risk */}
                <div className="relative rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Low Risk</span>
                    <i className="fi fi-rr-phone-call text-blue-500 text-base leading-none"></i>
                  </div>
                  <div>
                    <p className="text-xs text-blue-700 font-semibold">1 Attempt</p>
                    <p className="text-2xl font-extrabold text-gray-900 leading-tight">{data?.attemptsDist?.one || 0}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {data?.stats?.totalLeads ? (((data?.attemptsDist?.one || 0) / data.stats.totalLeads) * 100).toFixed(1) : 0}% of total leads
                    </p>
                  </div>
                  <div className="border-t border-blue-100 pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-blue-700 font-medium">Follow-ups</p>
                    <span className="text-sm font-extrabold text-blue-700">{followupByAttemptBucket.one}</span>
                  </div>
                </div>

                {/* 2 Attempts - Moderate Risk */}
                <div className="relative rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">Moderate Risk</span>
                    <i className="fi fi-rr-clock text-amber-500 text-base leading-none"></i>
                  </div>
                  <div>
                    <p className="text-xs text-amber-700 font-semibold">2 Attempts</p>
                    <p className="text-2xl font-extrabold text-gray-900 leading-tight">{data?.attemptsDist?.two || 0}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {data?.stats?.totalLeads ? (((data?.attemptsDist?.two || 0) / data.stats.totalLeads) * 100).toFixed(1) : 0}% of total leads
                    </p>
                  </div>
                  <div className="border-t border-amber-100 pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-amber-700 font-medium">Follow-ups</p>
                    <span className="text-sm font-extrabold text-amber-700">{followupByAttemptBucket.two}</span>
                  </div>
                </div>

                {/* 3 Attempts - High Churn Risk */}
                <div className="relative rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">High Churn Risk</span>
                    <i className="fi fi-rr-triangle-warning text-orange-500 text-base leading-none"></i>
                  </div>
                  <div>
                    <p className="text-xs text-orange-700 font-semibold">3 Attempts</p>
                    <p className="text-2xl font-extrabold text-gray-900 leading-tight">{data?.attemptsDist?.three || 0}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {data?.stats?.totalLeads ? (((data?.attemptsDist?.three || 0) / data.stats.totalLeads) * 100).toFixed(1) : 0}% of total leads
                    </p>
                  </div>
                  <div className="border-t border-orange-100 pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-orange-700 font-medium">Follow-ups</p>
                    <span className="text-sm font-extrabold text-orange-700">{followupByAttemptBucket.three}</span>
                  </div>
                </div>

                {/* 4+ Attempts - Critical Burnout */}
                <div className="relative rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full">Critical Burnout</span>
                    <i className="fi fi-rr-flame text-rose-500 text-base leading-none"></i>
                  </div>
                  <div>
                    <p className="text-xs text-rose-700 font-semibold">4+ Attempts (Burned)</p>
                    <p className="text-2xl font-extrabold text-gray-900 leading-tight">{data?.attemptsDist?.fourPlus || 0}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {data?.stats?.totalLeads ? (((data?.attemptsDist?.fourPlus || 0) / data.stats.totalLeads) * 100).toFixed(1) : 0}% of total leads
                    </p>
                  </div>
                  <div className="border-t border-rose-100 pt-2 flex items-center justify-between">
                    <p className="text-[11px] text-rose-700 font-medium">Follow-ups</p>
                    <span className="text-sm font-extrabold text-rose-700">{followupByAttemptBucket.fourPlus}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top 10 High-Fatigue Active Leads Table */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <i className="fi fi-rr-flame text-rose-500"></i> Top 10 High-Fatigue Active Leads
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Active CRM leads with highest call fatigue, repeated dials, and uncontactable friction</p>
                </div>
                <span className="bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-md text-xs font-semibold">
                  High Fatigue Active Risk
                </span>
              </div>

              {top10ChurnLeads.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center">No high fatigue active leads detected.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px] bg-gray-50/50">
                        <th className="py-3 px-4">Rank</th>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Phone Number</th>
                        <th className="py-3 px-4">Assigned Agent</th>
                        <th className="py-3 px-4 text-center">Same Agent Dials</th>
                        <th className="py-3 px-4">Last Disposition</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Action Needed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {top10ChurnLeads.map((lead: any, idx: number) => (
                        <tr key={lead.id || idx} className="hover:bg-rose-50/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-400">#{idx + 1}</td>
                          <td className="py-3 px-4 font-semibold text-gray-800">{lead.customerName || 'N/A'}</td>
                          <td className="py-3 px-4 font-mono text-gray-600">{lead.phoneNo}</td>
                          <td className="py-3 px-4 text-gray-700 font-medium">{lead.assignedAgent}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                              lead.attempts >= 4 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {lead.attempts} Call{lead.attempts > 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                              {lead.disposition || 'Call Back'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 capitalize">
                              {lead.status || 'followup'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Link
                              href={`/portal/campaign/${lead.campaignId || data?.meta?.campaignId}/${lead.id}?isManual=true`}
                              className="inline-flex items-center gap-1.5 bg-[#4b33e8] hover:bg-[#3b26c7] text-white px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]"
                            >
                              <i className="fi fi-rr-phone-call text-[10px]"></i>
                              <span>Dial Now</span>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Top 10 Source Rejected Leads Table */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <i className="fi fi-rr-cross-circle text-rose-600"></i> Top 10 Source Rejected Leads
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Leads moved to rejected pool with reasons, dispositions, and rejection timestamps</p>
                </div>
                <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-md text-xs font-semibold">
                  Rejected Leads Pool ({data?.stats?.rejectedLeads || 0} Total)
                </span>
              </div>

              {(!data?.topRejectedLeads || data.topRejectedLeads.length === 0) ? (
                <p className="text-xs text-gray-500 py-6 text-center">No rejected leads records found for this source.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px] bg-gray-50/50">
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Phone Number</th>
                        <th className="py-3 px-4">Assigned Agent</th>
                        <th className="py-3 px-4 text-center">Dials / Attempts</th>
                        <th className="py-3 px-4">Rejection Disposition</th>
                        <th className="py-3 px-4">Rejected Timestamp</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-center">Action Needed</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.topRejectedLeads.map((rejLead: any, idx: number) => (
                        <tr key={rejLead.rejectedId || idx} className="hover:bg-red-50/30 transition-colors">
                          <td className="py-3 px-4 font-bold text-gray-400">#{idx + 1}</td>
                          <td className="py-3 px-4 font-semibold text-gray-800">{rejLead.customerName}</td>
                          <td className="py-3 px-4 font-mono text-gray-600">{rejLead.phoneNo}</td>
                          <td className="py-3 px-4 text-gray-700 font-medium">{rejLead.assignedAgent}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                              rejLead.attempts >= 4 ? 'bg-rose-100 text-rose-700' : rejLead.attempts >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {rejLead.attempts} Call{rejLead.attempts > 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                              {rejLead.disposition}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                            {rejLead.rejectedAt ? new Date(rejLead.rejectedAt).toLocaleString() : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 text-rose-800 border border-rose-200">
                              Rejected
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => setDialModalLead(rejLead)}
                              className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]"
                            >
                              <i className="fi fi-rr-phone-call text-[10px]"></i>
                              <span>Dial</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Callback Loss Leads Table (Prior Callback -> Rejected) */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                    <i className="fi fi-rr-cross-circle text-orange-600"></i> Callback Loss Leads Table (Latest 20 Entries)
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Rejected leads that had a prior scheduled Callback disposition in call logs</p>
                </div>
                <span className="bg-orange-50 text-orange-700 border border-orange-200 px-3 py-1 rounded-md text-xs font-semibold">
                  {data?.callbacks?.callbackToNotContactable || 0} Total Callback Loss
                </span>
              </div>

              {(!data?.callbackLossLeads || data.callbackLossLeads.length === 0) ? (
                <p className="text-xs text-gray-500 py-6 text-center">No callback loss leads records found for this source.</p>
              ) : (
                (() => {
                  const cbList = data.callbackLossLeads || [];
                  const cbPerPage = 10;
                  const totalCbPages = Math.ceil(cbList.length / cbPerPage) || 1;
                  const currentCbLeads = cbList.slice((callbackLossPage - 1) * cbPerPage, callbackLossPage * cbPerPage);

                  return (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                          <thead>
                            <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px] bg-gray-50/50">
                              <th className="py-3 px-4">#</th>
                              <th className="py-3 px-4">Customer Name</th>
                              <th className="py-3 px-4">Phone Number</th>
                              <th className="py-3 px-4">Assigned Agent</th>
                              <th className="py-3 px-4 text-center">Dials / Attempts</th>
                              <th className="py-3 px-4">Prior Callback Time</th>
                              <th className="py-3 px-4">Rejection Disposition</th>
                              <th className="py-3 px-4">Rejected Timestamp</th>
                              <th className="py-3 px-4 text-center">Action Needed</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {currentCbLeads.map((cbLead: any, idx: number) => {
                              const globalIndex = (callbackLossPage - 1) * cbPerPage + idx + 1;
                              return (
                                <tr key={cbLead.rejectedId || cbLead.id || idx} className="hover:bg-orange-50/30 transition-colors">
                                  <td className="py-3 px-4 font-bold text-gray-400">#{globalIndex}</td>
                                  <td className="py-3 px-4 font-semibold text-gray-800">{cbLead.customerName}</td>
                                  <td className="py-3 px-4 font-mono text-gray-600">{cbLead.phoneNo}</td>
                                  <td className="py-3 px-4 text-gray-700 font-medium">{cbLead.assignedAgent}</td>
                                  <td className="py-3 px-4 text-center">
                                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                                      cbLead.attempts >= 4 ? 'bg-rose-100 text-rose-700' : cbLead.attempts >= 2 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {cbLead.attempts} Call{cbLead.attempts > 1 ? 's' : ''}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 font-mono text-[11px] text-amber-700 bg-amber-50/60 rounded px-2 py-0.5">
                                    {cbLead.callbackTime ? new Date(cbLead.callbackTime).toLocaleString() : 'N/A'}
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                                      {cbLead.disposition}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 font-mono text-[11px] text-gray-500">
                                    {cbLead.rejectedAt ? new Date(cbLead.rejectedAt).toLocaleString() : 'N/A'}
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <button
                                      type="button"
                                      onClick={() => setDialModalLead(cbLead)}
                                      className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-3 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-[1.02]"
                                    >
                                      <i className="fi fi-rr-phone-call text-[10px]"></i>
                                      <span>Dial</span>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Bar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-gray-100 text-xs">
                        <span className="text-gray-500 font-medium">
                          Showing <span className="font-bold text-gray-900">{(callbackLossPage - 1) * cbPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(callbackLossPage * cbPerPage, cbList.length)}</span> of <span className="font-bold text-gray-900">{cbList.length}</span> callback loss entries
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={callbackLossPage === 1}
                            onClick={() => setCallbackLossPage((prev) => Math.max(1, prev - 1))}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            &larr; Previous Page
                          </button>
                          <span className="px-3 py-1 rounded-lg bg-gray-100 font-bold text-gray-700 text-xs">
                            {callbackLossPage} / {totalCbPages}
                          </span>
                          <button
                            type="button"
                            disabled={callbackLossPage >= totalCbPages}
                            onClick={() => setCallbackLossPage((prev) => Math.min(totalCbPages, prev + 1))}
                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Next Page &rarr;
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()
              )}
            </div>
          </div>
        )}

        {/* TAB 1: LEADS LIST */}
        {activeTab === 'leads' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-5">
              <div className="relative flex-1 max-w-md">
                <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  type="text"
                  placeholder="Search customer name or phone number..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b33e8] focus:border-transparent"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                {/* Agent Filter */}
                <select
                  value={agentFilter}
                  onChange={(e) => {
                    setAgentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                >
                  <option value="all">All Agents</option>
                  {Array.from(new Set(data.leads.map((l: any) => l.assignedAgent).filter(Boolean))).map((agent: any) => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>

                {/* Disposition Filter */}
                <select
                  value={dispositionFilter}
                  onChange={(e) => {
                    setDispositionFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                >
                  <option value="all">All Outcomes</option>
                  {Array.from(new Set(data.leads.map((l: any) => l.disposition).filter(Boolean))).map((disp: any) => (
                    <option key={disp} value={disp}>{disp}</option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="py-2 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                >
                  <option value="all">All Statuses</option>
                  {Array.from(new Set(data.leads.map((l: any) => l.status).filter(Boolean))).map((st: any) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Table */}
            {filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                No leads match your filter criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px] bg-gray-50/50">
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Phone Number</th>
                      <th className="py-3 px-4">Assigned Agent</th>
                      <th className="py-3 px-4 text-center">Call Attempts</th>
                      <th className="py-3 px-4">Last Activity</th>
                      <th className="py-3 px-4">Disposition</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedLeads.map((lead: any) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          {lead.customerName || 'N/A'}
                        </td>
                        <td className="py-3 px-4 font-mono text-gray-600">
                          {lead.phoneNo}
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {lead.assignedAgent}
                        </td>
                        <td className="py-3 px-4 text-center font-semibold text-gray-800">
                          {lead.attempts}
                        </td>
                        <td className="py-3 px-4 text-gray-500 font-mono text-[11px]">
                          {lead.lastCall ? new Date(lead.lastCall).toLocaleString() : 'N/A'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[11px]">
                            {lead.disposition}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            lead.status === 'closed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                            lead.status === 'rejected' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-blue-50 text-blue-700 border border-blue-200'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                <span>
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span>Page {currentPage} of {totalPages}</span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AGENT PERFORMANCE */}
        {activeTab === 'agents' && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">Agent Allocation & Call Performance</h3>

            {agentPerformance.length === 0 ? (
              <p className="text-xs text-gray-500 py-6 text-center">No agent data available for this source.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px] bg-gray-50/50">
                      <th className="py-3 px-4">Agent Name</th>
                      <th className="py-3 px-4 text-center">Allocated Leads</th>
                      <th className="py-3 px-4 text-center">Total Calls</th>
                      <th className="py-3 px-4 text-center">Connected Rate</th>
                      <th className="py-3 px-4 text-center">Closed Deals</th>
                      <th className="py-3 px-4 text-center">Conversion Rate</th>
                      <th className="py-3 px-4 text-center">Avg Talk Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {agentPerformance.map((agent: any) => (
                      <tr key={agent.agentId} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          {agent.agentName}
                        </td>
                        <td className="py-3 px-4 text-center font-medium text-gray-700">{agent.leads}</td>
                        <td className="py-3 px-4 text-center font-medium text-gray-700">{agent.calls}</td>
                        <td className="py-3 px-4 text-center font-bold text-indigo-600">{agent.connectedRate}%</td>
                        <td className="py-3 px-4 text-center font-bold text-emerald-600">{agent.deals}</td>
                        <td className="py-3 px-4 text-center font-medium text-gray-700">{agent.conversionRate}%</td>
                        <td className="py-3 px-4 text-center text-gray-500">{agent.avgTalkTime}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: FUNNEL & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Funnel Progress */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Lead Funnel Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                {[
                  { label: 'Uploaded', val: funnel.uploaded },
                  { label: 'Imported', val: funnel.imported },
                  { label: 'Assigned', val: funnel.assigned },
                  { label: 'Called', val: funnel.called },
                  { label: 'Connected', val: funnel.connected },
                  { label: 'Interested', val: funnel.interested },
                  { label: 'Closed', val: funnel.closed },
                ].map((step, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-200 p-3 rounded-lg">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">{step.label}</span>
                    <span className="text-lg font-bold text-gray-800 mt-1 block">{step.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dispositions Breakdown */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Call Outcome Dispositions</h3>
              {dispositions.length === 0 ? (
                <p className="text-xs text-gray-500">No call log dispositions available.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {dispositions.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg bg-gray-50/50 text-xs">
                      <span className="font-medium text-gray-700">{item.disposition}</span>
                      <span className="font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">{item.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Dial Confirmation Dialogue Modal */}
      {dialModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
                  <i className="fi fi-rr-phone-call text-base"></i>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Initiate Customer Call</h3>
                  <p className="text-xs text-gray-500">Confirm phone number details before dialing</p>
                </div>
              </div>
              <button
                onClick={() => setDialModalLead(null)}
                className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fi fi-rr-cross text-xs"></i>
              </button>
            </div>

            <div className="space-y-3 bg-gray-50/75 p-4 rounded-xl border border-gray-200/80 text-xs mb-5 max-h-80 overflow-y-auto">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Customer Name:</span>
                <span className="font-bold text-gray-900">{dialModalLead.customerName}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Phone Number:</span>
                <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{dialModalLead.phoneNo}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                <span className="text-gray-500 font-medium">Rejection Reason:</span>
                <span className="font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">{dialModalLead.disposition}</span>
              </div>

              {/* Customer Extra Details Breakdown */}
              {(() => {
                let parsed: any = {};
                try {
                  if (dialModalLead.customerDetails) {
                    let raw = dialModalLead.customerDetails;
                    if (typeof raw === 'string') raw = JSON.parse(raw);
                    if (raw?.history) {
                      const activeKey = raw.active_details || Object.keys(raw.history)[0];
                      if (activeKey && raw.history[activeKey]) parsed = raw.history[activeKey];
                    } else {
                      parsed = raw || {};
                    }
                  }
                } catch (e) {}

                const entries = Object.entries(parsed);
                if (entries.length === 0) return null;

                return (
                  <div className="pt-2 space-y-2 border-t border-gray-200">
                    <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">Customer Policy & Profile Details</p>
                    <div className="grid grid-cols-1 gap-1.5 bg-white p-3 rounded-lg border border-gray-200">
                      {entries.map(([key, val]: [string, any], idx) => {
                        const cleanKey = key.replace('_checked', '').replace(/_/g, ' ');
                        return (
                          <div key={idx} className="flex justify-between items-center text-[11px]">
                            <span className="text-gray-500 font-medium capitalize">{cleanKey}:</span>
                            <span className="font-semibold text-gray-800">{String(val)}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setDialModalLead(null)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <a
                href={`tel:${dialModalLead.rawPhone || dialModalLead.phoneNo}`}
                onClick={() => setDialModalLead(null)}
                className="inline-flex items-center gap-2 bg-[#4b33e8] hover:bg-[#3b26c7] text-white px-5 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
              >
                <i className="fi fi-rr-phone-call"></i>
                <span>Call {dialModalLead.rawPhone || dialModalLead.phoneNo}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

