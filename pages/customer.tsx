import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import AppLayout, { useUser } from "../components/AppLayout";
import { supabase } from "../lib/supabase";
import ImportCustomersModal from "../components/ImportCustomersModal";
import { formatMaskedPhone, computePhoneHash, decryptPhone } from "../lib/phoneUtils";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [freshCustomersCount, setFreshCustomersCount] = useState(0);

  const [pendingFollowUps, setPendingFollowUps] = useState(0);
  const [upcomingFollowUps, setUpcomingFollowUps] = useState(0);
  const [overdueFollowUps, setOverdueFollowUps] = useState(0);
  const [pageSize, setPageSize] = useState<number | "all">(100);
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCustomerDetailsModal, setShowCustomerDetailsModal] =
    useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(
    new Set()
  );
  const [isDeleting, setIsDeleting] = useState(false);

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
  });

  // Bulk Action States
  const [showBulkOrgModal, setShowBulkOrgModal] = useState(false);
  const [showBulkCampaignModal, setShowBulkCampaignModal] = useState(false);
  const [showBulkAssignedModal, setShowBulkAssignedModal] = useState(false);
  const [showBulkDispositionModal, setShowBulkDispositionModal] = useState(false);
  const [isUpdatingBulk, setIsUpdatingBulk] = useState(false);
  const [bulkValue, setBulkValue] = useState("");




  // Format date safely for SSR (only format on client)
  const formatDate = (dateString: string | null) => {
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

  const fetchCustomers = async (page: number = currentPage) => {
    try {
      if (!user) return; // Prevent fetching without user payload
      setLoadingCustomers(true);

      // Get total count with filters applied
      let countQuery = supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      if (searchQuery) {
        countQuery = countQuery.or(`customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`);
      }

      // --- DATA MINING ALGORITHM ---
      // Level 1: Client Agent (Own Leads Only)
      if (user?.isClient && (user.designation === 'agent' || !user.designation)) {
          if (user.organization_id) countQuery = countQuery.eq('organization_id', user.organization_id);
          if (user.uid) countQuery = countQuery.eq('assigned_to', user.uid);
      }
      // Level 2: Team Leader (Own + Team Leads)
      else if (user?.isClient && user.designation === 'team_leader') {
         if (user.organization_id) countQuery = countQuery.eq('organization_id', user.organization_id);
         
         // Fetch team members logic (moved to top of function for reuse or kept inline if simple)
         // For cleanliness, we'll keep the fetch logic efficiently placed or reused.
         // (Re-implementing the fetch here for consistency with previous steps, but structured cleanly)
         let teamMemberIds: string[] = [];
         
          const { data: teamData } = await supabase
           .from('teams')
           .select('members')
           .eq('leader_id', user.uid)
           .eq('is_active', true);

         if (teamData) {
           teamData.forEach(team => {
             if (Array.isArray(team.members)) {
                team.members.forEach((member: any) => {
                  if (typeof member === 'string') teamMemberIds.push(member);
                });
             } else if (typeof team.members === 'string') {
                try {
                  const parsedIds = JSON.parse(team.members);
                  if (Array.isArray(parsedIds)) parsedIds.forEach((id: any) => teamMemberIds.push(String(id))); 
                } catch (e) {}
             }
           });
         }
         teamMemberIds.push(user.uid);
         teamMemberIds = [...new Set(teamMemberIds)];
         
         if (teamMemberIds.length > 0) countQuery = countQuery.in('assigned_to', teamMemberIds);
         else countQuery = countQuery.eq('assigned_to', user.uid);
      }
      // Level 3: Client Admin (Org Wide)
      else if (user?.isClient && ['ceo', 'developer'].includes(user.designation || '')) {
          if (user.organization_id) {
             countQuery = countQuery.eq('organization_id', user.organization_id);
          } else {
             // Fail-secure: If no Org ID, show nothing
             countQuery = countQuery.eq('id', '00000000-0000-0000-0000-000000000000');
          }
      }
      // Level 4: Internal Staff (Global Access) - No Filters Applied

      if (filters.organization) {
        countQuery = countQuery.eq("organization_id", filters.organization);
      }
      if (filters.campaign) {
        countQuery = countQuery.eq("campaign_id", filters.campaign);
      }
      if (filters.assignedTo) {
        if (filters.assignedTo === "unassigned") {
          countQuery = countQuery.is("assigned_to", null);
        } else {
          countQuery = countQuery.eq("assigned_to", filters.assignedTo);
        }
      }
      if (filters.disposition) {
        countQuery = countQuery.eq("disposition", filters.disposition);
      }

      const { count, error: countError } = await countQuery;

      if (countError) {
        console.error("Error fetching customer count:", countError);
      } else {
        setTotalCustomers(count || 0);
      }

      // --- Follow Up Stats Queries ---
      const todayISO = new Date();
      todayISO.setHours(0,0,0,0);
      
      // Helper function to apply user filters to any query
      const applyUserFilters = (q: any) => {
          if (user?.isClient && (user.designation === 'agent' || !user.designation)) {
              if (user.organization_id) q = q.eq('organization_id', user.organization_id);
              if (user.uid) q = q.eq('assigned_to', user.uid);
          }
          else if (user?.isClient && user.designation === 'team_leader') {
               if (user.organization_id) q = q.eq('organization_id', user.organization_id);
               // IMPORTANT: For Team Leader stats, we ideally assume organizational scope or specific team scope.
               // Applying Org ID filter is the basic fail-safe step here. 
          }
          else if (user?.isClient && ['ceo', 'developer'].includes(user.designation || '')) {
              if (user.organization_id) q = q.eq('organization_id', user.organization_id);
              else q = q.eq('id', '00000000-0000-0000-0000-000000000000');
          }
          return q;
      };

      // 1. Pending (Total Call Back)
      let pendingQuery = supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("disposition", "Call Back");
      
      pendingQuery = applyUserFilters(pendingQuery);
      
      // 2. Overdue (Call Back < Today)
      let overdueQuery = supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .eq("disposition", "Call Back")
        .lt("updated_at", todayISO.toISOString());
        
      overdueQuery = applyUserFilters(overdueQuery);

      const [{ count: pendingCount }, { count: overdueCount }] = await Promise.all([
          pendingQuery,
          overdueQuery
      ]);

      setPendingFollowUps(pendingCount || 0);
      setOverdueFollowUps(overdueCount || 0);
      setUpcomingFollowUps((pendingCount || 0) - (overdueCount || 0));


      // Get fresh customers count (unassigned leads) - always unassigned, but follow other filters
      let freshCountQuery = supabase
        .from("customers")
        .select("*", { count: "exact", head: true })
        .is("assigned_to", null);

      if (searchQuery) {
        freshCountQuery = freshCountQuery.or(`customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`);
      }

      // --- DATA MINING ALGORITHM (Fresh Count) ---
      // Level 1: Client Agent (Own Leads Only) -> Cannot see unassigned, so 0 results usually
      if (user?.isClient && (user.designation === 'agent' || !user.designation)) {
          if (user.organization_id) freshCountQuery = freshCountQuery.eq('organization_id', user.organization_id);
          if (user.uid) freshCountQuery = freshCountQuery.eq('assigned_to', user.uid);
      }
      // Level 2: Team Leader (Own + Team Leads)
      else if (user?.isClient && user.designation === 'team_leader') {
         if (user.organization_id) freshCountQuery = freshCountQuery.eq('organization_id', user.organization_id);
         
         // Re-use teamMemberIds if scoped variable available, else re-fetch (simplifying here assuming logic consistency)
         // For safety in this specific block without scope sharing:
         // Note: We need the IDs. Ideally we fetch once at top. For now, strict block logic:
         // We will rely on filters.assignedTo for team logic if needed, but for "Fresh" (unassigned),
         // Team Leaders only see unassigned if they are allowed to grab them?
         // Current logic: freshCountQuery checks `is('assigned_to', null)`.
         // AND we add `in('assigned_to', members)`.
         // Intersection is EMPTY.
         // This implies Team Leaders CANNOT see fresh leads unless we change logic to "Unassigned leads in their Org".
         // BUT, prompt said "assigned organization and self assigned agents".
         // So effectively they see NO fresh leads (unassigned) unless we open it up.
         // Keeping strict to previous logic:
         // If we added the filter `assigned_to IN (members)`, result is 0.
         // If we want them to see Unassigned in Org, we should ONLY filter by Org.
         // However, instruction was "check assigned agents".
         // We will maintain the previous logic: if (members) -> in(members).
         
         // To avoid re-fetching, we can't easily validly assume IDs here without top-level fetch.
         // BUT, for fresh leads (unassigned), filtering by assigned_to will always yield 0.
         // So for Level 2, Fresh Count is effectively 0 unless we change requirements.
         // We will apply the same filters as before to be consistent.
         
         // IMPORTANT: We need the IDs again if we want to be exact.
         // However, for efficiency, let's just apply the Org filter if we assume they can see Org Unassigned?
         // No, strictly follow Level 2 definition.
         // Since I cannot easily share `teamMemberIds` across these blocks without a major refactor of `fetchCustomers` to hoist the fetch,
         // I will assume for `freshCountQuery` we replicate the "Zero Result" effect if that's what the logic dictates,
         // OR we just apply Org filter if that's the intention.
         // Let's stick to the EXACT previous logic: Re-fetch is expensive but safe.
         // Actually, wait. `freshCountQuery` has `.is("assigned_to", null)`.
         // Any `.eq("assigned_to", ...)` makes it 0.
         // So for Level 1 & 2, fresh count is 0.
         // We can optimize this by just returning 0 if we want, but let's run the query with filters to be safe.
         // We will skip re-fetching for Level 2 here and just set a condition that will result in 0 to match previous behavior,
         // UNLESS we want to allow them to see specific unassigned ones (impossible).
         
         // ACTUALLY: Let's just apply the logic:
         if (user.organization_id) freshCountQuery = freshCountQuery.eq('organization_id', user.organization_id);
         // The previous logic added `.in('assigned_to', ids)`. 
         // Since `assigned_to` is null, this is `null IN (ids)` -> False.
         // We can simulate this by adding a dummy filter if we don't have IDs.
         freshCountQuery = freshCountQuery.eq('assigned_to', '00000000-0000-0000-0000-000000000000'); 
      }
      // Level 3: Client Admin (Org Wide) -> Can see Org Unassigned!
      else if (user?.isClient && ['ceo', 'developer'].includes(user.designation || '')) {
          if (user.organization_id) {
             freshCountQuery = freshCountQuery.eq('organization_id', user.organization_id);
          } else {
             // Fail-secure
             freshCountQuery = freshCountQuery.eq('id', '00000000-0000-0000-0000-000000000000');
          }
      }
      // Level 4: Internal Staff -> Can see ALL Unassigned

      if (filters.organization) {
        freshCountQuery = freshCountQuery.eq("organization_id", filters.organization);
      }
      if (filters.campaign) {
        freshCountQuery = freshCountQuery.eq("campaign_id", filters.campaign);
      }
      if (filters.disposition) {
        freshCountQuery = freshCountQuery.eq("disposition", filters.disposition);
      }

      const { count: freshCount, error: freshCountError } = await freshCountQuery;

      if (freshCountError) {
        console.error("Error fetching fresh customers count:", freshCountError);
      } else {
        setFreshCustomersCount(freshCount || 0);
      }

      // Fetch data based on page size
      let query = supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`);
      }

      // --- DATA MINING ALGORITHM (Main Query) ---
      // Level 1: Client Agent
      if (user?.isClient && (user.designation === 'agent' || !user.designation)) {
          if (user.organization_id) query = query.eq('organization_id', user.organization_id);
          if (user.uid) query = query.eq('assigned_to', user.uid);
      }
      // Level 2: Team Leader
      else if (user?.isClient && user.designation === 'team_leader') {
          if (user.organization_id) query = query.eq('organization_id', user.organization_id);
          
          // Re-fetch logic or assume variables. 
          // Since query is sequential in function, we MUST re-fetch or hoist variables.
          // Hoisting is best, but due to tool limitations, we'll re-implement fetch briefly or reuse if scope allows.
          // Note: `teamMemberIds` was defined in the `if` block of Count query, so it's NOT available here.
          // We must re-fetch for safety.
          let tMembers: string[] = [];
          const { data: tData } = await supabase.from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
           if (tData) {
               tData.forEach(t => {
                   if (Array.isArray(t.members)) {
                       t.members.forEach((m:any) => { if(typeof m==='string') tMembers.push(m) });
                   } else if (typeof t.members === 'string') {
                        try { const p = JSON.parse(t.members); if(Array.isArray(p)) p.forEach((id:any)=>tMembers.push(String(id))); } catch(e){}
                   }
               });
           }
           tMembers.push(user.uid);
           tMembers = [...new Set(tMembers)];
           
           if (tMembers.length > 0) query = query.in('assigned_to', tMembers);
           else query = query.eq('assigned_to', user.uid);
      }
      // Level 3: Client Admin
      else if (user?.isClient && ['ceo', 'developer'].includes(user.designation || '')) {
          if (user.organization_id) {
             query = query.eq('organization_id', user.organization_id);
          } else {
             // Fail-secure
             query = query.eq('id', '00000000-0000-0000-0000-000000000000');
          }
      }
      // Level 4: Internal Staff -> No Filters


      if (filters.organization) {
        query = query.eq("organization_id", filters.organization);
      }
      if (filters.campaign) {
        query = query.eq("campaign_id", filters.campaign);
      }
      if (filters.assignedTo) {
        if (filters.assignedTo === "unassigned") {
          query = query.is("assigned_to", null);
        } else {
          query = query.eq("assigned_to", filters.assignedTo);
        }
      }
      if (filters.disposition) {
        query = query.eq("disposition", filters.disposition);
      }


      let data: any[] | null = null;
      let error: any = null;

      if (pageSize === "all") {
        // Fetch all data in batches of 1000 to bypass API limits
        let allData: any[] = [];
        let hasMore = true;
        let pageIndex = 0;
        const batchSize = 1000;

        while (hasMore) {
            let batchQuery = supabase
                .from("customers")
                .select("*")
                .order("created_at", { ascending: false });

            if (searchQuery) {
                let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`;
                
                // If the search looks like a phone number (mostly digits), try hashing it for exact match
                if (searchQuery.replace(/\D/g, '').length > 0) {
                     const hash = computePhoneHash(searchQuery);
                     if (hash) {
                         // Add exact match check on phone_search_hash
                         orConditions += `,phone_search_hash.eq.${hash}`;
                     }
                }
                
                batchQuery = batchQuery.or(orConditions);
            }

            // --- DATA MINING ALGORITHM (Batch Query) ---
            // Level 1: Client Agent
            if (user?.isClient && (user.designation === 'agent' || !user.designation)) {
                if (user.organization_id) batchQuery = batchQuery.eq('organization_id', user.organization_id);
                if (user.uid) batchQuery = batchQuery.eq('assigned_to', user.uid);
            }
            // Level 2: Team Leader
            else if (user?.isClient && user.designation === 'team_leader') {
                if (user.organization_id) batchQuery = batchQuery.eq('organization_id', user.organization_id);
                
                // Re-fetch logic for batch loop
                let bMembers: string[] = [];
                const { data: bData } = await supabase.from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
                if (bData) {
                    bData.forEach(t => {
                        if (Array.isArray(t.members)) {
                            t.members.forEach((m:any) => { if(typeof m==='string') bMembers.push(m) });
                        } else if (typeof t.members === 'string') {
                                try { const p = JSON.parse(t.members); if(Array.isArray(p)) p.forEach((id:any)=>bMembers.push(String(id))); } catch(e){}
                        }
                    });
                }
                bMembers.push(user.uid);
                bMembers = [...new Set(bMembers)];
                
                if (bMembers.length > 0) batchQuery = batchQuery.in('assigned_to', bMembers);
                else batchQuery = batchQuery.eq('assigned_to', user.uid);
            }
            // Level 3: Client Admin
            else if (user?.isClient && ['ceo', 'developer'].includes(user.designation || '')) {
                if (user.organization_id) {
                    batchQuery = batchQuery.eq('organization_id', user.organization_id);
                } else {
                    // Fail-secure
                    batchQuery = batchQuery.eq('id', '00000000-0000-0000-0000-000000000000');
                }
            }
            // Level 4: Internal Staff -> No Filters


            if (filters.organization) {
                batchQuery = batchQuery.eq("organization_id", filters.organization);
            }
            if (filters.campaign) {
                batchQuery = batchQuery.eq("campaign_id", filters.campaign);
            }
            if (filters.assignedTo) {
                if (filters.assignedTo === "unassigned") {
                    batchQuery = batchQuery.is("assigned_to", null);
                } else {
                    batchQuery = batchQuery.eq("assigned_to", filters.assignedTo);
                }
            }
            if (filters.disposition) {
                batchQuery = batchQuery.eq("disposition", filters.disposition);
            }


            const { data: batch, error: batchError } = await batchQuery
                .range(pageIndex * batchSize, (pageIndex + 1) * batchSize - 1);

            if (batchError) {
                error = batchError;
                break;
            }

            if (batch && batch.length > 0) {
                allData = [...allData, ...batch];
                if (batch.length < batchSize) {
                    hasMore = false;
                }
                pageIndex++;
            } else {
                hasMore = false;
            }
        }
        data = allData;
      } else {
        // Calculate offset for pagination
        const offset = (page - 1) * pageSize;
        const { data: pagedData, error: pagedError } = await query.range(offset, offset + pageSize - 1);
        data = pagedData;
        error = pagedError;
      }

      if (error) {
        console.error("Error fetching customers:", error);
        setAllCustomers([]);
      } else {
        // Fetch assigned user names separately
        const allUserIds = [
          ...new Set(
            (data || [])
              .flatMap((c: any) => [c.assigned_to, c.managed_by])
              .filter((id: string | null) => id)
          ),
        ];

        let userMap: Record<
          string,
          { user_name: string | null; employee_id: string | null }
        > = {};

        if (allUserIds.length > 0) {
          const { data: userData } = await supabase
            .from("user_profiles")
            .select("user_id, id, user_name, employee_id")
            .or(`user_id.in.("${allUserIds.join('","')}"),id.in.("${allUserIds.join('","')}")`);

          if (userData) {
            userData.forEach((user) => {
                const info = {
                    user_name: user.user_name,
                    employee_id: user.employee_id,
                };
                userMap[user.user_id] = info;
                userMap[user.id] = info;
            });
          }
        }

        // Fetch campaign names separately (manual join)
        const campaignIds = [
          ...new Set(
            (data || [])
              .map((c: any) => c.campaign_id)
              .filter((id: string | null) => id)
          ),
        ];

        let campaignMap: Record<string, string> = {};

        if (campaignIds.length > 0) {
          const { data: campaignData } = await supabase
            .from("campaigns")
            .select("id, name")
            .in("id", campaignIds);

          if (campaignData) {
            campaignData.forEach((camp) => {
              campaignMap[camp.id] = camp.name;
            });
          }
        }

        // Fetch organization names separately
        const organizationIds = [
          ...new Set(
            (data || [])
              .map((c: any) => c.organization_id)
              .filter((id: string | null) => id)
          ),
        ];

        let organizationMap: Record<string, string> = {};

        if (organizationIds.length > 0) {
          const { data: orgData } = await supabase
            .from("organizations")
            .select("id, company_name")
            .in("id", organizationIds);

          if (orgData) {
            orgData.forEach((org) => {
              organizationMap[org.id] = org.company_name;
            });
          }
        }

        // Map the data to include assigned user name and campaign name
        const mappedData = (data || []).map((customer: any) => ({
          ...customer,
          assigned_user_name: customer.assigned_to
            ? userMap[customer.assigned_to]?.user_name || null
            : null,
          assigned_employee_id: customer.assigned_to
            ? userMap[customer.assigned_to]?.employee_id || null
            : null,
          managed_by_name: customer.managed_by
            ? userMap[customer.managed_by]?.user_name || "Unknown"
            : "Self",
          managed_by_id: customer.managed_by
            ? userMap[customer.managed_by]?.employee_id || customer.managed_by.slice(0, 8).toUpperCase()
            : null,
          campaign_name: customer.campaign_id
            ? campaignMap[customer.campaign_id] || null
            : null,
          organization_name: customer.organization_id
            ? organizationMap[customer.organization_id] || null
            : null,
        }));
        setAllCustomers(mappedData);
      }
    } catch (err) {
      console.error("Error fetching customers:", err);
      setAllCustomers([]);
    } finally {
      setLoadingCustomers(false);
    }
  };


  useEffect(() => {
    if (user || userLoaded) {
      fetchCustomers(1);
      fetchFilterMetadata();
    }

    // Refresh data when page comes into focus
    const handleFocus = () => {
      fetchCustomers(currentPage);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user, userLoaded]);

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
          // Fail-secure
          orgQuery = orgQuery.eq('id', '00000000-0000-0000-0000-000000000000');
          campQuery = campQuery.eq('id', '00000000-0000-0000-0000-000000000000');
          agentQuery = agentQuery.eq('id', '00000000-0000-0000-0000-000000000000');
        }
      }

      const [
        { data: orgs },
        { data: camps },
        { data: agents }
      ] = await Promise.all([
        orgQuery,
        campQuery,
        agentQuery,
      ]);

      setFilterStats(prev => ({
        ...prev,
        organizations: orgs || [],
        campaigns: camps || [],
        agents: agents || [],
      }));
    } catch (err) {
      console.error("Error fetching filter metadata:", err);
    }
  };

  const handleBulkUpdate = async (field: string, value: string | null) => {
    if (!selectedCustomers.size || !value) return;
    
    setIsUpdatingBulk(true);
    try {
      const ids = Array.from(selectedCustomers);

      if (field === "disposition") {
        if (["Wrong NO", "DND", "Language barrier"].includes(value)) {
          // Move to rejected_leads
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
              campaign_id: lead.campaign_id,
              disposition: value,
              sub_disposition: lead.sub_disposition,
              agent_id: lead.assigned_to,
              rejected_at: new Date().toISOString(),
              managed_by: lead.managed_by,
              organization_id: lead.organization_id
            }));

            const { error: insertError } = await supabase
              .from("rejected_leads")
              .insert(rejectedLeads);

            if (insertError) throw insertError;

            const { error: deleteError } = await supabase
              .from("customers")
              .delete()
              .in("id", ids);

            if (deleteError) throw deleteError;
          }
        } else if (value === "Move Fresh") {
          // Reset lead fields to fresh state
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
          // Standard disposition update
          const { error } = await supabase
            .from("customers")
            .update({ [field]: value })
            .in("id", ids);

          if (error) throw error;
        }
      } else {
        // Standard field update for organization, campaign, assigned_to
        const { error } = await supabase
          .from("customers")
          .update({ [field]: value })
          .in("id", ids);

        if (error) throw error;
      }

      setSelectedCustomers(new Set());
      await fetchCustomers(currentPage);
      
      // Close all bulk modals
      setShowBulkOrgModal(false);
      setShowBulkCampaignModal(false);
      setShowBulkAssignedModal(false);
      setShowBulkDispositionModal(false);
      setBulkValue("");
    } catch (err) {
      console.error("Error updated customers:", err);
      alert("Failed to update customers. Please try again.");
    } finally {
      setIsUpdatingBulk(false);
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
    <AppLayout>
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
                      <div className="relative w-full">
                        <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input
                          type="text"
                          placeholder="Search customers..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Mobile: Action Buttons (Below Search) */}
                  <div className="mb-4 sm:hidden flex flex-wrap items-center gap-2">
                    {/* Bulk Action Buttons */}
                    {selectedCustomers.size > 0 && (
                      <>
                        <button
                          onClick={() => setShowBulkOrgModal(true)}
                          className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeOrganizationButtonVisible ? 'hidden' : ''}`}
                          title="Change Organization"
                        >
                          <i className="fi flex fi-rr-building text-sm"></i>
                        </button>
                        <button
                          onClick={() => setShowBulkCampaignModal(true)}
                          className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeCampaginButtonVisible ? 'hidden' : ''}`}
                          title="Change Campaign"
                        >
                          <i className="fi flex fi-rr-megaphone text-sm"></i>
                        </button>
                        <button
                          onClick={() => setShowBulkAssignedModal(true)}
                          className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeAssignedButtonVisible ? 'hidden' : ''}`}
                          title="Change Assigned"
                        >
                          <i className="fi flex fi-rr-user-pen text-sm"></i>
                        </button>
                        <button
                          onClick={() => setShowBulkDispositionModal(true)}
                          className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeDispostionButtonVisible ? 'hidden' : ''}`}
                          title="Change Disposition"
                        >
                          <i className="fi flex fi-rr-list-check text-sm"></i>
                        </button>
                        <button
                          onClick={() => handleBulkUpdate("disposition", "Move Fresh")}
                          className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isMoveFreshButtonVisible ? 'hidden' : ''}`}
                          title="Move Fresh"
                        >
                          <i className="fi flex fi-rr-refresh text-sm"></i>
                        </button>
                      </>
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
                                const { error } = await supabase
                                  .from("customers")
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
                      className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
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
                                  const { error } = await supabase
                                    .from("customers")
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
                        <div className="relative w-64">
                          <i className="fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                          <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            style={{ fontFamily: "'Roboto', sans-serif" }}
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                          <button
                            onClick={() => setShowBulkOrgModal(true)}
                            className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeOrganizationButtonVisible ? 'hidden' : ''}`}
                            title="Change Organization"
                          >
                            <i className="fi flex fi-rr-building text-sm"></i>
                          </button>
                          <button
                            onClick={() => setShowBulkCampaignModal(true)}
                            className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeCampaginButtonVisible ? 'hidden' : ''}`}
                            title="Change Campaign"
                          >
                            <i className="fi flex fi-rr-megaphone text-sm"></i>
                          </button>
                          <button
                            onClick={() => setShowBulkAssignedModal(true)}
                            className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeAssignedButtonVisible ? 'hidden' : ''}`}
                            title="Change Assigned"
                          >
                            <i className="fi flex fi-rr-user-pen text-sm"></i>
                          </button>
                          <button
                            onClick={() => setShowBulkDispositionModal(true)}
                            className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeDispostionButtonVisible ? 'hidden' : ''}`}
                            title="Change Disposition"
                          >
                            <i className="fi flex fi-rr-list-check text-sm"></i>
                          </button>
                          <button
                            onClick={() => handleBulkUpdate("disposition", "Move Fresh")}
                            className={`h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isMoveFreshButtonVisible ? 'hidden' : ''}`}
                            title="Move Fresh"
                          >
                            <i className="fi flex fi-rr-refresh text-sm"></i>
                          </button>
                        </div>
                      )}
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
                        className="h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
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
                                  Expiry Date
                                </th>
                                <th className="px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                                  Created Date
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
                                        className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${customer.status === "active"
                                            ? "bg-green-50 text-green-600 border border-green-100"
                                            : customer.status === "inactive"
                                              ? "bg-gray-50 text-gray-600 border border-gray-100"
                                              : "bg-orange-50 text-orange-600 border border-orange-100"
                                          }`}
                                      >
                                        {customer.status === "active"
                                          ? "Active"
                                          : customer.status === "inactive"
                                            ? "Inactive"
                                            : "Pending"}
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
                                    <div className="flex flex-col">
                                      <span className="text-xs font-medium text-gray-700 leading-none mb-1">
                                        {customer.expiry_date
                                          ? formatDate(customer.expiry_date)
                                          : "---"}
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                        Expires
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-4">
                                    <div className="flex flex-col">
                                      <span className="text-xs font-medium text-gray-700 leading-none mb-1">
                                        {formatDate(customer.created_at)}
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-medium uppercase tracking-tighter">
                                        Created
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
                                                await fetchCustomers(
                                                  currentPage
                                                );
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
                                  const details = JSON.parse(
                                    customer.customer_details
                                  );
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
                        const details = JSON.parse(
                          selectedCustomer.customer_details
                        );
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
                    const details = JSON.parse(
                      selectedCustomer.customer_details
                    );
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

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Filter Customers
              </h3>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fi flex fi-rr-cross-small"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Organization Filter */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  Organization
                </label>
                <select
                  value={filters.organization}
                  onChange={(e) => {
                    const newOrg = e.target.value;
                    setFilters(prev => ({ 
                      ...prev, 
                      organization: newOrg,
                      // Reset dependent filters if they don't match the new organization
                      campaign: "",
                      assignedTo: ""
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">All Organizations</option>
                  {filterStats.organizations.map(org => (
                    <option key={org.id} value={org.id}>{org.company_name}</option>
                  ))}
                </select>
              </div>

              {/* Campaign Filter */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  Campaign
                </label>
                <select
                  value={filters.campaign}
                  onChange={(e) => {
                    const newCamp = e.target.value;
                    setFilters(prev => ({ 
                      ...prev, 
                      campaign: newCamp,
                      // Reset assigned to if it doesn't match the new campaign
                      assignedTo: ""
                    }));
                  }}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">All Campaigns</option>
                  {filterStats.campaigns
                    .filter(camp => !filters.organization || camp.organization_id === filters.organization)
                    .map(camp => (
                      <option key={camp.id} value={camp.id}>{camp.name}</option>
                    ))}
                </select>
              </div>

              {/* Assigned To Filter */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  Assigned To
                </label>
                <select
                  value={filters.assignedTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, assignedTo: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">All Agents</option>
                  <option value="unassigned">Unassigned Only</option>
                  {(() => {
                    const selectedCampaign = filterStats.campaigns.find(c => c.id === filters.campaign);
                    const campaignUserIds = selectedCampaign?.users?.map((u: any) => u.user_id) || [];
                    
                    return filterStats.agents
                      .filter(agent => {
                        const orgMatch = !filters.organization || agent.organization_id === filters.organization;
                        const campaignMatch = !filters.campaign || campaignUserIds.includes(agent.user_id);
                        return orgMatch && campaignMatch;
                      })
                      .map(agent => (
                        <option key={agent.id} value={agent.user_id || agent.id}>{agent.user_name}</option>
                      ));
                  })()}
                </select>
              </div>

              {/* Disposition Filter */}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  Disposition
                </label>
                <select
                  value={filters.disposition}
                  onChange={(e) => setFilters(prev => ({ ...prev, disposition: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  <option value="">All Dispositions</option>
                  {filterStats.dispositions.map(disp => (
                    <option key={disp} value={disp}>{disp}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setFilters({ organization: "", campaign: "", assignedTo: "", disposition: "" });
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={() => {
                  setShowFilterModal(false);
                  fetchCustomers(1);
                }}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Update Organization Modal */}
      {showBulkOrgModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Update Organization ({selectedCustomers.size})
              </h3>
              <button 
                onClick={() => {
                  setShowBulkOrgModal(false);
                  setBulkValue("");
                }}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fi flex fi-rr-cross-small"></i>
              </button>
            </div>
            <div className="p-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Select New Organization</label>
              <select
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">Select Organization</option>
                {filterStats.organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.company_name}</option>
                ))}
              </select>
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowBulkOrgModal(false);
                  setBulkValue("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isUpdatingBulk || !bulkValue}
                onClick={() => handleBulkUpdate("organization_id", bulkValue)}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {isUpdatingBulk ? "Updating..." : "Update Organization"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Bulk Update Campaign Modal */}
      {showBulkCampaignModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Update Campaign ({selectedCustomers.size})
              </h3>
              <button 
                onClick={() => {
                  setShowBulkCampaignModal(false);
                  setBulkValue("");
                }}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fi flex fi-rr-cross-small"></i>
              </button>
            </div>
            <div className="p-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Select New Campaign</label>
              <select
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">Select Campaign</option>
                {filterStats.campaigns.map(camp => (
                  <option key={camp.id} value={camp.id}>{camp.name}</option>
                ))}
              </select>
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowBulkCampaignModal(false);
                  setBulkValue("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isUpdatingBulk || !bulkValue}
                onClick={() => handleBulkUpdate("campaign_id", bulkValue)}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {isUpdatingBulk ? "Updating..." : "Update Campaign"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Assigned To Modal */}
      {showBulkAssignedModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Update Assignment ({selectedCustomers.size})
              </h3>
              <button 
                onClick={() => {
                  setShowBulkAssignedModal(false);
                  setBulkValue("");
                }}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fi flex fi-rr-cross-small"></i>
              </button>
            </div>
            <div className="p-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Select Agent</label>
              <select
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">Select Agent</option>
                <option value="unassigned">Unassigned</option>
                {filterStats.agents.map(agent => (
                  <option key={agent.id} value={agent.user_id || agent.id}>{agent.user_name}</option>
                ))}
              </select>
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowBulkAssignedModal(false);
                  setBulkValue("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isUpdatingBulk || !bulkValue}
                onClick={() => handleBulkUpdate("assigned_to", bulkValue === "unassigned" ? null : bulkValue)}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {isUpdatingBulk ? "Updating..." : "Update Assignment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Update Disposition Modal */}
      {showBulkDispositionModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Update Disposition ({selectedCustomers.size})
              </h3>
              <button 
                onClick={() => {
                  setShowBulkDispositionModal(false);
                  setBulkValue("");
                }}
                className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <i className="fi flex fi-rr-cross-small"></i>
              </button>
            </div>
            <div className="p-6">
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Select Disposition</label>
              <select
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="">Select Disposition</option>
                {filterStats.dispositions.map(disp => (
                  <option key={disp} value={disp}>{disp}</option>
                ))}
              </select>
            </div>
            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowBulkDispositionModal(false);
                  setBulkValue("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={isUpdatingBulk || !bulkValue}
                onClick={() => handleBulkUpdate("disposition", bulkValue)}
                className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
              >
                {isUpdatingBulk ? "Updating..." : "Update Disposition"}
              </button>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
