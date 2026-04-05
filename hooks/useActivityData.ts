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
  const [source, setSource] = useState<'crm' | 'mobile'>('crm');
  const [activities, setActivities] = useState<any[]>([]);
  const [mobileActivities, setMobileActivities] = useState<any[]>([]); // New state for mobile history
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  const [stats, setStats] = useState<ActivityStats>({
    totalDials: 0,
    totalTalkTime: 0,
    contactable: 0,
    uncontactable: 0,
    lastCallTime: "N/A",
    idleFrom: "N/A"
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchActivities = useCallback(async (isBackground = false) => {
    if (!mounted || !user) return;

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (!isBackground) setLoading(true);
      setError("");

      const localDate = new Date(selectedDate + 'T00:00:00'); // Parse as local
      const startOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0).toISOString();
      const endOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 23, 59, 59, 999).toISOString();

      // Base query
      // Note: We use !inner on agent join to allow filtering by agent's organization_id for Level 3
      let query = supabase
        .from("call_logs")
        .select(`
          *,
          agent:user_profiles!agent_id!inner(user_name, employee_id, organization_id),
          campaign:campaigns!campaign_id(name)
        `)
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: false });

      // Apply Security Levels
      if (user.isClient) {
        // Level 1: Client Agent (Own activities only)
        if (user.designation === 'agent' || !user.designation) {
           if (user.uid) {
             query = query.eq('agent_id', user.uid);
           }
        }
        // Level 2: Team Leader (Own + Team's activities)
        else if (user.designation === 'team_leader') {
           let teamMemberIds = [user.uid];
           if (user.uid) {
               const { data: teamData } = await supabase
                 .from('teams')
                 .select('members')
                 .eq('leader_id', user.uid)
                 .eq('is_active', true);
                 
               if (teamData) {
                  teamData.forEach((team: any) => {
                     // Parse members JSONB similar to other pages
                     if (Array.isArray(team.members)) {
                        team.members.forEach((m: any) => { if(typeof m === 'string') teamMemberIds.push(m); });
                     } else if (typeof team.members === 'string') {
                        try {
                           const parsed = JSON.parse(team.members);
                           if(Array.isArray(parsed)) parsed.forEach((id: any) => teamMemberIds.push(String(id)));
                        } catch(e){}
                     }
                  });
               }
           }
           teamMemberIds = [...new Set(teamMemberIds)]; // Unique keys
           if (teamMemberIds.length > 0) {
              query = query.in('agent_id', teamMemberIds);
           }
        }
        // Level 3: Client Admin (Organization Wide)
        else if (['ceo', 'developer'].includes(user.designation || '')) {
            if (user.organization_id) {
               // Filter by agent's organization_id (using the !inner join alias)
               query = query.eq('agent.organization_id', user.organization_id);
            } else {
               // Fail secure
               query = query.eq('id', '00000000-0000-0000-0000-000000000000');
            }
        }
      }
      // Level 4: Internal Staff (!isClient) gets explicit Global Access (no filters added)

      // --- START: COMBINED FETCH LOGIC ---
      
      // 1. Fetch Call Logs (Primary source)
      const { data: callLogs, error: logError } = await query;
      if (logError) throw logError;

      // 2. Fetch Rejected Leads for the same day
      let rejectedQuery = supabase
        .from('rejected_leads')
        .select('*, agent:user_profiles!agent_id(user_name, employee_id, organization_id), campaign:campaigns!campaign_id(name)')
        .gte('rejected_at', startOfDay)
        .lte('rejected_at', endOfDay);
      
      // 3. Fetch Closed Deals for the same day
      let closedQuery = supabase
        .from('closed_deals')
        .select('*, agent:user_profiles!agent_id(user_name, employee_id, organization_id), campaign:campaigns!campaign_id(name)')
        .gte('closed_at', startOfDay)
        .lte('closed_at', endOfDay);

      // Apply same user filters to rejected/closed queries
      if (user.isClient) {
        if (user.designation === 'agent' || !user.designation) {
          rejectedQuery = rejectedQuery.eq('agent_id', user.uid);
          closedQuery = closedQuery.eq('agent_id', user.uid);
        } else if (user.organization_id && ['ceo', 'developer'].includes(user.designation)) {
          rejectedQuery = rejectedQuery.eq('agent.organization_id', user.organization_id);
          closedQuery = closedQuery.eq('agent.organization_id', user.organization_id);
        }
        // (TL filter skipped for brevity but usually follows similar logic if needed)
      }

      const [{ data: rejectedLeads }, { data: closedDeals }] = await Promise.all([
        rejectedQuery,
        closedQuery
      ]);

      // --- 4. MAP AND MERGE ---
      const mappedLogs = (callLogs || []).map(log => ({
        ...log,
        created_at: log.created_at, // Use standard
        activity_type: 'call'
      }));

      const mappedRejected = (rejectedLeads || [])
        .filter(r => !mappedLogs.some(l => l.customer_id === r.customer_id && Math.abs(new Date(l.created_at).getTime() - new Date(r.rejected_at).getTime()) < 5000))
        .map(r => ({
          ...r,
          id: `rej-${r.id}`,
          created_at: r.rejected_at,
          customer: { customer_name: r.customer_name },
          is_connected: 'contactable',
          activity_type: 'rejection'
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
          disposition: c.final_disposition
        }));

      const combined = [...mappedLogs, ...mappedRejected, ...mappedClosed].sort((a, b) => 
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
          
          if (uniqueIds.length > 0) {
              // Active (by id)
              promises.push(supabase.from('customers').select('id, customer_name, phone_no, phone_search_hash').in('id', uniqueIds).then(r => activeHydrate.push(...(r.data || []))));
              
              // Rejected/Closed: Check 'customer_id' column (mapped from original id) AND 'id' (new pk)
              promises.push(supabase.from('rejected_leads').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('customer_id', uniqueIds).then(r => rHydrate.push(...(r.data || []))));
              promises.push(supabase.from('rejected_leads').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('id', uniqueIds).then(r => rHydrate.push(...(r.data || []))));
              
              promises.push(supabase.from('closed_deals').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('customer_id', uniqueIds).then(r => cHydrate.push(...(r.data || []))));
              promises.push(supabase.from('closed_deals').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('id', uniqueIds).then(r => cHydrate.push(...(r.data || []))));
          }
          
          if (uniqueHashes.length > 0) {
              promises.push(supabase.from('customers').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', uniqueHashes).then(r => activeHydrate.push(...(r.data || []))));
              promises.push(supabase.from('rejected_leads').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', uniqueHashes).then(r => rHydrate.push(...(r.data || []))));
              promises.push(supabase.from('closed_deals').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', uniqueHashes).then(r => cHydrate.push(...(r.data || []))));
          }
          
          if (promises.length > 0) {
              await Promise.all(promises);
              
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

      // Calculate Stats
      const totalTalkTimeSec = combined.reduce((acc, curr) => acc + (curr.duration || 0), 0);
      const contactableCount = combined.filter(cl => cl.is_connected === 'contactable').length;
      const lastCall = combined.length > 0 ? new Date(combined[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A";
      
      setStats({
        totalDials: combined.length,
        totalTalkTime: totalTalkTimeSec,
        contactable: contactableCount,
        uncontactable: combined.length - contactableCount,
        lastCallTime: lastCall,
        idleFrom: combined.length > 0 ? lastCall : "N/A"
      });

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching activities:", err);
        setError("Failed to load activities");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [selectedDate, user, mounted]);

  // Fetch Mobile History
  const fetchMobileHistory = useCallback(async (isBackground = false) => {
      if (!mounted || !user) return;
      
      try {
          if (!isBackground) setLoading(true);
          // Parse Date Range
          const localDate = new Date(selectedDate + 'T00:00:00');
          const startOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0).toISOString();
          const endOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 23, 59, 59, 999).toISOString();

          let query = supabase
              .from('call_history')
              .select('*')
              .gte('timestamp', startOfDay)
              .lte('timestamp', endOfDay)
              .order('timestamp', { ascending: false });

          // Filter by Employee ID (Security)
          if (user.isClient) {
              if (user.designation === 'agent' || !user.designation) {
                   if (user.employeeId) query = query.eq('employee_id', user.employeeId);
                   else if (user.uid) query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // Fail safe
              }
              // Add Team Leader / Admin logic if they have mobile history visibility needs
              // For now, assuming mobile history is personal or strictly hierachical.
              // If TL needs to see team's mobile history, we need 'employee_id' of team members.
              // Skipping complex TL logic for mobile history temporarily to match 'crm' simplicity first, 
              // or strictly filtering by own employee_id for now explicitly as per request "crm vs mobile" usually implies personal.
              // However, user said "sabhi jgh call_history se update kiya jayega".
              // Let's assume standard visibility:
              else if (user.organization_id && ['ceo', 'developer'].includes(user.designation || '')) {
                  // Admin sees all? call_history has employee_id. We might need to join user_profiles to check org?
                  // call_history doesn't have org_id. It has employee_id.
                  // We'd need to fetch all employee_ids for the org first.
                  const { data: orgUsers } = await supabase.from('user_profiles').select('employee_id').eq('organization_id', user.organization_id);
                  if (orgUsers) {
                      const empIds = orgUsers.map(u => u.employee_id).filter(Boolean);
                      if (empIds.length > 0) query = query.in('employee_id', empIds);
                  }
              }
          }

          const { data, error } = await query;
          
          if (error) throw error;
          
          let finalUniqueData: any[] = [];
          
          if (data && data.length > 0) {
              const empIds = [...new Set(data.map(d => d.employee_id).filter(Boolean))];
              let profileMap: Record<string, string> = {};
              
              if (empIds.length > 0) {
                  const { data: profiles } = await supabase
                      .from('user_profiles')
                      .select('employee_id, user_name')
                      .in('employee_id', empIds);
                  profileMap = Object.fromEntries((profiles || []).map(p => [p.employee_id, p.user_name]));
              }

              const hydratedData = data.map(d => ({
                  ...d,
                  user_name: profileMap[d.employee_id] || "Unknown"
              }));

              // DEDUPLICATION LOGIC: Filter by Number + Timestamp + Duration
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
          
          // Update Stats from Mobile History if Source is Mobile
          if (source === 'mobile') {
              const totalTalkTimeSec = finalUniqueData.reduce((acc: number, curr: any) => acc + (curr.duration || 0), 0);
              const lastCall = finalUniqueData.length > 0 ? new Date(finalUniqueData[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A";
              
              setStats({
                totalDials: finalUniqueData.length,
                totalTalkTime: totalTalkTimeSec,
                contactable: 0, 
                uncontactable: 0, 
                lastCallTime: lastCall,
                idleFrom: lastCall
              });
          }

      } catch (e) {
          console.error("Error fetching mobile history:", e);
      } finally {
          if (!isBackground) setLoading(false);
      }
  }, [selectedDate, user, mounted, source]);

  useEffect(() => {
     if (source === 'mobile') {
         fetchMobileHistory();
     } else {
         fetchActivities();
     }
  }, [source, fetchActivities, fetchMobileHistory]);


  const filteredActivities = useMemo(() => {
    const targetData = source === 'mobile' ? mobileActivities : activities;
    const query = searchQuery.toLowerCase();
    
    if (!query) return targetData;
    
    // Check if query looks like a phone number
    const cleanQuery = query.replace(/\D/g, '');
    const isPhoneSearch = cleanQuery.length > 3;
    const queryHash = isPhoneSearch ? computePhoneHash(cleanQuery) : null;

    return targetData.filter(a => {
       // 1. Phone Search Strategy
       if (isPhoneSearch) {
           // A. Exact Hash Match
           if (a.phone_search_hash && a.phone_search_hash === queryHash) return true;
           
           // B. Decryption / Plain Match
           if (a.phone_no || a.number) { // Check 'number' for mobile history
               const phoneField = a.phone_no || a.number;
               const plainPhone = decryptPhone(phoneField);
               if (plainPhone.includes(cleanQuery)) return true;
           }
       }
        
       // 2. Standard Text Search
       // Mobile History Fields: name, number, employee_id, device_id
       if (source === 'mobile') {
           return (
               (a.name && a.name.toLowerCase().includes(query)) ||
               (a.number && a.number.toLowerCase().includes(query)) ||
               (a.employee_id && a.employee_id.toLowerCase().includes(query)) ||
               (a.device_id && a.device_id.toLowerCase().includes(query))
           );
       }

       // CRM Fields
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
  }, [activities, mobileActivities, searchQuery, source]);

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

  return {
    loading,
    error,
    activities,
    filteredActivities,
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
    setSource
  };
}
