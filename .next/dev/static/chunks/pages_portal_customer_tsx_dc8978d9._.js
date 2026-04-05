(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/pages/portal/customer.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Customer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ImportCustomersModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCustomerModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AddCustomerModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
function Customer() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, mounted: userLoaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Customer.useEffect": ()=>{
            setMounted(true);
        }
    }["Customer.useEffect"], []);
    // Permission Flags Logic
    const permissionFlags = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Customer.useMemo[permissionFlags]": ()=>{
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
                isMoveFreshButtonVisible: false
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
            if (user.isClient && [
                'ceo',
                'developer'
            ].includes(user.designation || '')) {
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
                    isMoveFreshButtonVisible: true
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
                    isMoveFreshButtonVisible: true
                };
            }
            return flags;
        }
    }["Customer.useMemo[permissionFlags]"], [
        user,
        mounted
    ]);
    const [activeNav] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("customer");
    const [allCustomers, setAllCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingCustomers, setLoadingCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [tempSearchQuery, setTempSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalCustomers, setTotalCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [freshCustomersCount, setFreshCustomersCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pendingFollowUps, setPendingFollowUps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [upcomingFollowUps, setUpcomingFollowUps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [overdueFollowUps, setOverdueFollowUps] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [pageSize, setPageSize] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(100);
    const [viewType, setViewType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("list");
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAddCustomerModal, setShowAddCustomerModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCustomerDetailsModal, setShowCustomerDetailsModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [selectedCustomer, setSelectedCustomer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [viewingDetailsKey, setViewingDetailsKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedCustomers, setSelectedCustomers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const [isDeleting, setIsDeleting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dataSource, setDataSource] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("live");
    // Duplicate Modal States
    const [showDuplicateModal, setShowDuplicateModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [duplicateLeads, setDuplicateLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingDuplicates, setLoadingDuplicates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [duplicateDispositionFilter, setDuplicateDispositionFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [duplicateCampaignFilter, setDuplicateCampaignFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedDuplicateLeads, setSelectedDuplicateLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Customer.useEffect": ()=>{
            if (selectedCustomer?.customer_details) {
                try {
                    const data = typeof selectedCustomer.customer_details === 'string' ? JSON.parse(selectedCustomer.customer_details) : selectedCustomer.customer_details;
                    if (data?.active_details) {
                        setViewingDetailsKey(data.active_details);
                    }
                } catch (e) {}
            }
        }
    }["Customer.useEffect"], [
        selectedCustomer
    ]);
    const fetchDuplicates = async ()=>{
        try {
            setLoadingDuplicates(true);
            setShowDuplicateModal(true);
            // 1. Get duplicate summaries from RPC
            const { data: initialData, error: rpcError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].rpc('get_duplicate_leads');
            if (rpcError) throw rpcError;
            let items = initialData || [];
            if (items.length > 0) {
                // 2. Fetch full records from ALL tables to ensure all fields are present
                const leadIds = items.map((i)=>i.lead_id).filter(Boolean);
                if (leadIds.length > 0) {
                    const [liveRes, rejRes, closedRes] = await Promise.all([
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*').in('lead_id', leadIds),
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('*').in('lead_id', leadIds),
                        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('*').in('lead_id', leadIds)
                    ]);
                    const allFullRecords = [
                        ...liveRes.data || [],
                        ...rejRes.data || [],
                        ...closedRes.data || []
                    ];
                    if (allFullRecords.length > 0) {
                        const recordMap = new Map(allFullRecords.map((r)=>[
                                r.lead_id,
                                r
                            ]));
                        items = items.map((item)=>({
                                ...item,
                                ...recordMap.get(item.lead_id) || {}
                            }));
                    }
                }
                // 3. Resolve Campaign Names
                // Check for campaign_id (UUID) or campaign (often used as name or ID in some tables)
                const campaignIds = [
                    ...new Set(items.map((c)=>c.campaign_id || c.campaign).filter((id)=>id && id.length > 20))
                ];
                let campaignMap = {};
                if (campaignIds.length > 0) {
                    const { data: cData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name").in("id", campaignIds);
                    if (cData) cData.forEach((c)=>{
                        campaignMap[c.id] = c.name;
                    });
                }
                // 4. Resolve Agent Names
                const allUserIds = [
                    ...new Set(items.map((c)=>c.assigned_to || c.agent_id).filter((id)=>id))
                ];
                let userMap = {};
                if (allUserIds.length > 0) {
                    const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("user_id, id, user_name").or(`user_id.in.("${allUserIds.join('","')}"),id.in.("${allUserIds.join('","')}")`);
                    if (userData) {
                        userData.forEach((u)=>{
                            userMap[u.user_id] = u.user_name || "Unknown";
                            userMap[u.id] = u.user_name || "Unknown";
                        });
                    }
                }
                // 5. Final Mapping
                const mappedData = items.map((item)=>{
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
        } finally{
            setLoadingDuplicates(false);
        }
    };
    const handleDeleteDuplicateEntry = async (item)=>{
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
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from(table).delete().eq("lead_id", targetLeadId);
            if (error) throw error;
            // Update local duplicateLeads state to reflect deletion
            setDuplicateLeads((prev)=>prev.filter((lead)=>!(lead.lead_id === targetLeadId && lead.stage === item.stage)));
            // Also refresh the main customer table if it's currently showing that data source
            fetchCustomers(currentPage);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Delete Duplicate: Record ${targetLeadId} removed from ${table} for ${item.customer_name}`,
                metadata: {
                    lead_id: targetLeadId,
                    table,
                    customer_name: item.customer_name
                },
                payload_size: 0,
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error deleting duplicate entry:", err);
            alert("Failed to delete entry: " + (err.message || "Unknown error"));
        }
    };
    const filteredDuplicateLeads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Customer.useMemo[filteredDuplicateLeads]": ()=>{
            return duplicateLeads.filter({
                "Customer.useMemo[filteredDuplicateLeads]": (lead)=>{
                    const matchesDisposition = !duplicateDispositionFilter || lead.disposition === duplicateDispositionFilter;
                    const matchesCampaign = !duplicateCampaignFilter || lead.campaign_name === duplicateCampaignFilter || lead.campaign_id === duplicateCampaignFilter;
                    return matchesDisposition && matchesCampaign;
                }
            }["Customer.useMemo[filteredDuplicateLeads]"]);
        }
    }["Customer.useMemo[filteredDuplicateLeads]"], [
        duplicateLeads,
        duplicateDispositionFilter,
        duplicateCampaignFilter
    ]);
    const handleDeleteMultipleDuplicates = async (items)=>{
        if (items.length === 0) return;
        if (!confirm(`Are you sure you want to delete ${items.length} selected lead(s)?`)) return;
        setLoadingDuplicates(true);
        try {
            // Group by table stage
            const liveItems = items.filter((i)=>i.stage === "Live").map((i)=>i.lead_id);
            const rejectedItems = items.filter((i)=>i.stage === "Rejected").map((i)=>i.lead_id);
            const closedItems = items.filter((i)=>i.stage === "Closed").map((i)=>i.lead_id);
            const deletePromises = [];
            if (liveItems.length > 0) deletePromises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').delete().in('lead_id', liveItems));
            if (rejectedItems.length > 0) deletePromises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').delete().in('lead_id', rejectedItems));
            if (closedItems.length > 0) deletePromises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').delete().in('lead_id', closedItems));
            const results = await Promise.all(deletePromises);
            const firstError = results.find((r)=>r.error)?.error;
            if (firstError) throw firstError;
            const deletedIds = new Set(items.map((i)=>i.lead_id));
            setDuplicateLeads((prev)=>prev.filter((l)=>!deletedIds.has(l.lead_id)));
            setSelectedDuplicateLeads(new Set());
            await fetchCustomers(currentPage);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Bulk Delete Duplicates: ${items.length} records removed (${liveItems.length} Live, ${rejectedItems.length} Rejected, ${closedItems.length} Closed)`,
                metadata: {
                    record_count: items.length,
                    live_count: liveItems.length,
                    rejected_count: rejectedItems.length,
                    closed_count: closedItems.length
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])(items),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            alert(`Successfully deleted ${items.length} records.`);
        } catch (err) {
            console.error("Bulk delete error:", err);
            alert("Failed to delete records: " + (err.message || "Unknown error"));
        } finally{
            setLoadingDuplicates(false);
        }
    };
    // Filter Modal States
    const [showFilterModal, setShowFilterModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [filterStats, setFilterStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        organizations: [],
        campaigns: [],
        agents: [],
        dispositions: [
            "Not Intrested",
            "Language barrier",
            "DND",
            "Wrong NO",
            "Not Contactable",
            "Call Back",
            "Deal Done"
        ]
    });
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        organization: "",
        campaign: "",
        assignedTo: "",
        disposition: "",
        startDate: "",
        endDate: "",
        createdStartDate: "",
        createdEndDate: ""
    });
    // Bulk Action States
    const [showBulkOrgModal, setShowBulkOrgModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBulkCampaignModal, setShowBulkCampaignModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBulkAssignedModal, setShowBulkAssignedModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showBulkDispositionModal, setShowBulkDispositionModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isUpdatingBulk, setIsUpdatingBulk] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [bulkValue, setBulkValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    // Format date safely for SSR (only format on client)
    const formatDate = (dateString)=>{
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
    const fetchCustomers = async (page = currentPage)=>{
        try {
            setLoadingCustomers(true);
            const todayISO = new Date();
            todayISO.setHours(0, 0, 0, 0);
            const table = dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals";
            const dispCol = dataSource === "closed" ? "final_disposition" : "disposition";
            // 1. Fetch Shared Team Members for TL (Re-use in all sub-queries)
            let sharedTeamMemberIds = [];
            if (user?.isClient && user.designation === 'team_leader') {
                const { data: teamData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
                if (teamData) {
                    teamData.forEach((team)=>{
                        if (Array.isArray(team.members)) {
                            team.members.forEach((member)=>{
                                if (typeof member === 'string') sharedTeamMemberIds.push(member);
                            });
                        } else if (typeof team.members === 'string') {
                            try {
                                const parsedIds = JSON.parse(team.members);
                                if (Array.isArray(parsedIds)) parsedIds.forEach((id)=>sharedTeamMemberIds.push(String(id)));
                            } catch (e) {}
                        }
                    });
                }
                sharedTeamMemberIds.push(user.uid);
                sharedTeamMemberIds = [
                    ...new Set(sharedTeamMemberIds)
                ];
            }
            // 2. Helper function to apply user filters consistently
            const applyUserFilters = (q)=>{
                if (user?.isClient && (user.designation === 'agent' || !user.designation)) {
                    if (user.organization_id) q = q.eq('organization_id', user.organization_id);
                    if (user.uid) q = q.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', user.uid);
                } else if (user?.isClient && user.designation === 'team_leader') {
                    if (user.organization_id) q = q.eq('organization_id', user.organization_id);
                    if (sharedTeamMemberIds.length > 0) q = q.in(dataSource === 'live' ? 'assigned_to' : 'agent_id', sharedTeamMemberIds);
                    else q = q.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', user.uid);
                } else if (user?.isClient && [
                    'ceo',
                    'developer',
                    'manager'
                ].includes(user.designation || '')) {
                    if (user.organization_id) q = q.eq('organization_id', user.organization_id);
                    else q = q.eq('id', '00000000-0000-0000-0000-000000000000');
                }
                return q;
            };
            // 3. Get total count
            let countQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*", {
                count: "exact",
                head: true
            });
            if (searchQuery) {
                countQuery = countQuery.or(`customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`);
            }
            countQuery = applyUserFilters(countQuery);
            if (filters.organization) countQuery = countQuery.eq("organization_id", filters.organization);
            if (filters.campaign) countQuery = countQuery.eq("campaign_id", filters.campaign);
            if (filters.assignedTo) {
                if (filters.assignedTo === "unassigned") countQuery = countQuery.is(dataSource === 'live' ? 'assigned_to' : 'agent_id', null);
                else countQuery = countQuery.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', filters.assignedTo);
            }
            if (filters.disposition) countQuery = countQuery.eq(dispCol, filters.disposition);
            const dateField = "expiry_date";
            if (filters.startDate) countQuery = countQuery.gte(dateField, `${filters.startDate}T00:00:00`);
            if (filters.endDate) countQuery = countQuery.lte(dateField, `${filters.endDate}T23:59:59`);
            const lifecycleDateField = dataSource === "rejected" ? "rejected_at" : dataSource === "closed" ? "closed_at" : "created_at";
            if (filters.createdStartDate) countQuery = countQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
            if (filters.createdEndDate) countQuery = countQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
            const { count, error: countError } = await countQuery;
            if (countError) console.error("Error fetching customer count:", countError);
            else setTotalCustomers(count || 0);
            try {
                let pendingQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*", {
                    count: "exact",
                    head: true
                }).eq(dispCol, "Call Back");
                pendingQuery = applyUserFilters(pendingQuery);
                let overdueQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*", {
                    count: "exact",
                    head: true
                }).eq(dispCol, "Call Back").lt("updated_at", todayISO.toISOString());
                overdueQuery = applyUserFilters(overdueQuery);
                let freshCountQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*", {
                    count: "exact",
                    head: true
                });
                if (dataSource === 'live') {
                    freshCountQuery = freshCountQuery.eq("attempt_count", 0).is(dispCol, null);
                } else {
                    freshCountQuery = freshCountQuery.eq('id', '00000000-0000-0000-0000-000000000000');
                }
                freshCountQuery = applyUserFilters(freshCountQuery);
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
                if (dataSource === "closed") {
                    setPendingFollowUps(0);
                    setOverdueFollowUps(0);
                    setUpcomingFollowUps(0);
                    setFreshCustomersCount(0);
                } else {
                    const [pStats, oStats, fStats] = await Promise.all([
                        pendingQuery,
                        overdueQuery,
                        freshCountQuery
                    ]);
                    setPendingFollowUps(pStats.count || 0);
                    setOverdueFollowUps(oStats.count || 0);
                    setUpcomingFollowUps((pStats.count || 0) - (oStats.count || 0));
                    setFreshCustomersCount(fStats.count || 0);
                }
            } catch (statsErr) {
                console.warn("Follow-up/Fresh stats failed to load:", statsErr);
            }
            // 5. Fetch Main Data
            const orderCol = dataSource === "rejected" ? "rejected_at" : dataSource === "closed" ? "closed_at" : "created_at";
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*").order(orderCol, {
                ascending: false
            });
            if (searchQuery) {
                let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`;
                if (searchQuery.replace(/\D/g, '').length > 0) {
                    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["computePhoneHash"])(searchQuery);
                    if (hash) orConditions += `,phone_search_hash.eq.${hash}`;
                }
                query = query.or(orConditions);
            }
            query = applyUserFilters(query);
            if (filters.organization) query = query.eq("organization_id", filters.organization);
            if (filters.campaign) query = query.eq("campaign_id", filters.campaign);
            if (filters.assignedTo) {
                if (filters.assignedTo === "unassigned") query = query.is(dataSource === 'live' ? 'assigned_to' : 'agent_id', null);
                else query = query.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', filters.assignedTo);
            }
            if (filters.disposition) query = query.eq(dispCol, filters.disposition);
            if (filters.startDate) query = query.gte(dateField, `${filters.startDate}T00:00:00`);
            if (filters.endDate) query = query.lte(dateField, `${filters.endDate}T23:59:59`);
            if (filters.createdStartDate) query = query.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
            if (filters.createdEndDate) query = query.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
            let data = null;
            let error = null;
            if (pageSize === "all") {
                let allData = [];
                let hasMore = true;
                let pageIndex = 0;
                const batchSize = 1000;
                while(hasMore){
                    let batchQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from(table).select("*").order(orderCol, {
                        ascending: false
                    });
                    if (searchQuery) {
                        let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%,lead_id.ilike.%${searchQuery}%,campaign_id.ilike.%${searchQuery}%`;
                        if (searchQuery.replace(/\D/g, '').length > 0) {
                            const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["computePhoneHash"])(searchQuery);
                            if (hash) orConditions += `,phone_search_hash.eq.${hash}`;
                        }
                        batchQuery = batchQuery.or(orConditions);
                    }
                    batchQuery = applyUserFilters(batchQuery);
                    if (filters.organization) batchQuery = batchQuery.eq("organization_id", filters.organization);
                    if (filters.campaign) batchQuery = batchQuery.eq("campaign_id", filters.campaign);
                    if (filters.assignedTo) {
                        if (filters.assignedTo === "unassigned") batchQuery = batchQuery.is(dataSource === 'live' ? 'assigned_to' : 'agent_id', null);
                        else batchQuery = batchQuery.eq(dataSource === 'live' ? 'assigned_to' : 'agent_id', filters.assignedTo);
                    }
                    if (filters.disposition) batchQuery = batchQuery.eq(dispCol, filters.disposition);
                    if (filters.startDate) batchQuery = batchQuery.gte(dateField, `${filters.startDate}T00:00:00`);
                    if (filters.endDate) batchQuery = batchQuery.lte(dateField, `${filters.endDate}T23:59:59`);
                    if (filters.createdStartDate) batchQuery = batchQuery.gte(lifecycleDateField, `${filters.createdStartDate}T00:00:00`);
                    if (filters.createdEndDate) batchQuery = batchQuery.lte(lifecycleDateField, `${filters.createdEndDate}T23:59:59`);
                    const { data: batch, error: batchError } = await batchQuery.range(pageIndex * batchSize, (pageIndex + 1) * batchSize - 1);
                    if (batchError) {
                        error = batchError;
                        break;
                    }
                    if (batch && batch.length > 0) {
                        allData = [
                            ...allData,
                            ...batch
                        ];
                        if (batch.length < batchSize) hasMore = false;
                        pageIndex++;
                    } else {
                        hasMore = false;
                    }
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
                const allUserIds = [
                    ...new Set((data || []).flatMap((c)=>[
                            c.assigned_to || c.agent_id,
                            c.managed_by
                        ]).filter((id)=>id))
                ];
                let userMap = {};
                if (allUserIds.length > 0) {
                    const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("user_id, id, user_name, employee_id").or(`user_id.in.("${allUserIds.join('","')}"),id.in.("${allUserIds.join('","')}")`);
                    if (userData) {
                        userData.forEach((u)=>{
                            const info = {
                                user_name: u.user_name,
                                employee_id: u.employee_id
                            };
                            userMap[u.user_id] = info;
                            userMap[u.id] = info;
                        });
                    }
                }
                const campaignIds = [
                    ...new Set((data || []).map((c)=>c.campaign_id).filter((id)=>id))
                ];
                let campaignMap = {};
                if (campaignIds.length > 0) {
                    const { data: cData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name").in("id", campaignIds);
                    if (cData) cData.forEach((c)=>{
                        campaignMap[c.id] = c.name;
                    });
                }
                const orgIds = [
                    ...new Set((data || []).map((c)=>c.organization_id).filter((id)=>id))
                ];
                let orgMap = {};
                if (orgIds.length > 0) {
                    const { data: oData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name").in("id", orgIds);
                    if (oData) oData.forEach((o)=>{
                        orgMap[o.id] = o.company_name;
                    });
                }
                // Map data
                const mappedData = (data || []).map((customer)=>({
                        ...customer,
                        assigned_to: customer.assigned_to || customer.agent_id,
                        disposition: customer.disposition || customer.final_disposition || (dataSource === 'closed' ? 'Deal Done' : null),
                        assigned_user_name: userMap[customer.assigned_to || customer.agent_id]?.user_name || null,
                        assigned_employee_id: userMap[customer.assigned_to || customer.agent_id]?.employee_id || null,
                        managed_by_name: customer.managed_by ? userMap[customer.managed_by]?.user_name || "Unknown" : "Self",
                        managed_by_id: customer.managed_by ? userMap[customer.managed_by]?.employee_id || customer.managed_by.slice(0, 8).toUpperCase() : null,
                        campaign_name: customer.campaign_id ? campaignMap[customer.campaign_id] || null : null,
                        organization_name: customer.organization_id ? orgMap[customer.organization_id] || null : null
                    }));
                setAllCustomers(mappedData);
            }
        } catch (err) {
            console.error("Critical error in fetchCustomers:", err);
            setAllCustomers([]);
        } finally{
            setLoadingCustomers(false);
        }
    };
    // Initial fetch on mount or user change - but restricted to prevent focus/tab-switch loops
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Customer.useEffect": ()=>{
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
            }
        }
    }["Customer.useEffect"], [
        user?.uid,
        userLoaded,
        mounted
    ]); // Dependency on user?.uid is more stable than the whole user object
    const fetchFilterMetadata = async ()=>{
        try {
            let orgQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name").order("company_name");
            let campQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name, organization_id, users").order("name");
            let agentQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, user_id, user_name, organization_id").order("user_name");
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
            const [{ data: orgs }, { data: camps }, { data: agents }] = await Promise.all([
                orgQuery,
                campQuery,
                agentQuery
            ]);
            setFilterStats((prev)=>({
                    ...prev,
                    organizations: orgs || [],
                    campaigns: camps || [],
                    agents: agents || []
                }));
        } catch (err) {
            console.error("Error fetching filter metadata:", err);
        }
    };
    const handleBulkUpdate = async (field, value)=>{
        if (!selectedCustomers.size || !value) return;
        setIsUpdatingBulk(true);
        try {
            const ids = Array.from(selectedCustomers);
            if (field === "disposition") {
                if ([
                    "Wrong NO",
                    "DND",
                    "Language barrier"
                ].includes(value)) {
                    // Move to rejected_leads
                    const { data: leads, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("customers").select("*").in("id", ids);
                    if (fetchError) throw fetchError;
                    if (leads && leads.length > 0) {
                        const rejectedLeads = leads.map((lead)=>({
                                customer_id: lead.id,
                                customer_name: lead.customer_name,
                                phone_no: lead.phone_no,
                                phone_search_hash: lead.phone_search_hash || (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["computePhoneHash"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["decryptPhone"])(lead.phone_no)),
                                campaign_id: lead.campaign_id,
                                disposition: value,
                                sub_disposition: lead.sub_disposition,
                                agent_id: lead.assigned_to,
                                rejected_at: new Date().toISOString(),
                                managed_by: lead.managed_by,
                                organization_id: lead.organization_id
                            }));
                        const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("rejected_leads").insert(rejectedLeads);
                        if (insertError) throw insertError;
                        const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("customers").delete().in("id", ids);
                        if (deleteError) throw deleteError;
                    }
                } else if (value === "Move Fresh") {
                    // Reset lead fields to fresh state
                    const { error: resetError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("customers").update({
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
                    }).in("id", ids);
                    if (resetError) throw resetError;
                } else {
                    // Standard disposition update
                    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("customers").update({
                        [field]: value
                    }).in("id", ids);
                    if (error) throw error;
                }
            } else {
                // Standard field update for organization, campaign, assigned_to
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("customers").update({
                    [field]: value
                }).in("id", ids);
                if (error) throw error;
            }
            setSelectedCustomers(new Set());
            await fetchCustomers(currentPage);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Bulk Update: Field "${field}" set to "${value}" for ${ids.length} records.`,
                metadata: {
                    field,
                    value,
                    record_count: ids.length
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])({
                    field,
                    value,
                    ids
                }),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            // Close all bulk modals
            setShowBulkOrgModal(false);
            setShowBulkCampaignModal(false);
            setShowBulkAssignedModal(false);
            setShowBulkDispositionModal(false);
            setBulkValue("");
        } catch (err) {
            console.error("Error updated customers:", err);
            alert("Failed to update customers. Please try again.");
        } finally{
            setIsUpdatingBulk(false);
        }
    };
    const [isMovingToLive, setIsMovingToLive] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleMoveToLive = async ()=>{
        if (!selectedCustomers.size || dataSource !== 'rejected') return;
        setIsMovingToLive(true);
        try {
            const ids = Array.from(selectedCustomers);
            // 1. Fetch from rejected_leads
            const { data: rejectedLeads, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("rejected_leads").select("*").in("id", ids);
            if (fetchError) throw fetchError;
            if (rejectedLeads && rejectedLeads.length > 0) {
                // 2. Map back to customers
                const liveCustomers = rejectedLeads.map((lead)=>({
                        id: lead.customer_id,
                        customer_name: lead.customer_name,
                        phone_no: lead.phone_no,
                        phone_search_hash: lead.phone_search_hash,
                        campaign_id: lead.campaign_id,
                        disposition: lead.disposition,
                        sub_disposition: lead.sub_disposition,
                        assigned_to: lead.agent_id,
                        managed_by: lead.managed_by,
                        organization_id: lead.organization_id,
                        status: "active",
                        updated_at: new Date().toISOString()
                    }));
                // 3. Insert into customers
                const { error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("customers").upsert(liveCustomers); // Use upsert in case the record somehow exists
                if (insertError) throw insertError;
                // 4. Delete from rejected_leads
                const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("rejected_leads").delete().in("id", ids);
                if (deleteError) throw deleteError;
            }
            setSelectedCustomers(new Set());
            await fetchCustomers(currentPage);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Move to Live: ${rejectedLeads?.length || 0} records restored from rejected_leads`,
                metadata: {
                    record_count: rejectedLeads?.length || 0,
                    source: 'rejected_leads',
                    target: 'customers'
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])(rejectedLeads),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            alert(`Successfully moved ${rejectedLeads?.length} lead(s) back to Live.`);
        } catch (err) {
            console.error("Error moving to live:", err);
            alert("Failed to move leads back to live. Please try again.");
        } finally{
            setIsMovingToLive(false);
        }
    };
    const handleExportCustomers = async ()=>{
        if (allCustomers.length === 0) {
            alert("No customers to export.");
            return;
        }
        try {
            // Create CSV content
            const headers = [
                "Lead ID",
                "Name",
                "Phone",
                "Organization",
                "Campaign",
                "Assigned To",
                "Disposition",
                "Created At"
            ];
            const csvData = allCustomers.map((customer)=>[
                    `"${customer.lead_id || ''}"`,
                    `"${customer.customer_name || ''}"`,
                    `"${customer.phone_no || ''}"`,
                    `"${customer.organization_name || ''}"`,
                    `"${customer.campaign_name || ''}"`,
                    `"${customer.assigned_user_name || ''}"`,
                    `"${customer.disposition || ''}"`,
                    `"${customer.created_at || ''}"`
                ]);
            const csvContent = [
                headers,
                ...csvData
            ].map((e)=>e.join(",")).join("\n");
            const blob = new Blob([
                csvContent
            ], {
                type: 'text/csv;charset=utf-8;'
            });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `customers_export_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'READ',
                description: `Export Customers: ${allCustomers.length} records exported to CSV`,
                metadata: {
                    record_count: allCustomers.length,
                    format: 'csv'
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])(allCustomers),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error exporting customers:", err);
            alert("Failed to export customers. Please try again.");
        }
    };
    // Fetch customers when page size changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Customer.useEffect": ()=>{
            if (mounted) {
                setCurrentPage(1); // Reset to page 1 when page size changes
                fetchCustomers(1);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Customer.useEffect"], [
        pageSize
    ]);
    // Fetch customers when search query changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Customer.useEffect": ()=>{
            if (mounted) {
                setCurrentPage(1);
                fetchCustomers(1);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Customer.useEffect"], [
        searchQuery
    ]);
    // Reset search immediately if tempSearchQuery is cleared
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Customer.useEffect": ()=>{
            if (tempSearchQuery === "") {
                setSearchQuery("");
                setCurrentPage(1);
            }
        }
    }["Customer.useEffect"], [
        tempSearchQuery
    ]);
    // Fetch customers when page changes (only if not showing all)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Customer.useEffect": ()=>{
            if (mounted && pageSize !== "all") {
                fetchCustomers(currentPage);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Customer.useEffect"], [
        currentPage
    ]);
    // Use allCustomers directly since it is now filtered by the API
    const filteredCustomers = allCustomers;
    // Calculate pagination
    const effectivePageSize = pageSize === "all" ? totalCustomers : pageSize;
    const totalPages = pageSize === "all" ? 1 : Math.ceil(totalCustomers / pageSize);
    const startIndex = pageSize === "all" ? 1 : (currentPage - 1) * pageSize + 1;
    const endIndex = pageSize === "all" ? totalCustomers : Math.min(currentPage * pageSize, totalCustomers);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "Customers | TFC Connect"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 994,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 993,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6 sm:space-y-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 flex items-start justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-xl sm:text-2xl md:text-3xl font-bold mb-2",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: "Customers"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1004,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm sm:text-base",
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "View and manage all customers in the system"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1013,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1003,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-gray-100/80 backdrop-blur-sm p-1.5 rounded-xl gap-2 flex items-center md:min-w-[300px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setDataSource("live");
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        disposition: ""
                                                    }));
                                                setCurrentPage(1);
                                                fetchCustomers(1);
                                            },
                                            className: `flex-1 flex items-center justify-center gap-2 py-2.5 px-3 md:px-4 rounded-xl text-sm font-bold transition-all duration-300 ${dataSource === "live" ? "bg-white text-[#4b33e8] scale-[1.02] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: `fi text-base flex ${dataSource === "live" ? "fi-sr-bolt" : "fi-rr-bolt"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1039,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hidden md:inline",
                                                    children: "Live"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1040,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1026,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setDataSource("rejected");
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        disposition: ""
                                                    }));
                                                setCurrentPage(1);
                                                fetchCustomers(1);
                                            },
                                            className: `flex-1 flex items-center justify-center gap-2 py-2.5 px-3 md:px-4 rounded-xl text-sm font-bold transition-all duration-300 ${dataSource === "rejected" ? "bg-white text-rose-600 scale-[1.02] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: `fi text-base flex ${dataSource === "rejected" ? "fi-sr-cross-circle" : "fi-rr-cross-circle"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1055,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hidden md:inline",
                                                    children: "Rejected"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1056,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1042,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setDataSource("closed");
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        disposition: ""
                                                    }));
                                                setCurrentPage(1);
                                                fetchCustomers(1);
                                            },
                                            className: `flex-1 flex items-center justify-center gap-2 py-2.5 px-3 md:px-4 rounded-xl text-sm font-bold transition-all duration-300 ${dataSource === "closed" ? "bg-white text-emerald-600 scale-[1.02] shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: `fi text-base flex ${dataSource === "closed" ? "fi-sr-check-circle" : "fi-rr-check-circle"}`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1071,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "hidden md:inline",
                                                    children: "Closed"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1072,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1058,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1025,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 1002,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top right, rgba(75, 51, 232, 0.08), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1084,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-100/30 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1091,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-200/20 blur-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1093,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-purple-300/15 blur-lg"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1094,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2 opacity-5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-users text-5xl sm:text-6xl",
                                                style: {
                                                    color: "#4b33e8"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1097,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1096,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 opacity-[0.03]",
                                            style: {
                                                backgroundImage: "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
                                                backgroundSize: "20px 20px"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1103,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm font-medium",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Total Customer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1113,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                            style: {
                                                                backgroundColor: "transparent"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-users text-lg sm:text-xl",
                                                                style: {
                                                                    color: "#4b33e8"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1128,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1122,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1112,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-3xl sm:text-4xl font-semibold",
                                                            style: {
                                                                color: "#263238",
                                                                fontFamily: "'Poppins', sans-serif"
                                                            },
                                                            children: totalCustomers
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1135,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm mt-1",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Total customers"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1144,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1134,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1111,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1080,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1162,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-green-100/30 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1169,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-green-200/20 blur-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1171,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-green-300/15 blur-lg"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1172,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2 opacity-5",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-user-add text-5xl sm:text-6xl",
                                                style: {
                                                    color: "#10b981"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1175,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1174,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 opacity-[0.03]",
                                            style: {
                                                backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
                                                backgroundSize: "20px 20px"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1181,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm font-medium",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Fresh Customers"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1191,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                            style: {
                                                                backgroundColor: "transparent"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-user-add text-lg sm:text-xl",
                                                                style: {
                                                                    color: "#10b981"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1206,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1200,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1190,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-3xl sm:text-4xl font-semibold",
                                                            style: {
                                                                color: "#263238",
                                                                fontFamily: "'Poppins', sans-serif"
                                                            },
                                                            children: freshCustomersCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1213,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm mt-1",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Unassigned leads"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1222,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1212,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1189,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1158,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 backdrop-blur flex flex-col text-white hover:shadow-md",
                                    style: {
                                        backgroundColor: "#4b33e8"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top left, rgba(255,255,255,0.28), transparent 55%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1240,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1247,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-4 left-4 w-24 h-24 rounded-full bg-white/5 blur-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1249,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute top-12 right-12 w-20 h-20 rounded-full bg-white/8 blur-lg"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1250,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2 opacity-10",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-calendar-check text-5xl sm:text-6xl text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1253,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1252,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 opacity-[0.05]",
                                            style: {
                                                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)",
                                                backgroundSize: "25px 25px"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1256,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm font-medium",
                                                            style: {
                                                                color: "#ffffff",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Follow ups"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1266,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl border border-white/30 bg-white/10 backdrop-blur-lg",
                                                            style: {
                                                                color: "#ffffff"
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-calendar-check text-lg sm:text-xl",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1281,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1275,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1265,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mt-auto",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-3xl sm:text-4xl font-semibold",
                                                            style: {
                                                                color: "#ffffff",
                                                                fontFamily: "'Poppins', sans-serif"
                                                            },
                                                            children: pendingFollowUps
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1288,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm mt-1",
                                                            style: {
                                                                color: "rgba(255, 255, 255, 0.8)",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Pending follow ups"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1297,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1287,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1264,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1236,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative p-0 flex flex-col overflow-hidden",
                                    style: {
                                        backgroundColor: "transparent",
                                        border: "none"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col gap-3 h-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative overflow-hidden flex-1 rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                                style: {
                                                    background: "linear-gradient(135deg, #3b82f6, #2563eb)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0",
                                                        style: {
                                                            background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1323,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1330,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1332,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-4 right-4 w-12 h-12 rounded-full bg-white/6 blur-md"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1333,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute -right-1 -bottom-1 opacity-10",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-clock text-3xl text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1336,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1335,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 opacity-[0.08]",
                                                        style: {
                                                            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                            backgroundSize: "15px 15px"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1339,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative flex items-start justify-between z-10",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-medium mb-1",
                                                                        style: {
                                                                            color: "#ffffff",
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: "Upcoming follow ups"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1349,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xl font-bold",
                                                                        style: {
                                                                            color: "#ffffff",
                                                                            fontFamily: "'Poppins', sans-serif"
                                                                        },
                                                                        children: upcomingFollowUps
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1358,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1348,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex h-8 w-8 items-center justify-center rounded-lg",
                                                                style: {
                                                                    backgroundColor: "transparent"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-clock text-sm",
                                                                    style: {
                                                                        color: "#ffffff"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1374,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1368,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1347,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1317,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative overflow-hidden flex-1 rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                                style: {
                                                    background: "linear-gradient(135deg, #ef4444, #dc2626)"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0",
                                                        style: {
                                                            background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1389,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1396,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1398,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-4 right-4 w-12 h-12 rounded-full bg-white/6 blur-md"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1399,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute -right-1 -bottom-1 opacity-10",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-clock text-3xl text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1402,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1401,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute inset-0 opacity-[0.08]",
                                                        style: {
                                                            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                            backgroundSize: "15px 15px"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1405,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative flex items-start justify-between z-10",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-medium mb-1",
                                                                        style: {
                                                                            color: "#ffffff",
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: "Overdue follow ups"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1415,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xl font-bold",
                                                                        style: {
                                                                            color: "#ffffff",
                                                                            fontFamily: "'Poppins', sans-serif"
                                                                        },
                                                                        children: overdueFollowUps
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1424,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1414,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex h-10 w-10 items-center justify-center rounded-lg",
                                                                style: {
                                                                    backgroundColor: "transparent"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-clock text-sm",
                                                                    style: {
                                                                        color: "#ffffff"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1440,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1434,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1413,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1383,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1315,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 1311,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 1078,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-xl border border-gray-200 p-4 sm:p-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 sm:hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-bold mb-1",
                                                style: {
                                                    color: "#263238",
                                                    fontFamily: "'Poppins', sans-serif"
                                                },
                                                children: [
                                                    "All Customers",
                                                    selectedCustomers.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "ml-2 bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-300 align-middle",
                                                        children: [
                                                            selectedCustomers.size,
                                                            " SELECTED"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1465,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1456,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs",
                                                style: {
                                                    color: "#787E9D",
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: "Manage and view all your customers"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1470,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1455,
                                        columnNumber: 19
                                    }, this),
                                    !selectedCustomers.size && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 sm:hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-2 w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1486,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "Search...",
                                                            value: tempSearchQuery,
                                                            onChange: (e)=>setTempSearchQuery(e.target.value),
                                                            onKeyDown: (e)=>e.key === 'Enter' && setSearchQuery(tempSearchQuery),
                                                            className: "w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1487,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1485,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSearchQuery(tempSearchQuery),
                                                    className: "px-4 bg-[#4b33e8] text-white rounded-lg text-sm font-bold flex items-center justify-center shadow-sm active:scale-95 transition-transform",
                                                    children: "Search"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1496,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 1484,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1483,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mb-4 sm:hidden flex flex-wrap items-center gap-2",
                                        children: [
                                            selectedCustomers.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: dataSource !== 'rejected' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowBulkOrgModal(true),
                                                            className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeOrganizationButtonVisible ? 'hidden' : ''}`,
                                                            title: "Change Organization",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-building text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1518,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1513,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowBulkCampaignModal(true),
                                                            className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeCampaginButtonVisible ? 'hidden' : ''}`,
                                                            title: "Change Campaign",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-megaphone text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1525,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1520,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowBulkAssignedModal(true),
                                                            className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeAssignedButtonVisible ? 'hidden' : ''}`,
                                                            title: "Change Assigned",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-user-pen text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1532,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1527,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowBulkDispositionModal(true),
                                                            className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeDispostionButtonVisible ? 'hidden' : ''}`,
                                                            title: "Change Disposition",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-list-check text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1539,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1534,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleBulkUpdate("disposition", "Move Fresh"),
                                                            className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isMoveFreshButtonVisible ? 'hidden' : ''}`,
                                                            title: "Move Fresh",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-refresh text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1546,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1541,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false),
                                            selectedCustomers.size > 0 && dataSource === 'rejected' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleMoveToLive,
                                                disabled: isMovingToLive,
                                                className: "h-10 px-3 border border-emerald-200 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center text-emerald-600 gap-1.5",
                                                title: "Move to Live",
                                                children: isMovingToLive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1561,
                                                    columnNumber: 29
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-redo text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1564,
                                                            columnNumber: 31
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-bold",
                                                            children: "LIVE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1565,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1554,
                                                columnNumber: 25
                                            }, this),
                                            selectedCustomers.size > 0 && permissionFlags.isDeleteButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: async ()=>{
                                                    if (confirm(`Are you sure you want to delete ${selectedCustomers.size} customer(s)?`)) {
                                                        setIsDeleting(true);
                                                        try {
                                                            const customerIds = Array.from(selectedCustomers);
                                                            // Delete in batches of 50 to avoid URL length and query limits
                                                            const batchSize = 50;
                                                            let successCount = 0;
                                                            let failCount = 0;
                                                            const errors = [];
                                                            for(let i = 0; i < customerIds.length; i += batchSize){
                                                                const batch = customerIds.slice(i, i + batchSize);
                                                                const table = dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals";
                                                                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from(table).delete().in("id", batch);
                                                                if (error) {
                                                                    console.error(`Error deleting batch ${Math.floor(i / batchSize) + 1}:`, error);
                                                                    failCount += batch.length;
                                                                    errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
                                                                } else {
                                                                    successCount += batch.length;
                                                                }
                                                            }
                                                            if (failCount > 0) {
                                                                alert(`Deleted ${successCount} customer(s). ${failCount} failed. ${errors.slice(0, 2).join("; ")}`);
                                                            } else {
                                                                // All successful
                                                                setSelectedCustomers(new Set());
                                                                await fetchCustomers(currentPage);
                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                                                                    event_type: 'WRITE',
                                                                    description: `Bulk Delete: ${customerIds.length} records removed from ${dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals"} (Mobile View)`,
                                                                    metadata: {
                                                                        record_count: customerIds.length
                                                                    },
                                                                    payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])(customerIds),
                                                                    user_name: user?.displayName || 'Admin',
                                                                    organization_id: user?.organization_id || undefined
                                                                });
                                                            }
                                                        } catch (err) {
                                                            console.error("Error deleting customers:", err);
                                                            alert("Failed to delete customers. Please try again.");
                                                        } finally{
                                                            setIsDeleting(false);
                                                        }
                                                    }
                                                },
                                                disabled: isDeleting,
                                                className: "h-10 px-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center text-red-600",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: isDeleting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1655,
                                                    columnNumber: 27
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-trash text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1657,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1572,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>fetchCustomers(currentPage),
                                                className: `h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 ${loadingCustomers ? 'opacity-50' : ''}`,
                                                title: "Refresh Data",
                                                disabled: loadingCustomers,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: `fi flex fi-rr-refresh text-sm ${loadingCustomers ? 'animate-spin' : ''}`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1667,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1661,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowFilterModal(true),
                                                className: `h-10 px-3 border rounded-lg transition-colors flex items-center justify-center gap-2 ${Object.values(filters).some((v)=>v) ? "bg-indigo-50 border-indigo-200 text-indigo-600" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"}`,
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-filter text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1679,
                                                        columnNumber: 23
                                                    }, this),
                                                    Object.values(filters).some((v)=>v) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "w-2 h-2 rounded-full bg-indigo-600"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1681,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1670,
                                                columnNumber: 21
                                            }, this),
                                            permissionFlags.isImportButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowImportModal(true),
                                                className: "h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-upload text-sm text-gray-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1691,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1686,
                                                columnNumber: 21
                                            }, this),
                                            permissionFlags.isExportButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleExportCustomers,
                                                className: "h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                title: "Export Data",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-download text-sm text-gray-600"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1702,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1696,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1 bg-gray-100 rounded-lg p-1 h-10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setViewType("list"),
                                                        className: `px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "list" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-list"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1715,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1707,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setViewType("grid"),
                                                        className: `px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "grid" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-grid"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1725,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1717,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1706,
                                                columnNumber: 21
                                            }, this),
                                            permissionFlags.isAddCustomerButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowAddCustomerModal(true),
                                                className: "h-10 w-10 rounded-lg transition-colors flex items-center justify-center hover:opacity-90",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif",
                                                    backgroundColor: "#4b33e8"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-user-add text-sm text-white"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 1738,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1730,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1507,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "hidden sm:flex sm:items-center sm:justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                        className: "text-xl font-bold mb-1",
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        children: [
                                                            "All Customers",
                                                            selectedCustomers.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-2 bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-300 align-middle",
                                                                children: [
                                                                    selectedCustomers.size,
                                                                    " SELECTED"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1755,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1746,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Manage and view all your customers"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1760,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1745,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    selectedCustomers.size > 0 && permissionFlags.isDeleteButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: async ()=>{
                                                            if (confirm(`Are you sure you want to delete ${selectedCustomers.size} customer(s)?`)) {
                                                                setIsDeleting(true);
                                                                try {
                                                                    const customerIds = Array.from(selectedCustomers);
                                                                    // Delete in batches of 50 to avoid URL length and query limits
                                                                    const batchSize = 50;
                                                                    let successCount = 0;
                                                                    let failCount = 0;
                                                                    const errors = [];
                                                                    for(let i = 0; i < customerIds.length; i += batchSize){
                                                                        const batch = customerIds.slice(i, i + batchSize);
                                                                        const table = dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals";
                                                                        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from(table).delete().in("id", batch);
                                                                        if (error) {
                                                                            console.error(`Error deleting batch ${Math.floor(i / batchSize) + 1}:`, error);
                                                                            failCount += batch.length;
                                                                            errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
                                                                        } else {
                                                                            successCount += batch.length;
                                                                        }
                                                                    }
                                                                    if (failCount > 0) {
                                                                        alert(`Deleted ${successCount} customer(s). ${failCount} failed. ${errors.slice(0, 2).join("; ")}`);
                                                                    } else {
                                                                        // All successful
                                                                        setSelectedCustomers(new Set());
                                                                        await fetchCustomers(currentPage);
                                                                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                                                                            event_type: 'WRITE',
                                                                            description: `Bulk Delete: ${customerIds.length} records removed from ${dataSource === "live" ? "customers" : dataSource === "rejected" ? "rejected_leads" : "closed_deals"} (Desktop View)`,
                                                                            metadata: {
                                                                                record_count: customerIds.length
                                                                            },
                                                                            payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])(customerIds),
                                                                            user_name: user?.displayName || 'Admin',
                                                                            organization_id: user?.organization_id || undefined
                                                                        });
                                                                    }
                                                                } catch (err) {
                                                                    console.error("Error deleting customers:", err);
                                                                    alert("Failed to delete customers. Please try again.");
                                                                } finally{
                                                                    setIsDeleting(false);
                                                                }
                                                            }
                                                        },
                                                        disabled: isDeleting,
                                                        className: "h-10 px-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100 transition-colors flex items-center justify-center text-red-600",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: isDeleting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1857,
                                                            columnNumber: 29
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-trash text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1859,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1773,
                                                        columnNumber: 25
                                                    }, this),
                                                    !selectedCustomers.size ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "relative w-64 text-gray-800",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1867,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        placeholder: "Search customers...",
                                                                        value: tempSearchQuery,
                                                                        onChange: (e)=>setTempSearchQuery(e.target.value),
                                                                        onKeyDown: (e)=>e.key === 'Enter' && setSearchQuery(tempSearchQuery),
                                                                        className: "w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4b33e8] focus:border-transparent font-medium"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1868,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1866,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: fetchDuplicates,
                                                                className: "h-[38px] px-4 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg text-sm font-bold hover:bg-rose-100 transition-all flex items-center gap-2",
                                                                title: "Scan for Duplicate Numbers",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-copy-alt text-xs"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1882,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1877,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1865,
                                                        columnNumber: 25
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300",
                                                        children: [
                                                            dataSource !== 'rejected' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowBulkOrgModal(true),
                                                                        className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeOrganizationButtonVisible ? 'hidden' : ''}`,
                                                                        title: "Change Organization",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-building text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 1902,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1897,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowBulkCampaignModal(true),
                                                                        className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeCampaginButtonVisible ? 'hidden' : ''}`,
                                                                        title: "Change Campaign",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-megaphone text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 1909,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1904,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowBulkAssignedModal(true),
                                                                        className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeAssignedButtonVisible ? 'hidden' : ''}`,
                                                                        title: "Change Assigned",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-user-pen text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 1916,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1911,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowBulkDispositionModal(true),
                                                                        className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isChangeDispostionButtonVisible ? 'hidden' : ''}`,
                                                                        title: "Change Disposition",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-list-check text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 1923,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1918,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>handleBulkUpdate("disposition", "Move Fresh"),
                                                                        className: `h-10 px-3 border border-indigo-200 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors flex items-center justify-center text-indigo-600 ${!permissionFlags.isMoveFreshButtonVisible ? 'hidden' : ''}`,
                                                                        title: "Move Fresh",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-refresh text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 1930,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 1925,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true),
                                                            dataSource === 'rejected' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: handleMoveToLive,
                                                                disabled: isMovingToLive,
                                                                className: "h-10 px-4 border border-emerald-200 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center text-emerald-600 gap-2 font-bold text-xs",
                                                                title: "Move to Live",
                                                                children: isMovingToLive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 1944,
                                                                    columnNumber: 33
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-redo text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 1947,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        "MOVE TO LIVE"
                                                                    ]
                                                                }, void 0, true)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1937,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1894,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>fetchCustomers(currentPage),
                                                        className: `h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center text-gray-600 ${loadingCustomers ? 'opacity-50' : ''}`,
                                                        title: "Refresh Data",
                                                        disabled: loadingCustomers,
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: `fi flex fi-rr-refresh text-sm ${loadingCustomers ? 'animate-spin' : ''}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1962,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1956,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowFilterModal(true),
                                                        className: `h-10 px-3 border rounded-lg transition-colors flex items-center justify-center gap-2 ${Object.values(filters).some((v)=>v) ? "bg-indigo-50 border-indigo-200 text-indigo-600 font-bold" : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-filter text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1975,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: "Filter"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1976,
                                                                columnNumber: 25
                                                            }, this),
                                                            Object.values(filters).some((v)=>v) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "ml-1 px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px]",
                                                                children: Object.values(filters).filter((v)=>v).length
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 1978,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1966,
                                                        columnNumber: 23
                                                    }, this),
                                                    permissionFlags.isImportButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowImportModal(true),
                                                        className: "h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-upload text-sm text-gray-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 1991,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1986,
                                                        columnNumber: 23
                                                    }, this),
                                                    permissionFlags.isExportButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: handleExportCustomers,
                                                        className: "h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        title: "Export Data",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-download text-sm text-gray-600"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2002,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 1996,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1 bg-gray-100 rounded-lg p-1 h-10",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setViewType("list"),
                                                                className: `px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "list" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-list"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2015,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2007,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setViewType("grid"),
                                                                className: `px-3 h-full rounded text-xs font-medium transition-colors flex items-center justify-center ${viewType === "grid" ? "bg-white text-purple-600 shadow-sm" : "text-gray-600 hover:text-gray-900"}`,
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-grid"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2025,
                                                                    columnNumber: 27
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2017,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2006,
                                                        columnNumber: 23
                                                    }, this),
                                                    permissionFlags.isAddCustomerButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setShowAddCustomerModal(true),
                                                        className: "h-10 w-10 rounded-lg transition-colors flex items-center justify-center hover:opacity-90",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif",
                                                            backgroundColor: "#4b33e8"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-user-add text-sm text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2038,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2030,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 1770,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 1744,
                                        columnNumber: 19
                                    }, this),
                                    loadingCustomers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-12",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "animate-spin rounded-full h-8 w-8 border-4 border-t-transparent mx-auto mb-4",
                                                style: {
                                                    borderColor: "#4b33e8"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2047,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-500 text-sm",
                                                style: {
                                                    fontFamily: "'Roboto', sans-serif"
                                                },
                                                children: "Loading customers..."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2051,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2046,
                                        columnNumber: 21
                                    }, this) : filteredCustomers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center py-12",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-500",
                                            style: {
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: searchQuery ? "No customers found matching your search." : "No customers found."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 2060,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2059,
                                        columnNumber: 21
                                    }, this) : viewType === "list" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "overflow-x-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "overflow-x-auto -mx-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "w-full text-left",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "border-b border-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 w-10",
                                                                    children: permissionFlags.isCheckBoxVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-center",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: allCustomers.length > 0 && selectedCustomers.size === allCustomers.length,
                                                                            onChange: (e)=>{
                                                                                if (e.target.checked) {
                                                                                    const allIds = new Set(allCustomers.map((c)=>c.id));
                                                                                    setSelectedCustomers(allIds);
                                                                                } else {
                                                                                    setSelectedCustomers(new Set());
                                                                                }
                                                                            },
                                                                            className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2078,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2077,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2075,
                                                                    columnNumber: 34
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Customer Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2100,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center",
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2103,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Campaign"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2106,
                                                                    columnNumber: 34
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Organization"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2109,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Assigned To"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2112,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Managed By"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2115,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: "Disposition"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2118,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: dataSource === "closed" ? "Final Status" : dataSource === "rejected" ? "Rejection Reason" : "Expiry Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2121,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                                    children: dataSource === "closed" ? "Closed Date" : dataSource === "rejected" ? "Rejected Date" : "Created Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2124,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right",
                                                                    children: "Action"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2127,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2074,
                                                            columnNumber: 31
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2073,
                                                        columnNumber: 29
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        className: "divide-y divide-gray-50",
                                                        children: filteredCustomers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: "group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: permissionFlags.isCheckBoxVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: selectedCustomers.has(customer.id),
                                                                                onChange: (e)=>{
                                                                                    const newSelected = new Set(selectedCustomers);
                                                                                    if (e.target.checked) {
                                                                                        newSelected.add(customer.id);
                                                                                    } else {
                                                                                        newSelected.delete(customer.id);
                                                                                    }
                                                                                    setSelectedCustomers(newSelected);
                                                                                },
                                                                                className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2141,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2140,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2138,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase",
                                                                                    children: customer.customer_name ? customer.customer_name.charAt(0).toUpperCase() : "C"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2162,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium text-gray-800",
                                                                                    style: {
                                                                                        fontFamily: "'Poppins', sans-serif",
                                                                                        color: "#263238"
                                                                                    },
                                                                                    children: customer.customer_name || "N/A"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2169,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2161,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2160,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4 text-center",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex justify-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${dataSource === "closed" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : dataSource === "rejected" ? "bg-rose-50 text-rose-600 border border-rose-100" : customer.status === "active" ? "bg-green-50 text-green-600 border border-green-100" : customer.status === "inactive" ? "bg-gray-50 text-gray-600 border border-gray-100" : "bg-orange-50 text-orange-600 border border-orange-100"}`,
                                                                                children: dataSource === "closed" ? "Deal Done" : dataSource === "rejected" ? "Rejected" : customer.status === "active" ? "Active" : customer.status === "inactive" ? "Inactive" : "Pending"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2183,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2182,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2181,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide",
                                                                            children: customer.campaign_name || "No Campaign"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2200,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2199,
                                                                        columnNumber: 36
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-building text-[#4b33e8] text-xs"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2206,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[12px] font-medium text-gray-700",
                                                                                    style: {
                                                                                        fontFamily: "'Roboto', sans-serif"
                                                                                    },
                                                                                    children: customer.organization_name || "N/A"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2207,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2205,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2204,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-medium text-gray-600",
                                                                            children: customer.assigned_user_name || customer.assigned_employee_id || "Unassigned"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2218,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2217,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-semibold text-gray-800",
                                                                                    children: customer.managed_by_name || "Self"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2226,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                customer.managed_by_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[10px] text-gray-400 font-medium",
                                                                                    children: [
                                                                                        "ID: ",
                                                                                        customer.managed_by_id
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2230,
                                                                                    columnNumber: 41
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2225,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2224,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 uppercase tracking-tighter",
                                                                            children: customer.disposition || "No Status"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2237,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2236,
                                                                        columnNumber: 36
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium text-gray-700 leading-none mb-1",
                                                                                    children: dataSource === "closed" || dataSource === "rejected" ? customer.disposition || "N/A" : customer.expiry_date ? formatDate(customer.expiry_date) : "---"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2243,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] text-gray-400 font-medium uppercase tracking-tighter",
                                                                                    children: dataSource === "closed" || dataSource === "rejected" ? "Disposition" : "Expires"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2248,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2242,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2241,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-medium text-gray-700 leading-none mb-1",
                                                                                    children: formatDate(dataSource === "closed" ? customer.closed_at : dataSource === "rejected" ? customer.rejected_at : customer.created_at)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2255,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] text-gray-400 font-medium uppercase tracking-tighter",
                                                                                    children: dataSource === "closed" ? "Closed" : dataSource === "rejected" ? "Rejected" : "Created"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2258,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2254,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2253,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-4 py-4 text-right",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center justify-end gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: ()=>{
                                                                                        setSelectedCustomer(customer);
                                                                                        setShowCustomerDetailsModal(true);
                                                                                    },
                                                                                    className: "text-purple-600 hover:text-purple-700 transition-colors p-1.5 hover:bg-purple-50 rounded",
                                                                                    title: "View Details",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-info text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                                        lineNumber: 2273,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2265,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                permissionFlags.isDeleteFromLeadButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    className: "text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded",
                                                                                    title: "Delete",
                                                                                    onClick: async ()=>{
                                                                                        if (confirm("Are you sure you want to delete this customer?")) {
                                                                                            try {
                                                                                                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("customers").delete().eq("id", customer.id);
                                                                                                if (error) {
                                                                                                    console.error("Error deleting customer:", error);
                                                                                                    alert("Failed to delete customer");
                                                                                                } else {
                                                                                                    await fetchCustomers(currentPage);
                                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                                                                                                        event_type: 'WRITE',
                                                                                                        description: `Delete Customer: ${customer.customer_name || 'N/A'} (ID: ${customer.id}) removed`,
                                                                                                        metadata: {
                                                                                                            customer_id: customer.id,
                                                                                                            customer_name: customer.customer_name
                                                                                                        },
                                                                                                        payload_size: 0,
                                                                                                        user_name: user?.displayName || 'Admin',
                                                                                                        organization_id: user?.organization_id || undefined
                                                                                                    });
                                                                                                }
                                                                                            } catch (err) {
                                                                                                console.error("Error deleting customer:", err);
                                                                                                alert("Failed to delete customer");
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-trash text-sm"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                                        lineNumber: 2322,
                                                                                        columnNumber: 41
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2276,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2264,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2263,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, customer.id, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2134,
                                                                columnNumber: 33
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2132,
                                                        columnNumber: 29
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2072,
                                                columnNumber: 27
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 2071,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2070,
                                        columnNumber: 21
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
                                        children: filteredCustomers.map((customer)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "absolute top-2 right-2 flex items-center gap-1 z-10",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    setSelectedCustomer(customer);
                                                                    setShowCustomerDetailsModal(true);
                                                                },
                                                                className: "text-purple-600 hover:text-purple-700 transition-colors p-1.5 hover:bg-purple-50 rounded",
                                                                title: "View Details",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-info text-sm"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2354,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2342,
                                                                columnNumber: 29
                                                            }, this),
                                                            permissionFlags.isDeleteFromLeadButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: async (e)=>{
                                                                    e.stopPropagation();
                                                                    if (confirm("Are you sure you want to delete this customer?")) {
                                                                        try {
                                                                            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("customers").delete().eq("id", customer.id);
                                                                            if (error) {
                                                                                console.error("Error deleting customer:", error);
                                                                                alert("Failed to delete customer");
                                                                            } else {
                                                                                await fetchCustomers(currentPage);
                                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                                                                                    event_type: 'WRITE',
                                                                                    description: `Delete Customer: ${customer.customer_name || 'N/A'} (ID: ${customer.id}) removed from Grid`,
                                                                                    metadata: {
                                                                                        customer_id: customer.id,
                                                                                        customer_name: customer.customer_name
                                                                                    },
                                                                                    payload_size: 0,
                                                                                    user_name: user?.displayName || 'Admin',
                                                                                    organization_id: user?.organization_id || undefined
                                                                                });
                                                                            }
                                                                        } catch (err) {
                                                                            console.error("Error deleting customer:", err);
                                                                            alert("Failed to delete customer");
                                                                        }
                                                                    }
                                                                },
                                                                className: "text-red-600 hover:text-red-700 transition-colors p-1.5 hover:bg-red-50 rounded",
                                                                title: "Delete",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-trash text-sm"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2403,
                                                                    columnNumber: 31
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2357,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2341,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3 mb-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg",
                                                                children: customer.customer_name ? customer.customer_name.charAt(0).toUpperCase() : "C"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2408,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 min-w-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-sm font-semibold text-gray-900 truncate",
                                                                        style: {
                                                                            fontFamily: "'Poppins', sans-serif"
                                                                        },
                                                                        children: customer.customer_name || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2414,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs text-gray-600 truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(customer.phone_no) || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2420,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2413,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2407,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-3 text-xs mt-4",
                                                        children: [
                                                            customer.lead_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-id-card text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2431,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.lead_id
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2432,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2430,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-bullhorn text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2441,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.campaign_name || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2442,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2440,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-building text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2450,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.organization_name || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2451,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2449,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-headset text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2459,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.assigned_user_name || "Unassigned"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2460,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2458,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 text-gray-600",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-user text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2468,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "truncate",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: customer.managed_by_name || "Self"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2469,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2467,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between pt-2 border-t border-gray-50 mt-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${customer.status === "active" ? "bg-green-100" : customer.status === "inactive" ? "bg-gray-100" : "bg-orange-100"}`,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: `w-1 h-1 rounded-full ${customer.status === "active" ? "bg-green-500" : customer.status === "inactive" ? "bg-gray-400" : "bg-orange-400"}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2487,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: `text-[10px] font-semibold ${customer.status === "active" ? "text-green-700" : customer.status === "inactive" ? "text-gray-600" : "text-orange-700"}`,
                                                                                children: customer.status === "active" ? "Active" : customer.status === "inactive" ? "Inactive" : "Pending"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2496,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2478,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    customer.expiry_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2 text-gray-400",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-calendar text-[10px]"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2515,
                                                                                columnNumber: 35
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                style: {
                                                                                    fontFamily: "'Roboto', sans-serif"
                                                                                },
                                                                                children: formatDate(customer.expiry_date)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2516,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2514,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2477,
                                                                columnNumber: 29
                                                            }, this),
                                                            customer.customer_details && (()=>{
                                                                try {
                                                                    const rawData = JSON.parse(customer.customer_details);
                                                                    let details = rawData;
                                                                    if (rawData.active_details && rawData.history) {
                                                                        details = rawData.history[rawData.active_details] || {};
                                                                    }
                                                                    const checkedFields = Object.entries(details).filter(([key])=>key.endsWith("_checked")).map(([key, value])=>({
                                                                            fieldName: key.replace("_checked", ""),
                                                                            value: String(value)
                                                                        }));
                                                                    if (checkedFields.length === 0) return null;
                                                                    return checkedFields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 text-gray-500 pt-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-check text-[10px] text-green-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2549,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "truncate",
                                                                                    style: {
                                                                                        fontFamily: "'Roboto', sans-serif"
                                                                                    },
                                                                                    title: `${field.fieldName}: ${field.value}`,
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "font-medium text-gray-700",
                                                                                            children: [
                                                                                                field.fieldName,
                                                                                                ":"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                                            lineNumber: 2557,
                                                                                            columnNumber: 41
                                                                                        }, this),
                                                                                        " ",
                                                                                        field.value
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2550,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, field.fieldName, true, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 2545,
                                                                            columnNumber: 37
                                                                        }, this));
                                                                } catch (e) {
                                                                    return null;
                                                                }
                                                            })()
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2428,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, customer.id, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2336,
                                                columnNumber: 25
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2334,
                                        columnNumber: 21
                                    }, this),
                                    !loadingCustomers && totalCustomers > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 bg-white border-t border-gray-200 rounded-b-lg",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-sm text-gray-600",
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: [
                                                            "Showing ",
                                                            startIndex,
                                                            " to ",
                                                            endIndex,
                                                            " of ",
                                                            totalCustomers,
                                                            " ",
                                                            "customers"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2578,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "text-xs text-gray-600",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: "Per page:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2587,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                value: pageSize,
                                                                onChange: (e)=>{
                                                                    const newPageSize = e.target.value === "all" ? "all" : parseInt(e.target.value);
                                                                    setPageSize(newPageSize);
                                                                },
                                                                className: "px-2 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500",
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "50",
                                                                        children: "50"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2605,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "100",
                                                                        children: "100"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2606,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "200",
                                                                        children: "200"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2607,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "all",
                                                                        children: "All"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2608,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2593,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2586,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2577,
                                                columnNumber: 23
                                            }, this),
                                            pageSize !== "all" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            if (currentPage > 1) {
                                                                setCurrentPage(currentPage - 1);
                                                            }
                                                        },
                                                        disabled: currentPage === 1 || loadingCustomers,
                                                        className: `px-2 py-1.5 w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === 1 || loadingCustomers ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-angle-left"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2627,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2614,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-1",
                                                        children: Array.from({
                                                            length: Math.min(5, totalPages)
                                                        }, (_, i)=>{
                                                            let pageNum;
                                                            if (totalPages <= 5) {
                                                                pageNum = i + 1;
                                                            } else if (currentPage <= 3) {
                                                                pageNum = i + 1;
                                                            } else if (currentPage >= totalPages - 2) {
                                                                pageNum = totalPages - 4 + i;
                                                            } else {
                                                                pageNum = currentPage - 2 + i;
                                                            }
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setCurrentPage(pageNum),
                                                                disabled: loadingCustomers,
                                                                className: `w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum ? "bg-[#4b33e8] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                                                                style: {
                                                                    fontFamily: "'Roboto', sans-serif"
                                                                },
                                                                children: pageNum
                                                            }, pageNum, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2644,
                                                                columnNumber: 35
                                                            }, this);
                                                        })
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2629,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>{
                                                            if (currentPage < totalPages) {
                                                                setCurrentPage(currentPage + 1);
                                                            }
                                                        },
                                                        disabled: currentPage >= totalPages || loadingCustomers,
                                                        className: `px-3 w-8 h-8 py-1.5 rounded-lg text-sm font-medium transition-colors ${currentPage >= totalPages || loadingCustomers ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                                                        style: {
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-angle-right "
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2677,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 2662,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 2613,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2576,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/customer.tsx",
                                lineNumber: 1453,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 1452,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 1000,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 999,
                columnNumber: 11
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                show: showImportModal,
                onClose: ()=>setShowImportModal(false),
                onSuccess: ()=>fetchCustomers(1)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 2690,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCustomerModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                show: showAddCustomerModal,
                onClose: ()=>setShowAddCustomerModal(false),
                onSuccess: ()=>{
                    setShowAddCustomerModal(false);
                    fetchCustomers(); // Refresh data
                }
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 2696,
                columnNumber: 7
            }, this),
            showCustomerDetailsModal && selectedCustomer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 backdrop-blur-lg flex items-center justify-center z-50 p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold",
                                    style: {
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: "Customer Details"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 2711,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowCustomerDetailsModal(false);
                                        setSelectedCustomer(null);
                                        setViewingDetailsKey(null);
                                    },
                                    className: "text-gray-400 hover:text-gray-600 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 2728,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 2720,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 2710,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold mb-4",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: "Basic Information"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 2736,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                selectedCustomer.customer_details && (()=>{
                                                    try {
                                                        const rawData = JSON.parse(selectedCustomer.customer_details);
                                                        if (rawData.active_details && rawData.history) {
                                                            const keys = Object.keys(rawData.history).sort((a, b)=>{
                                                                const numA = parseInt(a.split('-')[1]);
                                                                const numB = parseInt(b.split('-')[1]);
                                                                return numA - numB;
                                                            });
                                                            if (keys.length > 1) {
                                                                const handleNext = ()=>{
                                                                    const currentKey = viewingDetailsKey || rawData.active_details;
                                                                    const currentIndex = keys.indexOf(currentKey);
                                                                    const nextIndex = (currentIndex + 1) % keys.length;
                                                                    setViewingDetailsKey(keys[nextIndex]);
                                                                };
                                                                const handlePrev = ()=>{
                                                                    const currentKey = viewingDetailsKey || rawData.active_details;
                                                                    const currentIndex = keys.indexOf(currentKey);
                                                                    const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
                                                                    setViewingDetailsKey(keys[prevIndex]);
                                                                };
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "md:col-span-2 mt-4",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center justify-between bg-indigo-50 p-1.5 rounded-2xl border border-indigo-100 shadow-sm mb-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: handlePrev,
                                                                                className: "w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-angle-left mt-0.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2777,
                                                                                    columnNumber: 51
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2773,
                                                                                columnNumber: 47
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "flex flex-col items-center",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[8px] font-black text-indigo-300 uppercase tracking-tighter",
                                                                                        children: "DATA HISTORY"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                                        lineNumber: 2781,
                                                                                        columnNumber: 51
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "text-xs font-black text-indigo-900",
                                                                                        children: String(viewingDetailsKey || rawData.active_details).replace('details-', 'RECORD #')
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                                        lineNumber: 2782,
                                                                                        columnNumber: 51
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2780,
                                                                                columnNumber: 47
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: handleNext,
                                                                                className: "w-9 h-9 flex items-center justify-center bg-white border border-indigo-200 rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-90 shadow-sm",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-angle-right mt-0.5"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                                    lineNumber: 2791,
                                                                                    columnNumber: 51
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 2787,
                                                                                columnNumber: 47
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2772,
                                                                        columnNumber: 43
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2771,
                                                                    columnNumber: 39
                                                                }, this);
                                                            }
                                                        }
                                                    } catch (e) {}
                                                    return null;
                                                })(),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Customer Name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2802,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.customer_name || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2808,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2801,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Phone Number"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2816,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(selectedCustomer.phone_no) || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2822,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2815,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Lead ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2830,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.lead_id || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2836,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2829,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Expiry Date"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2844,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.expiry_date ? formatDate(selectedCustomer.expiry_date) : "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2850,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2843,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Assigned To"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2860,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.assigned_user_name || selectedCustomer.assigned_employee_id || "N/A"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2866,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2859,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Managed By"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2876,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm font-semibold text-gray-900",
                                                                    style: {
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: selectedCustomer.managed_by_name || "Self"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2883,
                                                                    columnNumber: 23
                                                                }, this),
                                                                selectedCustomer.managed_by_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] text-gray-400",
                                                                    style: {
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: [
                                                                        "ID: ",
                                                                        selectedCustomer.managed_by_id
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 2890,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2882,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2875,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2900,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "inline-flex items-center gap-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${selectedCustomer.status === "active" ? "bg-green-100" : selectedCustomer.status === "inactive" ? "bg-gray-100" : "bg-orange-100"}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `w-1.5 h-1.5 rounded-full ${selectedCustomer.status === "active" ? "bg-green-500" : selectedCustomer.status === "inactive" ? "bg-gray-400" : "bg-orange-400"}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2915,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `text-xs font-semibold ${selectedCustomer.status === "active" ? "text-green-700" : selectedCustomer.status === "inactive" ? "text-gray-600" : "text-orange-700"}`,
                                                                        children: selectedCustomer.status === "active" ? "Active" : selectedCustomer.status === "inactive" ? "Inactive" : "Pending"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2923,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2907,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2906,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2899,
                                                    columnNumber: 19
                                                }, this),
                                                selectedCustomer.campaign_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Campaign ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2942,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.campaign_id
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2948,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2941,
                                                    columnNumber: 21
                                                }, this),
                                                selectedCustomer.utilities && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Utilities"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2958,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: selectedCustomer.utilities
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 2964,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 2957,
                                                    columnNumber: 21
                                                }, this),
                                                selectedCustomer.customer_details && (()=>{
                                                    try {
                                                        const rawData = JSON.parse(selectedCustomer.customer_details);
                                                        let details = rawData;
                                                        if (rawData.active_details && rawData.history) {
                                                            details = rawData.history[viewingDetailsKey || rawData.active_details] || {};
                                                        }
                                                        const checkedFields = Object.entries(details).filter(([key])=>key.endsWith("_checked")).map(([key, value])=>({
                                                                fieldName: key.replace("_checked", ""),
                                                                value: String(value)
                                                            }));
                                                        return checkedFields.map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: "text-xs font-medium text-gray-500 block mb-1",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: field.fieldName
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2990,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm text-gray-900",
                                                                        style: {
                                                                            fontFamily: "'Roboto', sans-serif"
                                                                        },
                                                                        children: field.value
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 2996,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, field.fieldName, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 2989,
                                                                columnNumber: 27
                                                            }, this));
                                                    } catch (e) {
                                                        return null;
                                                    }
                                                })()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 2745,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 2735,
                                    columnNumber: 15
                                }, this),
                                selectedCustomer.customer_details && (()=>{
                                    try {
                                        const rawData = JSON.parse(selectedCustomer.customer_details);
                                        let details = rawData;
                                        if (rawData.active_details && rawData.history) {
                                            details = rawData.history[viewingDetailsKey || rawData.active_details] || {};
                                        }
                                        const uncheckedFields = Object.entries(details).filter(([key])=>key.endsWith("_unchecked"));
                                        if (uncheckedFields.length === 0) return null;
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-6",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-semibold mb-4",
                                                    style: {
                                                        color: "#263238",
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Policy Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3028,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                                    children: uncheckedFields.map(([key, value])=>{
                                                        const displayKey = key.replace("_unchecked", "");
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "text-xs font-medium text-gray-500 block mb-1",
                                                                    style: {
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: displayKey
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3042,
                                                                    columnNumber: 33
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-sm text-gray-900",
                                                                    style: {
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: String(value)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3048,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, key, true, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3041,
                                                            columnNumber: 31
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3037,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3027,
                                            columnNumber: 23
                                        }, this);
                                    } catch (e) {
                                        return null;
                                    }
                                })(),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold mb-4",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: "Additional Information"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3067,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Created Date"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3078,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: formatDate(selectedCustomer.created_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3084,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3077,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-medium text-gray-500 block mb-1",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Last Updated"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3092,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm text-gray-900",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: formatDate(selectedCustomer.updated_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3098,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3091,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3076,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3066,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end pt-4 border-t border-gray-200",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setShowCustomerDetailsModal(false);
                                            setSelectedCustomer(null);
                                            setViewingDetailsKey(null);
                                        },
                                        className: "px-6 py-2 bg-[#4b33e8] hover:bg-[#3d28b8] text-white rounded-lg text-sm font-medium transition-colors",
                                        style: {
                                            fontFamily: "'Roboto', sans-serif"
                                        },
                                        children: "Close"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3110,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3109,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 2733,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 2708,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 2707,
                columnNumber: 9
            }, this),
            showFilterModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-gray-800",
                                    style: {
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: "Filter Customers"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3132,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowFilterModal(false),
                                    className: "w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3139,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3135,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3131,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                            style: {
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Organization"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3146,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: filters.organization,
                                            onChange: (e)=>{
                                                const newOrg = e.target.value;
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        organization: newOrg,
                                                        // Reset dependent filters if they don't match the new organization
                                                        campaign: "",
                                                        assignedTo: ""
                                                    }));
                                            },
                                            className: "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "All Organizations"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3163,
                                                    columnNumber: 19
                                                }, this),
                                                filterStats.organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: org.id,
                                                        children: org.company_name
                                                    }, org.id, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3165,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3149,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3145,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                            style: {
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Campaign"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3172,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: filters.campaign,
                                            onChange: (e)=>{
                                                const newCamp = e.target.value;
                                                setFilters((prev)=>({
                                                        ...prev,
                                                        campaign: newCamp,
                                                        // Reset assigned to if it doesn't match the new campaign
                                                        assignedTo: ""
                                                    }));
                                            },
                                            className: "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "All Campaigns"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3188,
                                                    columnNumber: 19
                                                }, this),
                                                filterStats.campaigns.filter((camp)=>!filters.organization || camp.organization_id === filters.organization).map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: camp.id,
                                                        children: camp.name
                                                    }, camp.id, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3192,
                                                        columnNumber: 23
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3175,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3171,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                            style: {
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Assigned To"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3199,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: filters.assignedTo,
                                            onChange: (e)=>setFilters((prev)=>({
                                                        ...prev,
                                                        assignedTo: e.target.value
                                                    })),
                                            className: "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "All Agents"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3207,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "unassigned",
                                                    children: "Unassigned Only"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3208,
                                                    columnNumber: 19
                                                }, this),
                                                (()=>{
                                                    const selectedCampaign = filterStats.campaigns.find((c)=>c.id === filters.campaign);
                                                    const campaignUserIds = selectedCampaign?.users?.map((u)=>u.user_id) || [];
                                                    return filterStats.agents.filter((agent)=>{
                                                        const orgMatch = !filters.organization || agent.organization_id === filters.organization;
                                                        const campaignMatch = !filters.campaign || campaignUserIds.includes(agent.user_id);
                                                        return orgMatch && campaignMatch;
                                                    }).map((agent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: agent.user_id || agent.id,
                                                            children: agent.user_name
                                                        }, agent.id, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3220,
                                                            columnNumber: 25
                                                        }, this));
                                                })()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3202,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3198,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                            style: {
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Disposition"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3228,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: filters.disposition,
                                            onChange: (e)=>setFilters((prev)=>({
                                                        ...prev,
                                                        disposition: e.target.value
                                                    })),
                                            className: "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "",
                                                    children: "All Dispositions"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3236,
                                                    columnNumber: 19
                                                }, this),
                                                filterStats.dispositions.map((disp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: disp,
                                                        children: disp
                                                    }, disp, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3238,
                                                        columnNumber: 21
                                                    }, this))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3231,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3227,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4 mt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                                    style: {
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: "Created Start"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3246,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: filters.createdStartDate,
                                                            onChange: (e)=>setFilters((prev)=>({
                                                                        ...prev,
                                                                        createdStartDate: e.target.value
                                                                    })),
                                                            className: "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all hover:bg-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3250,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-20",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-calendar text-xs"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3257,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3256,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3249,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3245,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                                    style: {
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: "Created End"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3262,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: filters.createdEndDate,
                                                            onChange: (e)=>setFilters((prev)=>({
                                                                        ...prev,
                                                                        createdEndDate: e.target.value
                                                                    })),
                                                            className: "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all hover:bg-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3266,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-20",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-calendar text-xs"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3273,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3272,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3265,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3261,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3244,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-4 mt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                                    style: {
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: "Expiry Start"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3282,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: filters.startDate,
                                                            onChange: (e)=>setFilters((prev)=>({
                                                                        ...prev,
                                                                        startDate: e.target.value
                                                                    })),
                                                            className: "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all hover:bg-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3286,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-20",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-calendar text-xs"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3293,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3292,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3285,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3281,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                                    style: {
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: "Expiry End"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3298,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: filters.endDate,
                                                            onChange: (e)=>setFilters((prev)=>({
                                                                        ...prev,
                                                                        endDate: e.target.value
                                                                    })),
                                                            className: "w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all hover:bg-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3302,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none opacity-20",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-calendar text-xs"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3309,
                                                                columnNumber: 23
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3308,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3301,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3297,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3280,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3143,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
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
                                    },
                                    className: "flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors",
                                    children: "Reset"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3317,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowFilterModal(false);
                                        fetchCustomers(1);
                                    },
                                    className: "flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200",
                                    children: "Apply Filters"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3334,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3316,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 3130,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 3129,
                columnNumber: 9
            }, this),
            showDuplicateModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[130] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg w-full max-w-4xl shadow-2xl flex flex-col max-h-[80vh] border border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-gray-800",
                                            children: "Duplicate Entries"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3355,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 ml-4 bg-gray-50 rounded-lg p-1 border border-gray-100",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2 px-2 border-r border-gray-200 pr-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            className: "w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer",
                                                            checked: filteredDuplicateLeads.length > 0 && filteredDuplicateLeads.every((l)=>selectedDuplicateLeads.has(l.lead_id)),
                                                            onChange: (e)=>{
                                                                const newSelected = new Set(selectedDuplicateLeads);
                                                                filteredDuplicateLeads.forEach((l)=>{
                                                                    if (e.target.checked) newSelected.add(l.lead_id);
                                                                    else newSelected.delete(l.lead_id);
                                                                });
                                                                setSelectedDuplicateLeads(newSelected);
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3359,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-bold text-gray-500 uppercase tracking-tighter",
                                                            children: "Select All"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3372,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3358,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: duplicateDispositionFilter,
                                                    onChange: (e)=>setDuplicateDispositionFilter(e.target.value),
                                                    className: "px-2 py-1 bg-transparent text-[11px] text-gray-600 focus:outline-none min-w-[130px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Dispositions"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3380,
                                                            columnNumber: 21
                                                        }, this),
                                                        [
                                                            ...new Set(duplicateLeads.map((l)=>l.disposition).filter(Boolean))
                                                        ].sort().map((disp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: disp,
                                                                children: disp
                                                            }, disp, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3382,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3375,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: duplicateCampaignFilter,
                                                    onChange: (e)=>setDuplicateCampaignFilter(e.target.value),
                                                    className: "px-2 py-1.5 bg-white border border-gray-200 rounded text-[11px] text-gray-600 focus:outline-none min-w-[140px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Campaigns"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3390,
                                                            columnNumber: 21
                                                        }, this),
                                                        [
                                                            ...new Set(duplicateLeads.map((l)=>l.campaign_name || l.campaign_id).filter(Boolean))
                                                        ].sort().map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: camp,
                                                                children: camp
                                                            }, camp, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3392,
                                                                columnNumber: 23
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3385,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3357,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3354,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowDuplicateModal(false);
                                        setDuplicateDispositionFilter("");
                                        setDuplicateCampaignFilter("");
                                    },
                                    className: "text-gray-400 hover:text-gray-600 p-1",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-cross-small text-xl leading-none"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3406,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3398,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3353,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto custom-scrollbar",
                            children: loadingDuplicates ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-20 text-center text-gray-400 uppercase tracking-widest text-[10px] font-medium",
                                children: "Scanning for duplicates..."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/customer.tsx",
                                lineNumber: 3412,
                                columnNumber: 17
                            }, this) : duplicateLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "py-20 text-center text-gray-400 text-sm",
                                children: "No duplicates found."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/customer.tsx",
                                lineNumber: 3416,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "divide-y divide-gray-100",
                                children: Object.values(filteredDuplicateLeads.reduce((acc, lead)=>{
                                    if (!acc[lead.phone_search_hash]) acc[lead.phone_search_hash] = [];
                                    acc[lead.phone_search_hash].push(lead);
                                    return acc;
                                }, {})).map((group, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "px-5 py-2 bg-gray-50/50 flex items-center justify-between border-y border-gray-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                className: "w-4 h-4 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer",
                                                                checked: group.every((item)=>selectedDuplicateLeads.has(item.lead_id)),
                                                                onChange: (e)=>{
                                                                    const newSelected = new Set(selectedDuplicateLeads);
                                                                    group.forEach((item)=>{
                                                                        if (e.target.checked) newSelected.add(item.lead_id);
                                                                        else newSelected.delete(item.lead_id);
                                                                    });
                                                                    setSelectedDuplicateLeads(newSelected);
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3429,
                                                                columnNumber: 28
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-gray-500 uppercase text-[10px]",
                                                                children: [
                                                                    "Group ",
                                                                    idx + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3442,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3428,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-4",
                                                        children: [
                                                            group.some((item)=>selectedDuplicateLeads.has(item.lead_id)) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    const selectedItemsInGroup = group.filter((item)=>selectedDuplicateLeads.has(item.lead_id));
                                                                    handleDeleteMultipleDuplicates(selectedItemsInGroup);
                                                                },
                                                                className: "text-[10px] font-bold text-rose-600 hover:text-rose-700 uppercase tracking-tight flex items-center gap-1.5 transition-colors",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-trash"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3453,
                                                                        columnNumber: 32
                                                                    }, this),
                                                                    "Delete Selected"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3446,
                                                                columnNumber: 30
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-gray-400",
                                                                children: [
                                                                    group.length,
                                                                    " records"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3457,
                                                                columnNumber: 28
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3444,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 3427,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                className: "w-full text-left",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                            className: "text-gray-400 uppercase text-[9px] font-bold border-b border-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-2 w-10"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3463,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-2",
                                                                    children: "Customer / Phone"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3464,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Lead ID"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3465,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3466,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Stage"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3467,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Campaign"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3468,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Agent"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3469,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-2",
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3470,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-2"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                                    lineNumber: 3471,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                            lineNumber: 3462,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3461,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                        className: "divide-y divide-gray-50",
                                                        children: group.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                className: `hover:bg-gray-50/30 transition-colors text-[11px] ${selectedDuplicateLeads.has(item.lead_id) ? 'bg-rose-50/20' : ''}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-3",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            className: "w-3.5 h-3.5 rounded border-gray-300 text-rose-600 focus:ring-rose-500 cursor-pointer",
                                                                            checked: selectedDuplicateLeads.has(item.lead_id),
                                                                            onChange: ()=>{
                                                                                const newSelected = new Set(selectedDuplicateLeads);
                                                                                if (newSelected.has(item.lead_id)) newSelected.delete(item.lead_id);
                                                                                else newSelected.add(item.lead_id);
                                                                                setSelectedDuplicateLeads(newSelected);
                                                                            }
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 3478,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3477,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "font-semibold text-gray-800",
                                                                                children: item.customer_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 3491,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "text-gray-400",
                                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(item.phone_no)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 3492,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3490,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-500",
                                                                        children: item.lead_id || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3494,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-500",
                                                                        children: item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB') : '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3495,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: `font-bold ${item.stage === 'Live' ? 'text-indigo-600' : item.stage === 'Rejected' ? 'text-rose-500' : 'text-emerald-600'}`,
                                                                            children: item.stage
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 3499,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3498,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-600",
                                                                        children: item.campaign_name || item.campaign_id || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3507,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-600",
                                                                        children: item.assigned_to_name || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3508,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-3 text-gray-600",
                                                                        children: item.disposition || '-'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3509,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-3 text-right",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleDeleteDuplicateEntry(item),
                                                                            className: "text-gray-300 hover:text-rose-500 transition-colors",
                                                                            title: "Delete Entry",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "fi fi-rr-trash"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                                lineNumber: 3516,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/customer.tsx",
                                                                            lineNumber: 3511,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                                        lineNumber: 3510,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, i, true, {
                                                                fileName: "[project]/pages/portal/customer.tsx",
                                                                lineNumber: 3476,
                                                                columnNumber: 29
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/customer.tsx",
                                                        lineNumber: 3474,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 3460,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3426,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/customer.tsx",
                                lineNumber: 3420,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3410,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-400 font-medium",
                                            children: [
                                                "Groups: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-bold",
                                                    children: Object.keys(filteredDuplicateLeads.reduce((acc, l)=>({
                                                            ...acc,
                                                            [l.phone_search_hash]: 1
                                                        }), {})).length
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3533,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3532,
                                            columnNumber: 17
                                        }, this),
                                        selectedDuplicateLeads.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                const itemsToDelete = filteredDuplicateLeads.filter((l)=>selectedDuplicateLeads.has(l.lead_id));
                                                handleDeleteMultipleDuplicates(itemsToDelete);
                                            },
                                            className: "px-3 py-1 bg-rose-600 text-white rounded text-[10px] font-bold uppercase tracking-wider hover:bg-rose-700 transition-colors flex items-center gap-2 shadow-sm shadow-rose-100",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-trash"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/customer.tsx",
                                                    lineNumber: 3543,
                                                    columnNumber: 21
                                                }, this),
                                                "Delete All Selected (",
                                                selectedDuplicateLeads.size,
                                                ")"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3536,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3531,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowDuplicateModal(false);
                                        setDuplicateDispositionFilter("");
                                        setDuplicateCampaignFilter("");
                                    },
                                    className: "px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all",
                                    children: "Done"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3548,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3530,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 3351,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 3350,
                columnNumber: 9
            }, this),
            showBulkOrgModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-gray-800",
                                    style: {
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: [
                                        "Update Organization (",
                                        selectedCustomers.size,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3567,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowBulkOrgModal(false);
                                        setBulkValue("");
                                    },
                                    className: "w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3577,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3570,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3566,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                    children: "Select New Organization"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3581,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: bulkValue,
                                    onChange: (e)=>setBulkValue(e.target.value),
                                    className: "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select Organization"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3587,
                                            columnNumber: 17
                                        }, this),
                                        filterStats.organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: org.id,
                                                children: org.company_name
                                            }, org.id, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 3589,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3582,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3580,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowBulkOrgModal(false);
                                        setBulkValue("");
                                    },
                                    className: "flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3594,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: isUpdatingBulk || !bulkValue,
                                    onClick: ()=>handleBulkUpdate("organization_id", bulkValue),
                                    className: "flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50",
                                    children: isUpdatingBulk ? "Updating..." : "Update Organization"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3603,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3593,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 3565,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 3564,
                columnNumber: 9
            }, this),
            showBulkCampaignModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-gray-800",
                                    style: {
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: [
                                        "Update Campaign (",
                                        selectedCustomers.size,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3619,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowBulkCampaignModal(false);
                                        setBulkValue("");
                                    },
                                    className: "w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3629,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3622,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3618,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                    children: "Select New Campaign"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3633,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: bulkValue,
                                    onChange: (e)=>setBulkValue(e.target.value),
                                    className: "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select Campaign"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3639,
                                            columnNumber: 17
                                        }, this),
                                        filterStats.campaigns.map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: camp.id,
                                                children: camp.name
                                            }, camp.id, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 3641,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3634,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3632,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowBulkCampaignModal(false);
                                        setBulkValue("");
                                    },
                                    className: "flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3646,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: isUpdatingBulk || !bulkValue,
                                    onClick: ()=>handleBulkUpdate("campaign_id", bulkValue),
                                    className: "flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50",
                                    children: isUpdatingBulk ? "Updating..." : "Update Campaign"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3655,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3645,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 3617,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 3616,
                columnNumber: 9
            }, this),
            showBulkAssignedModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-gray-800",
                                    style: {
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: [
                                        "Update Assignment (",
                                        selectedCustomers.size,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3672,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowBulkAssignedModal(false);
                                        setBulkValue("");
                                    },
                                    className: "w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3682,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3675,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3671,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                    children: "Select Agent"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3686,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: bulkValue,
                                    onChange: (e)=>setBulkValue(e.target.value),
                                    className: "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select Agent"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3692,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "unassigned",
                                            children: "Unassigned"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3693,
                                            columnNumber: 17
                                        }, this),
                                        filterStats.agents.map((agent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: agent.user_id || agent.id,
                                                children: agent.user_name
                                            }, agent.id, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 3695,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3687,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3685,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowBulkAssignedModal(false);
                                        setBulkValue("");
                                    },
                                    className: "flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3700,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: isUpdatingBulk || !bulkValue,
                                    onClick: ()=>handleBulkUpdate("assigned_to", bulkValue === "unassigned" ? null : bulkValue),
                                    className: "flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50",
                                    children: isUpdatingBulk ? "Updating..." : "Update Assignment"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3709,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3699,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 3670,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 3669,
                columnNumber: 9
            }, this),
            showBulkDispositionModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-gray-800",
                                    style: {
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: [
                                        "Update Disposition (",
                                        selectedCustomers.size,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3726,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowBulkDispositionModal(false);
                                        setBulkValue("");
                                    },
                                    className: "w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/customer.tsx",
                                        lineNumber: 3736,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3729,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3725,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2",
                                    children: "Select Disposition"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3740,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                    value: bulkValue,
                                    onChange: (e)=>setBulkValue(e.target.value),
                                    className: "w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                            value: "",
                                            children: "Select Disposition"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/customer.tsx",
                                            lineNumber: 3746,
                                            columnNumber: 17
                                        }, this),
                                        filterStats.dispositions.map((disp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: disp,
                                                children: disp
                                            }, disp, false, {
                                                fileName: "[project]/pages/portal/customer.tsx",
                                                lineNumber: 3748,
                                                columnNumber: 19
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3741,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3739,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setShowBulkDispositionModal(false);
                                        setBulkValue("");
                                    },
                                    className: "flex-1 px-4 py-2.5 border border-gray-300 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors",
                                    children: "Cancel"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3753,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    disabled: isUpdatingBulk || !bulkValue,
                                    onClick: ()=>handleBulkUpdate("disposition", bulkValue),
                                    className: "flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50",
                                    children: isUpdatingBulk ? "Updating..." : "Update Disposition"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/customer.tsx",
                                    lineNumber: 3762,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/customer.tsx",
                            lineNumber: 3752,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/customer.tsx",
                    lineNumber: 3724,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/customer.tsx",
                lineNumber: 3723,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(Customer, "gT9VRI37NscnTERMkMdpX5gr1JA=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c = Customer;
var _c;
__turbopack_context__.k.register(_c, "Customer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=pages_portal_customer_tsx_dc8978d9._.js.map