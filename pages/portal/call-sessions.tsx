import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { decryptPhone } from "@/lib/phoneUtils";
import { getUserDashboardLevel, DashboardLevel } from "@/lib/dashboardUtils";

// Module-level cache to persist data across page navigation in the same session
let cachedSessions: any[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds

export default function CallSessionsPage() {
  const { user, mounted } = useUser();
  const [sessions, setSessions] = useState<any[]>(cachedSessions);
  const [loading, setLoading] = useState(cachedSessions.length === 0);
  const [isRefetching, setIsRefetching] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Filter States
  const [agentFilter, setAgentFilter] = useState("All Agents");
  const [campaignFilter, setCampaignFilter] = useState("All Campaigns");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filteredItems = useMemo(() => sessions.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery || (
      s.agentName?.toLowerCase().includes(q) ||
      s.employeeId?.toLowerCase().includes(q) ||
      s.campaignName?.toLowerCase().includes(q) ||
      s.customerName?.toLowerCase().includes(q) ||
      s.manualCampaignName?.toLowerCase().includes(q) ||
      s.manualCustomerName?.toLowerCase().includes(q) ||
      s.status?.toLowerCase().includes(q)
    );
    const matchesAgent = agentFilter === "All Agents" || s.agentName === agentFilter;
    const matchesCampaign = campaignFilter === "All Campaigns" || s.campaignName === campaignFilter;
    const matchesStatus = statusFilter === "All Status" || s.status === statusFilter.toLowerCase().replace(/ /g, '_');
    return matchesSearch && matchesAgent && matchesCampaign && matchesStatus;
  }), [sessions, searchQuery, agentFilter, campaignFilter, statusFilter]);

  // Stats
  const stats = useMemo(() => {
    const active = sessions.filter(s => s.status === 'active').length;
    const manual = sessions.filter(s => s.is_manual).length;
    const pending = sessions.filter(s => s.status === 'disposition_pending').length;
    const assigned = sessions.filter(s => s.status === 'assigned').length;
    return { total: sessions.length, active, manual, pending, assigned };
  }, [sessions]);

  const availableAgents = useMemo(() => Array.from(new Set(sessions.map(s => s.agentName))).sort(), [sessions]);
  const availableCampaigns = useMemo(() => Array.from(new Set(sessions.map(s => s.campaignName))).sort(), [sessions]);
  const availableStatuses = useMemo(() => Array.from(new Set(sessions.map(s => s.status))), [sessions]);

  const formatTimeSafe = (date: any) => {
    if (!date) return '--:--';
    try {
      return new Date(date).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch { return '--:--'; }
  };

  const formatDateSafe = (date: any) => {
    if (!date) return '--';
    try {
      return new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return '--'; }
  };

  useEffect(() => {
    if (mounted && user) {
      const level = getUserDashboardLevel(user);
      if (level === DashboardLevel.LEVEL_1_ADMIN ||
          level === DashboardLevel.LEVEL_2_CLIENT_CEO ||
          level === DashboardLevel.LEVEL_3_TL_SALES) {
        setIsAuthorized(true);
        const now = Date.now();
        if (cachedSessions.length === 0 || (now - lastFetchTime > CACHE_DURATION)) {
          fetchSessions(cachedSessions.length === 0);
        }
      } else {
        setIsAuthorized(false);
        setLoading(false);
      }
    } else if (mounted && !user) {
      setIsAuthorized(false);
      setLoading(false);
    }
  }, [user, mounted]);

  const fetchSessions = async (showFullLoader = true) => {
    if (!user) return;
    try {
      if (showFullLoader) setLoading(true);
      else setIsRefetching(true);

      const level = getUserDashboardLevel(user);
      let query = supabase.from('call_sessions').select('*');

      if (level === DashboardLevel.LEVEL_2_CLIENT_CEO) {
        query = query.eq('organization_id', user.organization_id);
      } else if (level === DashboardLevel.LEVEL_3_TL_SALES) {
        const { data: teamsData } = await supabase.from('teams').select('members').eq('leader_id', user.uid);
        const memberIds = Array.from(new Set([user.uid, ...(teamsData?.flatMap(t => t.members) || [])]));
        query = query.in('user_id', memberIds);
      }

      const { data: sessionData, error: sessionError } = await query.order('updated_at', { ascending: false });
      if (sessionError) throw sessionError;

      if (!sessionData || sessionData.length === 0) {
        setSessions([]);
        cachedSessions = [];
        return;
      }

      const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      const userIds = Array.from(new Set(sessionData.map(s => s.user_id)));
      const campaignIds = Array.from(new Set([...sessionData.map(s => s.campaign_id), ...sessionData.map(s => s.manual_campaign_id).filter(id => !!id)]));
      const customerIds = Array.from(new Set([...sessionData.map(s => s.customer_id).filter(id => !!id && isUUID(id)), ...sessionData.map(s => s.manual_customer_id).filter(id => !!id && isUUID(id))]));
      const organizationIds = Array.from(new Set(sessionData.map(s => s.organization_id).filter(id => !!id)));

      const { data: userData } = await supabase.from('user_profiles').select('user_id, user_name, employee_id').in('user_id', userIds);
      const employeeIds = (userData || []).map(u => u.employee_id).filter(id => !!id);

      const [campaignsRes, customersRes, orgsRes, syncMetaRes, logsRes, historyRes] = await Promise.all([
        supabase.from('campaigns').select('id, name').in('id', campaignIds),
        supabase.from('customers').select('id, customer_name, phone_no, customer_details').in('id', customerIds),
        supabase.from('organizations').select('id, company_name').in('id', organizationIds),
        supabase.from('sync_meta').select('employee_id, customer_name, dialed_no').in('employee_id', employeeIds),
        supabase.from('call_logs').select('customer_id, customer_name').in('customer_id', customerIds),
        supabase.from('call_history').select('id, name, number').in('id', customerIds)
      ]);

      const userMap = Object.fromEntries((userData || []).map(u => [u.user_id, u]));
      const campaignMap = Object.fromEntries((campaignsRes.data || []).map(c => [c.id, c.name]));
      const customerMap = Object.fromEntries((customersRes.data || []).map(c => [c.id, c]));
      const orgMap = Object.fromEntries((orgsRes.data || []).map(o => [o.id, o.company_name]));
      const syncMap = Object.fromEntries((syncMetaRes.data || []).map(s => [s.employee_id?.trim(), s]));
      const logMap = Object.fromEntries((logsRes.data || []).reverse().map(l => [l.customer_id, l.customer_name]));
      const historyMap = Object.fromEntries((historyRes.data || []).map(h => [h.id, h]));

      const enriched = sessionData.map(s => {
        const uProfile = userMap[s.user_id];
        const empId = uProfile?.employee_id?.trim();
        const cust = customerMap[s.customer_id];
        const manualCust = customerMap[s.manual_customer_id];
        const liveSync = empId ? syncMap[empId] : null;
        const isActuallyManual = s.is_manual && (s.manual_customer_id || s.manual_status);
        const manualLogName = logMap[s.manual_customer_id];
        const manualHist = historyMap[s.manual_customer_id];
        const resolvedManualName = manualCust?.customer_name || manualLogName || manualHist?.name || (isActuallyManual ? liveSync?.customer_name : null);
        const resolvedManualPhone = (isActuallyManual ? liveSync?.dialed_no : null) || (manualCust?.phone_no ? decryptPhone(manualCust.phone_no) : null) || manualHist?.number;
        const autoLogName = logMap[s.customer_id];
        const autoHist = historyMap[s.customer_id];
        const resolvedAutoName = cust?.customer_name || s.customer_name || autoLogName || autoHist?.name || (!s.is_manual ? liveSync?.customer_name : '') || 'N/A';
        const resolvedAutoPhone = (cust?.phone_no ? decryptPhone(cust.phone_no) : null) || autoHist?.number || (!s.is_manual ? liveSync?.dialed_no : '');

        return {
          ...s,
          agentName: uProfile?.user_name || 'Unknown',
          employeeId: uProfile?.employee_id || '--',
          campaignName: campaignMap[s.campaign_id] || s.campaign_id,
          customerName: resolvedAutoName,
          customerPhone: resolvedAutoPhone,
          customerDetails: cust?.customer_details || '',
          orgName: orgMap[s.organization_id] || 'NO_ORG',
          manualCampaignName: campaignMap[s.manual_campaign_id] || s.manual_campaign_id || '---',
          manualCustomerName: resolvedManualName || 'Manual Entry',
          manualCustomerPhone: resolvedManualPhone || '',
          manualCustomerDetails: manualCust?.customer_details || ''
        };
      });

      setSessions(enriched);
      cachedSessions = enriched;
      lastFetchTime = Date.now();
    } catch (err) {
      console.error("Error fetching call sessions:", err);
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  };

  const handleDelete = async (userId: string, campaignId: string) => {
    if (!window.confirm("Delete this session? This will force the agent off their current lead session.")) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");
      const response = await fetch("/api/auth/delete-call-session", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ user_id: userId, campaign_id: campaignId }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Failed to delete session");
      const updated = sessions.filter(s => !(s.user_id === userId && s.campaign_id === campaignId));
      setSessions(updated);
      cachedSessions = updated;
      setSelectedKeys(prev => prev.filter(k => k !== `${userId}|${campaignId}`));
    } catch (err) {
      console.error("Error deleting session:", err);
      alert("Failed to delete session.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedKeys.length === 0) return;
    if (!window.confirm(`Delete ${selectedKeys.length} selected sessions?`)) return;
    try {
      setIsRefetching(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No active session");
      await Promise.all(selectedKeys.map(async (key) => {
        const [uId, cId] = key.split('|');
        const res = await fetch("/api/auth/delete-call-session", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
          body: JSON.stringify({ user_id: uId, campaign_id: cId }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.error);
      }));
      const updated = sessions.filter(s => !selectedKeys.includes(`${s.user_id}|${s.campaign_id}`));
      setSessions(updated);
      cachedSessions = updated;
      setSelectedKeys([]);
    } catch (err) {
      console.error("Error bulk deleting:", err);
      alert("Failed to delete some sessions.");
    } finally {
      setIsRefetching(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedKeys.length === filteredItems.length && filteredItems.length > 0) setSelectedKeys([]);
    else setSelectedKeys(filteredItems.map(s => `${s.user_id}|${s.campaign_id}`));
  };

  const toggleSelectRow = (uId: string, cId: string) => {
    const key = `${uId}|${cId}`;
    setSelectedKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'assigned': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'disposition_pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'paused': return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'closed': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"></div>
        <p className="text-xs text-gray-500 font-medium">Loading call sessions...</p>
      </div>
    );
  }

  // ── Unauthorized ─────────────────────────────────────────────────────────────
  if (isAuthorized === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafb] text-center p-8">
        <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
          <i className="fi fi-rr-lock text-2xl flex"></i>
        </div>
        <h1 className="text-lg font-bold text-gray-900 mb-2">Access Restricted</h1>
        <p className="text-xs text-gray-500 max-w-md">This module is reserved for administrators. Contact support if you believe this is an error.</p>
      </div>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <i className="fi fi-rr-headset text-[#4b33e8]"></i>
            Live Call Sessions
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time agent session monitoring &mdash; {sessions.length} total sessions
            {isRefetching && <span className="ml-2 text-[#4b33e8] animate-pulse">· Syncing...</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedKeys.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-600 border border-rose-200 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            >
              <i className="fi fi-rr-trash text-[10px]"></i>
              Delete ({selectedKeys.length})
            </button>
          )}
          <button
            onClick={() => fetchSessions(false)}
            className="inline-flex items-center gap-1.5 bg-[#4b33e8] hover:bg-[#3b26c7] text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all"
          >
            <i className={`fi fi-rr-refresh text-[10px] ${isRefetching ? 'animate-spin' : ''}`}></i>
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Summary Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Total Sessions</span>
            <span className="p-1.5 bg-[#4b33e8]/10 text-[#4b33e8] rounded-lg"><i className="fi fi-rr-layers text-xs flex"></i></span>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{stats.total}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">All monitored agents</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Active Now</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><i className="fi fi-rr-bolt text-xs flex"></i></span>
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">{stats.active}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Live on call</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Assigned</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><i className="fi fi-rr-user-check text-xs flex"></i></span>
          </div>
          <p className="text-2xl font-extrabold text-blue-600">{stats.assigned}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Ready to dial</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Disp. Pending</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><i className="fi fi-rr-pending text-xs flex"></i></span>
          </div>
          <p className="text-2xl font-extrabold text-amber-600">{stats.pending}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Awaiting disposition</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500">Manual Mode</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><i className="fi fi-rr-user-md text-xs flex"></i></span>
          </div>
          <p className="text-2xl font-extrabold text-purple-600">{stats.manual}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">Manual override active</p>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 max-w-sm">
              <i className="fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
              <input
                type="text"
                placeholder="Search agent, campaign, customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b33e8] focus:border-transparent"
              />
            </div>
            {/* Filter Popover */}
            <div className="relative">
              <button
                onClick={() => setShowFilterModal(!showFilterModal)}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${showFilterModal ? 'bg-[#4b33e8] text-white border-[#4b33e8]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#4b33e8] hover:text-[#4b33e8]'}`}
              >
                <i className="fi fi-rr-filter text-[11px]"></i>
                Filters
                {(agentFilter !== 'All Agents' || campaignFilter !== 'All Campaigns' || statusFilter !== 'All Status') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                )}
              </button>
              {showFilterModal && (
                <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-xl border border-gray-200 p-4 z-50">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-gray-700">Filters</p>
                    <button
                      onClick={() => { setAgentFilter("All Agents"); setCampaignFilter("All Campaigns"); setStatusFilter("All Status"); }}
                      className="text-[10px] font-semibold text-rose-500 hover:text-rose-700"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Agent</label>
                      <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)} className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none">
                        <option>All Agents</option>
                        {availableAgents.map(a => <option key={a}>{a}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Campaign</label>
                      <select value={campaignFilter} onChange={(e) => setCampaignFilter(e.target.value)} className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none">
                        <option>All Campaigns</option>
                        {availableCampaigns.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-500 uppercase mb-1 block">Status</label>
                      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 outline-none">
                        <option>All Status</option>
                        {availableStatuses.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                      </select>
                    </div>
                    <button onClick={() => setShowFilterModal(false)} className="w-full py-2 bg-[#4b33e8] text-white rounded-lg text-xs font-semibold hover:bg-[#3b26c7] transition-all">
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{filteredItems.length} sessions</span>
            {lastFetchTime > 0 && (
              <span className="text-xs text-gray-400">· Updated {formatTimeSafe(new Date(lastFetchTime))}</span>
            )}
          </div>
        </div>

        {/* Table */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center">
            <i className="fi fi-rr-headset text-4xl text-gray-200 flex justify-center mb-3"></i>
            <p className="text-xs text-gray-400 font-medium">
              {searchQuery ? `No sessions found for "${searchQuery}"` : 'No active sessions to display'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase text-[10px] bg-gray-50/50">
                  <th className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-[#4b33e8] w-3.5 h-3.5 cursor-pointer"
                      checked={selectedKeys.length === filteredItems.length && filteredItems.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="py-3 px-4">Agent</th>
                  <th className="py-3 px-4">Campaign</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Mode</th>
                  <th className="py-3 px-4">Manual Override</th>
                  <th className="py-3 px-4 text-right">Last Heartbeat</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((session) => {
                  const key = `${session.user_id}|${session.campaign_id}`;
                  const isSelected = selectedKeys.includes(key);
                  return (
                    <tr key={key} className={`hover:bg-gray-50/60 transition-colors ${isSelected ? 'bg-[#4b33e8]/5' : ''}`}>
                      {/* Checkbox */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-[#4b33e8] w-3.5 h-3.5 cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggleSelectRow(session.user_id, session.campaign_id)}
                        />
                      </td>

                      {/* Agent */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-[#4b33e8] flex items-center justify-center text-white font-bold text-[11px] shrink-0">
                            {session.agentName?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-xs leading-tight">{session.agentName}</p>
                            <p className="text-[10px] text-gray-400">{session.employeeId}</p>
                          </div>
                        </div>
                      </td>

                      {/* Campaign */}
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-700 max-w-[140px] truncate">{session.campaignName}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{session.orgName}</p>
                      </td>

                      {/* Customer */}
                      <td className="py-3 px-4">
                        <p className="font-semibold text-gray-800">{session.customerName}</p>
                        {session.customerPhone && (
                          <p className="text-[10px] text-gray-400 font-mono">{session.customerPhone}</p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(session.status)}`}>
                          {session.status?.replace(/_/g, ' ')}
                        </span>
                      </td>

                      {/* Mode */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${session.is_manual ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                          {session.is_manual ? 'Manual' : 'Auto'}
                        </span>
                      </td>

                      {/* Manual Override */}
                      <td className="py-3 px-4">
                        {session.manual_status || session.manual_campaign_id ? (
                          <div>
                            <p className="font-medium text-purple-700 text-xs truncate max-w-[130px]">{session.manualCustomerName}</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[130px]">{session.manualCampaignName}</p>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-300">— No override —</span>
                        )}
                      </td>

                      {/* Last Heartbeat */}
                      <td className="py-3 px-4 text-right">
                        <p className="font-semibold text-[#4b33e8] flex items-center justify-end gap-1">
                          <i className="fi fi-rr-bolt text-[10px] animate-pulse"></i>
                          {formatTimeSafe(session.updated_at)}
                        </p>
                        <p className="text-[10px] text-gray-400">{formatDateSafe(session.updated_at)}</p>
                      </td>

                      {/* Delete */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleDelete(session.user_id, session.campaign_id)}
                          className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center mx-auto"
                          title="Delete Session"
                        >
                          <i className="fi fi-rr-trash text-[11px] flex"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Mobile Card List */}
      <div className="lg:hidden space-y-3">
        {filteredItems.map((session) => {
          const key = `${session.user_id}|${session.campaign_id}`;
          const isSelected = selectedKeys.includes(key);
          return (
            <div key={key} className={`bg-white rounded-xl border ${isSelected ? 'border-[#4b33e8]' : 'border-gray-200'} p-4 transition-all`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300 text-[#4b33e8] w-3.5 h-3.5 cursor-pointer" checked={isSelected} onChange={() => toggleSelectRow(session.user_id, session.campaign_id)} />
                  <div className="w-7 h-7 rounded-full bg-[#4b33e8] flex items-center justify-center text-white font-bold text-xs">
                    {session.agentName?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-800">{session.agentName}</p>
                    <p className="text-[10px] text-gray-400">{session.employeeId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getStatusBadge(session.status)}`}>
                    {session.status?.replace(/_/g, ' ')}
                  </span>
                  <button onClick={() => handleDelete(session.user_id, session.campaign_id)} className="w-7 h-7 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center">
                    <i className="fi fi-rr-trash text-[11px] flex"></i>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Campaign</p>
                  <p className="font-medium text-gray-700 truncate">{session.campaignName}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-0.5">Customer</p>
                  <p className="font-semibold text-gray-800 truncate">{session.customerName}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${session.is_manual ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                  {session.is_manual ? 'Manual' : 'Auto'}
                </span>
                <p className="text-[11px] font-semibold text-[#4b33e8] flex items-center gap-1">
                  <i className="fi fi-rr-bolt text-[10px] animate-pulse"></i>
                  {formatTimeSafe(session.updated_at)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
