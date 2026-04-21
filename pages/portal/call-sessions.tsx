import { useState, useEffect } from "react";
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
  const [statusFilter, setStatusFilter] = useState("Status");
  const [orgFilter, setOrgFilter] = useState("Organization");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [expandedSessions, setExpandedSessions] = useState<string[]>([]);

  const filteredItems = sessions.filter(s => {
    // 1. Search Query Filter
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

    // 2. Dropdown Filters
    const matchesAgent = agentFilter === "All Agents" || s.agentName === agentFilter;
    const matchesCampaign = campaignFilter === "All Campaigns" || s.campaignName === campaignFilter;
    const matchesStatus = statusFilter === "Status" || s.status === statusFilter.toLowerCase().replace(' ', '_');
    const matchesOrg = orgFilter === "Organization" || s.orgName === orgFilter;

    return matchesSearch && matchesAgent && matchesCampaign && matchesStatus && matchesOrg;
  });

  // Extract unique options for dropdowns
  const availableAgents = Array.from(new Set(sessions.map(s => s.agentName))).sort();
  const availableCampaigns = Array.from(new Set(sessions.map(s => s.campaignName))).sort();
  const availableStatuses = Array.from(new Set(sessions.map(s => s.status))).map(st => st.charAt(0).toUpperCase() + st.slice(1).replace('_', ' '));
  const availableOrgs = Array.from(new Set(sessions.map(s => s.orgName))).filter(o => !!o).sort();

  const formatTimeSafe = (date: any) => {
    if (!date) return '--:--:--';
    try {
      return new Date(date).toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
      });
    } catch (e) {
      return '--:--:--';
    }
  };

  const formatDateSafe = (date: any) => {
    if (!date) return '-- -- --';
    try {
      return new Date(date).toLocaleDateString('en-IN', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric' 
      });
    } catch (e) {
      return '-- -- --';
    }
  };

  useEffect(() => {
    if (mounted && user) {
      const level = getUserDashboardLevel(user);
      
      // Permission: Level 1, 2, or 3
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
    try {
      if (showFullLoader) setLoading(true);
      else setIsRefetching(true);
      
      // 1. Determine Access Level & Build Query
      const level = getUserDashboardLevel(user);
      let query = supabase.from('call_sessions').select('*');

      if (level === DashboardLevel.LEVEL_2_CLIENT_CEO) {
        // Level 2: Filter by Organization
        query = query.eq('organization_id', user.organization_id);
      } else if (level === DashboardLevel.LEVEL_3_TL_SALES) {
        // Level 3: Filter by Team
        // First, get all teams led by this user
        const { data: teamsData } = await supabase
            .from('teams')
            .select('members')
            .eq('leader_id', user.uid);
        
        const memberIds = Array.from(new Set([
            user.uid, // Always show leader's own session
            ...(teamsData?.flatMap(t => t.members) || [])
        ]));

        query = query.in('user_id', memberIds);
      }
      
      const { data: sessionData, error: sessionError } = await query.order('updated_at', { ascending: false });

      if (sessionError) throw sessionError;

      if (!sessionData || sessionData.length === 0) {
        setSessions([]);
        cachedSessions = [];
        return;
      }

      // 2. Collect ALL IDs for enrichment (both auto and manual)
      const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

      const userIds = Array.from(new Set(sessionData.map(s => s.user_id)));
      const campaignIds = Array.from(new Set([
        ...sessionData.map(s => s.campaign_id),
        ...sessionData.map(s => s.manual_campaign_id).filter(id => !!id)
      ]));
      const customerIds = Array.from(new Set([
        ...sessionData.map(s => s.customer_id).filter(id => !!id && isUUID(id)),
        ...sessionData.map(s => s.manual_customer_id).filter(id => !!id && isUUID(id))
      ]));

      // 3. Fetch related data in stages to avoid circular dependency
      const organizationIds = Array.from(new Set(sessionData.map(s => s.organization_id).filter(id => !!id)));
      
      const { data: userData, error: userDataError } = await supabase
        .from('user_profiles')
        .select('user_id, user_name, employee_id')
        .in('user_id', userIds);
      
      if (userDataError) throw userDataError;

      const employeeIds = (userData || []).map(u => u.employee_id).filter(id => !!id);

      const [campaignsRes, customersRes, orgsRes, syncMetaRes, logsRes, historyRes] = await Promise.all([
        supabase.from('campaigns').select('id, name').in('id', campaignIds),
        supabase.from('customers').select('id, customer_name, phone_no, customer_details').in('id', customerIds),
        supabase.from('organizations').select('id, company_name').in('id', organizationIds),
        supabase.from('sync_meta').select('employee_id, customer_name, dialed_no').in('employee_id', employeeIds),
        supabase.from('call_logs').select('customer_id, customer_name').in('customer_id', customerIds),
        supabase.from('call_history').select('id, name, number').in('id', customerIds)
      ]);

      // 4. Map names
      const userMap = Object.fromEntries((userData || []).map(u => [u.user_id, u]));
      const campaignMap = Object.fromEntries((campaignsRes.data || []).map(c => [c.id, c.name]));
      const customerMap = Object.fromEntries((customersRes.data || []).map(c => [c.id, c]));
      const orgMap = Object.fromEntries((orgsRes.data || []).map(o => [o.id, o.company_name]));
      const syncMap = Object.fromEntries((syncMetaRes.data || []).map(s => [s.employee_id?.trim(), s]));
      const logMap = Object.fromEntries((logsRes.data || []).reverse().map(l => [l.customer_id, l.customer_name])); // Use latest log name
      const historyMap = Object.fromEntries((historyRes.data || []).map(h => [h.id, h]));

      // 5. Enrich sessions
      const enriched = sessionData.map(s => {
        const uProfile = userMap[s.user_id];
        const empId = uProfile?.employee_id?.trim();
        const cust = customerMap[s.customer_id];
        const manualCust = customerMap[s.manual_customer_id];
        const liveSync = empId ? syncMap[empId] : null;

        // Status-based formatting
        const isActuallyManual = s.is_manual && (s.manual_customer_id || s.manual_status);

        // Fallback names
        const manualLogName = logMap[s.manual_customer_id];
        const manualHist = historyMap[s.manual_customer_id];
        const resolvedManualName = manualCust?.customer_name || manualLogName || manualHist?.name || (isActuallyManual ? liveSync?.customer_name : null);
        
        // Priority for Manual Phone: Live Sync > DB Record > History
        const resolvedManualPhone = (isActuallyManual ? liveSync?.dialed_no : null) || 
                                    (manualCust?.phone_no ? decryptPhone(manualCust.phone_no) : null) || 
                                    manualHist?.number;

        // Auto fallback
        const autoLogName = logMap[s.customer_id];
        const autoHist = historyMap[s.customer_id];
        const resolvedAutoName = cust?.customer_name || s.customer_name || autoLogName || autoHist?.name || (!s.is_manual ? liveSync?.customer_name : '') || 'N/A';
        const resolvedAutoPhone = (cust?.phone_no ? decryptPhone(cust.phone_no) : null) || autoHist?.number || (!s.is_manual ? liveSync?.dialed_no : '');

        return {
          ...s,
          agentName: uProfile?.user_name || 'Unknown',
          employeeId: uProfile?.employee_id || '--',
          campaignName: campaignMap[s.campaign_id] || s.campaign_id,
          // Primary Customer Logic
          customerName: resolvedAutoName,
          customerPhone: resolvedAutoPhone,
          customerDetails: cust?.customer_details || '',
          orgName: orgMap[s.organization_id] || 'NO_ORG',
          // Manual/Override Logic
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
    if (!window.confirm("Are you sure you want to delete this session? This will force the agent off their current lead session.")) return;

    try {
        const { error } = await supabase
            .from('call_sessions')
            .delete()
            .match({ user_id: userId, campaign_id: campaignId });

        if (error) throw error;
        
        // Update local state
        const updated = sessions.filter(s => !(s.user_id === userId && s.campaign_id === campaignId));
        setSessions(updated);
        cachedSessions = updated;
        setSelectedKeys((prev: string[]) => prev.filter((k: string) => k !== `${userId}|${campaignId}`));
        
    } catch (err) {
        console.error("Error deleting session:", err);
        alert("Failed to delete session.");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedKeys.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedKeys.length} selected sessions?`)) return;

    try {
        setIsRefetching(true);
        // Supabase delete doesn't support multiple .match in one go easily for composite keys in a simple way
        // We can use an RPC or run multiple deletes, or use a filter that matches the combination
        
        // For composite keys, the safest/cleanest way without a custom RPC is to run them in parallel or loop
        const deletePromises = selectedKeys.map((key: string) => {
            const [uId, cId] = key.split('|'); // Using | as separator to avoid - issues in UUIDs
            return supabase
                .from('call_sessions')
                .delete()
                .match({ user_id: uId, campaign_id: cId });
        });

        const results = await Promise.all(deletePromises);
        const errors = results.filter((r: any) => r.error);
        
        if (errors.length > 0) throw errors[0].error;

        // Update local state
        const updated = sessions.filter(s => !selectedKeys.includes(`${s.user_id}|${s.campaign_id}`));
        setSessions(updated);
        cachedSessions = updated;
        setSelectedKeys([]);
        
    } catch (err) {
        console.error("Error bulk deleting sessions:", err);
        alert("Failed to delete some sessions.");
    } finally {
        setIsRefetching(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedKeys.length === filteredItems.length && filteredItems.length > 0) {
        setSelectedKeys([]);
    } else {
        setSelectedKeys(filteredItems.map(s => `${s.user_id}|${s.campaign_id}`));
    }
  };

  const toggleSelectRow = (uId: string, cId: string) => {
    const key = `${uId}|${cId}`;
    setSelectedKeys((prev: string[]) => 
        prev.includes(key) ? prev.filter((k: string) => k !== key) : [...prev, key]
    );
  };

  const toggleExpand = (uId: string, cId: string) => {
    const key = `${uId}|${cId}`;
    setExpandedSessions(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'assigned': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'disposition_pending': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'paused': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'closed': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-8">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <i className="flex fi fi-rr-lock text-2xl"></i>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-gray-500 max-w-md">
            This module is reserved for system administrators (NXUS-001). Please contact support if you believe this is an error.
          </p>
      </div>
    );
  }

  return (
    <div className="p-4 w-full h-full min-h-0 overflow-auto bg-[#fbfcfe]">
      {/* Search & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1 w-full lg:max-w-4xl">
          <div className="relative flex-1">
            <i className="flex fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[14px]"></i>
            <input 
              type="text" 
              placeholder="Search agent, campaign, customer..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-14 py-3 bg-white border border-gray-100 rounded-xl text-[12px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-300 shadow-none h-12"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase transition-colors"
                style={{ zIndex: 10 }}
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar shrink-0">
          
          {/* Filter Popover Trigger */}
          <div className="relative">
            <button 
                onClick={() => setShowFilterModal(!showFilterModal)}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border shrink-0 ${showFilterModal ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-200'}`}
            >
                <i className="flex fi fi-rr-filter text-[16px]"></i>
            </button>

            {showFilterModal && (
                <div className="absolute top-full mt-2 left-0 md:right-0 md:left-auto w-[280px] bg-white rounded-2xl border border-slate-200 p-5 z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-left md:origin-top-right">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Filters</p>
                        <button 
                            onClick={() => {
                                setAgentFilter("All Agents");
                                setCampaignFilter("All Campaigns");
                                setStatusFilter("Status");
                                setOrgFilter("Organization");
                                setSearchQuery("");
                            }}
                            className="text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest"
                        >
                            Reset
                        </button>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Agent</label>
                            <select 
                                value={agentFilter}
                                onChange={(e) => setAgentFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:border-indigo-200 cursor-pointer transition-all outline-none"
                            >
                                <option>All Agents</option>
                                {availableAgents.map(a => <option key={a}>{a}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Campaign</label>
                            <select 
                                value={campaignFilter}
                                onChange={(e) => setCampaignFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:border-indigo-200 cursor-pointer transition-all outline-none"
                            >
                                <option>All Campaigns</option>
                                {availableCampaigns.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Status</label>
                            <select 
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:border-indigo-200 cursor-pointer transition-all outline-none"
                            >
                                <option>Status</option>
                                {availableStatuses.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Organization</label>
                            <select 
                                value={orgFilter}
                                onChange={(e) => setOrgFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:border-indigo-200 cursor-pointer transition-all outline-none"
                            >
                                <option>Organization</option>
                                {availableOrgs.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>

                        <button 
                            onClick={() => setShowFilterModal(false)}
                            className="mt-2 w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}
          </div>

          <button className="flex items-center justify-center gap-2 h-12 px-5 bg-white border border-gray-100 rounded-xl text-[12px] font-black text-gray-700 hover:bg-gray-50 transition-all uppercase tracking-tight shadow-none shrink-0">
            <i className="flex fi fi-rr-file-export text-[14px]"></i>
            <span className="hidden sm:inline">Export</span>
          </button>

          <button 
            onClick={() => fetchSessions(true)}
            className="h-12 px-5 bg-indigo-600 text-white rounded-xl text-[10px] font-black cursor-pointer hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest whitespace-nowrap shrink-0"
          >
            <i className={`flex fi fi-rr-refresh text-[10px] ${isRefetching ? 'animate-spin' : ''}`}></i>
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {selectedKeys.length > 0 && (
             <button 
                onClick={handleBulkDelete}
                className="h-12 px-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest animate-in fade-in slide-in-from-right-2 whitespace-nowrap shrink-0"
             >
                <i className="flex fi fi-rr-trash text-[12px]"></i>
                Delete ({selectedKeys.length})
             </button>
          )}
        </div>
      </div>

        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 w-full lg:w-auto mt-2 lg:mt-0 p-3 lg:p-0 bg-slate-50 lg:bg-transparent rounded-xl lg:rounded-none">
          <div className="flex flex-col items-start lg:items-end gap-1">
            {isRefetching && (
               <span className="text-[10px] font-black text-indigo-400 animate-pulse uppercase tracking-widest leading-none">Syncing...</span>
            )}
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Status: Active</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">
               Updated: {lastFetchTime > 0 ? formatTimeSafe(new Date(lastFetchTime)) : '--:--'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container - Hidden on Mobile */}
      <div className="hidden lg:block bg-white rounded-xl border border-gray-100 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-4 py-4 border-b border-gray-100 text-center">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                    checked={selectedKeys.length === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Agent & Org</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Auto Session</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Overrides / Manual</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center">Flags</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-right pr-8">Heartbeat</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <i className="flex fi fi-rr-search-heart text-5xl"></i>
                      <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">
                         {searchQuery ? `No sessions found for "${searchQuery}"` : 'No active sessions monitored'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((session, i) => {
                  const key = `${session.user_id}|${session.campaign_id}`;
                  const isSelected = selectedKeys.includes(key);
                  return (
                    <tr key={key} className={`hover:bg-slate-50 transition-colors group ${isSelected ? 'bg-indigo-50/30' : ''}`}>
                      <td className="px-4 py-4 text-center">
                        <input 
                          type="checkbox" 
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                          checked={isSelected}
                          onChange={() => toggleSelectRow(session.user_id, session.campaign_id)}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-3 pr-4 py-1.5 pl-1.5 border border-indigo-100 rounded-full bg-indigo-50/50 w-fit">
                            <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-[14px]">
                              {session.agentName.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[14px] font-black text-gray-900 leading-none">{session.agentName}</span>
                              <span className="text-[11px] font-bold text-indigo-500 leading-none mt-1 uppercase tracking-wider">{session.employeeId || 'ID_ERR'}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-black text-gray-400 pl-2 uppercase tracking-widest">{session.orgName || 'NO_ORGANIZATION'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 min-w-[180px]">
                        <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50">
                            <div className="flex items-center justify-between mb-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase ${
                                  session.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 
                                  session.status === 'assigned' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                  session.status === 'disposition_pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                  'bg-white text-gray-400 border-gray-100'
                                }`}>
                                  {session.status.replace('_', ' ')}
                                </span>
                            </div>
                            <p className="text-[12px] font-black text-gray-800 leading-tight flex items-center gap-2"><i className="fi fi-rr-bullhorn text-[11px] text-gray-400 flex"></i> {session.campaignName}</p>
                            <p className="text-[12px] font-bold text-indigo-600 leading-tight flex items-center gap-2 mt-0.5"><i className="fi fi-rr-user-md text-[11px] flex"></i> {session.customerName}</p>
                            {session.customerPhone && (
                              <p className="text-[10px] font-bold text-gray-400 pl-4 flex items-center gap-1 italic opacity-70 leading-none">{session.customerPhone}</p>
                            )}
                        </div>
                      </td>
                      <td className="px-4 py-4 min-w-[180px]">
                        {session.manual_status || session.manual_campaign_id ? (
                          <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-purple-50/30 border border-purple-100/30">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase ${
                                  session.manual_status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 
                                  session.manual_status === 'disposition_pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                  'bg-purple-100 text-purple-700 border-purple-200'
                                }`}>
                                  {session.manual_status?.replace('_', ' ') || 'MANUAL'}
                                </span>
                              </div>
                              <p className="text-[12px] font-black text-gray-800 leading-tight flex items-center gap-2"><i className="fi fi-rr-bullhorn text-[11px] text-purple-400 flex"></i> {session.manualCampaignName}</p>
                              <p className="text-[12px] font-bold text-purple-600 leading-tight flex items-center gap-2 mt-0.5"><i className="fi fi-rr-user-md text-[11px] flex"></i> {session.manualCustomerName}</p>
                              {session.manualCustomerPhone && (
                                <p className="text-[10px] font-bold text-gray-400 pl-4 flex items-center gap-1 italic opacity-70 leading-none">{session.manualCustomerPhone}</p>
                              )}
                              {session.manualCustomerDetails && (
                                <p className="text-[9px] font-bold text-gray-300 pl-4 mt-0.5 truncate max-w-[140px] leading-none">{session.manualCustomerDetails}</p>
                              )}
                          </div>
                        ) : (
                          <div className="text-center w-full py-4 bg-gray-50/30 rounded-2xl border border-dashed border-gray-100">
                             <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">--- No Override ---</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                            <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black border flex tracking-wider ${session.is_manual ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                              {session.is_manual ? 'M-MODE' : 'A-SYNC'}
                            </span>
                            {session.is_unassigned && (
                              <span className="bg-red-50 text-red-500 px-3 py-1.5 rounded-xl text-[10px] font-black border border-red-100 flex">UNASGND</span>
                            )}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right pr-8">
                        <div className="flex flex-col items-end gap-1.5">
                          <p className="text-[13px] font-black text-indigo-700 flex items-center gap-2"><i className="fi fi-rr-bolt animate-pulse flex text-[14px]"></i> {formatTimeSafe(session.updated_at)}</p>
                          <p className="text-[11px] font-bold text-gray-300 leading-none">{formatDateSafe(session.updated_at)}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button 
                          onClick={() => handleDelete(session.user_id, session.campaign_id)}
                          className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center group/del"
                          title="Delete Session"
                        >
                          <i className="flex fi fi-rr-trash text-[14px] group-hover/del:scale-110 transition-transform"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List - Shown only on Mobile */}
      <div className="lg:hidden flex flex-col gap-4 mb-6">
        {filteredItems.length === 0 ? (
          <div className="px-6 py-24 text-center bg-white rounded-2xl border border-slate-100">
            <div className="flex flex-col items-center gap-3 opacity-30">
              <i className="flex fi fi-rr-search-heart text-5xl"></i>
              <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">
                 No active sessions found
              </p>
            </div>
          </div>
        ) : (
          filteredItems.map((session) => {
            const key = `${session.user_id}|${session.campaign_id}`;
            const isSelected = selectedKeys.includes(key);
            return (
              <div key={key} className={`bg-white rounded-xl border ${isSelected ? 'border-indigo-500' : 'border-gray-100'} overflow-hidden transition-all duration-300`}>
                {/* Card Header: Agent & Select */}
                <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer" 
                      checked={isSelected}
                      onChange={() => toggleSelectRow(session.user_id, session.campaign_id)}
                    />
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-[12px]">
                        {session.agentName.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-gray-900 leading-none">{session.agentName}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold text-indigo-500 leading-none uppercase tracking-wider">{session.employeeId}</span>
                          <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest truncate max-w-[120px]">{session.orgName || 'No Org'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(session.user_id, session.campaign_id)}
                    className="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center"
                  >
                    <i className="flex fi fi-rr-trash text-[12px]"></i>
                  </button>
                </div>

                {/* Card Body - Details with Height Transition */}
                <div className={`grid transition-all duration-300 ease-in-out ${expandedSessions.includes(key) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                  <div className="overflow-hidden">
                    <div className="p-4 flex flex-col gap-4 bg-white border-b border-slate-50">
                      {/* Auto Session */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Auto Session</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-black border uppercase ${
                            session.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 
                            session.status === 'assigned' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-gray-50 text-gray-400 border-gray-100'
                          }`}>
                            {session.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                          <p className="text-[12px] font-black text-gray-800 leading-tight truncate">{session.campaignName}</p>
                          <p className="text-[12px] font-bold text-indigo-600 leading-tight mt-1">{session.customerName}</p>
                        </div>
                      </div>

                      {/* Manual Override (if any) */}
                      {(session.manual_status || session.manual_campaign_id) && (
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center justify-between">
                            <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Manual Override</span>
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-[9px] font-black uppercase">
                              {session.manual_status?.replace('_', ' ') || 'MANUAL'}
                            </span>
                          </div>
                          <div className="p-3 bg-purple-50/30 rounded-xl border border-purple-100/30">
                            <p className="text-[12px] font-black text-gray-800 leading-tight truncate">{session.manualCampaignName}</p>
                            <p className="text-[12px] font-bold text-purple-600 leading-tight mt-1">{session.manualCustomerName}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Details Footer - Always visible, sits under header when collapsed */}
                <div className="px-4 py-3 flex items-center justify-between bg-white overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => toggleExpand(session.user_id, session.campaign_id)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${expandedSessions.includes(key) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <i className={`flex fi fi-rr-angle-small-${expandedSessions.includes(key) ? 'up' : 'down'} text-[14px]`}></i>
                    </button>

                    <span className={`px-2 py-1 rounded-lg text-[8px] font-black border ${session.is_manual ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                      {session.is_manual ? 'MANUAL' : 'A-SYNC'}
                    </span>
                    {session.is_unassigned && (
                      <span className="bg-red-50 text-red-500 px-2 py-1 rounded-lg text-[8px] font-black border border-red-100 uppercase">Unasgd</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-indigo-700 flex items-center gap-1">
                      <i className="fi fi-rr-bolt text-[10px]"></i> {formatTimeSafe(session.updated_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pb-8">
        <div className="flex items-center gap-3 order-2 sm:order-1">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 transition-all hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest">
              <i className="flex fi fi-rr-arrow-small-left text-[14px]"></i>
              <span className="hidden xs:inline">Prev</span>
          </button>
          
          <div className="flex items-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl text-[11px] font-black transition-all active:scale-90">1</button>
              <button className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-400 rounded-xl text-[11px] font-black hover:border-indigo-100 hover:text-indigo-600 transition-all active:scale-90">2</button>
          </div>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 transition-all hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest">
              <span className="hidden xs:inline">Next</span>
              <i className="flex fi fi-rr-arrow-small-right text-[14px]"></i>
          </button>
        </div>
        
        <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest order-1 sm:order-2">
           Showing {filteredItems.length} of {sessions.length} Sessions
        </div>
      </div>
    </div>
  );
}
