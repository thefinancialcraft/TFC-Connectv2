import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { supabase } from "../lib/supabase";

export interface FollowUpLead {
  id: string;
  customer_name: string;
  phone_no: string;
  disposition: string;
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
}

export function useFollowUpLeads(userId: string | undefined) {
  const [leads, setLeads] = useState<FollowUpLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLeads = useCallback(async (isBackground = false) => {
    if (!userId) return;

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
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .in('disposition', ['Callback', 'Call Back', 'Follow Up', 'FollowUp'])
        .order('next_called_at', { ascending: true })
        .abortSignal(abortControllerRef.current.signal);

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
          userIds.length > 0 ? supabase.from('user_profiles').select('user_id, user_name').in('user_id', userIds).abortSignal(abortControllerRef.current.signal) : Promise.resolve({ data: [] })
        ]);

        // Create Lookup Maps
        const campaignMap = Object.fromEntries(campaignsResult.data?.map((c: any) => [c.id, c.name]) || []);
        const orgMap = Object.fromEntries(orgsResult.data?.map((o: any) => [o.id, o.company_name]) || []);
        const userMap = Object.fromEntries(usersResult.data?.map((u: any) => [u.user_id, u.user_name]) || []);

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

          return {
            ...lead,
            isOverdue,
            isUpcoming,
            campaign_name: campaignMap[lead.campaign_id] || 'Unknown Campaign',
            organization_name: orgMap[lead.organization_id] || '—',
            assigned_name: userMap[lead.assigned_to] || 'Unassigned',
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
  }, [userId]);

  useEffect(() => {
    fetchLeads();
    
    const interval = setInterval(() => {
      fetchLeads(true);
    }, 60000);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      clearInterval(interval);
    };
  }, [fetchLeads]);

  const stats = useMemo(() => {
    return leads.reduce((acc, lead) => {
      acc.total++;
      if (lead.isOverdue) acc.overdue++;
      if (lead.isUpcoming) acc.upcoming++;
      return acc;
    }, { total: 0, overdue: 0, upcoming: 0 });
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const query = searchQuery.toLowerCase();
    if (!query) return leads;
    
    return leads.filter(lead => 
      lead.customer_name?.toLowerCase().includes(query) || 
      lead.phone_no?.includes(query) ||
      lead.campaign_name?.toLowerCase().includes(query) ||
      lead.organization_name?.toLowerCase().includes(query) ||
      lead.assigned_name?.toLowerCase().includes(query)
    );
  }, [leads, searchQuery]);

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
    stats,
    fetchLeads,
    formatDate
  };
}
