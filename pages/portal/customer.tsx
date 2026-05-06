import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useUser } from "@/components/AppLayout";
import { supabase } from "@/lib/supabase";
import { logSystemEvent, estimateSize } from "@/lib/monitoring";
import ImportCustomersModal from "@/components/ImportCustomersModal";
import AddCustomerModal from "@/components/AddCustomerModal";
import { formatMaskedPhone, computePhoneHash, decryptPhone } from "@/lib/phoneUtils";

interface Customer {
  id: string;
  lead_id: string | null;
  customer_name: string | null;
  phone_no: string | null;
  phone_search_hash: string | null;
  expiry_date: string | null;
  customer_details: string | null;
  utilities: string | null;
  campaign_id: string | null;
  assigned_to: string | null;
  status: string | null;
  created_at: string | null;
  updated_at: string | null;
  assigned_user_name?: string | null;
  assigned_employee_id?: string | null;
  campaign_name?: string | null;
  managed_by?: string | null;
  managed_by_name?: string | null;
  managed_by_id?: string | null;
  organization_id?: string | null;
  organization_name?: string | null;
  disposition?: string | null;
  closed_at?: string | null;
  rejected_at?: string | null;
}


export default function Customer() {
  const router = useRouter();
  const { user, mounted: userLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Permission Flags Logic
  const permissionFlags = useMemo(() => {
    // Default: Hide all restricted actions
    const flags = {
      isImportButtonVisible: false,
      isExportButtonVisible: false,
      isAddCustomerButtonVisible: false,
      isChangeOrganizationButtonVisible: false,
      isChangeCampaginButtonVisible: false,
      isChangeAssignedButtonVisible: false,
      isChangeDispostionButtonVisible: false,
      isDeleteButtonVisible: false,
      isCheckBoxVisible: false,
      isDeleteFromLeadButtonVisible: false,
      isMoveFreshButtonVisible: false,
    };

    if (!mounted || !user) return flags;

    // Level 1: Client Agent (isClient: true, designation: agent)
    // Only assigned organization and self-assigned leads shown
    // All buttons remain HIDDEN (default false)
    if (user.isClient && (user.designation === 'agent' || !user.designation)) {
        return flags;
    }
    
    // Level 2: Team Leader (isClient: true, designation: team_leader)
    // Assigned organization and team members' leads shown
    // All buttons remain HIDDEN (default false)
    if (user.isClient && user.designation === 'team_leader') {
      return flags;
    }
    
    // Level 3: Client Admin (isClient: true, designation: ceo | developer)
    // Assigned organization leads shown (Filtered in fetchCustomers)
    // All buttons VISIBLE
    if (user.isClient && ['ceo', 'developer'].includes(user.designation || '')) {
         return {
            isImportButtonVisible: true,
            isExportButtonVisible: true,
            isAddCustomerButtonVisible: true,
            isChangeOrganizationButtonVisible: true,
            isChangeCampaginButtonVisible: true,
            isChangeAssignedButtonVisible: true,
            isChangeDispostionButtonVisible: true,
            isDeleteButtonVisible: true,
            isCheckBoxVisible: true,
            isDeleteFromLeadButtonVisible: true,
            isMoveFreshButtonVisible: true,
         };
    }

    // Level 4: Internal Staff (isClient: false)
    // All leads shown (No hard filters)
    // All buttons VISIBLE
    if (!user.isClient) {
         return {
            isImportButtonVisible: true,
            isExportButtonVisible: true,
            isAddCustomerButtonVisible: true,
            isChangeOrganizationButtonVisible: true,
            isChangeCampaginButtonVisible: true,
            isChangeAssignedButtonVisible: true,
            isChangeDispostionButtonVisible: true,
            isDeleteButtonVisible: true,
            isCheckBoxVisible: true,
            isDeleteFromLeadButtonVisible: true,
            isMoveFreshButtonVisible: true,
         };
    }

    return flags;
  }, [user, mounted]);

  
  const [activeNav] = useState("customer");
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [tempSearchQuery, setTempSearchQuery] = useState("");
  const [searchField, setSearchField] = useState<"name" | "phone">("name");
  const [showSearchFieldDropdown, setShowSearchFieldDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [freshCustomersCount, setFreshCustomersCount] = useState(0);

  const [pendingFollowUps, setPendingFollowUps] = useState(0);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState(0);
  const [overdueFollowUps, setOverdueFollowUps] = useState(0);
  const [pageSize, setPageSize] = useState<number | "all">(100);
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewingDetailsKey, setViewingDetailsKey] = useState<string | null>(null);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(
    new Set()
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [dataSource, setDataSource] = useState<"live" | "rejected" | "closed">("live");
  
  // Duplicate Modal States
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateLeads, setDuplicateLeads] = useState<any[]>([]);
  const [loadingDuplicates, setLoadingDuplicates] = useState(false);
  const [duplicateDispositionFilter, setDuplicateDispositionFilter] = useState("");
  const [duplicateCampaignFilter, setDuplicateCampaignFilter] = useState("");
  const [selectedDuplicateLeads, setSelectedDuplicateLeads] = useState<Set<string>>(new Set());


  useEffect(() => {
    if (selectedCustomer?.customer_details) {
      try {
        const data = typeof selectedCustomer.customer_details === 'string' 
          ? JSON.parse(selectedCustomer.customer_details) 
          : selectedCustomer.customer_details;
        if (data?.active_details) {
          setViewingDetailsKey(data.active_details);
        }
      } catch (e) {}
    }
  }, [selectedCustomer]);

  const fetchDuplicates = async () => {
    try {
      setLoadingDuplicates(true);
      setShowDuplicateModal(true);
      
      // 1. Get duplicate summaries from RPC
      const { data: initialData, error: rpcError } = await supabase.rpc('get_duplicate_leads');
      if (rpcError) throw rpcError;

      let items = initialData || [];
      
      if (items.length > 0) {
        // 2. Fetch full records from ALL tables to ensure all fields are present
        const leadIds = items.map((i: any) => i.lead_id).filter(Boolean);
        if (leadIds.length > 0) {
           const [liveRes, rejRes, closedRes] = await Promise.all([
             supabase.from('customers').select('*').in('lead_id', leadIds),
             supabase.from('rejected_leads').select('*').in('lead_id', leadIds),
             supabase.from('closed_deals').select('*').in('lead_id', leadIds)
           ]);
           
           const allFullRecords = [...(liveRes.data || []), ...(rejRes.data || []), ...(closedRes.data || [])];
           
           if (allFullRecords.length > 0) {
             const recordMap = new Map(allFullRecords.map(r => [r.lead_id, r]));
             items = items.map((item: any) => ({
               ...item,
               ...(recordMap.get(item.lead_id) || {})
             }));
           }
        }

        // 3. Resolve Campaign Names
        // Check for campaign_id (UUID) or campaign (often used as name or ID in some tables)
        const campaignIds = [...new Set(items.map((c: any) => c.campaign_id || c.campaign).filter((id: any) => id && id.length > 20))];
        let campaignMap: Record<string, string> = {};
        if (campaignIds.length > 0) {
          const { data: cData } = await supabase.from("campaigns").select("id, name").in("id", campaignIds);
          if (cData) cData.forEach(c => { campaignMap[c.id] = c.name; });
        }

        // 4. Resolve Agent Names
        const allUserIds = [...new Set(items.map((c: any) => c.assigned_to || c.agent_id).filter((id: any) => id))];
        let userMap: Record<string, string> = {};
        if (allUserIds.length > 0) {
          const { data: userData } = await supabase.from("user_profiles").select("user_id, id, user_name")
            .or(`user_id.in.("${allUserIds.join('","')}"),id.in.("${allUserIds.join('","')}")`);
          if (userData) {
            userData.forEach(u => {
              userMap[u.user_id] = u.user_name || "Unknown";
              userMap[u.id] = u.user_name || "Unknown";
            });
          }
        }

        // 5. Final Mapping
        const mappedData = items.map((item: any) => {
          const agentId = item.assigned_to || item.agent_id;
          const campId = item.campaign_id || item.campaign;
          
          // Campaign logic: Use resolved name, or string in 'campaign' field if it's not a UUID
          let resolvedCampaign = item.campaign_name;
          if (!resolvedCampaign && campId) {
             resolvedCampaign = campaignMap[campId] || (campId.length < 20 ? campId : null);
          }

          return {
            ...item,
            campaign_name: resolvedCampaign || "N/A",
            assigned_to_name: item.assigned_to_name || (agentId ? userMap[agentId] || "Unknown" : "Unassigned")
          };
        });
        setDuplicateLeads(mappedData);

      } else {
        setDuplicateLeads([]);
      }
    } catch (err) {
      console.error("Error fetching duplicates:", err);
      alert("Failed to fetch duplicate leads.");
    } finally {
      setLoadingDuplicates(false);
    }
  };

  const handleDeleteDuplicateEntry = async (item: any) => {
    // Using lead_id as the primary identifier (e.g., LEAD-1772796342061-975)
    const targetLeadId = item.lead_id;
    
    if (!targetLeadId) {
      console.error("No Lead ID found for item:", item);
      alert("Error: Could not find Lead ID. Deletion failed.");
      return;
    }

    if (!confirm(`Are you sure you want to delete this specific lead record (${targetLeadId}) for ${item.customer_name}?`)) return;
    
    try {
      // Determine the correct table based on the item stage
      const table = item.stage === "Live" ? "customers" : item.stage === "Rejected" ? "rejected_leads" : "closed_deals";
      
      // Attempt to delete. This uses lead_id to ensure the exact business record is removed
      const { error } = await supabase.from(table).delete().eq("lead_id", targetLeadId);
      
      if (error) throw error;
      
      // Update local duplicateLeads state to reflect deletion
      setDuplicateLeads(prev => prev.filter(lead => !(lead.lead_id === targetLeadId && lead.stage === item.stage)));
      
      // Also refresh the main customer table if it's currently showing that data source
      fetchCustomers(currentPage);

      logSystemEvent({
          event_type: 'WRITE',
          description: `Delete Duplicate: Record ${targetLeadId} removed from ${table} for ${item.customer_name}`,
          metadata: { lead_id: targetLeadId, table, customer_name: item.customer_name },
          payload_size: 0,
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });
      
    } catch (err: any) {
      console.error("Error deleting duplicate entry:", err);
      alert("Failed to delete entry: " + (err.message || "Unknown error"));
    }
  };

  const filteredDuplicateLeads = useMemo(() => {
    return duplicateLeads.filter(lead => {
      const matchesDisposition = !duplicateDispositionFilter || lead.disposition === duplicateDispositionFilter;
      const matchesCampaign = !duplicateCampaignFilter || (lead.campaign_name === duplicateCampaignFilter || lead.campaign_id === duplicateCampaignFilter);
      return matchesDisposition && matchesCampaign;
    });
  }, [duplicateLeads, duplicateDispositionFilter, duplicateCampaignFilter]);

  const handleDeleteMultipleDuplicates = async (items: any[]) => {
    if (items.length === 0) return;
    if (!confirm(`Are you sure you want to delete ${items.length} selected lead(s)?`)) return;
    
    setLoadingDuplicates(true);
    try {
      // Group by table stage
      const liveItems = items.filter(i => i.stage === "Live").map(i => i.lead_id);
      const rejectedItems = items.filter(i => i.stage === "Rejected").map(i => i.lead_id);
      const closedItems = items.filter(i => i.stage === "Closed").map(i => i.lead_id);

      const deletePromises = [];
      if (liveItems.length > 0) deletePromises.push(supabase.from('customers').delete().in('lead_id', liveItems));
      if (rejectedItems.length > 0) deletePromises.push(supabase.from('rejected_leads').delete().in('lead_id', rejectedItems));
      if (closedItems.length > 0) deletePromises.push(supabase.from('closed_deals').delete().in('lead_id', closedItems));

      const results = await Promise.all(deletePromises);
      const firstError = results.find(r => r.error)?.error;
      if (firstError) throw firstError;

      const deletedIds = new Set(items.map(i => i.lead_id));
      setDuplicateLeads(prev => prev.filter(l => !deletedIds.has(l.lead_id)));
      setSelectedDuplicateLeads(new Set());
      await fetchCustomers(currentPage);

      logSystemEvent({
          event_type: 'WRITE',
          description: `Bulk Delete Duplicates: ${items.length} records removed (${liveItems.length} Live, ${rejectedItems.length} Rejected, ${closedItems.length} Closed)`,
          metadata: { record_count: items.length, live_count: liveItems.length, rejected_count: rejectedItems.length, closed_count: closedItems.length },
          payload_size: estimateSize(items),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });

      alert(`Successfully deleted ${items.length} records.`);
    } catch (err: any) {
      console.error("Bulk delete error:", err);
      alert("Failed to delete records: " + (err.message || "Unknown error"));
    } finally {
      setLoadingDuplicates(false);
    }
  };


  // Filter Modal States
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterStats, setFilterStats] = useState({
    organizations: [] as any[],
    campaigns: [] as any[],
    agents: [] as any[],
    dispositions: [
      "Not Intrested",
      "Language barrier",
      "DND",
      "Wrong NO",
      "Not Contactable",
      "Call Back",
      "Deal Done",
    ],
  });

  const [filters, setFilters] = useState({
    organization: "",
    campaign: "",
    assignedTo: "",
    disposition: "",
    startDate: "",
    endDate: "",
    createdStartDate: "",
    createdEndDate: "",
  });

  // Bulk Action States
  const [showBulkActionModal, setShowBulkActionModal] = useState(false);
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);
  const [bulkUpdates, setBulkUpdates] = useState({
    organization_id: "",
    campaign_id: "",
    assigned_to: "",
    disposition: ""
  });




  // Format date safely for SSR (only format on client)
  const formatDate = (dateString: string | null | undefined) => {
    if (!mounted || !dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "N/A";
    }
  };

  const handleSourceChange = async (newSource: "live" | "rejected" | "closed") => {
    // 1. Clear "Cache" (Local State)
    setAllCustomers([]);
    setTotalCustomers(0);
    setFreshCustomersCount(0);
    setPendingFollowUps(0);
    setUpcomingFollowUps(0);
    setOverdueFollowUps(0);
    setLoadingCustomers(true);
    setSelectedCustomers(new Set());
    setFilters(prev => ({ ...prev, disposition: "" }));
    
    // 2. Update Source State
    setDataSource(newSource);
    setCurrentPage(1);
    
    // 3. Fetch Fresh Data (Pass explicitly to avoid state update delay)
    await fetchCustomers(1, newSource);
  };

  const fetchCustomers = async (page: number = currentPage, sourceOverride?: "live" | "rejected" | "closed") => {
    const activeSource = sourceOverride || dataSource;
    try {
      setLoadingCustomers(true);
      const todayISO = new Date();
      todayISO.setHours(0,0,0,0);

      const table = activeSource === "live" ? "customers" : activeSource === "rejected" ? "rejected_leads" : "closed_deals";
      const dispCol = activeSource === "closed" ? "final_disposition" : "disposition";

      // 1. Fetch Shared Team Members for TL (Re-use in all sub-queries)
      let sharedTeamMemberIds: string[] = [];
      if (user?.isClient && user.designation === 'team_leader') {
         const { data: teamData } = await supabase
           .from('teams')
           .select('members')
           .eq('leader_id', user.uid)
           .eq('is_active', true);

         if (teamData) {
           teamData.forEach(team => {
             if (Array.isArray(team.members)) {
                team.members.forEach((member: any) => {
                  if (typeof member === 'string') sharedTeamMemberIds.push(member);
                });
             } else if (typeof team.members === 'string') {
                try {
                  const parsedIds = JSON.parse(team.members);
                  if (Array.isArray(parsedIds)) parsedIds.forEach((id: any) => sharedTeamMemberIds.push(String(id))); 
                } catch (e) {}
             }
           });
         }
         sharedTeamMemberIds.push(user.uid);
         sharedTeamMemberIds = [...new Set(sharedTeamMemberIds)];
      }

      // 2. Helper function to apply user filters consistently
      const applyUserFilters = (q: any) => {
          if (user?.isClient && (user.designation === 'agent' || !user.designation)) {
              if (user.organization_id) q = q.eq('organization_id', user.organization_id);
              if (user.uid) q = q.eq(activeSource === 'live' ? 'assigned_to' : 'agent_id', user.uid);
          }
          else if (user?.isClient && user.designation === 'team_leader') {
               if (user.organization_id) q = q.eq('organization_id', user.organization_id);
               if (sharedTeamMemberIds.length > 0) q = q.in(activeSource === 'live' ? 'assigned_to' : 'agent_id', sharedTeamMemberIds);
               else q = q.eq(activeSource === 'live' ? 'assigned_to' : 'agent_id', user.uid);
          }
          else if (user?.isClient && ['ceo', 'developer', 'manager'].includes(user.designation || '')) {
              if (user.organization_id) q = q.eq('organization_id', user.organization_id);
              else q = q.eq('id', '00000000-0000-0000-0000-000000000000');
          }
          return q;
      };

      // 3. Get total count
      let countQuery = supabase.from(table).select("*", { count: "exact", head: true });
      if (searchQuery) {
        if (searchField === "name") {
          countQuery = countQuery.ilike("customer_name", `%${searchQuery}%`);
        } else {
          const cleanSearch = searchQuery.replace(/\D/g, '');
          if (cleanSearch.length > 0) {
            const hash = computePhoneHash(cleanSearch);
            if (hash) {
              countQuery = countQuery.eq("phone_search_hash", hash);
            } else {
              countQuery = countQuery.ilike("phone_no", `%${searchQuery}%`);
            }
          } else {
            countQuery = countQuery.ilike("phone_no", `%${searchQuery}%`);
          }
        }
      }
      countQuery = applyUserFilters(countQuery);
      if (filters.organization) countQuery = countQuery.eq("organization_id", filters.organization);
      if (filters.campaign) countQuery = countQuery.eq("campaign_id", filters.campaign);
      if (filters.assignedTo) {
        if (filters.assignedTo === "unassigned") countQuery = countQuery.is(activeSource === 'live' ? 'assigned_to' : 'agent_id', null);
        else countQuery = countQuery.eq(activeSource === 'live' ? 'assigned_to' : 'agent_id', filters.assignedTo);
      }
      if (filters.disposition) countQuery = countQuery.eq(dispCol, filters.disposition);
      
      const dateField = "expiry_date";
      if (filters.startDate) countQuery = countQuery.gte(dateField, `${filters.startDate}T00:00:00`);
      if (filters.endDate) countQuery = countQuery.lte(dateField, `${filters.endDate}T23:59:59`);
      
      const lifecycleDateField = activeSource === "rejected" ? "rejected_at" : activeSource === "closed" ? "closed_at" : "created_at";
      if (filters.createdStartDate) countQuery = countQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
      if (filters.createdEndDate) countQuery = countQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);


      const { count, error: countError } = await countQuery;
      if (countError) console.error("Error fetching customer count:", countError);
      else setTotalCustomers(count || 0);

      try {
        let pendingQuery = supabase.from(table).select("*", { count: "exact", head: true }).eq(dispCol, "Call Back");
        pendingQuery = applyUserFilters(pendingQuery);

        let overdueQuery = supabase.from(table).select("*", { count: "exact", head: true })
          .eq(dispCol, "Call Back")
          .lt("updated_at", todayISO.toISOString());
        overdueQuery = applyUserFilters(overdueQuery);

        let freshCountQuery = supabase.from(table).select("*", { count: "exact", head: true });
        if (activeSource === 'live') {
            freshCountQuery = freshCountQuery.eq("attempt_count", 0).is(dispCol, null);
        } else {
            freshCountQuery = freshCountQuery.eq('id', '00000000-0000-0000-0000-000000000000');
        }
        freshCountQuery = applyUserFilters(freshCountQuery);

        if (filters.organization) {
            pendingQuery = pendingQuery.eq("organization_id", filters.organization);
            overdueQuery = overdueQuery.eq("organization_id", filters.organization);
            freshCountQuery = freshCountQuery.eq("organization_id", filters.organization);
        }
        if (filters.campaign) {
            pendingQuery = pendingQuery.eq("campaign_id", filters.campaign);
            overdueQuery = overdueQuery.eq("campaign_id", filters.campaign);
            freshCountQuery = freshCountQuery.eq("campaign_id", filters.campaign);
        }
        if (filters.assignedTo) {
            const agentCol = activeSource === 'live' ? 'assigned_to' : 'agent_id';
            if (filters.assignedTo === "unassigned") {
                pendingQuery = pendingQuery.is(agentCol, null);
                overdueQuery = overdueQuery.is(agentCol, null);
                freshCountQuery = freshCountQuery.is(agentCol, null);
            } else {
                pendingQuery = pendingQuery.eq(agentCol, filters.assignedTo);
                overdueQuery = overdueQuery.eq(agentCol, filters.assignedTo);
                freshCountQuery = freshCountQuery.eq(agentCol, filters.assignedTo);
            }
        }

        if (filters.startDate) {
            pendingQuery = pendingQuery.gte(dateField, `${filters.startDate}T00:00:00`);
            overdueQuery = overdueQuery.gte(dateField, `${filters.startDate}T00:00:00`);
            freshCountQuery = freshCountQuery.gte(dateField, `${filters.startDate}T00:00:00`);
        }
        if (filters.endDate) {
            pendingQuery = pendingQuery.lte(dateField, `${filters.endDate}T23:59:59`);
            overdueQuery = overdueQuery.lte(dateField, `${filters.endDate}T23:59:59`);
            freshCountQuery = freshCountQuery.lte(dateField, `${filters.endDate}T23:59:59`);
        }
        
        if (filters.createdStartDate) {
            pendingQuery = pendingQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
            overdueQuery = overdueQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
            freshCountQuery = freshCountQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
        }
        if (filters.createdEndDate) {
            pendingQuery = pendingQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
            overdueQuery = overdueQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
            freshCountQuery = freshCountQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
        }

        if (activeSource === "closed") {
            setPendingFollowUps(0);
            setOverdueFollowUps(0);
            setUpcomingFollowUps(0);
            setFreshCustomersCount(0);
        } else {
            const [pStats, oStats, fStats] = await Promise.all([pendingQuery, overdueQuery, freshCountQuery]);
            setPendingFollowUps(pStats.count || 0);
            setOverdueFollowUps(oStats.count || 0);
            setUpcomingFollowUps((pStats.count || 0) - (oStats.count || 0));
            setFreshCustomersCount(fStats.count || 0);
        }
      } catch (statsErr) {
        console.warn("Follow-up/Fresh stats failed to load:", statsErr);
      }

      // 5. Fetch Main Data
      const orderCol = activeSource === "rejected" ? "rejected_at" : activeSource === "closed" ? "closed_at" : "created_at";
      let query = supabase.from(table).select("*")
        .order(orderCol, { ascending: false });

      if (searchQuery) {
        if (searchField === "name") {
          query = query.ilike("customer_name", `%${searchQuery}%`);
        } else {
          const cleanSearch = searchQuery.replace(/\D/g, '');
          if (cleanSearch.length > 0) {
            const hash = computePhoneHash(cleanSearch);
            if (hash) {
              query = query.eq("phone_search_hash", hash);
            } else {
              query = query.ilike("phone_no", `%${searchQuery}%`);
            }
          } else {
            query = query.ilike("phone_no", `%${searchQuery}%`);
          }
        }
      }
      query = applyUserFilters(query);
      if (filters.organization) query = query.eq("organization_id", filters.organization);
      if (filters.campaign) query = query.eq("campaign_id", filters.campaign);
      if (filters.assignedTo) {
        if (filters.assignedTo === "unassigned") query = query.is(activeSource === 'live' ? 'assigned_to' : 'agent_id', null);
        else query = query.eq(activeSource === 'live' ? 'assigned_to' : 'agent_id', filters.assignedTo);
      }
      if (filters.disposition) query = query.eq(dispCol, filters.disposition);
      
      if (filters.startDate) query = query.gte(dateField, `${filters.startDate}T00:00:00`);
      if (filters.endDate) query = query.lte(dateField, `${filters.endDate}T23:59:59`);
      
      if (filters.createdStartDate) query = query.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
      if (filters.createdEndDate) query = query.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);


      let data: any[] | null = null;
      let error: any = null;

      if (pageSize === "all") {
        let allData: any[] = [];
        let hasMore = true;
        let pageIndex = 0;
        const batchSize = 1000;
        while (hasMore) {
            let batchQuery = supabase.from(table).select("*")
                .order(orderCol, { ascending: false });
            if (searchQuery) {
                if (searchField === "name") {
                    batchQuery = batchQuery.ilike("customer_name", `%${searchQuery}%`);
                } else {
                    const cleanSearch = searchQuery.replace(/\D/g, '');
                    if (cleanSearch.length > 0) {
                        const hash = computePhoneHash(cleanSearch);
                        if (hash) {
                            batchQuery = batchQuery.eq("phone_search_hash", hash);
                        } else {
                            batchQuery = batchQuery.ilike("phone_no", `%${searchQuery}%`);
                        }
                    } else {
                        batchQuery = batchQuery.ilike("phone_no", `%${searchQuery}%`);
                    }
                }
            }
            batchQuery = applyUserFilters(batchQuery);
            if (filters.organization) batchQuery = batchQuery.eq("organization_id", filters.organization);
            if (filters.campaign) batchQuery = batchQuery.eq("campaign_id", filters.campaign);
            if (filters.assignedTo) {
                if (filters.assignedTo === "unassigned") batchQuery = batchQuery.is(activeSource === 'live' ? 'assigned_to' : 'agent_id', null);
                else batchQuery = batchQuery.eq(activeSource === 'live' ? 'assigned_to' : 'agent_id', filters.assignedTo);
            }
            if (filters.disposition) batchQuery = batchQuery.eq(dispCol, filters.disposition);
            
            if (filters.startDate) batchQuery = batchQuery.gte(dateField, `${filters.startDate}T00:00:00`);
            if (filters.endDate) batchQuery = batchQuery.lte(dateField, `${filters.endDate}T23:59:59`);
            
            if (filters.createdStartDate) batchQuery = batchQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
            if (filters.createdEndDate) batchQuery = batchQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);


            const { data: batch, error: batchError } = await batchQuery.range(pageIndex * batchSize, (pageIndex + 1) * batchSize - 1);
            if (batchError) { error = batchError; break; }
            if (batch && batch.length > 0) {
                allData = [...allData, ...batch];
                if (batch.length < batchSize) hasMore = false;
                pageIndex++;
            } else { hasMore = false; }
        }
        data = allData;
      } else {
        const offset = (page - 1) * pageSize;
        const { data: pagedData, error: pagedError } = await query.range(offset, offset + pageSize - 1);
        data = pagedData;
        error = pagedError;
      }

      if (error) {
        console.error("Error fetching customers:", error);
        setAllCustomers([]);
      } else {
        // Fetch related data
        const allUserIds = [...new Set((data || []).flatMap((c: any) => [c.assigned_to || c.agent_id, c.managed_by]).filter(id => id))];
        let userMap: Record<string, { user_name: string | null; employee_id: string | null }> = {};
        if (allUserIds.length > 0) {
          const { data: userData } = await supabase.from("user_profiles").select("user_id, id, user_name, employee_id")
            .or(`user_id.in.("${allUserIds.join('","')}"),id.in.("${allUserIds.join('","')}")`);
          if (userData) {
            userData.forEach(u => {
                const info = { user_name: u.user_name, employee_id: u.employee_id };
                userMap[u.user_id] = info;
                userMap[u.id] = info;
            });
          }
        }

        const campaignIds = [...new Set((data || []).map((c: any) => c.campaign_id).filter(id => id))];
        let campaignMap: Record<string, string> = {};
        if (campaignIds.length > 0) {
          const { data: cData } = await supabase.from("campaigns").select("id, name").in("id", campaignIds);
          if (cData) cData.forEach(c => { campaignMap[c.id] = c.name; });
        }

        const orgIds = [...new Set((data || []).map((c: any) => c.organization_id).filter(id => id))];
        let orgMap: Record<string, string> = {};
        if (orgIds.length > 0) {
          const { data: oData } = await supabase.from("organizations").select("id, company_name").in("id", orgIds);
          if (oData) oData.forEach(o => { orgMap[o.id] = o.company_name; });
        }

        // Map data
        const mappedData = (data || []).map((customer: any) => ({
          ...customer,
          assigned_to: customer.assigned_to || customer.agent_id,
          disposition: customer.disposition || customer.final_disposition || (activeSource === 'closed' ? 'Deal Done' : null),
          assigned_user_name: userMap[customer.assigned_to || customer.agent_id]?.user_name || null,
          assigned_employee_id: userMap[customer.assigned_to || customer.agent_id]?.employee_id || null,
          managed_by_name: customer.managed_by ? userMap[customer.managed_by]?.user_name || "Unknown" : "Self",
          managed_by_id: customer.managed_by ? userMap[customer.managed_by]?.employee_id || customer.managed_by.slice(0, 8).toUpperCase() : null,
          campaign_name: customer.campaign_id ? campaignMap[customer.campaign_id] || null : null,
          organization_name: customer.organization_id ? orgMap[customer.organization_id] || null : null,
        }));
        setAllCustomers(mappedData);
      }
    } catch (err) {
      console.error("Critical error in fetchCustomers:", err);
      setAllCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };

  // Initial fetch on mount or user change - but restricted to prevent focus/tab-switch loops
  useEffect(() => {
    if ((user || userLoaded) && mounted) {
      // Only trigger if we don't have customers yet or it's the first stable mount
      if (allCustomers.length === 0) {
        setCurrentPage(1);
        fetchCustomers(1);
        fetchFilterMetadata();
      }
      setSelectedCustomers(new Set());
      setSearchQuery("");
      setTempSearchQuery("");

      // Initialize filters for clients
      if (user?.isClient && user.organization_id) {
        setFilters(prev => ({ ...prev, organization: user.organization_id || "" }));
        setBulkUpdates(prev => ({ ...prev, organization_id: user.organization_id || "" }));
      }
    }
  }, [user?.uid, userLoaded, mounted]); // Dependency on user?.uid is more stable than the whole user object


  const fetchFilterMetadata = async () => {
    try {
      let orgQuery = supabase.from("organizations").select("id, company_name").order("company_name");
      let campQuery = supabase.from("campaigns").select("id, name, organization_id, users").order("name");
      let agentQuery = supabase.from("user_profiles").select("id, user_id, user_name, organization_id").order("user_name");

      if (user?.isClient) {
        if (user.organization_id) {
          orgQuery = orgQuery.eq('id', user.organization_id);
          campQuery = campQuery.eq('organization_id', user.organization_id);
          agentQuery = agentQuery.eq('organization_id', user.organization_id);
        } else {
          orgQuery = orgQuery.eq('id', '00000000-0000-0000-0000-000000000000');
          campQuery = campQuery.eq('id', '00000000-0000-0000-0000-000000000000');
          agentQuery = agentQuery.eq('id', '00000000-0000-0000-0000-000000000000');
        }
      }
      const [{ data: orgs }, { data: camps }, { data: agents }] = await Promise.all([orgQuery, campQuery, agentQuery]);
      setFilterStats(prev => ({ ...prev, organizations: orgs || [], campaigns: camps || [], agents: agents || [] }));
    } catch (err) { console.error("Error fetching filter metadata:", err); }
  };

  const handleBulkUpdate = async (updates: Record<string, any>) => {
    if (!selectedCustomers.size || Object.keys(updates).length === 0) return;
    
    setIsUpdatingBulk(true);
    try {
      const ids = Array.from(selectedCustomers);

      // Check for special "Move Fresh" action
      if (updates.action === "Move Fresh") {
        const { error: resetError } = await supabase
          .from("customers")
          .update({
            disposition: null,
            sub_disposition: null,
            assigned_to: null,
            status: "active",
            last_called_at: null,
            last_updated_by: null,
            is_connected: null,
            attempt_count: 0,
            last_attempt_at: null,
            managed_by: null
          })
          .in("id", ids);

        if (resetError) throw resetError;
      } else {
        // Check for Rejected Disposition move
        const rejectedValue = updates.disposition;
        if (rejectedValue && ["Wrong NO", "DND", "Language barrier"].includes(rejectedValue)) {
          // 1. Fetch the leads first to move them
          const { data: leads, error: fetchError } = await supabase
            .from("customers")
            .select("*")
            .in("id", ids);

          if (fetchError) throw fetchError;

          if (leads && leads.length > 0) {
            const rejectedLeads = leads.map(lead => ({
              customer_id: lead.id,
              customer_name: lead.customer_name,
              phone_no: lead.phone_no,
              phone_search_hash: lead.phone_search_hash || computePhoneHash(decryptPhone(lead.phone_no)),
              campaign_id: updates.campaign_id || lead.campaign_id,
              disposition: updates.disposition || lead.disposition,
              sub_disposition: lead.sub_disposition,
              agent_id: updates.assigned_to || lead.assigned_to,
              rejected_at: new Date().toISOString(),
              managed_by: lead.managed_by,
              organization_id: updates.organization_id || lead.organization_id
            }));

            // 2. Insert into rejected
            const { error: insertError } = await supabase
              .from("rejected_leads")
              .insert(rejectedLeads);

            if (insertError) throw insertError;

            // 3. Delete from customers
            const { error: deleteError } = await supabase
              .from("customers")
              .delete()
              .in("id", ids);

            if (deleteError) throw deleteError;
          }
        } else {
          // Standard bulk update for any fields provided
          const { error } = await supabase
            .from("customers")
            .update(updates)
            .in("id", ids);

          if (error) throw error;
        }
      }

      setSelectedCustomers(new Set());
      await fetchCustomers(currentPage);

      logSystemEvent({
          event_type: 'WRITE',
          description: `Bulk Update: Applied changes ${JSON.stringify(updates)} to ${ids.length} records.`,
          metadata: { updates, record_count: ids.length },
          payload_size: estimateSize({ updates, ids }),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });
      
      setShowBulkActionModal(false);
      setBulkUpdates({
        organization_id: "",
        campaign_id: "",
        assigned_to: "",
        disposition: ""
      });
    } catch (err) {
      console.error("Error updating customers:", err);
      alert("Failed to update customers. Please try again.");
    } finally {
      setIsUpdatingBulk(false);
    }
  };

  const [isMovingToLive, setIsMovingToLive] = useState(false);

  const handleMoveToLive = async () => {
    if (!selectedCustomers.size || dataSource !== 'rejected') return;
    
    setIsMovingToLive(true);
    try {
      const ids = Array.from(selectedCustomers);

      // 1. Fetch from rejected_leads
      const { data: rejectedLeads, error: fetchError } = await supabase
        .from("rejected_leads")
        .select("*")
        .in("id", ids);

      if (fetchError) throw fetchError;

      if (rejectedLeads && rejectedLeads.length > 0) {
        // 2. Map back to customers - Moving all common fields as-is
        const liveCustomers = rejectedLeads.map(lead => {
          // Destructure to separate specific transformations from common fields
          const { 
            id, // PK of rejected_leads (not needed in customers)
            customer_id, // Original ID from customers table
            agent_id, // Needs to be mapped to assigned_to
            rejected_at, // Not present in customers table
            status, // Will be forced to 'active'
            idx, // Auto-increment (not needed)
            ...commonFields 
          } = lead;

          return {
            ...commonFields,
            id: customer_id,
            assigned_to: agent_id,
            status: "active",
            updated_at: new Date().toISOString()
          };
        });

        // 3. Insert into customers
        const { error: insertError } = await supabase
          .from("customers")
          .upsert(liveCustomers); // Use upsert in case the record somehow exists

        if (insertError) throw insertError;

        // 4. Delete from rejected_leads
        const { error: deleteError } = await supabase
          .from("rejected_leads")
          .delete()
          .in("id", ids);

        if (deleteError) throw deleteError;
      }

      setSelectedCustomers(new Set());
      await fetchCustomers(currentPage);
      
      logSystemEvent({
          event_type: 'WRITE',
          description: `Move to Live: ${rejectedLeads?.length || 0} records restored from rejected_leads`,
          metadata: { record_count: rejectedLeads?.length || 0, source: 'rejected_leads', target: 'customers' },
          payload_size: estimateSize(rejectedLeads),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });

      alert(`Successfully moved ${rejectedLeads?.length} lead(s) back to Live.`);
    } catch (err) {
      console.error("Error moving to live:", err);
      alert("Failed to move leads back to live. Please try again.");
    } finally {
      setIsMovingToLive(false);
    }
  };

  const handleExportCustomers = async () => {
    if (allCustomers.length === 0) {
      alert("No customers to export.");
      return;
    }

    try {
      // Create CSV content
      const headers = ["Lead ID", "Name", "Phone", "Organization", "Campaign", "Assigned To", "Disposition", "Created At"];
      const csvData = allCustomers.map(customer => [
        `"${customer.lead_id || ''}"`,
        `"${customer.customer_name || ''}"`,
        `"${customer.phone_no || ''}"`,
        `"${customer.organization_name || ''}"`,
        `"${customer.campaign_name || ''}"`,
        `"${customer.assigned_user_name || ''}"`,
        `"${customer.disposition || ''}"`,
        `"${customer.created_at || ''}"`
      ]);

      const csvContent = [headers, ...csvData].map(e => e.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      logSystemEvent({
          event_type: 'READ',
          description: `Export Customers: ${allCustomers.length} records exported to CSV`,
          metadata: { record_count: allCustomers.length, format: 'csv' },
          payload_size: estimateSize(allCustomers),
          user_name: user?.displayName || 'Admin',
          organization_id: user?.organization_id || undefined
      });

    } catch (err) {
      console.error("Error exporting customers:", err);
      alert("Failed to export customers. Please try again.");
    }
  };

  // Fetch customers when page size changes
  useEffect(() => {
    if (mounted) {
      setCurrentPage(1); // Reset to page 1 when page size changes
      fetchCustomers(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize]);

  // Fetch customers when search query changes
  useEffect(() => {
    if (mounted) {
      setCurrentPage(1);
      fetchCustomers(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Reset search immediately if tempSearchQuery is cleared
  useEffect(() => {
    if (tempSearchQuery === "") {
      setSearchQuery("");
      setCurrentPage(1);
    }
  }, [tempSearchQuery]);

  // Fetch customers when page changes (only if not showing all)
  useEffect(() => {
    if (mounted && pageSize !== "all") {
      fetchCustomers(currentPage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // Use allCustomers directly since it is now filtered by the API
  const filteredCustomers = allCustomers;

  // Calculate pagination
  const effectivePageSize = pageSize === "all" ? totalCustomers : pageSize;
  const totalPages =
    pageSize === "all" ? 1 : Math.ceil(totalCustomers / pageSize);
  const startIndex = pageSize === "all" ? 1 : (currentPage - 1) * pageSize + 1;
  const endIndex =
    pageSize === "all"
      ? totalCustomers
      : Math.min(currentPage * pageSize, totalCustomers);





  return (
    <>
      <Head>
        <title>Customers | TFC Connect</title>
      </Head>

        {/* Main Content */}

          <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl">
            <div className="space-y-6 sm:space-y-8">
              {/* Page Header */}
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h1
                    className="text-xl sm:text-2xl md:text-3xl font-bold mb-2"
                    style={{
                      color: "#263238",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Customers
                  </h1>
                  <p
                    className="text-sm sm:text-base"
                    style={{
                      color: "#787E9D",
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    View and manage all customers in the system
                  </p>
                </div>

                {/* Data Source Toggle */}
                <div className="bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-xl gap-2 flex items-center md:min-w-[300px]">
                  <button
                    onClick={() => handleSourceChange("live")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 md:px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                      dataSource === "live"
                        ? "bg-white text-[#4b33e8] scale-[1.02] shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }`}
                  >
                    <i className={`fi text-base flex ${dataSource === "live" ? "fi-sr-bolt" : "fi-rr-bolt"}`}></i>
                    <span className="hidden md:inline">Live</span>
                  </button>
                  <button
                    onClick={() => handleSourceChange("rejected")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 md:px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                      dataSource === "rejected"
                        ? "bg-white text-rose-600 scale-[1.02] shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }`}
                  >
                    <i className={`fi text-base flex ${dataSource === "rejected" ? "fi-sr-cross-circle" : "fi-rr-cross-circle"}`}></i>
                    <span className="hidden md:inline">Rejected</span>
                  </button>
                  <button
                    onClick={() => handleSourceChange("closed")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 md:px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                      dataSource === "closed"
                        ? "bg-white text-emerald-600 scale-[1.02] shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }`}
                  >
                    <i className={`fi text-base flex ${dataSource === "closed" ? "fi-sr-check-circle" : "fi-rr-check-circle"}`}></i>
                    <span className="hidden md:inline">Closed</span>
                  </button>
                </div>
              </div>

              {/* 4 Tiles Grid - 3 Main Tiles + 1 Container with 2 Sub-tiles (hidden border) */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                {/* Tile 1: Total Customer */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(75, 51, 232, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-100/30 blur-2xl" />
                  {/* Decorative Graphics */}
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-purple-300/15 blur-lg" />
                  {/* Background Icon */}
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-users text-5xl sm:text-6xl"
                      style={{ color: "#4b33e8" }}
                    ></i>
                  </div>
                  {/* Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Total Customer
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-users text-lg sm:text-xl"
                          style={{ color: "#4b33e8" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {totalCustomers}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Total customers
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tile 2: Fresh Customers */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md"
                  style={{ backgroundColor: "white" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 60%)",
                    }}
                  />
                  <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-green-100/30 blur-2xl" />
                  {/* Decorative Graphics */}
                  <div className="absolute top-0 left-0 w-32 h-32 rounded-full bg-green-200/20 blur-xl" />
                  <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-green-300/15 blur-lg" />
                  {/* Background Icon */}
                  <div className="absolute -right-2 -bottom-2 opacity-5">
                    <i
                      className="fi flex fi-rr-user-add text-5xl sm:text-6xl"
                      style={{ color: "#10b981" }}
                    ></i>
                  </div>
                  {/* Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, #10b981 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Fresh Customers
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: "transparent",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-user-add text-lg sm:text-xl"
                          style={{ color: "#10b981" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {freshCustomersCount}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Unassigned leads
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tile 3: Follow ups */}
                <div
                  className="relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 backdrop-blur flex flex-col text-white hover:shadow-md"
                  style={{ backgroundColor: "#4b33e8" }}
                >
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 55%)",
                    }}
                  />
                  <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                  {/* Decorative Graphics */}
                  <div className="absolute top-4 left-4 w-24 h-24 rounded-full bg-white/5 blur-xl" />
                  <div className="absolute top-12 right-12 w-20 h-20 rounded-full bg-white/8 blur-lg" />
                  {/* Background Icon */}
                  <div className="absolute -right-2 -bottom-2 opacity-10">
                    <i className="fi flex fi-rr-calendar-check text-5xl sm:text-6xl text-white"></i>
                  </div>
                  {/* Pattern Overlay */}
                  <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                      backgroundSize: "25px 25px",
                    }}
                  />
                  <div className="relative flex flex-col h-full z-10">
                    <div className="flex items-start justify-between mb-auto">
                      <p
                        className="text-xs sm:text-sm font-medium"
                        style={{
                          color: "#ffffff",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Follow ups
                      </p>
                      <div
                        className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-lg"
                        style={{
                          color: "#ffffff",
                        }}
                      >
                        <i
                          className="fi flex fi-rr-calendar-check text-lg sm:text-xl"
                          style={{ color: "#ffffff" }}
                        ></i>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <p
                        className="text-3xl sm:text-4xl font-semibold"
                        style={{
                          color: "#ffffff",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {pendingFollowUps}
                      </p>
                      <p
                        className="text-xs sm:text-sm mt-1"
                        style={{
                          color: "rgba(255, 255, 255, 0.8)",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Pending follow ups
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tile 4: Container with 2 Sub-tiles (hidden outer border) */}
                <div
                  className="relative p-0 flex flex-col overflow-hidden"
                  style={{ backgroundColor: "transparent", border: "none" }}
                >
                  <div className="flex flex-col gap-3 h-full">
                    {/* Sub-tile 1: Upcoming follow ups */}
                    <div
                      className="relative overflow-hidden flex-1 rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)",
                        }}
                      />
                      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                      {/* Decorative Graphics */}
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/6 blur-md" />
                      {/* Background Icon */}
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-clock text-3xl text-white"></i>
                      </div>
                      {/* Pattern Overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex items-start justify-between z-10">
                        <div className="flex-1">
                          <p
                            className="text-xs font-medium mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Upcoming follow ups
                          </p>
                          <p
                            className="text-xl font-bold"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {upcomingFollowUps}
                          </p>
                        </div>
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: "transparent",
                          }}
                        >
                          <i
                            className="fi flex fi-rr-clock text-sm"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                      </div>
                    </div>

                    {/* Sub-tile 2: Overdue follow ups */}
                    <div
                      className="relative overflow-hidden flex-1 rounded-xl p-3 transition-shadow duration-200 hover:shadow-md"
                      style={{
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)",
                        }}
                      />
                      <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                      {/* Decorative Graphics */}
                      <div className="absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg" />
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/6 blur-md" />
                      {/* Background Icon */}
                      <div className="absolute -right-1 -bottom-1 opacity-10">
                        <i className="fi flex fi-rr-clock text-3xl text-white"></i>
                      </div>
                      {/* Pattern Overlay */}
                      <div
                        className="absolute inset-0 opacity-[0.08]"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                          backgroundSize: "15px 15px",
                        }}
                      />
                      <div className="relative flex items-start justify-between z-10">
                        <div className="flex-1">
                          <p
                            className="text-xs font-medium mb-1"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Roboto', sans-serif",
                            }}
                          >
                            Overdue follow ups
                          </p>
                          <p
                            className="text-xl font-bold"
                            style={{
                              color: "#ffffff",
                              fontFamily: "'Poppins', sans-serif",
                            }}
                          >
                            {overdueFollowUps}
                          </p>
                        </div>
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor: "transparent",
                          }}
                        >
                          <i
                            className="fi flex fi-rr-clock text-sm"
                            style={{ color: "#ffffff" }}
                          ></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Customers Table Section */}
              <div className="mt-8">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                  {/* Mobile: Table Header */}
                  <div className="mb-4 sm:hidden">
                    <h2
                      className="text-lg font-bold mb-1"
                      style={{
                        color: "#263238",
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      All Customers
                      {selectedCustomers.size > 0 && (
                        <span className="ml-2 bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-300 align-middle">
                          {selectedCustomers.size} SELECTED
                        </span>
                      )}
                    </h2>
                    <p
                      className="text-xs"
                      style={{
                        color: "#787E9D",
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      Manage and view all your customers
                    </p>
                  </div>

                  {/* Mobile: Search Bar (Full Width) */}
                  {!selectedCustomers.size && (
                    <div className="mb-4 sm:hidden">
                      <div className="flex gap-2 w-full">
                        <div className="relative flex-1">
                          <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                          <input
                            type="text"
                            placeholder={searchField === 'name' ? "Search by Name..." : "Search by Phone..."}
                            value={tempSearchQuery}
                            onChange={(e) => setTempSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearchQuery)}
                            className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                          />
                          <button 
                            onClick={() => setShowSearchFieldDropdown(!showSearchFieldDropdown)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all active:scale-90 border border-gray-100"
                            title="Change search field"
                          >
                            <i className={`fi flex ${searchField === 'name' ? 'fi-rr-user' : 'fi-rr-phone-call'} text-[10px]`}></i>
                          </button>

                          {showSearchFieldDropdown && (
                            <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              <button
                                onClick={() => { setSearchField("name"); setShowSearchFieldDropdown(false); }}
                                className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors flex items-center gap-2 ${searchField === 'name' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                              >
                                <i className="fi flex fi-rr-user text-[10px]"></i>
                                NAME
                              </button>
                              <button
                                onClick={() => { setSearchField("phone"); setShowSearchFieldDropdown(false); }}
                                className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors flex items-center gap-2 ${searchField === 'phone' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                              >
                                <i className="fi flex fi-rr-phone-call text-[10px]"></i>
                                PHONE
                              </button>
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => setSearchQuery(tempSearchQuery)}
                          className="px-4 bg-[#4b33e8] text-white rounded-lg text-sm font-bold flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                        >
                          Search
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mobile: Action Buttons (Below Search) */}
                  <div className="mb-4 sm:hidden flex flex-wrap items-center gap-2">
                    {/* Bulk Action Buttons */}
                    {selectedCustomers.size > 0 && (
                      <>
                        {dataSource !== 'rejected' && (
                          <>
                          <>
                            <button
                              onClick={() => setShowBulkActionModal(true)}
                              className="h-10 px-4 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 gap-2 shadow-sm shadow-indigo-100"
                              title="Bulk Actions"
                            >
                              <i className="fi flex fi-rr-menu-dots-vertical text-sm"></i>
                              <span className="text-xs font-bold uppercase tracking-wider">Actions ({selectedCustomers.size})</span>
                            </button>
                          </>
                          </>
                        )}
                      </>
                    )}
                      {/* Move to Live Button - Only for Rejected Data source */}
                      {selectedCustomers.size > 0 && dataSource === 'rejected' && (
                        <button
                          onClick={handleMoveToLive}
                          disabled={isMovingToLive}
                          className="h-10 px-3 border border-emerald-200 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center text-emerald-600 gap-1.5"
                          title="Move to Live"
                        >
                          {isMovingToLive ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"></div>
                          ) : (
                            <>
                              <i className="fi flex fi-rr-redo text-sm"></i>
                              <span className="text-[10px] font-bold">LIVE</span>
                            </>
                          )}
                        </button>
                      )}
                    {/* Delete Button - Show when customers are selected */}
                    {selectedCustomers.size > 0 && permissionFlags.isDeleteButtonVisible && (
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              `Are you sure you want to delete ${selectedCustomers.size} customer(s)?`
                            )
                          ) {
                            setIsDeleting(true);
                            try {
                              const customerIds = Array.from(selectedCustomers);

                              // Delete in batches of 50 to avoid URL length and query limits
                              const batchSize = 50;
                              let successCount = 0;
                              let failCount = 0;
                              const errors: string[] = [];

                              for (
                                let i = 0;
                                i < customerIds.length;
                                i += batchSize
                              ) {
                                const batch = customerIds.slice(
                                  i,
                                  i + batchSize
                                );
                                const table = dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals";
                                const { error } = await supabase
                                  .from(table)
                                  .delete()
                                  .in("id", batch);

                                if (error) {
                                  console.error(
                                    `Error deleting batch ${Math.floor(i / batchSize) + 1
                                    }:`,
                                    error
                                  );
                                  failCount += batch.length;
                                  errors.push(
                                    `Batch ${Math.floor(i / batchSize) + 1}: ${error.message
                                    }`
                                  );
                                } else {
                                  successCount += batch.length;
                                }
                              }

                              if (failCount > 0) {
                                alert(
                                  `Deleted ${successCount} customer(s). ${failCount} failed. ${errors
                                    .slice(0, 2)
                                    .join("; ")}`
                                );
                                } else {
                                  // All successful
                                  setSelectedCustomers(new Set());
                                  await fetchCustomers(currentPage);

                                  logSystemEvent({
                                      event_type: 'WRITE',
                                      description: `Bulk Delete: ${customerIds.length} records removed from ${dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals"} (Mobile View)`,
                                      metadata: { record_count: customerIds.length },
                                      payload_size: estimateSize(customerIds),
                                      user_name: user?.displayName || 'Admin',
                                      organization_id: user?.organization_id || undefined
                                  });
                                }
                            } catch (err) {
                              console.error("Error deleting customers:", err);
                              alert(
                                "Failed to delete customers. Please try again."
                              );
                            } finally {
                              setIsDeleting(false);
                            }
                          }
                        }}
                        disabled={isDeleting}
                        className="h-10 px-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center text-red-600"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {isDeleting ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                        ) : (
                          <i className="fi flex fi-rr-trash text-sm"></i>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => fetchCustomers(currentPage)}
                      className={`h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 ${loadingCustomers ? 'opacity-50' : ''}`}
                      title="Refresh Data"
                      disabled={loadingCustomers}
                    >
                      <i className={`fi flex fi-rr-refresh text-sm ${loadingCustomers ? 'animate-spin' : ''}`}></i>
                    </button>
                    {/* Filter Button */}
                    <button
                      onClick={() => setShowFilterModal(true)}
                      className={`h-10 px-3 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        Object.values(filters).some(v => v) 
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600" 
                        : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                      }`}
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      <i className="fi flex fi-rr-filter text-sm"></i>
                      {Object.values(filters).some(v => v) && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                      )}
                    </button>
                    {/* Import Button */}
                    {permissionFlags.isImportButtonVisible && (
                    <button
                      onClick={() => setShowImportModal(true)}
                      className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      <i className="fi flex fi-rr-upload text-sm text-gray-600"></i>
                    </button>
                    )}
                    {/* Export Button */}
                    {permissionFlags.isExportButtonVisible && (
                    <button
                      onClick={handleExportCustomers}
                      className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                      title="Export Data"
                    >
                      <i className="fi flex fi-rr-download text-sm text-gray-600"></i>
                    </button>
                    )}
                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 h-10">
                      <button
                        onClick={() => setViewType("list")}
                        className={`px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "list"
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                          }`}
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-list"></i>
                      </button>
                      <button
                        onClick={() => setViewType("grid")}
                        className={`px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "grid"
                          ? "bg-white text-purple-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                          }`}
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-grid"></i>
                      </button>
                    </div>
                    {/* Add Customer Button */}
                    {permissionFlags.isAddCustomerButtonVisible && (
                    <button
                      onClick={() => setShowAddCustomerModal(true)}
                      className="h-10 w-10 rounded-lg transition-colors flex items-center justify-center hover:opacity-90"
                      style={{
                        fontFamily: "'Roboto', sans-serif",
                        backgroundColor: "#4b33e8",
                      }}
                    >
                      <i className="fi flex fi-rr-user-add text-sm text-white"></i>
                    </button>
                    )}
                  </div>

                  {/* Desktop: Title and Search/Actions in Same Row */}
                  <div className="hidden sm:flex sm:items-center sm:justify-between mb-6">
                    <div>
                      <h2
                        className="text-xl font-bold mb-1"
                        style={{
                          color: "#263238",
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        All Customers
                        {selectedCustomers.size > 0 && (
                          <span className="ml-2 bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-300 align-middle">
                            {selectedCustomers.size} SELECTED
                          </span>
                        )}
                      </h2>
                      <p
                        className="text-sm"
                        style={{
                          color: "#787E9D",
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        Manage and view all your customers
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {/* Delete Button - Show when customers are selected */}
                      {selectedCustomers.size > 0 && permissionFlags.isDeleteButtonVisible && (
                        <button
                          onClick={async () => {
                            if (
                              confirm(
                                `Are you sure you want to delete ${selectedCustomers.size} customer(s)?`
                              )
                            ) {
                              setIsDeleting(true);
                              try {
                                const customerIds =
                                  Array.from(selectedCustomers);

                                // Delete in batches of 50 to avoid URL length and query limits
                                const batchSize = 50;
                                let successCount = 0;
                                let failCount = 0;
                                const errors: string[] = [];

                                for (
                                  let i = 0;
                                  i < customerIds.length;
                                  i += batchSize
                                ) {
                                  const batch = customerIds.slice(
                                    i,
                                    i + batchSize
                                  );
                                  const table = dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals";
                                  const { error } = await supabase
                                    .from(table)
                                    .delete()
                                    .in("id", batch);

                                  if (error) {
                                    console.error(
                                      `Error deleting batch ${Math.floor(i / batchSize) + 1
                                      }:`,
                                      error
                                    );
                                    failCount += batch.length;
                                    errors.push(
                                      `Batch ${Math.floor(i / batchSize) + 1
                                      }: ${error.message}`
                                    );
                                  } else {
                                    successCount += batch.length;
                                  }
                                }

                                if (failCount > 0) {
                                  alert(
                                    `Deleted ${successCount} customer(s). ${failCount} failed. ${errors
                                      .slice(0, 2)
                                      .join("; ")}`
                                  );
                                  } else {
                                    // All successful
                                    setSelectedCustomers(new Set());
                                    await fetchCustomers(currentPage);

                                    logSystemEvent({
                                        event_type: 'WRITE',
                                        description: `Bulk Delete: ${customerIds.length} records removed from ${dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals"} (Desktop View)`,
                                        metadata: { record_count: customerIds.length },
                                        payload_size: estimateSize(customerIds),
                                        user_name: user?.displayName || 'Admin',
                                        organization_id: user?.organization_id || undefined
                                    });
                                  }
                              } catch (err) {
                                console.error("Error deleting customers:", err);
                                alert(
                                  "Failed to delete customers. Please try again."
                                );
                              } finally {
                                setIsDeleting(false);
                              }
                            }
                          }}
                          disabled={isDeleting}
                          className="h-10 px-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center text-red-600"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          {isDeleting ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                          ) : (
                            <i className="fi flex fi-rr-trash text-sm"></i>
                          )}
                        </button>
                      )}
                      {/* Search / Bulk Actions */}
                      {!selectedCustomers.size ? (
                        <div className="flex gap-2">
                          <div className="relative w-64 text-gray-800">
                            <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                            <input
                              type="text"
                              placeholder={searchField === 'name' ? "Search by Name..." : "Search by Phone..."}
                              value={tempSearchQuery}
                              onChange={(e) => setTempSearchQuery(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(tempSearchQuery)}
                              className="w-full pl-9 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b33e8] focus:border-transparent font-medium"
                            />
                            <button 
                              onClick={() => setShowSearchFieldDropdown(!showSearchFieldDropdown)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 flex items-center justify-center rounded-md bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all active:scale-90 border border-gray-100"
                              title="Change search field"
                            >
                              <i className={`fi flex ${searchField === 'name' ? 'fi-rr-user' : 'fi-rr-phone-call'} text-[10px]`}></i>
                            </button>

                            {showSearchFieldDropdown && (
                              <div className="absolute right-0 top-full mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <button
                                  onClick={() => { setSearchField("name"); setShowSearchFieldDropdown(false); }}
                                  className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors flex items-center gap-2 ${searchField === 'name' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                  <i className="fi flex fi-rr-user text-[10px]"></i>
                                  NAME
                                </button>
                                <button
                                  onClick={() => { setSearchField("phone"); setShowSearchFieldDropdown(false); }}
                                  className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors flex items-center gap-2 ${searchField === 'phone' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                  <i className="fi flex fi-rr-phone-call text-[10px]"></i>
                                  PHONE
                                </button>
                              </div>
                            )}
                          </div>
                          <button
                            onClick={fetchDuplicates}
                            className="h-[38px] px-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm font-bold hover:bg-rose-100 transition-all flex items-center gap-2"
                            title="Scan for Duplicate Numbers"
                          >
                            <i className="fi flex fi-rr-copy-alt text-xs"></i>
                           
                          </button>
                          {/* <button 
                            onClick={() => setSearchQuery(tempSearchQuery)}
                            className="px-4 py-2 bg-[#4b33e8] text-white rounded-lg text-sm font-bold hover:bg-[#3d29c2] transition-colors shadow-sm active:scale-95 flex items-center gap-2"
                          >
                            <i className="fi flex fi-rr-search text-xs"></i>
                            Search
                          </button> */}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                          {dataSource !== 'rejected' && (
                            <>
                              <button
                                onClick={() => setShowBulkActionModal(true)}
                                className="h-10 px-4 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 gap-2 shadow-sm shadow-indigo-100"
                                title="Bulk Actions"
                              >
                                <i className="fi flex fi-rr-menu-dots-vertical text-sm"></i>
                                <span className="text-xs font-bold uppercase tracking-widest">Bulk Actions ({selectedCustomers.size})</span>
                              </button>
                            </>
                          )}
                          
                          {/* Move to Live Button - Only for Rejected Data source */}
                          {dataSource === 'rejected' && (
                            <button
                              onClick={handleMoveToLive}
                              disabled={isMovingToLive}
                              className="h-10 px-4 border border-emerald-200 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center text-emerald-600 gap-2 font-bold text-xs"
                              title="Move to Live"
                            >
                              {isMovingToLive ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"></div>
                              ) : (
                                <>
                                  <i className="fi flex fi-rr-redo text-sm"></i>
                                  MOVE TO LIVE
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                      {/* Refresh Button - Before Filter */}
                      <button
                        onClick={() => fetchCustomers(currentPage)}
                        className={`h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 ${loadingCustomers ? 'opacity-50' : ''}`}
                        title="Refresh Data"
                        disabled={loadingCustomers}
                      >
                        <i className={`fi flex fi-rr-refresh text-sm ${loadingCustomers ? 'animate-spin' : ''}`}></i>
                      </button>

                      {/* Filter Button */}
                      <button
                        onClick={() => setShowFilterModal(true)}
                        className={`h-10 px-3 border rounded-lg transition-colors flex items-center justify-center gap-2 ${
                          Object.values(filters).some(v => v) 
                          ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold" 
                          : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
                        }`}
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-filter text-sm"></i>
                        <span>Filter</span>
                        {Object.values(filters).some(v => v) && (
                          <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px]">
                            {Object.values(filters).filter(v => v).length}
                          </span>
                        )}
                      </button>

                      {/* Import Button */}
                      {permissionFlags.isImportButtonVisible && (
                      <button
                        onClick={() => setShowImportModal(true)}
                        className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        <i className="fi flex fi-rr-upload text-sm text-gray-600"></i>
                      </button>
                      )}
                      {/* Export Button */}
                      {permissionFlags.isExportButtonVisible && (
                      <button
                        onClick={handleExportCustomers}
                        className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                        title="Export Data"
                      >
                        <i className="fi flex fi-rr-download text-sm text-gray-600"></i>
                      </button>
                      )}
                      {/* View Toggle */}
                      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 h-10">
                        <button
                          onClick={() => setViewType("list")}
                          className={`px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "list"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          <i className="fi flex fi-rr-list"></i>
                        </button>
                        <button
                          onClick={() => setViewType("grid")}
                          className={`px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "grid"
                            ? "bg-white text-purple-600 shadow-sm"
                            : "text-gray-600 hover:text-gray-900"
                            }`}
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          <i className="fi flex fi-rr-grid"></i>
                        </button>
                      </div>
                      {/* Add Customer Button */}
                      {permissionFlags.isAddCustomerButtonVisible && (
                      <button
                        onClick={() => setShowAddCustomerModal(true)}
                        className="h-10 w-10 rounded-lg transition-colors flex items-center justify-center hover:opacity-90"
                        style={{
                          fontFamily: "'Roboto', sans-serif",
                          backgroundColor: "#4b33e8",
                        }}
                      >
                        <i className="fi flex fi-rr-user-add text-sm text-white"></i>
                      </button>
                      )}
                    </div>
                  </div>

                  {/* Table Content */}
                  {loadingCustomers ? (
                    <div className="text-center py-12">
                      <div
                        className="animate-spin rounded-full h-8 w-8 border-4 border-t-transparent mx-auto mb-4"
                        style={{ borderColor: "#4b33e8" }}
                      ></div>
                      <p
                        className="text-gray-500 text-sm"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        Loading customers...
                      </p>
                    </div>
                  ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-12">
                      <p
                        className="text-gray-500"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {searchQuery
                          ? "No customers found matching your search."
                          : "No customers found."}
                      </p>
                    </div>
                  ) : viewType === "list" ? (
                    <div className="overflow-x-auto">
                      <div className="overflow-x-auto -mx-2">
                          <table className="w-full text-left">
                            <thead>
                              <tr className="border-b border-gray-50">
                                 <th className="px-4 py-4 w-10">
                                  {permissionFlags.isCheckBoxVisible && (
                                  <div className="flex items-center justify-center">
                                    <input
                                      type="checkbox"
                                      checked={
                                        allCustomers.length > 0 &&
                                        selectedCustomers.size ===
                                        allCustomers.length
                                      }
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          const allIds = new Set(
                                            allCustomers.map((c) => c.id)
                                          );
                                          setSelectedCustomers(allIds);
                                        } else {
                                          setSelectedCustomers(new Set());
                                        }
                                      }}
                                      className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                    />
                                  </div>
                                  )}
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Customer Name
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center">
                                  Status
                                </th>
                                 <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Campaign
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Organization
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Assigned To
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Managed By
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Disposition
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  {dataSource === "closed" ? "Final Status" : dataSource === "rejected" ? "Rejection Reason" : "Expiry Date"}
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  {dataSource === "closed" ? "Closed Date" : dataSource === "rejected" ? "Rejected Date" : "Created Date"}
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                              {filteredCustomers.map((customer) => (
                                <tr
                                  key={customer.id}
                                  className="group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0"
                                >
                                  <td className="px-4 py-4">
                                    {permissionFlags.isCheckBoxVisible && (
                                    <div className="flex items-center justify-center">
                                      <input
                                        type="checkbox"
                                        checked={selectedCustomers.has(customer.id)}
                                        onChange={(e) => {
                                          const newSelected = new Set(
                                            selectedCustomers
                                          );
                                          if (e.target.checked) {
                                            newSelected.add(customer.id);
                                          } else {
                                            newSelected.delete(customer.id);
                                          }
                                          setSelectedCustomers(newSelected);
                                        }}
                                        className="w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                      />
                                    </div>
                                    )}
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase">
                                        {customer.customer_name
                                          ? customer.customer_name
                                            .charAt(0)
                                            .toUpperCase()
                                          : "C"}
                                      </div>
                                      <span
                                        className="text-xs font-medium text-gray-800"
                                        style={{
                                          fontFamily: "'Poppins', sans-serif",
                                          color: "#263238",
                                        }}
                                      >
                                        {customer.customer_name || "N/A"}
                                      </span>
                                    </div>
                                  </td>

                                  <td className="px-4 py-4 text-center">
                                    <div className="flex justify-center">
                                      <div
                                        className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${
                                            dataSource === "closed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                            dataSource === "rejected" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                                            customer.status === "active" ? "bg-green-50 text-green-600 border border-green-100" :
                                            customer.status === "inactive" ? "bg-gray-50 text-gray-600 border border-gray-100" :
                                            "bg-orange-50 text-orange-600 border border-orange-100"
                                          }`}
                                      >
                                        {dataSource === "closed" ? "Deal Done" : 
                                         dataSource === "rejected" ? "Rejected" :
                                         customer.status === "active" ? "Active" :
                                         customer.status === "inactive" ? "Inactive" : "Pending"}
                                      </div>
                                    </div>
                                  </td>
                                   <td className="px-4 py-4">
                                    <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide">
                                      {customer.campaign_name || "No Campaign"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex items-center gap-2">
                                      <i className="fi flex fi-rr-building text-[#4b33e8] text-xs"></i>
                                      <span
                                        className="text-[12px] font-medium text-gray-700"
                                        style={{
                                          fontFamily: "'Roboto', sans-serif",
                                        }}
                                      >
                                        {customer.organization_name || "N/A"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className="text-xs font-medium text-gray-600">
                                      {customer.assigned_user_name ||
                                        customer.assigned_employee_id ||
                                        "Unassigned"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-semibold text-gray-800">
                                        {customer.managed_by_name || "Self"}
                                      </span>
                                      {customer.managed_by_id && (
                                        <span className="text-[10px] text-gray-400 font-medium">
                                          ID: {customer.managed_by_id}
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                   <td className="px-4 py-4">
                                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 uppercase tracking-tighter">
                                      {customer.disposition || "No Status"}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-medium text-gray-700 leading-none mb-1">
                                        {dataSource === "closed" || dataSource === "rejected" 
                                          ? customer.disposition || "N/A"
                                          : customer.expiry_date ? formatDate(customer.expiry_date) : "---"}
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                        {dataSource === "closed" || dataSource === "rejected" ? "Disposition" : "Expires"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-medium text-gray-700 leading-none mb-1">
                                        {formatDate(dataSource === "closed" ? customer.closed_at : dataSource === "rejected" ? customer.rejected_at : customer.created_at)}
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                        {dataSource === "closed" ? "Closed" : dataSource === "rejected" ? "Rejected" : "Created"}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button
                                        onClick={() => {
                                          setSelectedCustomer(customer);
                                          setShowCustomerDetailsModal(true);
                                        }}
                                        className="text-purple-600 hover:text-purple-700 transition-colors p-1.5 hover:bg-purple-50 rounded"
                                        title="View Details"
                                      >
                                        <i className="fi flex fi-rr-info text-sm"></i>
                                      </button>
                                      {permissionFlags.isDeleteFromLeadButtonVisible && (
                                      <button
                                        className="text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded"
                                        title="Delete"
                                        onClick={async () => {
                                          if (
                                            confirm(
                                              "Are you sure you want to delete this customer?"
                                            )
                                          ) {
                                            try {
                                              const { error } = await supabase
                                                .from("customers")
                                                .delete()
                                                .eq("id", customer.id);

                                              if (error) {
                                                console.error(
                                                  "Error deleting customer:",
                                                  error
                                                );
                                                alert(
                                                  "Failed to delete customer"
                                                );
                                              } else {
                                                await fetchCustomers(currentPage);
                                                logSystemEvent({
                                                    event_type: 'WRITE',
                                                    description: `Delete Customer: ${customer.customer_name || 'N/A'} (ID: ${customer.id}) removed`,
                                                    metadata: { customer_id: customer.id, customer_name: customer.customer_name },
                                                    payload_size: 0,
                                                    user_name: user?.displayName || 'Admin',
                                                    organization_id: user?.organization_id || undefined
                                                });
                                              }
                                            } catch (err) {
                                              console.error(
                                                "Error deleting customer:",
                                                err
                                              );
                                              alert(
                                                "Failed to delete customer"
                                              );
                                            }
                                          }
                                        }}
                                      >
                                        <i className="fi flex fi-rr-trash text-sm"></i>
                                      </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filteredCustomers.map((customer) => (
                        <div
                          key={customer.id}
                          className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          {/* Action Buttons - Top Right Corner */}
                          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCustomer(customer);
                                setShowCustomerDetailsModal(true);
                              }}
                              className="text-purple-600 hover:text-purple-700 transition-colors p-1.5 hover:bg-purple-50 rounded"
                              title="View Details"
                              style={{
                                fontFamily: "'Roboto', sans-serif",
                              }}
                            >
                              <i className="fi flex fi-rr-info text-sm"></i>
                            </button>
                            {permissionFlags.isDeleteFromLeadButtonVisible && (
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (
                                  confirm(
                                    "Are you sure you want to delete this customer?"
                                  )
                                ) {
                                  try {
                                    const { error } = await supabase
                                      .from("customers")
                                      .delete()
                                      .eq("id", customer.id);

                                    if (error) {
                                      console.error(
                                        "Error deleting customer:",
                                        error
                                      );
                                      alert("Failed to delete customer");
                                    } else {
                                      await fetchCustomers(currentPage);
                                      logSystemEvent({
                                          event_type: 'WRITE',
                                          description: `Delete Customer: ${customer.customer_name || 'N/A'} (ID: ${customer.id}) removed from Grid`,
                                          metadata: { customer_id: customer.id, customer_name: customer.customer_name },
                                          payload_size: 0,
                                          user_name: user?.displayName || 'Admin',
                                          organization_id: user?.organization_id || undefined
                                      });
                                    }
                                  } catch (err) {
                                    console.error(
                                      "Error deleting customer:",
                                      err
                                    );
                                    alert("Failed to delete customer");
                                  }
                                }
                              }}
                              className="text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded"
                              title="Delete"
                              style={{
                                fontFamily: "'Roboto', sans-serif",
                              }}
                            >
                              <i className="fi flex fi-rr-trash text-sm"></i>
                            </button>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                              {customer.customer_name
                                ? customer.customer_name.charAt(0).toUpperCase()
                                : "C"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className="text-sm font-semibold text-gray-900 truncate"
                                style={{ fontFamily: "'Poppins', sans-serif" }}
                              >
                                {customer.customer_name || "N/A"}
                              </h3>
                              <p
                                className="text-xs text-gray-600 truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {formatMaskedPhone(customer.phone_no) || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-3 text-xs mt-4">
                            {customer.lead_id && (
                              <div className="flex items-center gap-2 text-gray-600">
                                <i className="fi flex fi-rr-id-card text-[10px]"></i>
                                <span
                                  className="truncate"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  {customer.lead_id}
                                </span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-gray-600">
                              <i className="fi flex fi-rr-bullhorn text-[10px]"></i>
                              <span
                                className="truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {customer.campaign_name || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <i className="fi flex fi-rr-building text-[10px]"></i>
                              <span
                                className="truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {customer.organization_name || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <i className="fi flex fi-rr-headset text-[10px]"></i>
                              <span
                                className="truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {customer.assigned_user_name || "Unassigned"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <i className="fi flex fi-rr-user text-[10px]"></i>
                              <span
                                className="truncate"
                                style={{ fontFamily: "'Roboto', sans-serif" }}
                              >
                                {customer.managed_by_name || "Self"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
                              <div
                                className={`px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                                  customer.status === "active"
                                    ? "bg-green-100"
                                    : customer.status === "inactive"
                                    ? "bg-gray-100"
                                    : "bg-orange-100"
                                }`}
                              >
                                <div
                                  className={`w-1 h-1 rounded-full ${
                                    customer.status === "active"
                                      ? "bg-green-500"
                                      : customer.status === "inactive"
                                      ? "bg-gray-400"
                                      : "bg-orange-400"
                                  }`}
                                ></div>
                                <span
                                  className={`text-[10px] font-semibold ${
                                    customer.status === "active"
                                      ? "text-green-700"
                                      : customer.status === "inactive"
                                      ? "text-gray-600"
                                      : "text-orange-700"
                                  }`}
                                >
                                  {customer.status === "active"
                                    ? "Active"
                                    : customer.status === "inactive"
                                    ? "Inactive"
                                    : "Pending"}
                                </span>
                              </div>

                              {customer.expiry_date && (
                                <div className="flex items-center gap-2 text-gray-400">
                                  <i className="fi flex fi-rr-calendar text-[10px]"></i>
                                  <span
                                    style={{ fontFamily: "'Roboto', sans-serif" }}
                                  >
                                    {formatDate(customer.expiry_date)}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Display checked fields from customer_details */}
                            {customer.customer_details &&
                              (() => {
                                try {
                                  const rawData = JSON.parse(customer.customer_details);
                                  let details = rawData;
                                  if (rawData.active_details && rawData.history) {
                                      details = rawData.history[rawData.active_details] || {};
                                  }

                                  const checkedFields = Object.entries(details)
                                    .filter(([key]) => key.endsWith("_checked"))
                                    .map(([key, value]) => ({
                                      fieldName: key.replace("_checked", ""),
                                      value: String(value),
                                    }));

                                  if (checkedFields.length === 0) return null;

                                  return checkedFields.map((field) => (
                                    <div
                                      key={field.fieldName}
                                      className="flex items-center gap-2 text-gray-500 pt-1"
                                    >
                                      <i className="fi flex fi-rr-check text-[10px] text-green-500"></i>
                                      <span
                                        className="truncate"
                                        style={{
                                          fontFamily: "'Roboto', sans-serif",
                                        }}
                                        title={`${field.fieldName}: ${field.value}`}
                                      >
                                        <span className="font-medium text-gray-700">
                                          {field.fieldName}:
                                        </span>{" "}
                                        {field.value}
                                      </span>
                                    </div>
                                  ));
                                } catch (e) {
                                  return null;
                                }
                              })()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Pagination Controls */}
                  {!loadingCustomers && totalCustomers > 0 && (
                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg">
                      <div className="flex items-center gap-3">
                        <div
                          className="text-sm text-gray-600"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          Showing {startIndex} to {endIndex} of {totalCustomers}{" "}
                          customers
                        </div>
                        {/* Page Size Selector */}
                        <div className="flex items-center gap-2">
                          <label
                            className="text-xs text-gray-600"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            Per page:
                          </label>
                          <select
                            value={pageSize}
                            onChange={(e) => {
                              const newPageSize =
                                e.target.value === "all"
                                  ? "all"
                                  : parseInt(e.target.value);
                              setPageSize(newPageSize);
                            }}
                            className="px-2 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            <option value="50">50</option>
                            <option value="100">100</option>
                            <option value="200">200</option>
                            <option value="all">All</option>
                          </select>
                        </div>
                      </div>
                      {pageSize !== "all" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (currentPage > 1) {
                                setCurrentPage(currentPage - 1);
                              }
                            }}
                            disabled={currentPage === 1 || loadingCustomers}
                            className={`px-2 py-1.5 w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 || loadingCustomers
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            <i className="fi flex fi-rr-angle-left"></i>
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from(
                              { length: Math.min(5, totalPages) },
                              (_, i) => {
                                let pageNum: number;
                                if (totalPages <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                  pageNum = totalPages - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    disabled={loadingCustomers}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                      ? "bg-[#4b33e8] text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                      }`}
                                    style={{
                                      fontFamily: "'Roboto', sans-serif",
                                    }}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              }
                            )}
                          </div>
                          <button
                            onClick={() => {
                              if (currentPage < totalPages) {
                                setCurrentPage(currentPage + 1);
                              }
                            }}
                            disabled={
                              currentPage >= totalPages || loadingCustomers
                            }
                            className={`px-3 w-8 h-8 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage >= totalPages || loadingCustomers
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          >
                            <i className="fi flex fi-rr-angle-right "></i>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


      {/* Reusable Import Customers Modal */}
      <ImportCustomersModal
        show={showImportModal}
        onClose={() => setShowImportModal(false)}
        onSuccess={() => fetchCustomers(1)}
      />

      <AddCustomerModal
        show={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onSuccess={() => {
          setShowAddCustomerModal(false);
          fetchCustomers(); // Refresh data
        }}
      />

      {/* Customer Details Modal */}
      {showCustomerDetailsModal && selectedCustomer && (
        <div className="fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2
                className="text-xl font-bold"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Customer Details
              </h2>
              <button
                onClick={() => {
                  setShowCustomerDetailsModal(false);
                  setSelectedCustomer(null);
                  setViewingDetailsKey(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fi flex fi-rr-cross text-xl"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Basic Information */}
              <div className="mb-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* History Navigation */}
                  {selectedCustomer.customer_details && (() => {
                      try {
                          const rawData = JSON.parse(selectedCustomer.customer_details);
                          if (rawData.active_details && rawData.history) {
                              const keys = Object.keys(rawData.history).sort((a, b) => {
                                  const numA = parseInt(a.split('-')[1]);
                                  const numB = parseInt(b.split('-')[1]);
                                  return numA - numB;
                              });
                              if (keys.length > 1) {
                                  const handleNext = () => {
                                      const currentKey = viewingDetailsKey || rawData.active_details;
                                      const currentIndex = keys.indexOf(currentKey);
                                      const nextIndex = (currentIndex + 1) % keys.length;
                                      setViewingDetailsKey(keys[nextIndex]);
                                  };
                                  const handlePrev = () => {
                                      const currentKey = viewingDetailsKey || rawData.active_details;
                                      const currentIndex = keys.indexOf(currentKey);
                                      const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
                                      setViewingDetailsKey(keys[prevIndex]);
                                  };

                                  return (
                                      <div className="md:col-span-2 mt-4">
                                          <div className="flex items-center justify-between bg-indigo-50 p-1.5 rounded-2xl border border-indigo-100 shadow-sm mb-4">
                                              <button 
                                                  onClick={handlePrev}
                                                  className="w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm"
                                              >
                                                  <i className="fi flex fi-rr-angle-left mt-0.5"></i>
                                              </button>
                                              
                                              <div className="flex flex-col items-center">
                                                  <span className="text-[8px] font-black text-indigo-300 uppercase tracking-tighter">DATA HISTORY</span>
                                                  <span className="text-xs font-black text-indigo-900">
                                                      {String(viewingDetailsKey || rawData.active_details).replace('details-', 'RECORD #')}
                                                  </span>
                                              </div>

                                              <button 
                                                  onClick={handleNext}
                                                  className="w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm"
                                              >
                                                  <i className="fi flex fi-rr-angle-right mt-0.5"></i>
                                              </button>
                                          </div>
                                      </div>
                                  );
                              }
                          }
                      } catch (e) {}
                      return null;
                  })()}
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Customer Name
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {selectedCustomer.customer_name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Phone Number
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {formatMaskedPhone(selectedCustomer.phone_no) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Lead ID
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {selectedCustomer.lead_id || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Expiry Date
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {selectedCustomer.expiry_date
                        ? formatDate(selectedCustomer.expiry_date)
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Assigned To
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {selectedCustomer.assigned_user_name ||
                        selectedCustomer.assigned_employee_id ||
                        "N/A"}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Managed By
                    </label>
                    <div className="flex flex-col">
                      <p
                        className="text-sm font-semibold text-gray-900"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {selectedCustomer.managed_by_name || "Self"}
                      </p>
                      {selectedCustomer.managed_by_id && (
                        <p
                          className="text-[10px] text-gray-400"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          ID: {selectedCustomer.managed_by_id}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Status
                    </label>
                    <div className="inline-flex items-center gap-2">
                      <div
                        className={`px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${selectedCustomer.status === "active"
                          ? "bg-green-100"
                          : selectedCustomer.status === "inactive"
                            ? "bg-gray-100"
                            : "bg-orange-100"
                          }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${selectedCustomer.status === "active"
                            ? "bg-green-500"
                            : selectedCustomer.status === "inactive"
                              ? "bg-gray-400"
                              : "bg-orange-400"
                            }`}
                        ></div>
                        <span
                          className={`text-xs font-semibold ${selectedCustomer.status === "active"
                            ? "text-green-700"
                            : selectedCustomer.status === "inactive"
                              ? "text-gray-600"
                              : "text-orange-700"
                            }`}
                        >
                          {selectedCustomer.status === "active"
                            ? "Active"
                            : selectedCustomer.status === "inactive"
                              ? "Inactive"
                              : "Pending"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedCustomer.campaign_id && (
                    <div>
                      <label
                        className="text-xs font-medium text-gray-500 block mb-1"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        Campaign ID
                      </label>
                      <p
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {selectedCustomer.campaign_id}
                      </p>
                    </div>
                  )}
                  {selectedCustomer.utilities && (
                    <div>
                      <label
                        className="text-xs font-medium text-gray-500 block mb-1"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        Utilities
                      </label>
                      <p
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {selectedCustomer.utilities}
                      </p>
                    </div>
                  )}
                  {/* Checked fields from customer_details */}
                  {selectedCustomer.customer_details &&
                    (() => {
                      try {
                        const rawData = JSON.parse(selectedCustomer.customer_details);
                        let details = rawData;
                        if (rawData.active_details && rawData.history) {
                            details = rawData.history[viewingDetailsKey || rawData.active_details] || {};
                        }
                        const checkedFields = Object.entries(details)
                          .filter(([key]) => key.endsWith("_checked"))
                          .map(([key, value]) => ({
                            fieldName: key.replace("_checked", ""),
                            value: String(value),
                          }));

                        return checkedFields.map((field) => (
                          <div key={field.fieldName}>
                            <label
                              className="text-xs font-medium text-gray-500 block mb-1"
                              style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                              {field.fieldName}
                            </label>
                            <p
                              className="text-sm text-gray-900"
                              style={{ fontFamily: "'Roboto', sans-serif" }}
                            >
                              {field.value}
                            </p>
                          </div>
                        ));
                      } catch (e) {
                        return null;
                      }
                    })()}
                </div>
              </div>

              {/* Policy Details (Unchecked fields from JSON) */}
              {selectedCustomer.customer_details &&
                (() => {
                  try {
                    const rawData = JSON.parse(selectedCustomer.customer_details);
                    let details = rawData;
                    if (rawData.active_details && rawData.history) {
                        details = rawData.history[viewingDetailsKey || rawData.active_details] || {};
                    }
                    const uncheckedFields = Object.entries(details).filter(
                      ([key]) => key.endsWith("_unchecked")
                    );

                    if (uncheckedFields.length === 0) return null;

                    return (
                      <div className="mb-6">
                        <h3
                          className="text-lg font-semibold mb-4"
                          style={{
                            color: "#263238",
                            fontFamily: "'Poppins', sans-serif",
                          }}
                        >
                          Policy Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {uncheckedFields.map(([key, value]) => {
                            const displayKey = key.replace("_unchecked", "");
                            return (
                              <div key={key}>
                                <label
                                  className="text-xs font-medium text-gray-500 block mb-1"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  {displayKey}
                                </label>
                                <p
                                  className="text-sm text-gray-900"
                                  style={{ fontFamily: "'Roboto', sans-serif" }}
                                >
                                  {String(value)}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return null;
                  }
                })()}

              {/* Additional Information */}
              <div className="mb-6">
                <h3
                  className="text-lg font-semibold mb-4"
                  style={{
                    color: "#263238",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Additional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Created Date
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {formatDate(selectedCustomer.created_at)}
                    </p>
                  </div>
                  <div>
                    <label
                      className="text-xs font-medium text-gray-500 block mb-1"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      Last Updated
                    </label>
                    <p
                      className="text-sm text-gray-900"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      {formatDate(selectedCustomer.updated_at)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowCustomerDetailsModal(false);
                    setSelectedCustomer(null);
                    setViewingDetailsKey(null);
                  }}
                  className="px-6 py-2 bg-[#4b33e8] hover:bg-[#3d28b8] text-white rounded-lg text-sm font-medium transition-colors"
                  style={{ fontFamily: "'Roboto', sans-serif" }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs font-sans">
          <div className="bg-white rounded-lg w-full max-w-md shadow-2xl flex flex-col border border-gray-100">
            {/* Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-800">Filter Customers</h3>
                {(Object.values(filters).some(v => v) || filters.createdStartDate || filters.createdEndDate) && (
                  <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                    Active Filters
                  </span>
                )}
              </div>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <i className="fi fi-rr-cross-small text-xl leading-none"></i>
              </button>
            </div>
 
            <div className="p-5 space-y-4">
              {/* Organization */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5">
                  Organization
                </label>
                <select
                  value={filters.organization || (user?.isClient ? (user.organization_id || "") : "")}
                  disabled={user?.isClient}
                  onChange={(e) => {
                    const newOrg = e.target.value;
                    setFilters(prev => ({ 
                      ...prev, 
                      organization: newOrg,
                      campaign: "",
                      assignedTo: ""
                    }));
                  }}
                  className={`w-full h-9 px-3 border border-gray-200 rounded text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans ${user?.isClient ? 'bg-gray-50 cursor-not-allowed text-gray-500' : 'bg-white cursor-pointer text-gray-700'}`}
                >
                  <option value="">All Organizations</option>
                  {filterStats.organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.company_name}</option>
                  ))}
                </select>
              </div>
 
              {/* Campaign */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5">
                  Campaign
                </label>
                <select
                  value={filters.campaign}
                  onChange={(e) => {
                    const newCamp = e.target.value;
                    setFilters(prev => ({ 
                      ...prev, 
                      campaign: newCamp,
                      assignedTo: ""
                    }));
                  }}
                  className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
                >
                  <option value="">All Campaigns</option>
                  {filterStats.campaigns
                    .filter(camp => filters.organization && camp.organization_id === filters.organization)
                    .map(camp => (
                      <option key={camp.id} value={camp.id}>{camp.name}</option>
                    ))}
                </select>
              </div>
 
              {/* Assigned To & Disposition */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5">
                    Assigned To
                  </label>
                  <select
                    value={filters.assignedTo}
                    onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
                  >
                    <option value="">All Agents</option>
                    <option value="unassigned">Unassigned</option>
                    {(() => {
                      const selectedCampaign = filterStats.campaigns.find(c => c.id === filters.campaign);
                      const campaignUserIds = selectedCampaign?.users?.map((u: any) => u.user_id) || [];
                      
                      return filterStats.agents
                        .filter(agent => {
                          const orgMatch = filters.organization && agent.organization_id === filters.organization;
                          const campaignMatch = !filters.campaign || campaignUserIds.includes(agent.user_id);
                          return orgMatch && campaignMatch;
                        })
                        .map(agent => (
                          <option key={agent.id} value={agent.user_id || agent.id}>{agent.user_name}</option>
                        ));
                    })()}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5">
                    Disposition
                  </label>
                  <select
                    value={filters.disposition}
                    onChange={(e) => setFilters(prev => ({ ...prev, disposition: e.target.value }))}
                    className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all cursor-pointer font-sans"
                  >
                    <option value="">All Stats</option>
                    {filterStats.dispositions.map(disp => (
                      <option key={disp} value={disp}>{disp}</option>
                    ))}
                  </select>
                </div>
              </div>
 
              {/* Date Ranges */}
              <div className="pt-3 border-t border-gray-100 space-y-4">
                {/* Lead Generation Date */}
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5">Lead Generation Date</p>
                   <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={filters.createdStartDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, createdStartDate: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    />
                    <input
                      type="date"
                      value={filters.createdEndDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, createdEndDate: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    />
                   </div>
                </div>

                {/* Expiry Date */}
                <div>
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 pl-0.5">Policy Expiry Window</p>
                   <div className="grid grid-cols-2 gap-4">
                    <input
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    />
                    <input
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    />
                   </div>
                </div>
              </div>
            </div>
 
            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg">
              <button
                onClick={() => {
                  setFilters({ 
                    organization: "", 
                    campaign: "", 
                    assignedTo: "", 
                    disposition: "",
                    startDate: "",
                    endDate: "",
                    createdStartDate: "",
                    createdEndDate: ""
                  });
                }}
                className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setShowFilterModal(false);
                  fetchCustomers(1);
                }}
                className="px-6 py-1.5 bg-[#1e1b4b] text-white rounded font-bold uppercase tracking-widest hover:bg-indigo-900 transition-all shadow-sm shadow-indigo-100"
              >
                Apply Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Duplicate Numbers Modal */}
      {showDuplicateModal && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs">
          <div className="bg-white rounded-lg w-full max-w-4xl shadow-2xl flex flex-col max-h-[80vh] border border-gray-100">
            {/* Simple Clean Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <h3 className="font-bold text-gray-800">Duplicate Entries</h3>
                
                 <div className="flex items-center gap-3 ml-4 bg-gray-50 rounded-lg p-1 border border-gray-100">
                   <div className="flex items-center gap-2 px-2 border-r border-gray-200 pr-3">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                        checked={filteredDuplicateLeads.length > 0 && filteredDuplicateLeads.every(l => selectedDuplicateLeads.has(l.lead_id))}
                        onChange={(e) => {
                          const newSelected = new Set(selectedDuplicateLeads);
                          filteredDuplicateLeads.forEach(l => {
                            if (e.target.checked) newSelected.add(l.lead_id);
                            else newSelected.delete(l.lead_id);
                          });
                          setSelectedDuplicateLeads(newSelected);
                        }}
                      />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Select All</span>
                   </div>

                  <select 
                    value={duplicateDispositionFilter}
                    onChange={(e) => setDuplicateDispositionFilter(e.target.value)}
                    className="px-2 py-1 bg-transparent text-[11px] text-gray-600 focus:outline-none min-w-[130px]"
                  >
                    <option value="">All Dispositions</option>
                    {[...new Set(duplicateLeads.map(l => l.disposition).filter(Boolean))].sort().map(disp => (
                      <option key={disp} value={disp}>{disp}</option>
                    ))}
                  </select>
                  <select 
                    value={duplicateCampaignFilter}
                    onChange={(e) => setDuplicateCampaignFilter(e.target.value)}
                    className="px-2 py-1.5 bg-white border border-gray-200 rounded text-[11px] text-gray-600 focus:outline-none min-w-[140px]"
                  >
                    <option value="">All Campaigns</option>
                    {[...new Set(duplicateLeads.map(l => l.campaign_name || l.campaign_id).filter(Boolean))].sort().map(camp => (
                      <option key={camp} value={camp}>{camp}</option>
                    ))}
                  </select>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowDuplicateModal(false);
                  setDuplicateDispositionFilter("");
                  setDuplicateCampaignFilter("");
                }}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <i className="fi fi-rr-cross-small text-xl leading-none"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingDuplicates ? (
                <div className="py-20 text-center text-gray-400 uppercase tracking-widest text-[10px] font-medium">
                  Scanning for duplicates...
                </div>
              ) : duplicateLeads.length === 0 ? (
                <div className="py-20 text-center text-gray-400 text-sm">
                  No duplicates found.
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {Object.values(filteredDuplicateLeads.reduce((acc: any, lead: any) => {
                    if (!acc[lead.phone_search_hash]) acc[lead.phone_search_hash] = [];
                    acc[lead.phone_search_hash].push(lead);
                    return acc;
                  }, {})).map((group: any, idx: number) => (
                    <div key={idx} className="bg-white">
                      <div className="px-5 py-2 bg-gray-50/50 flex items-center justify-between border-y border-gray-50">
                        <div className="flex items-center gap-3">
                           <input 
                             type="checkbox" 
                             className="w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                             checked={group.every((item: any) => selectedDuplicateLeads.has(item.lead_id))}
                             onChange={(e) => {
                               const newSelected = new Set(selectedDuplicateLeads);
                               group.forEach((item: any) => {
                                 if (e.target.checked) newSelected.add(item.lead_id);
                                 else newSelected.delete(item.lead_id);
                               });
                               setSelectedDuplicateLeads(newSelected);
                             }}
                           />
                           <span className="font-bold text-gray-500 uppercase text-[10px]">Group {idx + 1}</span>
                        </div>
                        <div className="flex items-center gap-4">
                           {group.some((item: any) => selectedDuplicateLeads.has(item.lead_id)) && (
                             <button
                               onClick={() => {
                                 const selectedItemsInGroup = group.filter((item: any) => selectedDuplicateLeads.has(item.lead_id));
                                 handleDeleteMultipleDuplicates(selectedItemsInGroup);
                               }}
                               className="text-[10px] font-bold text-rose-600 hover:text-rose-700 uppercase tracking-tight flex items-center gap-1.5 transition-colors"
                             >
                               <i className="fi fi-rr-trash"></i>
                               Delete Selected
                             </button>
                           )}
                           <span className="text-[10px] text-gray-400">{group.length} records</span>
                        </div>
                      </div>
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-gray-400 uppercase text-[9px] font-bold border-b border-gray-50">
                            <th className="px-5 py-2 w-10"></th>
                            <th className="px-5 py-2">Customer / Phone</th>
                            <th className="px-3 py-2">Lead ID</th>
                            <th className="px-3 py-2">Date</th>
                            <th className="px-3 py-2">Stage</th>
                            <th className="px-3 py-2">Campaign</th>
                            <th className="px-3 py-2">Agent</th>
                            <th className="px-3 py-2">Status</th>
                            <th className="px-5 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {group.map((item: any, i: number) => (
                            <tr key={i} className={`hover:bg-gray-50/30 transition-colors text-[11px] ${selectedDuplicateLeads.has(item.lead_id) ? 'bg-rose-50/20' : ''}`}>
                              <td className="px-5 py-3">
                                <input 
                                  type="checkbox" 
                                  className="w-3.5 h-3.5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                                  checked={selectedDuplicateLeads.has(item.lead_id)}
                                  onChange={() => {
                                    const newSelected = new Set(selectedDuplicateLeads);
                                    if (newSelected.has(item.lead_id)) newSelected.delete(item.lead_id);
                                    else newSelected.add(item.lead_id);
                                    setSelectedDuplicateLeads(newSelected);
                                  }}
                                />
                              </td>
                              <td className="px-5 py-3">
                                <div className="font-semibold text-gray-800">{item.customer_name}</div>
                                <div className="text-gray-400">{formatMaskedPhone(item.phone_no)}</div>
                              </td>
                              <td className="px-3 py-3 text-gray-500">{item.lead_id || '-'}</td>
                              <td className="px-3 py-3 text-gray-500">
                                {item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : '-'}
                              </td>
                              <td className="px-3 py-3">
                                <span className={`font-bold ${
                                  item.stage === 'Live' ? 'text-indigo-600' :
                                  item.stage === 'Rejected' ? 'text-rose-500' :
                                  'text-emerald-600'
                                }`}>
                                  {item.stage}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-gray-600">{item.campaign_name || item.campaign_id || '-'}</td>
                              <td className="px-3 py-3 text-gray-600">{item.assigned_to_name || '-'}</td>
                              <td className="px-3 py-3 text-gray-600">{item.disposition || '-'}</td>
                              <td className="px-5 py-3 text-right">
                                <button
                                  onClick={() => handleDeleteDuplicateEntry(item)}
                                  className="text-gray-300 hover:text-rose-500 transition-colors"
                                  title="Delete Entry"
                                >
                                  <i className="fi fi-rr-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Flat Social Footer */}
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg">
              <div className="flex items-center gap-6">
                <span className="text-gray-400 font-medium">
                  Groups: <span className="text-gray-700 font-bold">{Object.keys(filteredDuplicateLeads.reduce((acc: any, l: any) => ({...acc, [l.phone_search_hash]: 1}), {})).length}</span>
                </span>
                {selectedDuplicateLeads.size > 0 && (
                  <button
                    onClick={() => {
                      const itemsToDelete = filteredDuplicateLeads.filter(l => selectedDuplicateLeads.has(l.lead_id));
                      handleDeleteMultipleDuplicates(itemsToDelete);
                    }}
                    className="px-3 py-1 bg-rose-600 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-sm shadow-rose-100"
                  >
                    <i className="fi fi-rr-trash"></i>
                    Delete All Selected ({selectedDuplicateLeads.size})
                  </button>
                )}
              </div>
              <button
                onClick={() => {
                  setShowDuplicateModal(false);
                  setDuplicateDispositionFilter("");
                  setDuplicateCampaignFilter("");
                }}
                className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Unified Bulk Action Modal */}
      {showBulkActionModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs font-sans">
          <div className="bg-white rounded-lg w-full max-w-lg shadow-2xl flex flex-col border border-gray-100">
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-800">Bulk Update Records</h3>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                  {selectedCustomers.size} Items
                </span>
              </div>
              <button 
                onClick={() => setShowBulkActionModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <i className="fi fi-rr-cross-small text-xl leading-none"></i>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Organization Field */}
                {permissionFlags.isChangeOrganizationButtonVisible && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Organization</label>
                    <select
                      value={bulkUpdates.organization_id || (user?.isClient ? (user.organization_id || "") : "")}
                      disabled={user?.isClient}
                      onChange={(e) => setBulkUpdates(prev => ({ ...prev, organization_id: e.target.value }))}
                      className={`w-full h-9 px-3 border border-gray-200 rounded text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans ${user?.isClient ? 'bg-gray-50 cursor-not-allowed text-gray-500' : 'bg-white text-gray-700'}`}
                    >
                      <option value="">No Change</option>
                      {filterStats.organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.company_name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Campaign Field */}
                {permissionFlags.isChangeCampaginButtonVisible && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Campaign</label>
                    <select
                      value={bulkUpdates.campaign_id}
                      onChange={(e) => setBulkUpdates(prev => ({ ...prev, campaign_id: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    >
                      <option value="">No Change</option>
                      {filterStats.campaigns
                        .filter(camp => bulkUpdates.organization_id && camp.organization_id === bulkUpdates.organization_id)
                        .map(camp => (
                        <option key={camp.id} value={camp.id}>{camp.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Assigned To Field */}
                {permissionFlags.isChangeAssignedButtonVisible && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Assign To</label>
                    <select
                      value={bulkUpdates.assigned_to}
                      onChange={(e) => setBulkUpdates(prev => ({ ...prev, assigned_to: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    >
                      <option value="">No Change</option>
                      <option value="unassigned">Unassigned (Clear Agent)</option>
                      {filterStats.agents
                        .filter(a => bulkUpdates.organization_id && a.organization_id === bulkUpdates.organization_id)
                        .map(agent => (
                        <option key={agent.id} value={agent.user_id || agent.id}>{agent.user_name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Disposition Field */}
                {permissionFlags.isChangeDispostionButtonVisible && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5">Disposition</label>
                    <select
                      value={bulkUpdates.disposition}
                      onChange={(e) => setBulkUpdates(prev => ({ ...prev, disposition: e.target.value }))}
                      className="w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                    >
                      <option value="">No Change</option>
                      {filterStats.dispositions.map(disp => (
                        <option key={disp} value={disp}>{disp}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Special Action: Move to Fresh */}
              {permissionFlags.isMoveFreshButtonVisible && (
                <div className="pt-2">
                  <button
                    onClick={() => {
                        if(confirm(`Are you sure you want to reset ${selectedCustomers.size} leads to Fresh state? This will clear all history and assignments.`)) {
                           handleBulkUpdate({ action: "Move Fresh" });
                        }
                    }}
                    className="w-full h-9 flex items-center justify-center gap-2 border border-rose-200 bg-rose-50 text-rose-600 rounded text-[10px] font-bold uppercase tracking-widest hover:bg-rose-100 transition-all"
                  >
                    <i className="fi flex fi-rr-refresh"></i>
                    Reset to Fresh Leads
                  </button>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg">
              <button
                onClick={() => setShowBulkActionModal(false)}
                className="px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                disabled={isUpdatingBulk || !Object.entries(bulkUpdates).some(([k,v]) => v !== "")}
                onClick={() => {
                   const cleanUpdates: any = {};
                   if (bulkUpdates.organization_id) cleanUpdates.organization_id = bulkUpdates.organization_id;
                   if (bulkUpdates.campaign_id) cleanUpdates.campaign_id = bulkUpdates.campaign_id;
                   if (bulkUpdates.assigned_to) cleanUpdates.assigned_to = (bulkUpdates.assigned_to === "unassigned" ? null : bulkUpdates.assigned_to);
                   if (bulkUpdates.disposition) cleanUpdates.disposition = bulkUpdates.disposition;
                   handleBulkUpdate(cleanUpdates);
                }}
                className="px-6 py-1.5 bg-indigo-600 text-white rounded font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-50"
              >
                {isUpdatingBulk ? "Updating..." : `Apply Changes (${selectedCustomers.size})`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
