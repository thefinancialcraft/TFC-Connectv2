import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useUser } from "../context/UserContext";
import { decryptPhone, computePhoneHash } from "../lib/phoneUtils";

export interface ActivityStats {
  totalDials: number;
  totalTalkTime: number;
  contactable: number;
  uncontactable: number;
  lastCallTime: string;
  idleFrom: string;
}

export function useActivityData() {
  const { user, mounted } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [source, setSource] = useState<'crm' | 'mobile'>('mobile');
  const [activities, setActivities] = useState<any[]>([]);
  const [mobileActivities, setMobileActivities] = useState<any[]>([]); // New state for mobile history
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Correctly get Today's date in IST (YYYY-MM-DD)
    return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Advanced Filters
  const [agentFilter, setAgentFilter] = useState("All Agents");
  const [campaignFilter, setCampaignFilter] = useState("All Campaigns");
  const [dispositionFilter, setDispositionFilter] = useState("All Dispositions");
  const [orgFilter, setOrgFilter] = useState("All Organizations");
  const [callTypeFilter, setCallTypeFilter] = useState("All Types");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, agentFilter, campaignFilter, dispositionFilter, orgFilter, callTypeFilter, selectedDate, source]);
  
  // Global filter options states
  const [globalOrganizations, setGlobalOrganizations] = useState<any[]>([]);
  const [globalCampaigns, setGlobalCampaigns] = useState<any[]>([]);
  const [globalAgents, setGlobalAgents] = useState<any[]>([]);
  const [globalDispositions, setGlobalDispositions] = useState<string[]>([]);

  const [stats, setStats] = useState<ActivityStats>({
    totalDials: 0,
    totalTalkTime: 0,
    contactable: 0,
    uncontactable: 0,
    lastCallTime: "N/A",
    idleFrom: "N/A"
  });

  // Reset dependent filters when organization changes
  useEffect(() => {
    if (orgFilter !== "All Organizations") {
      const filteredAgents = globalAgents.filter(a => a.organization_id === orgFilter);
      const isAgentValid = filteredAgents.some(a => a.employee_id === agentFilter);
      if (agentFilter !== "All Agents" && !isAgentValid) {
        setAgentFilter("All Agents");
      }

      const filteredCampaigns = globalCampaigns.filter(c => c.organization_id === orgFilter);
      const isCampaignValid = filteredCampaigns.some(c => c.name === campaignFilter);
      if (campaignFilter !== "All Campaigns" && !isCampaignValid) {
        setCampaignFilter("All Campaigns");
      }
    }
  }, [orgFilter, globalAgents, globalCampaigns]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchIdRef = useRef<number>(0);

  const fetchActivities = useCallback(async (isBackground = false) => {
    if (!mounted || !user) return;

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const fetchId = ++fetchIdRef.current;

    try {
      if (!isBackground) setLoading(true);
      setError("");

      // selectedDate is already YYYY-MM-DD in IST
      // We need to define the boundaries of that specific date in IST and convert to ISO
      const startOfDay = new Date(`${selectedDate}T00:00:00+05:30`).toISOString();
      const endOfDay = new Date(`${selectedDate}T23:59:59+05:30`).toISOString();

      // Apply Security Levels
      const getLevel = () => {
        const designation = (user.designation || '').toLowerCase();
        const role = user.role || '';
        if (
          user.isClient === false && 
          (role === 'superadmin' || role === 'super_admin') && 
          (designation === 'ceo' || designation === 'developer')
        ) return 1; // LEVEL_1_ADMIN
        
        if (role === 'super_admin' || designation === 'ceo' || designation === 'owner') return 2; // LEVEL_2_CLIENT_CEO
        if (role === 'admin' && (designation === 'team_leader' || designation === 'teamleader' || designation.includes('tl'))) return 3; // LEVEL_3_TL_SALES
        return 4; // LEVEL_4_AGENT_SALES
      };

      const dashboardLevel = getLevel();

      let teamMemberIds: string[] = [];
      if (dashboardLevel === 3 && user.uid) {
        teamMemberIds = [user.uid];
        const { data: teamData } = await supabase
          .from('teams')
          .select('members')
          .eq('leader_id', user.uid)
          .eq('is_active', true);
          
        if (teamData) {
          teamData.forEach((team: any) => {
            if (Array.isArray(team.members)) {
              team.members.forEach((m: any) => { if (typeof m === 'string') teamMemberIds.push(String(m)); });
            }
          });
        }
        teamMemberIds = [...new Set(teamMemberIds)];
      }

      const fetchPaginated = async (buildQueryFn: () => any, throwOnError: boolean = false, maxRecords: number = 5000) => {
        let allData: any[] = [];
        let from = 0;
        const step = 1000;
        try {
          while(allData.length < maxRecords) {
            const { data, error } = await buildQueryFn().range(from, from + step - 1);
            if (error) throw error;
            if (data) allData.push(...data);
            if (!data || data.length < step) break;
            from += step;
          }
        } catch (error: any) {
          if (throwOnError) throw error;
          console.error("Pagination error:", error.message || error);
        }
        return allData;
      };

      const buildCallLogsQuery = () => {
        let q = supabase
          .from("call_logs")
          .select(`
            *,
            customer_name,
            agent:user_profiles!agent_id!inner(user_name, employee_id, organization_id),
            campaign:campaigns!campaign_id(name)
          `)
          .gte("created_at", startOfDay)
          .lte("created_at", endOfDay)
          .order("created_at", { ascending: false });

        if (dashboardLevel === 4 && user.uid) {
          q = q.eq('agent_id', user.uid);
        } else if (dashboardLevel === 3 && teamMemberIds.length > 0) {
          q = q.in('agent_id', teamMemberIds);
        } else if (dashboardLevel === 2) {
          if (user.organization_id) q = q.eq('agent.organization_id', user.organization_id);
          else q = q.eq('id', '00000000-0000-0000-0000-000000000000');
        }
        return q;
      };

      const buildRejectedQuery = () => {
        let q = supabase
          .from('rejected_leads')
          .select('*')
          .gte('rejected_at', startOfDay)
          .lte('rejected_at', endOfDay);
        
        if (dashboardLevel === 4 && user.uid) {
          q = q.eq('agent_id', user.uid);
        } else if ((dashboardLevel === 3 || dashboardLevel === 2) && teamMemberIds.length > 0) {
          q = q.in('agent_id', teamMemberIds);
        }
        return q;
      };

      const buildClosedQuery = () => {
        let q = supabase
          .from('closed_deals')
          .select('*')
          .gte('closed_at', startOfDay)
          .lte('closed_at', endOfDay);

        if (dashboardLevel === 4 && user.uid) {
          q = q.eq('agent_id', user.uid);
        } else if ((dashboardLevel === 3 || dashboardLevel === 2) && teamMemberIds.length > 0) {
          q = q.in('agent_id', teamMemberIds);
        }
        return q;
      };

      const [callLogs, rejectedLeads, closedDeals] = await Promise.all([
        fetchPaginated(buildCallLogsQuery, true),
        fetchPaginated(buildRejectedQuery, false),
        fetchPaginated(buildClosedQuery, false)
      ]);

      // --- HYDRATE AGENT AND CAMPAIGN DATA MANUALLY ---
      const allAgentIds = [...new Set([
        ...callLogs.map(l => l.agent_id),
        ...rejectedLeads.map(l => l.agent_id),
        ...closedDeals.map(l => l.agent_id)
      ])].filter(Boolean);

      const allCampaignIds = [...new Set([
        ...callLogs.map(l => l.campaign_id),
        ...rejectedLeads.map(l => l.campaign_id),
        ...closedDeals.map(l => l.campaign_id)
      ])].filter(Boolean);

      let profileMap: Record<string, any> = {};
      let campaignMap: Record<string, any> = {};

      if (allAgentIds.length > 0) {
        const { data: profiles } = await supabase.from('user_profiles').select('user_id, user_name, employee_id, organization_id').in('user_id', allAgentIds);
        (profiles || []).forEach(p => { profileMap[p.user_id] = p; });
      }

      if (allCampaignIds.length > 0) {
        const { data: camps } = await supabase.from('campaigns').select('id, name').in('id', allCampaignIds);
        (camps || []).forEach(c => { campaignMap[c.id] = c; });
      }

      // --- 4. MAP AND MERGE ---
      const mappedLogs = (callLogs || []).map(log => ({
        ...log,
        created_at: log.created_at,
        customer: log.customer_name ? { customer_name: log.customer_name } : null,
        activity_type: 'call',
        agent: log.agent || profileMap[log.agent_id], // logs already have it but being safe
        campaign: log.campaign || campaignMap[log.campaign_id]
      }));

      const mappedRejected = (rejectedLeads || [])
        .filter(r => !mappedLogs.some(l => l.customer_id === r.customer_id && Math.abs(new Date(l.created_at).getTime() - new Date(r.rejected_at).getTime()) < 5000))
        .map(r => ({
          ...r,
          id: `rej-${r.id}`,
          created_at: r.rejected_at,
          customer: { customer_name: r.customer_name },
          is_connected: 'contactable',
          activity_type: 'rejection',
          agent: profileMap[r.agent_id],
          campaign: campaignMap[r.campaign_id]
        }));

      const mappedClosed = (closedDeals || [])
        .filter(c => !mappedLogs.some(l => l.customer_id === c.customer_id && Math.abs(new Date(l.created_at).getTime() - new Date(c.closed_at).getTime()) < 5000))
        .map(c => ({
          ...c,
          id: `cls-${c.id}`,
          created_at: c.closed_at,
          customer: { customer_name: c.customer_name },
          status: 'closed',
          is_connected: 'contactable',
          activity_type: 'closing',
          disposition: c.final_disposition,
          agent: profileMap[c.agent_id],
          campaign: campaignMap[c.campaign_id]
        }));

      const combined = [...mappedLogs, ...mappedRejected, ...mappedClosed]
        .filter(act => {
           // Post-fetch filter for LEVEL 2 (Org) if relationship was missing
           if (dashboardLevel === 2 && user.organization_id) {
              const orgId = act.agent?.organization_id || act.organization_id;
              return orgId === user.organization_id;
           }
           return true;
        })
        .sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );

      setActivities(combined);

      // Hydrate missing customer names AND phone numbers
        try {
          // Hydrate Logic: 
          // 1. Identify missing IDs
          const missingCustomerIds = combined
             .filter(a => !a.customer?.customer_name && a.customer_id)
             .map(a => a.customer_id);
             
          const uniqueIds = [...new Set(missingCustomerIds)];

          // 2. Identify missing Hashes (mostly for mobile history if any)
          const missingHashes = combined
             .filter(a => !a.customer?.customer_name && !a.customer_id && a.phone_search_hash)
             .map(a => a.phone_search_hash);
          const uniqueHashes = [...new Set(missingHashes)];

          let activeHydrate: any[] = [], rHydrate: any[] = [], cHydrate: any[] = [];

          const promises = [];
          
          if (uniqueIds.length > 0 || uniqueHashes.length > 0) {
              const CHUNK_SIZE = 150; 
              
              const idChunks = Array.from({ length: Math.ceil(uniqueIds.length / CHUNK_SIZE) }, (_, i) => uniqueIds.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE));
              const hashChunks = Array.from({ length: Math.ceil(uniqueHashes.length / CHUNK_SIZE) }, (_, i) => uniqueHashes.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE));

              // 1. Hydrate by ID
              for (const batch of idChunks) {
                  promises.push(supabase.from('customers').select('id, customer_name, phone_no, phone_search_hash').in('id', batch).then(r => activeHydrate.push(...(r.data || []))));
                  promises.push(supabase.from('rejected_leads').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('customer_id', batch).then(r => rHydrate.push(...(r.data || []))));
                  promises.push(supabase.from('rejected_leads').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('id', batch).then(r => rHydrate.push(...(r.data || []))));
                  promises.push(supabase.from('closed_deals').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('customer_id', batch).then(r => cHydrate.push(...(r.data || []))));
                  promises.push(supabase.from('closed_deals').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('id', batch).then(r => cHydrate.push(...(r.data || []))));
              }
              
              // 2. Hydrate by Hash
              for (const batch of hashChunks) {
                  promises.push(supabase.from('customers').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', batch).then(r => activeHydrate.push(...(r.data || []))));
                  promises.push(supabase.from('rejected_leads').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', batch).then(r => rHydrate.push(...(r.data || []))));
                  promises.push(supabase.from('closed_deals').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', batch).then(r => cHydrate.push(...(r.data || []))));
              }
          }
          
          if (promises.length > 0) {
              await Promise.all(promises);
              
              if (fetchIdRef.current !== fetchId) return;

              setActivities(prev => prev.map(act => {
                 if (act.customer?.customer_name) return act; 
                 
                 // Match Priority: 
                 // 1. Customer ID (Exact match to id or customer_id)
                 // 2. Phone Hash
                 
                 let match = null;
                 if (act.customer_id) {
                     match = activeHydrate.find(a => a.id === act.customer_id) ||
                             rHydrate.find(r => r.id === act.customer_id || r.customer_id === act.customer_id) ||
                             cHydrate.find(c => c.id === act.customer_id || c.customer_id === act.customer_id);
                 }
                 
                 if (!match && act.phone_search_hash) {
                     match = activeHydrate.find(a => a.phone_search_hash === act.phone_search_hash) ||
                             rHydrate.find(r => r.phone_search_hash === act.phone_search_hash) ||
                             cHydrate.find(c => c.phone_search_hash === act.phone_search_hash);
                 }
      
                if (match) {
                   return { 
                      ...act, 
                      customer: { 
                          ...act.customer, 
                          customer_name: match.customer_name || "Unknown"
                      },
                      phone_no: match.phone_no 
                   };
                }
                return act;
              }));
          }
        } catch (err) {
           console.error("Hydration failed:", err);
        }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [
    selectedDate, 
    user?.uid, 
    user?.role, 
    user?.designation, 
    user?.organization_id, 
    user?.isClient, 
    mounted
  ]);

  // Fetch Mobile History
  const fetchMobileHistory = useCallback(async (isBackground = false) => {
      if (!mounted || !user) return;
      
      try {
          if (!isBackground) setLoading(true);
          // Parse Date Range
          const localDate = new Date(selectedDate + 'T00:00:00');
          const startOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0).toISOString();
          const endOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 23, 59, 59, 999).toISOString();

          // Filter by Employee ID (Security)
          const getLevel = () => {
            const designation = (user.designation || '').toLowerCase();
            const role = user.role || '';
            if (
              user.isClient === false && 
              (role === 'superadmin' || role === 'super_admin') && 
              (designation === 'ceo' || designation === 'developer')
            ) return 1;
            
            if (role === 'super_admin' || designation === 'ceo' || designation === 'owner') return 2;
            if (role === 'admin' && (designation === 'team_leader' || designation === 'teamleader' || designation.includes('tl'))) return 3;
            return 4;
          };

          const dashboardLevel = getLevel();

          let allowedEmpIds: string[] | null = null;
          let enforceEmpty = false;

          if (dashboardLevel === 4) {
            if (user.employeeId) allowedEmpIds = [user.employeeId];
            else enforceEmpty = true;
          }
          else if (dashboardLevel === 3) {
            let teamMemberIds = [user.uid];
            const { data: teamData } = await supabase
              .from('teams')
              .select('members')
              .eq('leader_id', user.uid)
              .eq('is_active', true);
            
            if (teamData) {
              teamData.forEach((t: any) => { if (Array.isArray(t.members)) t.members.forEach((m: any) => teamMemberIds.push(String(m))); });
            }
            const uniqueUserIds = [...new Set(teamMemberIds)];
            
            const { data: profiles } = await supabase
              .from('user_profiles')
              .select('employee_id')
              .in('user_id', uniqueUserIds);
            
            const empIds = (profiles || []).map(p => p.employee_id).filter(Boolean);
            if (empIds.length > 0) allowedEmpIds = empIds;
            else enforceEmpty = true;
          }
          else if (dashboardLevel === 2) {
            if (user.organization_id) {
              const { data: orgUsers } = await supabase
                .from('user_profiles')
                .select('employee_id')
                .eq('organization_id', user.organization_id);
              
              if (orgUsers) {
                const empIds = orgUsers.map(u => u.employee_id).filter(Boolean);
                if (empIds.length > 0) allowedEmpIds = empIds;
                else enforceEmpty = true;
              } else {
                enforceEmpty = true;
              }
            } else {
              enforceEmpty = true;
            }
          }

          const fetchPaginatedMobile = async () => {
            let allData: any[] = [];
            let from = 0;
            const step = 1000;
            while(true) {
              let q = supabase
                .from('call_history')
                .select('*')
                .gte('timestamp', startOfDay)
                .lte('timestamp', endOfDay)
                .order('timestamp', { ascending: false });

              if (enforceEmpty) {
                q = q.eq('id', '00000000-0000-0000-0000-000000000000');
              } else if (allowedEmpIds) {
                q = q.in('employee_id', allowedEmpIds);
              }

              const { data, error } = await q.range(from, from + step - 1);
              if (error) throw error;
              if (data) allData.push(...data);
              if (!data || data.length < step) break;
              from += step;
            }
            return allData;
          };

          const data = await fetchPaginatedMobile();
          
          let finalUniqueData: any[] = [];
          
          if (data && data.length > 0) {
              const empIds = [...new Set(data.map(d => d.employee_id).filter(Boolean))];
              let profileMap: Record<string, string> = {};
              
              if (empIds.length > 0) {
                  const { data: profiles } = await supabase
                      .from('user_profiles')
                      .select('employee_id, user_name, organization_id')
                      .in('employee_id', empIds);
                  profileMap = Object.fromEntries((profiles || []).map(p => [p.employee_id, p.user_name]));
                  // Separate map for Org ID hydration
                  const orgMap = Object.fromEntries((profiles || []).map(p => [p.employee_id, p.organization_id]));
                  
                  const hydratedData = data.map(d => ({
                      ...d,
                      user_name: profileMap[d.employee_id] || "Unknown",
                      organization_id: orgMap[d.employee_id] || null,
                      is_connected: (d.duration || 0) > 5 ? 'contactable' : 'uncontactable'
                  }));

                  // DEDUPLICATION LOGIC
                  const seenKeys = new Set<string>();
                  finalUniqueData = hydratedData.filter(item => {
                      const timestamp = new Date(item.timestamp);
                      const timeStr = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      const dateStr = timestamp.toLocaleDateString();
                      const key = `${item.number}-${item.employee_id}-${dateStr}-${timeStr}-${item.duration}`;
                      
                      if (!seenKeys.has(key)) {
                          seenKeys.add(key);
                          return true;
                      }
                      return false;
                  });
              }
              setMobileActivities(finalUniqueData);
          }

      } catch (e) {
          console.error("Error fetching mobile history:", e);
      } finally {
          if (!isBackground) setLoading(false);
      }
  }, [
    selectedDate, 
    user?.uid, 
    user?.employeeId, 
    user?.role, 
    user?.designation, 
    user?.organization_id, 
    user?.isClient, 
    mounted, 
    source
  ]);

  // Reset data when date changes to force a fresh fetch
  useEffect(() => {
     setActivities([]);
     setMobileActivities([]);
  }, [selectedDate]);

  useEffect(() => {
     if (source === 'mobile' && mobileActivities.length === 0) {
         fetchMobileHistory();
     } else if (source === 'crm' && activities.length === 0) {
         fetchActivities();
     }
  }, [source, fetchActivities, fetchMobileHistory, activities.length, mobileActivities.length]);


   const filteredActivities = useMemo(() => {
    let result = source === 'mobile' ? mobileActivities : activities;
    const query = searchQuery.toLowerCase();
    
    // 1. Core Filtration
    if (query) {
        const cleanQuery = query.replace(/\D/g, '');
        const isPhoneSearch = cleanQuery.length > 3;
        const queryHash = isPhoneSearch ? computePhoneHash(cleanQuery) : null;

        result = result.filter(a => {
           if (isPhoneSearch) {
               if (a.phone_search_hash && a.phone_search_hash === queryHash) return true;
               const phoneField = a.phone_no || a.number;
               if (phoneField && decryptPhone(phoneField).includes(cleanQuery)) return true;
           }
            
           if (source === 'mobile') {
               return (
                   (a.name && a.name.toLowerCase().includes(query)) ||
                   (a.number && a.number.toLowerCase().includes(query)) ||
                   (a.employee_id && a.employee_id.toLowerCase().includes(query)) ||
                   (a.device_id && a.device_id.toLowerCase().includes(query))
               );
           }

           return (
              a.agent?.user_name?.toLowerCase().includes(query) ||
              a.customer?.customer_name?.toLowerCase().includes(query) ||
              (a.disposition && a.disposition.toLowerCase().includes(query)) ||
              (a.sub_disposition && a.sub_disposition.toLowerCase().includes(query)) ||
              a.agent?.employee_id?.toLowerCase().includes(query) ||
              a.campaign?.name?.toLowerCase().includes(query) ||
              (a.notes && a.notes.toLowerCase().includes(query))
           );
        });
    }

    // 2. Advanced Filters
    if (agentFilter !== "All Agents") {
       result = result.filter(a => {
           const empId = source === 'mobile' ? a.employee_id : a.agent?.employee_id;
           return empId === agentFilter;
       });
    }

    if (orgFilter !== "All Organizations") {
       result = result.filter(a => {
           const orgId = source === 'mobile' ? a.organization_id : (a.agent?.organization_id || a.organization_id);
           return orgId === orgFilter;
       });
    }

    if (campaignFilter !== "All Campaigns") {
       result = result.filter(a => {
          const campName = source === 'mobile' ? (a.campaign_name || "General") : (a.campaign?.name || "General");
          return campName === campaignFilter;
       });
    }

    if (dispositionFilter !== "All Dispositions") {
       result = result.filter(a => a.disposition === dispositionFilter);
    }

    if (callTypeFilter !== "All Types") {
        result = result.filter(a => {
            const type = (a.call_type || (a.is_connected === 'contactable' ? 'outgoing' : 'missed')).toLowerCase();
            if (callTypeFilter === 'Outgoing') return type.includes('outgoing');
            if (callTypeFilter === 'Incoming') return type.includes('incoming');
            if (callTypeFilter === 'Missed') return type.includes('missed') || type.includes('reject');
            return true;
        });
    }

    return result;
  }, [activities, mobileActivities, searchQuery, source, agentFilter, campaignFilter, dispositionFilter, orgFilter, callTypeFilter]);

  // Reactive Stats Update
  useEffect(() => {
    const totalDials = filteredActivities.length;
    const totalTalkTimeSec = filteredActivities.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const contactableCount = filteredActivities.filter(a => a.is_connected === 'contactable').length;
    
    let lastCall = "N/A";
    if (totalDials > 0) {
        const sorted = [...filteredActivities].sort((a, b) => new Date(b.created_at || b.timestamp).getTime() - new Date(a.created_at || a.timestamp).getTime());
        lastCall = new Date(sorted[0].created_at || sorted[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    setStats({
       totalDials,
       totalTalkTime: totalTalkTimeSec,
       contactable: contactableCount,
       uncontactable: totalDials - contactableCount,
       lastCallTime: lastCall,
       idleFrom: totalDials > 0 ? lastCall : "N/A"
    });
  }, [filteredActivities]);

  // Fetch all global filter data on mount
  useEffect(() => {
    const fetchGlobalFilters = async () => {
      if (!mounted || !user) return;

      const getLevel = () => {
        const designation = (user.designation || '').toLowerCase();
        const role = (user.role || '').toLowerCase();
        if (
          user.isClient === false && 
          (role === 'superadmin' || role === 'super_admin') && 
          (designation === 'ceo' || designation === 'developer')
        ) return 1;
        
        if (role === 'super_admin' || role === 'superadmin' || designation === 'ceo' || designation === 'developer' || designation === 'owner') return 2;
        if (role === 'admin' && (designation === 'team_leader' || designation === 'teamleader' || designation.includes('tl'))) return 3;
        return 4;
      };

      const dashboardLevel = getLevel();

      // 1. All Organizations
      let orgQuery = supabase.from('organizations').select('id, company_name').order('company_name');
      if (dashboardLevel !== 1 && user.organization_id) {
         orgQuery = orgQuery.eq('id', user.organization_id);
      }
      const { data: orgs } = await orgQuery;
      if (orgs) setGlobalOrganizations(orgs);

      // 2. All Campaigns
      let campQuery = supabase.from('campaigns').select('id, name, organization_id').order('name');
      if (dashboardLevel !== 1 && user.organization_id) {
         campQuery = campQuery.eq('organization_id', user.organization_id);
      }
      const { data: camps } = await campQuery;
      if (camps) setGlobalCampaigns(camps);

      // 3. All Agents
      let agentQuery = supabase.from('user_profiles').select('employee_id, user_name, user_id, organization_id').order('user_name');
      
      if (dashboardLevel === 4) {
         agentQuery = agentQuery.eq('user_id', user.uid);
      } else if (dashboardLevel === 3) {
         // TL sees team
         let teamMemberIds = [user.uid];
         const { data: teamData } = await supabase.from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
         if (teamData) {
            teamData.forEach((t: any) => { if (Array.isArray(t.members)) t.members.forEach((m: any) => teamMemberIds.push(String(m))); });
         }
         agentQuery = agentQuery.in('user_id', [...new Set(teamMemberIds)]);
      } else if (dashboardLevel === 2) {
         agentQuery = agentQuery.eq('organization_id', user.organization_id);
      }

      const { data: agents } = await agentQuery;
      if (agents) setGlobalAgents(agents.filter(a => a.employee_id && a.user_name));

      // 4. Unique Dispositions
      // (This is mostly fine as it's just strings, but let's filter the logs source too)
      let logQuery = supabase.from('call_logs').select('disposition').not('disposition', 'is', null);
      if (dashboardLevel !== 1 && user.organization_id) {
         // We'd need a join here or just filter by agent_id
         // For simplicity, we can let dispositions be global or based on existing fetched activities
      }
      const { data: logs } = await logQuery;
      if (logs) {
         const uniqueDisps = Array.from(new Set(logs.map(l => l.disposition))).sort();
         setGlobalDispositions(uniqueDisps);
      }
    };
    fetchGlobalFilters();
  }, [mounted, user?.uid, user?.organization_id]);

  // Use global options for dropdowns
  const filterOptions = useMemo(() => {
    let filteredAgents = globalAgents;
    let filteredCampaigns = globalCampaigns;

    if (orgFilter !== "All Organizations") {
      filteredAgents = globalAgents.filter(a => a.organization_id === orgFilter);
      filteredCampaigns = globalCampaigns.filter(c => c.organization_id === orgFilter);
    }

    return {
      agents: filteredAgents.map(a => ({ id: a.employee_id, name: a.user_name })),
      campaigns: filteredCampaigns.map(c => c.name),
      dispositions: globalDispositions,
      organizations: globalOrganizations.map(o => ({ id: o.id, name: o.company_name }))
    };
  }, [globalAgents, globalCampaigns, globalDispositions, globalOrganizations, orgFilter]);

  // Utility formatters memoized or optimized
  const formatSeconds = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formatTime = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }, []);

  const formatDisplayDate = useCallback((dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  // Pagination logic
  const paginatedActivities = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredActivities.slice(start, start + itemsPerPage);
  }, [filteredActivities, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  return {
    loading,
    error,
    activities,
    filteredActivities,
    paginatedActivities,
    currentPage,
    setCurrentPage,
    totalPages,
    itemsPerPage,
    stats,
    selectedDate,
    setSelectedDate,
    searchQuery,
    setSearchQuery,
    fetchActivities,
    formatSeconds,
    formatTime,
    formatDisplayDate,
    source,
    setSource,
    mobileActivities,
    // Add shared filter states
    agentFilter, setAgentFilter,
    campaignFilter, setCampaignFilter,
    dispositionFilter, setDispositionFilter,
    orgFilter, setOrgFilter,
    callTypeFilter, setCallTypeFilter,
    filterOptions
  };
}
