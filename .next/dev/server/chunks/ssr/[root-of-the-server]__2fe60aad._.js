module.exports = [
"[project]/components/ExpiryBadge.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExpiryBadge
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function ExpiryBadge({ expireDate }) {
    if (!expireDate) return null;
    const now = new Date();
    const expire = new Date(expireDate);
    const diffTime = expire.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let colorClass = 'bg-emerald-100 text-emerald-600';
    let iconClass = 'fi-rr-calendar-clock';
    let text = `${diffDays} Days Left`;
    if (diffDays < 0) {
        colorClass = 'bg-red-100 text-red-600';
        iconClass = 'fi-rr-cross-circle';
        text = 'Expired';
    } else if (diffDays <= 7) {
        colorClass = 'bg-orange-100 text-orange-600';
        iconClass = 'fi-rr-clock';
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${colorClass}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                className: `fi flex ${iconClass} text-[10px]`
            }, void 0, false, {
                fileName: "[project]/components/ExpiryBadge.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                children: text
            }, void 0, false, {
                fileName: "[project]/components/ExpiryBadge.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ExpiryBadge.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
}),
"[project]/hooks/useSessionState.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSessionState",
    ()=>useSessionState
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
function useSessionState(key, initialValue) {
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        return initialValue;
    });
    const setValue = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((value)=>{
        try {
            setState((prevState)=>{
                const valueToStore = value instanceof Function ? value(prevState) : value;
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                return valueToStore;
            });
        } catch (error) {
            console.warn(`Error setting sessionStorage key "${key}":`, error);
        }
    }, [
        key
    ]);
    return [
        state,
        setValue
    ];
}
}),
"[project]/hooks/useOrganizationData.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useOrganizationData",
    ()=>useOrganizationData
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSessionState.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function useOrganizationData(user, mounted) {
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("org_searchQuery", "");
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const fetchOrganizations = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (isBackground = false)=>{
        if (!mounted || !user?.uid) return;
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        try {
            if (!isBackground) setLoading(true);
            setError("");
            // 1. Fetch Organizations
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("*").order("company_joined", {
                ascending: false
            });
            // --- SECURITY FILTERING ---
            const designation = user.designation?.toLowerCase() || '';
            const isCEO = user.isClient === true && designation === 'ceo';
            if (isCEO && user.organization_id) {
                query = query.eq('id', user.organization_id);
            } else if (user.isClient === true && !isCEO) {
                // Safety: If somehow a non-CEO client reaches here, show nothing
                query = query.eq('id', '00000000-0000-0000-0000-000000000000');
            }
            const { data: orgData, error: orgError } = await query.abortSignal(abortControllerRef.current.signal);
            if (orgError) throw orgError;
            // 2. Fetch member counts and avatars efficiently (bulk)
            const { data: memberData, error: memberError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("organization_id, profile_pic_url").not("organization_id", "is", null).abortSignal(abortControllerRef.current.signal);
            if (memberError) {
                console.error("Error fetching member data:", memberError);
            }
            const counts = {};
            const avatars = {};
            memberData?.forEach((m)=>{
                counts[m.organization_id] = (counts[m.organization_id] || 0) + 1;
                if (!avatars[m.organization_id]) avatars[m.organization_id] = [];
                if (avatars[m.organization_id].length < 3) {
                    avatars[m.organization_id].push(m.profile_pic_url);
                }
            });
            const enrichedOrgs = (orgData || []).map((org)=>({
                    ...org,
                    member_count: counts[org.id] || 0,
                    member_avatars: avatars[org.id] || []
                }));
            setOrganizations(enrichedOrgs);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Error fetching organizations:", err);
                setError("Failed to load organizations");
            }
        } finally{
            if (!isBackground) setLoading(false);
        }
    }, [
        mounted,
        user?.uid,
        user?.designation,
        user?.organization_id,
        user?.isClient
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchOrganizations();
        return ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [
        fetchOrganizations
    ]);
    const stats = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const total = organizations.length;
        let active = 0;
        let inactive = 0;
        let recent = 0;
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        organizations.forEach((org)=>{
            if (org.is_active) active++;
            else inactive++;
            if (org.company_joined) {
                const joined = new Date(org.company_joined);
                if (joined > monthAgo) recent++;
            }
        });
        return {
            total,
            active,
            inactive,
            recent
        };
    }, [
        organizations
    ]);
    const filteredOrgs = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        // Stage 0: Hydration Gate
        if (!mounted || !user) return [];
        const query = searchQuery.toLowerCase().trim();
        if (!query) return organizations;
        return organizations.filter((org)=>org.company_name.toLowerCase().includes(query) || org.owner_name?.toLowerCase().includes(query) || org.company_code?.toLowerCase().includes(query));
    }, [
        organizations,
        searchQuery,
        mounted,
        user
    ]);
    return {
        organizations,
        filteredOrgs,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        stats,
        fetchOrganizations
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/portal/organization.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>OrganizationPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExpiryBadge$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ExpiryBadge.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useOrganizationData.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
const formatDate = (dateString)=>{
    if (!dateString) return "—";
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "—";
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    } catch (e) {
        return "—";
    }
};
function OrganizationPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, mounted, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const { loading, searchQuery, setSearchQuery, stats, filteredOrgs, fetchOrganizations } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useOrganizationData"])(user, mounted);
    const isAddOrgVisible = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!mounted || !user) return false;
        // Only internal staff can create organizations
        return user.isClient === false;
    }, [
        mounted,
        user
    ]);
    // Page level protection logic (Strict: Wait for auth to finalize)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && !authLoading && user) {
            const isOrgVisible = user.isClient === false || user.isClient === true && user.designation?.toLowerCase() === 'ceo';
            if (!isOrgVisible) {
                console.warn("Unauthorized access to organization page, redirecting...");
                router.replace('/dashboard');
            }
        }
    }, [
        mounted,
        user,
        authLoading,
        router
    ]);
    const [availableUsers, setAvailableUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showAssignModal, setShowAssignModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [selectedOrg, setSelectedOrg] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [selectedUserIds, setSelectedUserIds] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [assigningLoading, setAssigningLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [userSearchQuery, setUserSearchQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [showOnlyUnassigned, setShowOnlyUnassigned] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const userAbortRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const fetchUsers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (userAbortRef.current) userAbortRef.current.abort();
        userAbortRef.current = new AbortController();
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, user_name, employee_id, profile_pic_url, organization_id").order("user_name").abortSignal(userAbortRef.current.signal);
            if (error) throw error;
            setAvailableUsers(data || []);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Error fetching users:", err);
            }
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (user?.uid) {
            fetchUsers();
        }
        return ()=>{
            if (userAbortRef.current) userAbortRef.current.abort();
        };
    }, [
        user?.uid,
        fetchUsers
    ]);
    // Reset modal state when closing
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!showAssignModal) {
            setSelectedUserIds([]);
            setUserSearchQuery("");
            setShowOnlyUnassigned(false);
        }
    }, [
        showAssignModal
    ]);
    const handleDeleteOrganization = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (id, name)=>{
        if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
            return;
        }
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").delete().eq("id", id);
            if (error) throw error;
            fetchOrganizations();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Delete Organization: ${name}`,
                metadata: {
                    organization_id: id,
                    organization_name: name
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error deleting organization:", err);
            alert("Failed to delete organization. Please try again.");
        }
    }, [
        fetchOrganizations
    ]);
    const handleAssignUsers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (!selectedOrg || selectedUserIds.length === 0) return;
        try {
            setAssigningLoading(true);
            // Perform task in smaller batches or ensure atomic nature
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").update({
                organization_id: selectedOrg.id
            }).in("id", selectedUserIds);
            if (error) throw error;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Assign ${selectedUserIds.length} members to ${selectedOrg.company_name}`,
                metadata: {
                    organization_id: selectedOrg.id,
                    organization_name: selectedOrg.company_name,
                    user_count: selectedUserIds.length,
                    user_ids: selectedUserIds
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            alert(`Successfully assigned ${selectedUserIds.length} members to ${selectedOrg.company_name}`);
            setShowAssignModal(false);
            fetchOrganizations();
            fetchUsers();
        } catch (err) {
            console.error("Error assigning users:", err);
            alert("Failed to assign users. Some assignments might not have completed.");
        } finally{
            setAssigningLoading(false);
        }
    }, [
        selectedOrg,
        selectedUserIds,
        fetchOrganizations,
        fetchUsers
    ]);
    // Memoized user filter for the modal to avoid expensive computations on every keystroke
    const filteredUsers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const query = userSearchQuery.toLowerCase().trim();
        return availableUsers.filter((u)=>{
            const matchesSearch = !query || u.user_name?.toLowerCase().includes(query) || u.employee_id?.toLowerCase().includes(query);
            const matchesUnassigned = showOnlyUnassigned ? !u.organization_id : true;
            return matchesSearch && matchesUnassigned;
        });
    }, [
        availableUsers,
        userSearchQuery,
        showOnlyUnassigned
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-b98940fe51b8b8d3" + " " + "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center gap-2 text-xs text-gray-400 mb-8 px-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                onClick: ()=>router.push("/dashboard"),
                                className: "jsx-b98940fe51b8b8d3" + " " + "cursor-pointer hover:text-[#4b33e8] transition-colors",
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 186,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-angle-small-right text-[10px]"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 189,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-600 font-bold",
                                children: "Organizations"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 190,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/organization.tsx",
                        lineNumber: 185,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-b98940fe51b8b8d3" + " " + "relative overflow-hidden rounded-2xl bg-white p-6 md:p-8 shadow-sm border border-gray-100 mb-8 group",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 195,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "absolute top-0 right-0 p-8 opacity-[0.03] transform group-hover:scale-110 transition-transform duration-700",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-building text-9xl"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/organization.tsx",
                                    lineNumber: 197,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 196,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "max-w-3xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center gap-4 mb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] shadow-sm",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-building text-xl"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 204,
                                                            columnNumber: 23
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 203,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-b98940fe51b8b8d3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                                style: {
                                                                    color: "#263238",
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                className: "jsx-b98940fe51b8b8d3" + " " + "text-xl md:text-xl font-bold text-gray-800",
                                                                children: "Organization Management"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                lineNumber: 207,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center gap-2 mt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-b98940fe51b8b8d3" + " " + "px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest bg-green-100 text-green-700 border border-green-200",
                                                                        children: "System Active"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                                        lineNumber: 211,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-b98940fe51b8b8d3" + " " + "w-1 h-1 rounded-full bg-gray-300 mx-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                                        lineNumber: 214,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-[10px] text-gray-400 font-bold uppercase tracking-tight",
                                                                        children: [
                                                                            "Total Orgs: ",
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-600",
                                                                                children: stats.total
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                                lineNumber: 216,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                                        lineNumber: 215,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                lineNumber: 210,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 206,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 202,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-500 text-sm leading-relaxed mb-6 font-medium",
                                                children: "Manage and monitor all business organizations registered on the platform. Review company profiles, ownership details, and verification status."
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 221,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 201,
                                        columnNumber: 17
                                    }, this),
                                    isAddOrgVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "flex flex-wrap gap-4 items-center self-start lg:self-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>router.push("/organization/create"),
                                            style: {
                                                background: "linear-gradient(135deg, #4b33e8 0%, #8b5cf6 100%)"
                                            },
                                            className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center gap-4 px-7 py-4 rounded-2xl border border-white/10 shadow-xl shadow-indigo-200/50 transition-all hover:scale-[1.03] active:scale-95 group/btn relative overflow-hidden h-18",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "relative z-10 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover/btn:bg-white/30 transition-colors shadow-sm ring-1 ring-white/30",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-plus text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 235,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "relative z-10 flex flex-col items-start translate-y-[1px]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-base font-black text-white leading-none",
                                                            children: "Add One"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 238,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-[10px] font-bold text-white/70 uppercase tracking-widest leading-none mt-1.5",
                                                            children: "Organization"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 237,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization.tsx",
                                            lineNumber: 228,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 227,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 200,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/organization.tsx",
                        lineNumber: 194,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-b98940fe51b8b8d3" + " " + "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "radial-gradient(circle at right top, rgba(59, 130, 246, 0.12), transparent 60%)"
                                        },
                                        className: "jsx-b98940fe51b8b8d3" + " " + "absolute inset-0"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 251,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "absolute -right-2 -bottom-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            style: {
                                                color: "#3b82f6",
                                                opacity: 0.15
                                            },
                                            className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-building text-5xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization.tsx",
                                            lineNumber: 253,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 252,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "relative flex flex-col h-full z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "flex items-start justify-between mb-auto",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "#787E9D",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "text-xs sm:text-sm font-medium",
                                                    children: "Total Orgs"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 257,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 256,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "mt-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-xl sm:text-4xl font-semibold",
                                                        children: stats.total
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]",
                                                        children: "Registered entities"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 261,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 259,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 255,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 250,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "radial-gradient(circle at right top, rgba(16, 185, 129, 0.12), transparent 60%)"
                                        },
                                        className: "jsx-b98940fe51b8b8d3" + " " + "absolute inset-0"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 268,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "absolute -right-2 -bottom-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            style: {
                                                color: "#10b981",
                                                opacity: 0.15
                                            },
                                            className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-check-circle text-5xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization.tsx",
                                            lineNumber: 270,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "relative flex flex-col h-full z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "flex items-start justify-between mb-auto",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "#787E9D",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "text-xs sm:text-sm font-medium",
                                                    children: "Active"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 274,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 273,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "mt-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-xl sm:text-4xl font-semibold",
                                                        children: stats.active
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 277,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]",
                                                        children: "Currently operational"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 276,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 272,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 267,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "radial-gradient(circle at right top, rgba(139, 92, 246, 0.12), transparent 60%)"
                                        },
                                        className: "jsx-b98940fe51b8b8d3" + " " + "absolute inset-0"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 285,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "absolute -right-2 -bottom-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            style: {
                                                color: "#8b5cf6",
                                                opacity: 0.15
                                            },
                                            className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-time-past text-5xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization.tsx",
                                            lineNumber: 287,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 286,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "relative flex flex-col h-full z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "flex items-start justify-between mb-auto",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "#787E9D",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "text-xs sm:text-sm font-medium",
                                                    children: "Recent"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 290,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "mt-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-xl sm:text-4xl font-semibold",
                                                        children: stats.recent
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 294,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]",
                                                        children: "Joined last 30 days"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 295,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 293,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 289,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 284,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-32 sm:h-38 bg-white border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "radial-gradient(circle at right top, rgba(239, 68, 68, 0.12), transparent 60%)"
                                        },
                                        className: "jsx-b98940fe51b8b8d3" + " " + "absolute inset-0"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 302,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "absolute -right-2 -bottom-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            style: {
                                                color: "#ef4444",
                                                opacity: 0.15
                                            },
                                            className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-cross-circle text-5xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization.tsx",
                                            lineNumber: 304,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 303,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "relative flex flex-col h-full z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "flex items-start justify-between mb-auto",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    style: {
                                                        color: "#787E9D",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "text-xs sm:text-sm font-medium",
                                                    children: "Expired"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 308,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 307,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "mt-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-xl sm:text-4xl font-semibold",
                                                        children: stats.inactive
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 311,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-[10px] sm:text-[11px] mt-1 font-bold text-[#787E9D]",
                                                        children: "Subscription ended"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 312,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 310,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 306,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 301,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/organization.tsx",
                        lineNumber: 248,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-b98940fe51b8b8d3" + " " + "flex flex-col gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center justify-between px-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        style: {
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-lg font-bold text-gray-800",
                                        children: "All Organizations"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 321,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "relative group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Search organizations...",
                                                value: searchQuery,
                                                onChange: (e)=>setSearchQuery(e.target.value),
                                                className: "jsx-b98940fe51b8b8d3" + " " + "w-64 h-10 pl-10 text-gray-700 pr-4 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 focus:border-[#4b33e8] transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 323,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#4b33e8] transition-colors"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 330,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 322,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 320,
                                columnNumber: 15
                            }, this),
                            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center justify-center p-20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-b98940fe51b8b8d3" + " " + "animate-spin rounded-full h-8 w-8 border-2 border-t-transparent border-[#4b33e8]"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/organization.tsx",
                                    lineNumber: 336,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 335,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                                children: [
                                    filteredOrgs.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            onClick: ()=>router.push(`/organization/${org.id}`),
                                            className: "jsx-b98940fe51b8b8d3" + " " + "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 flex flex-col bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "absolute inset-0 bg-gradient-to-br from-[#4b33e8]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "relative z-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "flex items-start justify-between mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] transform group-hover:scale-110 transition-transform",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-building text-xl"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                                lineNumber: 353,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 352,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "flex flex-col gap-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-b98940fe51b8b8d3" + " " + `px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${org.is_active ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`,
                                                                                    children: org.is_active ? 'Active' : 'Expired'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                                    lineNumber: 356,
                                                                                    columnNumber: 32
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExpiryBadge$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                    expireDate: org.expiry_date
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                                    lineNumber: 361,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 355,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 351,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + `px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${org.company_type ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-gray-50 text-gray-500 border border-gray-100'}`,
                                                                    children: org.company_type || 'Unspecified'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 364,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 350,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center justify-between mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                    style: {
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "text-lg font-bold text-gray-800 truncate group-hover:text-[#4b33e8] transition-colors",
                                                                    children: org.company_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 372,
                                                                    columnNumber: 27
                                                                }, this),
                                                                isAddOrgVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: (e)=>{
                                                                                e.stopPropagation();
                                                                                setSelectedOrg(org);
                                                                                setShowAssignModal(true);
                                                                            },
                                                                            title: "Assign Members",
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "w-8 h-8 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-user-add text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                                lineNumber: 387,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 378,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: (e)=>{
                                                                                e.stopPropagation();
                                                                                handleDeleteOrganization(org.id, org.company_name);
                                                                            },
                                                                            title: "Delete Organization",
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-b98940fe51b8b8d3" + " " + "fi flex fi-rr-trash text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                                lineNumber: 397,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 389,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 377,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 371,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-500 text-xs leading-relaxed mb-6 line-clamp-2 min-h-[32px]",
                                                            children: org.description || 'Provide a sustainable growth strategy for the organization.'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 402,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "grid grid-cols-2 gap-y-3 gap-x-4 pt-4 border-t border-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex flex-col gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-400 text-[10px] font-black uppercase tracking-tight",
                                                                            children: "System ID"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 408,
                                                                            columnNumber: 30
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-indigo-600 text-[11px] font-black tracking-widest",
                                                                            children: org.company_code || '—'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 409,
                                                                            columnNumber: 30
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 407,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex flex-col gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-400 text-[10px] font-black uppercase tracking-tight",
                                                                            children: "Renewal"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 414,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-700 text-[11px] font-bold",
                                                                            children: formatDate(org.renewal_date)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 415,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 413,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex flex-col gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-400 text-[10px] font-black uppercase tracking-tight",
                                                                            children: "Expiry"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 420,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-700 text-[11px] font-bold",
                                                                            children: formatDate(org.expiry_date)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 421,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 419,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex flex-col gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-400 text-[10px] font-black uppercase tracking-tight",
                                                                            children: "Owner"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 426,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-700 text-[11px] font-bold truncate",
                                                                            children: org.owner_name || '—'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 427,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 425,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex flex-col gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-400 text-[10px] font-black uppercase tracking-tight",
                                                                            children: "Joined"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 430,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-700 text-[11px] font-bold",
                                                                            children: formatDate(org.company_joined)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 431,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 429,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex flex-col gap-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-400 text-[10px] font-black uppercase tracking-tight",
                                                                            children: "Members"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 436,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center gap-1.5",
                                                                            children: [
                                                                                org.member_avatars && org.member_avatars.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex -space-x-2 mr-1",
                                                                                    children: [
                                                                                        org.member_avatars.map((avatar, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-b98940fe51b8b8d3" + " " + "w-5 h-5 rounded-full border-2 border-white overflow-hidden bg-gray-100 flex-shrink-0",
                                                                                                children: avatar ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                                                    src: avatar,
                                                                                                    alt: "",
                                                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "w-full h-full object-cover"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                                                    lineNumber: 443,
                                                                                                    columnNumber: 41
                                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "w-full h-full flex items-center justify-center bg-indigo-50 text-[8px] text-[#4b33e8] font-bold",
                                                                                                    children: idx + 1
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                                                    lineNumber: 445,
                                                                                                    columnNumber: 41
                                                                                                }, this)
                                                                                            }, idx, false, {
                                                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                                                lineNumber: 441,
                                                                                                columnNumber: 37
                                                                                            }, this)),
                                                                                        (org.member_count || 0) > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "w-5 h-5 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[7px] text-[#4b33e8] font-black flex-shrink-0",
                                                                                            children: [
                                                                                                "+",
                                                                                                (org.member_count || 0) - 3
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                                            lineNumber: 452,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                                    lineNumber: 439,
                                                                                    columnNumber: 33
                                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "text-[#4b33e8] text-[11px] font-black",
                                                                                    children: [
                                                                                        org.member_count || 0,
                                                                                        " People"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                                    lineNumber: 458,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                org.member_avatars && org.member_avatars.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-700 text-[11px] font-bold",
                                                                                    children: org.member_count
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                                    lineNumber: 463,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 437,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 435,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 406,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 349,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, org.id, true, {
                                            fileName: "[project]/pages/portal/organization.tsx",
                                            lineNumber: 342,
                                            columnNumber: 21
                                        }, this)),
                                    filteredOrgs.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "col-span-full py-20 bg-white rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mb-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "fi fi-rr-search text-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 477,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 476,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-800 font-bold mb-1",
                                                children: "No organizations found"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 479,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "text-gray-400 text-sm",
                                                children: "Try adjusting your search terms"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 480,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 475,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 339,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/organization.tsx",
                        lineNumber: 319,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/organization.tsx",
                lineNumber: 183,
                columnNumber: 11
            }, this),
            showAssignModal && selectedOrg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-b98940fe51b8b8d3" + " " + "fixed inset-0 z-50 flex items-center justify-center px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        onClick: ()=>setShowAssignModal(false),
                        className: "jsx-b98940fe51b8b8d3" + " " + "absolute inset-0 bg-black/40 backdrop-blur-sm"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization.tsx",
                        lineNumber: 490,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-b98940fe51b8b8d3" + " " + "relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                style: {
                                                    fontFamily: "'Poppins', sans-serif"
                                                },
                                                className: "jsx-b98940fe51b8b8d3" + " " + "text-xl font-bold text-gray-800",
                                                children: "Assign Members"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 498,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "text-xs text-gray-500 mt-1",
                                                children: [
                                                    "Assign users to ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-[#4b33e8] font-bold",
                                                        children: selectedOrg.company_name
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 501,
                                                        columnNumber: 75
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 501,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 497,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAssignModal(false),
                                        className: "jsx-b98940fe51b8b8d3" + " " + "w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "jsx-b98940fe51b8b8d3" + " " + "fi fi-rr-cross text-xs"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization.tsx",
                                            lineNumber: 507,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 503,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 496,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "p-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "mb-6 flex flex-col sm:flex-row gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "relative flex-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        placeholder: "Refine users...",
                                                        value: userSearchQuery,
                                                        onChange: (e)=>setUserSearchQuery(e.target.value),
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 focus:border-[#4b33e8] transition-all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 516,
                                                        columnNumber: 20
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "jsx-b98940fe51b8b8d3" + " " + "fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 523,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 515,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowOnlyUnassigned(!showOnlyUnassigned),
                                                className: "jsx-b98940fe51b8b8d3" + " " + `h-11 px-6 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${showOnlyUnassigned ? 'bg-indigo-50 border-[#4b33e8]/20 text-[#4b33e8]' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "jsx-b98940fe51b8b8d3" + " " + `fi flex ${showOnlyUnassigned ? 'fi-rr-user-slash' : 'fi-rr-users'} text-sm`
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 533,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "jsx-b98940fe51b8b8d3",
                                                        children: showOnlyUnassigned ? 'Showing Unassigned' : 'All Users'
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 525,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 514,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "max-h-[350px] overflow-y-auto pr-2 custom-scrollbar",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-b98940fe51b8b8d3" + " " + "grid grid-cols-1 gap-3",
                                            children: filteredUsers.map((targetUser)=>{
                                                const isSelected = selectedUserIds.includes(targetUser.id);
                                                const isAlreadyInOrg = targetUser.organization_id === selectedOrg.id;
                                                // Optimized lookup using hook data
                                                const otherOrg = targetUser.organization_id ? filteredOrgs.find((o)=>o.id === targetUser.organization_id) : null;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    onClick: ()=>{
                                                        if (isAlreadyInOrg) return;
                                                        setSelectedUserIds((prev)=>isSelected ? prev.filter((id)=>id !== targetUser.id) : [
                                                                ...prev,
                                                                targetUser.id
                                                            ]);
                                                    },
                                                    className: "jsx-b98940fe51b8b8d3" + " " + `flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${isSelected ? 'border-[#4b33e8] bg-indigo-50/50' : isAlreadyInOrg ? 'border-gray-100 bg-gray-50/50 opacity-60 cursor-not-allowed' : 'border-gray-100 hover:border-gray-200 bg-white'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200",
                                                            children: targetUser.profile_pic_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                src: targetUser.profile_pic_url,
                                                                alt: "",
                                                                className: "jsx-b98940fe51b8b8d3" + " " + "w-full h-full object-cover"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                lineNumber: 567,
                                                                columnNumber: 31
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-b98940fe51b8b8d3" + " " + "w-full h-full flex items-center justify-center text-gray-400 text-xs font-bold bg-indigo-50 text-[#4b33e8]",
                                                                children: targetUser.user_name?.charAt(0)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                lineNumber: 569,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 565,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "flex-1 text-left",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "text-sm font-bold text-gray-800",
                                                                    children: targetUser.user_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 575,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-[10px] text-gray-400 font-medium",
                                                                            children: targetUser.employee_id || 'No ID'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 577,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + "w-1 h-1 rounded-full bg-gray-200"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 578,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-b98940fe51b8b8d3" + " " + `text-[10px] font-bold ${!targetUser.organization_id ? 'text-amber-500' : 'text-gray-400'}`,
                                                                            children: !targetUser.organization_id ? 'Unassigned' : otherOrg?.company_name || 'In Organization'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                                            lineNumber: 579,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                                    lineNumber: 576,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 574,
                                                            columnNumber: 27
                                                        }, this),
                                                        isAlreadyInOrg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "text-[10px] font-black text-green-600 bg-green-50 px-2.5 py-1.5 rounded-xl border border-green-100",
                                                            children: "Member"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 585,
                                                            columnNumber: 29
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + `w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-[#4b33e8] border-[#4b33e8] text-white' : 'border-gray-200'}`,
                                                            children: isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "jsx-b98940fe51b8b8d3" + " " + "fi fi-rr-check text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization.tsx",
                                                                lineNumber: 590,
                                                                columnNumber: 46
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 587,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, targetUser.id, true, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 549,
                                                    columnNumber: 25
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization.tsx",
                                            lineNumber: 540,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 539,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 512,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-b98940fe51b8b8d3" + " " + "px-8 py-6 bg-gray-50/80 backdrop-blur-sm flex items-center justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "text-xs text-gray-500 font-medium",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-b98940fe51b8b8d3" + " " + "text-[#4b33e8] font-bold",
                                                children: selectedUserIds.length
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 603,
                                                columnNumber: 17
                                            }, this),
                                            " users selected"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 602,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-b98940fe51b8b8d3" + " " + "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowAssignModal(false),
                                                className: "jsx-b98940fe51b8b8d3" + " " + "px-6 h-11 rounded-2xl text-sm font-bold text-gray-600 hover:bg-gray-100 transition-all",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 606,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handleAssignUsers,
                                                disabled: selectedUserIds.length === 0 || assigningLoading,
                                                className: "jsx-b98940fe51b8b8d3" + " " + "px-8 h-11 rounded-2xl text-sm font-bold text-white bg-[#4b33e8] hover:shadow-lg hover:shadow-indigo-500/30 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2",
                                                children: assigningLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-b98940fe51b8b8d3" + " " + "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization.tsx",
                                                    lineNumber: 618,
                                                    columnNumber: 21
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-b98940fe51b8b8d3",
                                                            children: "Assign Members"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 621,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "jsx-b98940fe51b8b8d3" + " " + "fi fi-rr-arrow-right text-[10px]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization.tsx",
                                                            lineNumber: 622,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization.tsx",
                                                lineNumber: 612,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization.tsx",
                                        lineNumber: 605,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization.tsx",
                                lineNumber: 601,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/organization.tsx",
                        lineNumber: 494,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/organization.tsx",
                lineNumber: 489,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "b98940fe51b8b8d3",
                children: ".custom-scrollbar.jsx-b98940fe51b8b8d3::-webkit-scrollbar{width:5px}.custom-scrollbar.jsx-b98940fe51b8b8d3::-webkit-scrollbar-track{background:#f8f9fa;border-radius:10px}.custom-scrollbar.jsx-b98940fe51b8b8d3::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:10px}.custom-scrollbar.jsx-b98940fe51b8b8d3.jsx-b98940fe51b8b8d3::-webkit-scrollbar-thumb:hover{background:#cbd5e1}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__2fe60aad._.js.map