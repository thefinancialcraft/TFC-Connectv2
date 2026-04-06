import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import { decryptPhone } from "@/lib/phoneUtils";

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

  const filteredItems = sessions.filter(s => {
    const q = searchQuery.toLowerCase();
    return (
      s.agentName?.toLowerCase().includes(q) ||
      s.employeeId?.toLowerCase().includes(q) ||
      s.campaignName?.toLowerCase().includes(q) ||
      s.customerName?.toLowerCase().includes(q) ||
      s.manualCampaignName?.toLowerCase().includes(q) ||
      s.manualCustomerName?.toLowerCase().includes(q) ||
      s.status?.toLowerCase().includes(q)
    );
  });

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
      // Check authorization: only NXUS-001
      if (user.employeeId === 'NXUS-001') {
        setIsAuthorized(true);
        
        const now = Date.now();
        if (cachedSessions.length === 0 || (now - lastFetchTime > CACHE_DURATION)) {
            fetchSessions(cachedSessions.length === 0); // Only show full loader if no cache
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
      
      // 1. Fetch sessions
      const { data: sessionData, error: sessionError } = await supabase
        .from('call_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (sessionError) throw sessionError;

      if (!sessionData || sessionData.length === 0) {
        setSessions([]);
        cachedSessions = [];
        return;
      }

      // 2. Collect ALL IDs for enrichment (both auto and manual)
      const userIds = Array.from(new Set(sessionData.map(s => s.user_id)));
      const campaignIds = Array.from(new Set([
        ...sessionData.map(s => s.campaign_id),
        ...sessionData.map(s => s.manual_campaign_id).filter(id => !!id)
      ]));
      const customerIds = Array.from(new Set([
        ...sessionData.map(s => s.customer_id).filter(id => !!id),
        ...sessionData.map(s => s.manual_customer_id).filter(id => !!id)
      ]));

      // 3. Fetch related data in parallel
      const [usersRes, campaignsRes, customersRes] = await Promise.all([
        supabase.from('user_profiles').select('user_id, user_name, employee_id').in('user_id', userIds),
        supabase.from('campaigns').select('id, name').in('id', campaignIds),
        supabase.from('customers').select('id, customer_name, phone_no').in('id', customerIds)
      ]);

      // 4. Map names
      const userMap = Object.fromEntries((usersRes.data || []).map(u => [u.user_id, u]));
      const campaignMap = Object.fromEntries((campaignsRes.data || []).map(c => [c.id, c.name]));
      const customerMap = Object.fromEntries((customersRes.data || []).map(c => [c.id, c]));

      // 5. Enrich sessions
      const enriched = sessionData.map(s => {
        const cust = customerMap[s.customer_id];
        const manualCust = customerMap[s.manual_customer_id];
        return {
          ...s,
          agentName: userMap[s.user_id]?.user_name || 'Unknown',
          employeeId: userMap[s.user_id]?.employee_id || '--',
          campaignName: campaignMap[s.campaign_id] || s.campaign_id,
          customerName: cust?.customer_name || 'N/A',
          customerPhone: cust?.phone_no ? decryptPhone(cust.phone_no) : '',
          // Override details
          manualCampaignName: campaignMap[s.manual_campaign_id] || s.manual_campaign_id || '---',
          manualCustomerName: manualCust?.customer_name || 'N/A',
          manualCustomerPhone: manualCust?.phone_no ? decryptPhone(manualCust.phone_no) : ''
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
            <i className="fi fi-rr-lock text-2xl"></i>
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
      {/* Search & Filters Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          {['All Agents', 'All Campaigns', 'Status'].map((filter) => (
            <div key={filter} className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-700 hover:border-indigo-200 cursor-pointer transition-all uppercase tracking-wider">
              {filter}
              <i className="fi fi-rr-angle-small-down text-[14px]"></i>
            </div>
          ))}
          <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors">
             <i className="fi fi-rr-filter text-[16px]"></i>
          </div>
        </div>
        <div className="flex items-center gap-3">
           {isRefetching && (
              <span className="text-[10px] font-black text-indigo-400 animate-pulse uppercase tracking-widest mr-2">Syncing Live...</span>
           )}
           <div 
             onClick={() => fetchSessions(true)}
             className="px-5 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black cursor-pointer hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-widest "
           >
              <i className={`fi fi-rr-refresh text-[10px] ${isRefetching ? 'animate-spin' : ''}`}></i>
              Refresh Panel
           </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <i className="fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[14px]"></i>
            <input 
              type="text" 
              placeholder="Search by agent, campaign, customer or status..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-14 py-3 bg-white border border-gray-100 rounded-xl text-[12px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-300 shadow-none"
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
          
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-100 rounded-xl text-[12px] font-black text-gray-700 hover:bg-gray-50 transition-all uppercase tracking-tight shadow-none flex-shrink-0">
            <i className="fi fi-rr-file-export text-[14px]"></i>
            Export
          </button>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-none">Status: Monitoring Enabled</p>
          <p className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-none">
             Last Refreshed: {lastFetchTime > 0 ? formatTimeSafe(new Date(lastFetchTime)) : 'WAITING...'}
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-4 py-4 border-b border-gray-100 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                </th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Agent & Org</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap">Auto Session</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center">Status</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center">Overrides</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center">Flags</th>
                <th className="px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-right">Heartbeat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <i className="fi fi-rr-search-heart text-5xl"></i>
                      <p className="text-[12px] font-black uppercase tracking-widest text-slate-400">
                         {searchQuery ? `No sessions found for "${searchQuery}"` : 'No active sessions monitored'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((session, i) => (
                  <tr key={`${session.user_id}-${session.campaign_id}`} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 text-center">
                       <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
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
                        <span className="text-[10px] font-black text-gray-400 pl-2 uppercase tracking-widest">{session.organization_id || 'NO_ORGANIZATION'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex flex-col gap-1.5">
                          <p className="text-[13px] font-black text-gray-800 leading-none flex items-center gap-2"><i className="fi fi-rr-bullhorn text-[12px] text-gray-400 flex"></i> {session.campaignName}</p>
                          <p className="text-[12px] font-semibold text-indigo-600 leading-none flex items-center gap-2"><i className="fi fi-rr-user-md text-[12px] flex"></i> {session.customerName !== 'N/A' ? `${session.customerName}` : 'IDLE'}</p>
                          {session.customerPhone && (
                             <p className="text-[11px] font-bold text-gray-400 pl-5 flex items-center gap-2 italic">{session.customerPhone}</p>
                          )}
                       </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[11px] font-black leading-none border uppercase ${
                        session.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 
                        session.status === 'assigned' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                        session.status === 'disposition_pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                        'bg-slate-50 text-gray-500 border-gray-100'
                      }`}>
                        {session.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                       <div className="flex flex-col gap-1.5">
                          {session.manual_status || session.manual_campaign_id ? (
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-purple-600 border border-purple-100 bg-purple-50 px-2.5 py-0.5 rounded-lg uppercase tracking-widest whitespace-nowrap">{session.manual_status || 'MANUAL'}</span>
                              </div>
                              <p className="text-[13px] font-black text-gray-800 leading-none flex items-center gap-2"><i className="fi fi-rr-bullhorn text-[12px] text-purple-400 flex"></i> {session.manualCampaignName}</p>
                              <p className="text-[12px] font-semibold text-purple-600 leading-none flex items-center gap-2"><i className="fi fi-rr-user-md text-[12px] flex"></i> {session.manualCustomerName}</p>
                              {session.manualCustomerPhone && (
                                <p className="text-[11px] font-bold text-gray-400 pl-5 flex items-center gap-2 italic">{session.manualCustomerPhone}</p>
                              )}
                            </>
                          ) : (
                            <div className="text-center w-full">
                               <span className="text-[12px] font-bold text-gray-200">NO OVERRIDE</span>
                            </div>
                          )}
                       </div>
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
                    <td className="px-4 py-4 text-right">
                      <div className="flex flex-col items-end gap-1.5">
                        <p className="text-[13px] font-black text-indigo-700 flex items-center gap-2"><i className="fi fi-rr-bolt animate-pulse flex text-[14px]"></i> {formatTimeSafe(session.updated_at)}</p>
                        <p className="text-[11px] font-bold text-gray-300 leading-none">{formatDateSafe(session.updated_at)}</p>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer - Just decorative to match image */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <button className="px-3 py-1 bg-white border border-gray-100 rounded text-[10px] font-bold text-gray-400"><i className="fi fi-rr-angle-left"></i> Previous</button>
        <button className="w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded text-[10px] font-bold">1</button>
        <button className="px-3 py-1 bg-white border border-gray-100 rounded text-[10px] font-bold text-gray-400 font-bold">Next <i className="fi fi-rr-angle-right"></i></button>
      </div>
    </div>
  );
}
