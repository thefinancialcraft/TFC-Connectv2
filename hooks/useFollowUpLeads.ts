import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";
import { decryptPhone } from "../lib/phoneUtils";
import { useUser } from "../context/UserContext";

export interface FollowUpLead {
  id: string;
  customer_name: string;
  phone_no: string;
  disposition: string;
  sub_disposition?: string;
  next_called_at: string;
  campaign_id: string;
  organization_id: string;
  assigned_to: string;
  campaign_name: string;
  organization_name: string;
  assigned_name: string;
  isOverdue: boolean;
  isUpcoming: boolean;
  status_label: string;
  employee_id?: string;
  outcome?: string;
  profile_pic_url?: string;
}

export function useFollowUpLeads() {
  const { user, mounted } = useUser();
  const [leads, setLeads] = useState<FollowUpLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    organizationId: "",
    assignedTo: "",
    status: "", // overdue, upcoming
    campaignId: "",
    callbackDate: "" // yyyy-mm-dd
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLeads = useCallback(async (isBackground = false) => {
    if (!mounted || !user) return;

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      if (!isBackground) setLoading(true);
      setError("");

      const now = new Date();

      // Fetch customers first (Joins disabled due to missing FKs on campaign_id/assigned_to)
      let query = supabase
        .from('customers')
        .select('*')
        .in('disposition', ['Callback', 'Call Back', 'Follow Up', 'FollowUp'])
        .order('next_called_at', { ascending: true })
        .abortSignal(abortControllerRef.current.signal);

      // Apply Security Levels
      if (user.isClient) {
        // Level 1: Client Agent (Own leads only)
        if (user.designation === 'agent' || !user.designation) {
           if (user.uid) {
             query = query.eq('assigned_to', user.uid);
           }
        }
        // Level 2: Team Leader (Own + Team's leads)
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
                     // Parse members JSONB consistent with other pages
                     if (Array.isArray(team.members)) {
                        team.members.forEach((m: any) => { if (typeof m === 'string') teamMemberIds.push(m); });
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
              query = query.in('assigned_to', teamMemberIds);
           } else {
              query = query.eq('assigned_to', user.uid);
           }
        }
        // Level 3: Client Admin (Organization Wide)
        else if (['ceo', 'developer', 'admin'].includes(user.designation || '')) {
            if (user.organization_id) {
               query = query.eq('organization_id', user.organization_id);
            } else {
               // Fail secure
               query = query.eq('id', '00000000-0000-0000-0000-000000000000');
            }
        }
      }
      // Level 4: Internal Staff (!isClient) gets explicit Global Access (no filters applied)

      const { data: customerData, error: customerError } = await query;

      if (customerError) {
        if (customerError.name === 'AbortError') return;
        throw customerError;
      }

      if (customerData) {
        // Parallel fetch related data (Manual Join Pattern)
        const campaignIds = [...new Set(customerData.map(c => c.campaign_id).filter(Boolean))];
        const orgIds = [...new Set(customerData.map(c => c.organization_id).filter(Boolean))];
        const userIds = [...new Set(customerData.map(c => c.assigned_to).filter(Boolean))];

        const [campaignsResult, orgsResult, usersResult] = await Promise.all([
          campaignIds.length > 0 ? supabase.from('campaigns').select('id, name').in('id', campaignIds).abortSignal(abortControllerRef.current.signal) : Promise.resolve({ data: [] }),
          orgIds.length > 0 ? supabase.from('organizations').select('id, company_name').in('id', orgIds).abortSignal(abortControllerRef.current.signal) : Promise.resolve({ data: [] }),
          userIds.length > 0 ? supabase.from('user_profiles').select('user_id, user_name, employee_id').in('user_id', userIds).abortSignal(abortControllerRef.current.signal) : Promise.resolve({ data: [] })
        ]);

        // Create Lookup Maps
        const campaignMap = Object.fromEntries(campaignsResult.data?.map((c: any) => [c.id, c.name]) || []);
        const orgMap = Object.fromEntries(orgsResult.data?.map((o: any) => [o.id, o.company_name]) || []);
        const userMap = Object.fromEntries(usersResult.data?.map((u: any) => [u.user_id, { name: u.user_name, employee_id: u.employee_id }]) || []);

        const enrichedLeads = customerData.map((lead: any) => {
          let isOverdue = false;
          let isUpcoming = false;
          
          if (lead.next_called_at) {
            const nextCallDate = new Date(lead.next_called_at);
            if (nextCallDate < now) {
              isOverdue = true;
            } else {
              isUpcoming = true;
            }
          } else {
            isOverdue = true; 
          }

          const userInfo = userMap[lead.assigned_to] || { name: 'Unassigned', employee_id: '' };

          return {
            ...lead,
            phone_no: decryptPhone(lead.phone_no),
            isOverdue,
            isUpcoming,
            campaign_name: campaignMap[lead.campaign_id] || 'Unknown Campaign',
            organization_name: orgMap[lead.organization_id] || '—',
            assigned_name: userInfo.name,
            employee_id: userInfo.employee_id,
            status_label: isOverdue ? 'Overdue' : 'Upcoming'
          };
        });

        setLeads(enrichedLeads);
      } else {
        setLeads([]);
      }

    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error("Error fetching follow-up leads:", err);
        setError("Failed to load follow-up schedule");
      }
    } finally {
      if (!isBackground) setLoading(false);
    }
  }, [user, mounted]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (mounted && user) {
        if (leads.length === 0) {
            fetchLeads();
        }
        
        interval = setInterval(() => {
          fetchLeads(true);
        }, 60000);
    }

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (interval) clearInterval(interval);
    };
  }, [fetchLeads, mounted, user]);
  const filteredLeads = useMemo(() => {
    let result = leads;

    // Search query filter
    const query = searchQuery.toLowerCase();
    if (query) {
      result = result.filter(lead => 
        lead.customer_name?.toLowerCase().includes(query) || 
        lead.phone_no?.includes(query) ||
        lead.disposition?.toLowerCase().includes(query) ||
        lead.campaign_name?.toLowerCase().includes(query) ||
        lead.organization_name?.toLowerCase().includes(query) ||
        lead.assigned_name?.toLowerCase().includes(query) ||
        lead.employee_id?.toLowerCase().includes(query)
      );
    }

    // Structured filters
    if (filters.organizationId) {
      result = result.filter(lead => lead.organization_id === filters.organizationId);
    }
    
    if (filters.assignedTo) {
      result = result.filter(lead => lead.assigned_to === filters.assignedTo);
    }

    if (filters.status) {
      if (filters.status === 'overdue') {
        result = result.filter(lead => lead.isOverdue);
      } else if (filters.status === 'upcoming') {
        result = result.filter(lead => lead.isUpcoming);
      }
    }

    if (filters.campaignId) {
      result = result.filter(lead => lead.campaign_id === filters.campaignId);
    }

    if (filters.callbackDate) {
      result = result.filter(lead => {
        if (!lead.next_called_at) return false;
        const date = new Date(lead.next_called_at).toISOString().split('T')[0];
        return date === filters.callbackDate;
      });
    }

    return result;
  }, [leads, searchQuery, filters]);

  const stats = useMemo(() => {
    return filteredLeads.reduce((acc, lead) => {
      acc.total++;
      if (lead.isOverdue) acc.overdue++;
      if (lead.isUpcoming) acc.upcoming++;
      return acc;
    }, { total: 0, overdue: 0, upcoming: 0 });
  }, [filteredLeads]);

  const formatDate = useCallback((dateStr: string) => {
    if (!dateStr) return '—';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '—';
        return date.toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
    } catch (e) {
        return '—';
    }
  }, []);

  return {
    leads,
    filteredLeads,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    stats,
    fetchLeads,
    formatDate
  };
}
