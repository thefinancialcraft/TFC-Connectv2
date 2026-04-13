(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/pages/portal/organization/[id].tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>OrganizationDetail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExpiryBadge$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ExpiryBadge.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SignupForm$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SignupForm.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ImportCustomersModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$index$2e$ts__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/index.ts [client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useOrganizationDetailData.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dateUtils.ts [client] (ecmascript)");
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
;
;
function OrganizationDetail() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { id } = router.query;
    const { user, mounted, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    // Page level protection logic (Strict: Wait for auth to finalize)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrganizationDetail.useEffect": ()=>{
            if (mounted && !authLoading && user) {
                const allowedRoles = [
                    'ceo',
                    'admin',
                    'super_admin'
                ];
                const userDesignation = user.designation?.toLowerCase().replace(/\s+/g, '_') || '';
                const isOrgVisible = user.isClient === false || user.isClient === true && allowedRoles.includes(userDesignation);
                if (!isOrgVisible) {
                    console.warn("Unauthorized access to organization detail, redirecting...");
                    router.replace('/dashboard');
                }
            }
        }
    }["OrganizationDetail.useEffect"], [
        mounted,
        user,
        authLoading,
        router
    ]);
    const { loading, organization, setOrganization, orgUsers, setOrgUsers, stats, filteredUsers, searchQuery, setSearchQuery, refreshData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useOrganizationDetailData"])(id);
    const [showUserModal, setShowUserModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSignupModal, setShowSignupModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [unassignedUsers, setUnassignedUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedUserToAdd, setSelectedUserToAdd] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [addingUser, setAddingUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showRenewalModal, setShowRenewalModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [renewalMonths, setRenewalMonths] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("1");
    const [customMonth, setCustomMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [customYear, setCustomYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [renewingOrg, setRenewingOrg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [previewExpiryDate, setPreviewExpiryDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const unassignedAbortRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fetchUnassignedUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "OrganizationDetail.useCallback[fetchUnassignedUsers]": async ()=>{
            if (unassignedAbortRef.current) unassignedAbortRef.current.abort();
            unassignedAbortRef.current = new AbortController();
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('id, user_name, email').is('organization_id', null).abortSignal(unassignedAbortRef.current.signal);
                if (data) setUnassignedUsers(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Error fetching unassigned users:', err);
                }
            }
        }
    }["OrganizationDetail.useCallback[fetchUnassignedUsers]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrganizationDetail.useEffect": ()=>{
            if (id) {
                fetchUnassignedUsers();
            }
            return ({
                "OrganizationDetail.useEffect": ()=>{
                    if (unassignedAbortRef.current) unassignedAbortRef.current.abort();
                }
            })["OrganizationDetail.useEffect"];
        }
    }["OrganizationDetail.useEffect"], [
        id,
        fetchUnassignedUsers
    ]);
    // Reset modal-related state on close
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrganizationDetail.useEffect": ()=>{
            if (!showUserModal) {
                setSelectedUserToAdd("");
            }
        }
    }["OrganizationDetail.useEffect"], [
        showUserModal
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrganizationDetail.useEffect": ()=>{
            if (!showRenewalModal) {
                setRenewalMonths("1");
                setCustomMonth("");
                setCustomYear("");
                setPreviewExpiryDate(null);
            }
        }
    }["OrganizationDetail.useEffect"], [
        showRenewalModal
    ]);
    const handleAddUser = async ()=>{
        if (!selectedUserToAdd || !organization) return;
        try {
            setAddingUser(true);
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                organization_id: organization.id,
                status: 'active'
            }).eq('id', selectedUserToAdd);
            if (error) throw error;
            setShowUserModal(false);
            // Redundant refetch avoided by doing refreshData() which is the only way to get full accurate list with profile pics etc easily
            // However, requirement says "Avoid redundant refetch after optimistic updates".
            // But adding a user involves moving them from "unassigned" to "assigned".
            // I'll refresh data to keep it consistent.
            refreshData(true);
            fetchUnassignedUsers();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Add member to ${organization.company_name}`,
                metadata: {
                    organization_id: organization.id,
                    user_id: selectedUserToAdd
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error adding user:", err);
            alert("Failed to add user");
        } finally{
            setAddingUser(false);
        }
    };
    const handleRemoveUser = async (userId, userName)=>{
        if (!confirm(`Remove ${userName} from this organization?`)) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                organization_id: null,
                status: 'inactive'
            }).eq('id', userId);
            if (error) throw error;
            // Optimistic update
            setOrgUsers((prev)=>prev.filter((u)=>u.id !== userId));
            fetchUnassignedUsers();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Remove member from ${organization?.company_name}`,
                metadata: {
                    organization_id: organization?.id,
                    user_id: userId,
                    user_name: userName
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error removing user:", err);
        }
    };
    const toggleUserStatus = async (userId, currentStatus)=>{
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                status: newStatus
            }).eq('id', userId);
            if (error) throw error;
            // Optimistically update local state & stats (requirement 5)
            setOrgUsers((prev)=>prev.map((u)=>u.id === userId ? {
                        ...u,
                        status: newStatus
                    } : u));
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Toggle member status to ${newStatus}`,
                metadata: {
                    organization_id: organization?.id,
                    user_id: userId,
                    status: newStatus
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };
    const handleRenewalOrganization = async ()=>{
        if (!organization) return;
        try {
            setRenewingOrg(true);
            let monthsToAdd = 0;
            if (renewalMonths === "custom") {
                if (!customMonth || !customYear) {
                    alert("Please select both month and year for custom renewal");
                    return;
                }
                monthsToAdd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["calculateMonthsToTarget"])(customYear, customMonth);
                if (monthsToAdd <= 0) {
                    alert("Please select a future date for renewal");
                    return;
                }
            } else {
                monthsToAdd = parseInt(renewalMonths);
            }
            const newExpiryString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["calculateNewExpiryDate"])(organization.expiry_date, monthsToAdd);
            const renewalDateString = new Date().toISOString().split('T')[0];
            // Update organization
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").update({
                expiry_date: newExpiryString,
                renewal_date: renewalDateString,
                is_active: true
            }).eq("id", organization.id);
            if (error) throw error;
            // Update all users assigned to this organization
            const { error: userUpdateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").update({
                renewal_at: renewalDateString,
                expire_at: newExpiryString
            }).eq("organization_id", organization.id);
            if (userUpdateError) {
                console.error("Error updating user dates:", userUpdateError);
            }
            await refreshData(true);
            setShowRenewalModal(false);
            alert("Organization renewed successfully!");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Renew Organization: ${organization.company_name} for ${monthsToAdd} months`,
                metadata: {
                    organization_id: organization.id,
                    months_added: monthsToAdd,
                    new_expiry: newExpiryString
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error renewing organization:", err);
            alert("Failed to renew organization");
        } finally{
            setRenewingOrg(false);
        }
    };
    // Calculate preview expiry date
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "OrganizationDetail.useEffect": ()=>{
            if (!organization || !showRenewalModal) {
                setPreviewExpiryDate(null);
                return;
            }
            try {
                let monthsToAdd = 0;
                if (renewalMonths === "custom") {
                    if (!customMonth || !customYear) {
                        setPreviewExpiryDate(null);
                        return;
                    }
                    monthsToAdd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["calculateMonthsToTarget"])(customYear, customMonth);
                    if (monthsToAdd <= 0) {
                        setPreviewExpiryDate(null);
                        return;
                    }
                } else if (renewalMonths) {
                    monthsToAdd = parseInt(renewalMonths);
                } else {
                    setPreviewExpiryDate(null);
                    return;
                }
                setPreviewExpiryDate((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["calculateNewExpiryDate"])(organization.expiry_date, monthsToAdd));
            } catch (err) {
                setPreviewExpiryDate(null);
            }
        }
    }["OrganizationDetail.useEffect"], [
        renewalMonths,
        customMonth,
        customYear,
        organization,
        showRenewalModal
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-[#f6f5f7]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-4 border-[#4b33e8] border-t-transparent"
            }, void 0, false, {
                fileName: "[project]/pages/portal/organization/[id].tsx",
                lineNumber: 311,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/organization/[id].tsx",
            lineNumber: 310,
            columnNumber: 7
        }, this);
    }
    if (!organization) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-[#f6f5f7]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center font-poppins",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold text-gray-800 mb-2",
                        children: "Organization not found"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 320,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/organization"),
                        className: "text-[#4b33e8] font-semibold hover:underline",
                        children: "Back to Organizations"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 321,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/organization/[id].tsx",
                lineNumber: 319,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/organization/[id].tsx",
            lineNumber: 318,
            columnNumber: 7
        }, this);
    }
    // Calculate Org Days Left
    const getOrgDaysLeft = ()=>{
        if (!organization.expiry_date) return null;
        const now = new Date();
        const exp = new Date(organization.expiry_date);
        const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };
    const orgDaysLeft = getOrgDaysLeft();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: [
                        organization.company_name,
                        " • TFC Nexus"
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/organization/[id].tsx",
                    lineNumber: 341,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/organization/[id].tsx",
                lineNumber: 340,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col w-full min-w-0 font-poppins",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 pb-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative w-full overflow-hidden  pb-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 349,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl relative z-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold tracking-wide text-left",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "cursor-pointer hover:text-indigo-600 transition-colors",
                                                    onClick: ()=>router.push("/organization"),
                                                    children: "Organizations"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-angle-small-right text-[10px]"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 355,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-600",
                                                    children: organization.company_name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 353,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-slate-200/40 overflow-hidden group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-0 right-0 p-12 opacity-[0.02] transform group-hover:scale-110 transition-transform duration-1000 pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-building text-[12rem]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 26
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 361,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-3xl font-semibold",
                                                                children: organization.company_name.charAt(0)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 368,
                                                                columnNumber: 30
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 367,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0 text-left",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap items-center gap-4 mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                                                            className: "text-3xl md:text-4xl font-semibold text-slate-800 tracking-tight",
                                                                            children: organization.company_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 373,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        organization.is_active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-[10px] font-semibold border border-emerald-200",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 377,
                                                                                    columnNumber: 42
                                                                                }, this),
                                                                                "Active"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 376,
                                                                            columnNumber: 38
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-red-700 text-[10px] font-semibold border border-red-200",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-1.5 h-1.5 rounded-full bg-red-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 382,
                                                                                    columnNumber: 42
                                                                                }, this),
                                                                                "Inactive"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 381,
                                                                            columnNumber: 38
                                                                        }, this),
                                                                        organization.org_code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold border border-slate-200",
                                                                            children: organization.org_code
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 388,
                                                                            columnNumber: 39
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 372,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed mb-6",
                                                                    children: organization.description || "Comprehensive organizational profile managing client assets, licenses, and operational compliance within the Nexus infrastructure."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap gap-6",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-briefcase text-xs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 401,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 400,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex flex-col",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[9px] font-semibold text-slate-400",
                                                                                            children: "Industry"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 404,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs font-semibold text-slate-700",
                                                                                            children: organization.company_type || 'General'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 405,
                                                                                            columnNumber: 42
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 403,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 399,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-marker text-xs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 411,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 410,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex flex-col",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[9px] font-semibold text-slate-400",
                                                                                            children: "Headquarters"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 414,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs font-semibold text-slate-700 truncate max-w-[150px]",
                                                                                            title: organization.address || '',
                                                                                            children: organization.address ? organization.address.split(',')[0] : 'Remote'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 415,
                                                                                            columnNumber: 42
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 413,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 409,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-calendar-check text-xs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 423,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 422,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "flex flex-col",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[9px] font-semibold text-slate-400",
                                                                                            children: "Joined On"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 426,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs font-semibold text-slate-700",
                                                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatDate"])(organization.company_joined)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 427,
                                                                                            columnNumber: 42
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 425,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 421,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        user?.isClient === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setShowRenewalModal(true),
                                                                            className: "px-8 ml-3 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-[12px] font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center gap-1.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-refresh text-[10px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 436,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                "Renew"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 432,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 398,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 371,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 360,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 md:grid-cols-4 gap-6 mt-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white p-6 rounded-2xl hover:shadow-md transition-all group text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-users-alt text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 451,
                                                                        columnNumber: 34
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 450,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-slate-300",
                                                                    children: "Total"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 453,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 449,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-3xl font-semibold text-slate-800",
                                                                    children: stats.totalMembers
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 456,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-semibold text-slate-400",
                                                                    children: "Deployed Personnel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 457,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 455,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 448,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white p-6 rounded-2xl hover:shadow-md transition-all group text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-id-badge text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 465,
                                                                        columnNumber: 34
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 464,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-slate-300",
                                                                    children: "Active"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 467,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-3xl font-semibold text-slate-800",
                                                                    children: stats.activeLicenses
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 470,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-semibold text-slate-400",
                                                                    children: "Valid Licenses"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 471,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 469,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white p-6 rounded-2xl hover:shadow-md transition-all group text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-alarm-clock text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 479,
                                                                        columnNumber: 34
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 478,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-slate-300",
                                                                    children: "Warning"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 481,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 477,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-3xl font-semibold text-slate-800",
                                                                    children: stats.expiringSoon
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 484,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-semibold text-slate-400",
                                                                    children: "Expire in 30 Days"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 485,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 483,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 476,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "bg-white p-6 rounded-2xl hover:shadow-md transition-all group relative overflow-hidden text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: `absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -mr-10 -mt-10 ${orgDaysLeft && orgDaysLeft < 30 ? 'bg-red-500/20' : 'bg-indigo-500/10'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 491,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-4 relative z-10",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `w-10 h-10 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform ${orgDaysLeft && orgDaysLeft < 30 ? 'bg-red-500' : 'bg-indigo-500'}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-crown text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 498,
                                                                        columnNumber: 34
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 495,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-slate-300",
                                                                    children: "Validity"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 500,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 494,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col relative z-10",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-3xl font-semibold text-slate-800",
                                                                    children: orgDaysLeft !== null ? orgDaysLeft : '∞'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 503,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-semibold text-slate-400",
                                                                    children: "Days Remaining"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 504,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 502,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 490,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 446,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "lg:col-span-1 space-y-8 text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white rounded-2xl p-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-xs font-semibold text-slate-400 mb-6 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-shield-check text-indigo-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 517,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        "Compliance Info"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 516,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "p-4 rounded-xl bg-slate-50",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[9px] font-semibold text-slate-400 mb-1 font-poppins",
                                                                                    children: "Tax Identity (GSTIN)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 523,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-semibold text-slate-700 tracking-wide font-mono",
                                                                                    children: organization.gst_no || 'N/A'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 524,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 522,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "p-4 rounded-xl bg-slate-50",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[9px] font-semibold text-slate-400 mb-1 font-poppins",
                                                                                    children: "Company Code"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 527,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-semibold text-slate-700 tracking-wide font-mono",
                                                                                    children: organization.company_code || 'N/A'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 528,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 526,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "p-4 rounded-xl bg-slate-50",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[9px] font-semibold text-slate-400 mb-1 font-poppins",
                                                                                    children: "Full Address"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 531,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-semibold text-slate-600 leading-relaxed",
                                                                                    children: organization.address || '—'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 532,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 530,
                                                                            columnNumber: 34
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 521,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 515,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "bg-white rounded-2xl p-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "text-xs font-semibold text-slate-400 mb-6 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-address-book text-emerald-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 540,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        "Principal Contact"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 539,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-4 mb-6",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-lg font-poppins",
                                                                            children: organization.owner_name?.charAt(0) || 'O'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 545,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-semibold text-slate-800",
                                                                                    children: organization.owner_name || 'Unknown'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 549,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[10px] font-semibold text-slate-400 tracking-wide font-poppins",
                                                                                    children: "Owner / Admin"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 550,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 548,
                                                                            columnNumber: 34
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 544,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3 text-xs font-medium text-slate-600",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-phone-call"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 557,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 556,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "font-poppins",
                                                                                    children: organization.owner_phone_no || 'No Phone'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 559,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 555,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3 text-xs font-medium text-slate-600",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-envelope"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 563,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 562,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "truncate font-poppins",
                                                                                    children: organization.email || 'No Email'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 565,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 561,
                                                                            columnNumber: 34
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 554,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 538,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "lg:col-span-2 space-y-8 text-left",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "bg-white rounded-2xl overflow-hidden flex flex-col min-h-[500px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "text-sm font-bold text-slate-700 flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-users-alt text-indigo-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 576,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            "Member Directory"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 575,
                                                                        columnNumber: 34
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "relative",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 581,
                                                                                        columnNumber: 43
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                        type: "text",
                                                                                        placeholder: "Search members...",
                                                                                        value: searchQuery,
                                                                                        onChange: (e)=>setSearchQuery(e.target.value),
                                                                                        className: "pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-48 placeholder:text-slate-400"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 582,
                                                                                        columnNumber: 43
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 580,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            user?.isClient === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setShowUserModal(true),
                                                                                className: "flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all font-poppins",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-user-add"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 595,
                                                                                        columnNumber: 47
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: "Assign"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 596,
                                                                                        columnNumber: 47
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 591,
                                                                                columnNumber: 43
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setShowSignupModal(true),
                                                                                className: "flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-200 font-poppins",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-plus"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 604,
                                                                                        columnNumber: 43
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: "Add"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 605,
                                                                                        columnNumber: 43
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 600,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            user?.isClient === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setShowImportModal(true),
                                                                                className: "flex items-center gap-2 px-4 py-2 bg-indigo-50 text-[#4b33e8] border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all uppercase tracking-widest font-poppins",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-upload"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 613,
                                                                                        columnNumber: 47
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        children: "Import"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 614,
                                                                                        columnNumber: 47
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 609,
                                                                                columnNumber: 43
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 579,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 574,
                                                                columnNumber: 30
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 overflow-x-auto",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                                                    className: "w-full text-left border-collapse",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                                className: "bg-slate-50/50 border-b border-slate-100",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 font-poppins",
                                                                                        children: "Member Profile"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 624,
                                                                                        columnNumber: 46
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 font-poppins",
                                                                                        children: "Role"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 625,
                                                                                        columnNumber: 46
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 font-poppins",
                                                                                        children: "Status"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 626,
                                                                                        columnNumber: 46
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 font-poppins",
                                                                                        children: "License Expiry"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 627,
                                                                                        columnNumber: 46
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 text-right font-poppins",
                                                                                        children: "Actions"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 628,
                                                                                        columnNumber: 46
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 623,
                                                                                columnNumber: 42
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 622,
                                                                            columnNumber: 38
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                                            className: "divide-y divide-slate-50",
                                                                            children: [
                                                                                filteredUsers.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                                        className: "group hover:bg-indigo-50/10 transition-colors",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex items-center gap-3 text-left",
                                                                                                    children: [
                                                                                                        u.profile_pic_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                                                            src: u.profile_pic_url,
                                                                                                            className: "w-9 h-9 rounded-xl object-cover bg-white",
                                                                                                            alt: ""
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 637,
                                                                                                            columnNumber: 63
                                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: "w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-semibold text-xs font-poppins",
                                                                                                            children: (u.user_name || u.email || 'U').charAt(0).toUpperCase()
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 639,
                                                                                                            columnNumber: 63
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                                    className: "text-sm font-semibold text-slate-700",
                                                                                                                    children: u.user_name || 'Unnamed'
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                                    lineNumber: 644,
                                                                                                                    columnNumber: 63
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                                    className: "text-[10px] font-semibold text-slate-400 font-poppins",
                                                                                                                    children: u.employee_id || 'ID Pending'
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                                    lineNumber: 645,
                                                                                                                    columnNumber: 63
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 643,
                                                                                                            columnNumber: 59
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 635,
                                                                                                    columnNumber: 54
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 634,
                                                                                                columnNumber: 50
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex items-center gap-2 text-left",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-xs font-semibold text-slate-600 capitalize font-poppins",
                                                                                                            children: u.role || 'Employee'
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 651,
                                                                                                            columnNumber: 58
                                                                                                        }, this),
                                                                                                        u.is_client && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                            className: "px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 text-[9px] font-semibold uppercase font-poppins",
                                                                                                            children: "Client"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 653,
                                                                                                            columnNumber: 62
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 650,
                                                                                                    columnNumber: 54
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 649,
                                                                                                columnNumber: 50
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4 text-left",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: `inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider font-poppins ${u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`,
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                            className: `w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 661,
                                                                                                            columnNumber: 58
                                                                                                        }, this),
                                                                                                        u.status || 'Pending'
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 658,
                                                                                                    columnNumber: 55
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 657,
                                                                                                columnNumber: 51
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4 text-left",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExpiryBadge$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                                    expireDate: u.expire_at
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 666,
                                                                                                    columnNumber: 54
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 665,
                                                                                                columnNumber: 50
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4 text-right",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex items-center justify-end gap-2",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                            onClick: ()=>toggleUserStatus(u.id, u.status),
                                                                                                            className: `w-8 h-8 rounded-lg flex items-center justify-center transition-all ${u.status === 'active' ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'}`,
                                                                                                            title: u.status === 'active' ? 'Deactivate Member' : 'Activate Member',
                                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                                className: `fi flex ${u.status === 'active' ? 'fi-rr-power' : 'fi-rr-bolt'}`
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                                lineNumber: 679,
                                                                                                                columnNumber: 63
                                                                                                            }, this)
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 670,
                                                                                                            columnNumber: 59
                                                                                                        }, this),
                                                                                                        user?.isClient === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                            onClick: ()=>handleRemoveUser(u.id, u.user_name || 'User'),
                                                                                                            className: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors",
                                                                                                            title: "Remove from Organization",
                                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                                className: "fi flex fi-rr-trash"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                                lineNumber: 688,
                                                                                                                columnNumber: 65
                                                                                                            }, this)
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 683,
                                                                                                            columnNumber: 61
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 669,
                                                                                                    columnNumber: 55
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 668,
                                                                                                columnNumber: 51
                                                                                            }, this)
                                                                                        ]
                                                                                    }, u.id, true, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 633,
                                                                                        columnNumber: 46
                                                                                    }, this)),
                                                                                orgUsers.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                                        colSpan: 5,
                                                                                        className: "p-12 text-center",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                    className: "fi flex fi-rr-users text-slate-300"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 700,
                                                                                                    columnNumber: 58
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 699,
                                                                                                columnNumber: 54
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "text-sm font-semibold text-slate-400 font-poppins",
                                                                                                children: "No members deployed yet."
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 702,
                                                                                                columnNumber: 54
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 698,
                                                                                        columnNumber: 50
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 697,
                                                                                    columnNumber: 46
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 631,
                                                                            columnNumber: 38
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 621,
                                                                    columnNumber: 34
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 620,
                                                                columnNumber: 30
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 573,
                                                        columnNumber: 26
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 572,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 510,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 351,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/organization/[id].tsx",
                            lineNumber: 348,
                            columnNumber: 12
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this),
                    showSignupModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowSignupModal(false),
                                        className: "absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-cross-small"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 726,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                        lineNumber: 722,
                                        columnNumber: 20
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SignupForm$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                        onSuccess: ()=>{
                                            setShowSignupModal(false);
                                            refreshData(true);
                                        },
                                        defaultOrganizationId: organization?.id,
                                        fromAdminPanel: true
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                        lineNumber: 728,
                                        columnNumber: 20
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                lineNumber: 721,
                                columnNumber: 16
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/organization/[id].tsx",
                            lineNumber: 720,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 719,
                        columnNumber: 11
                    }, this),
                    showUserModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold text-slate-800",
                                            children: "Assign Member"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 746,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowUserModal(false),
                                            className: "w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-cross-small"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                lineNumber: 748,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 747,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 745,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6 space-y-6 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins",
                                                    children: "Select User"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 754,
                                                    columnNumber: 29
                                                }, this),
                                                unassignedUsers.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: selectedUserToAdd,
                                                    onChange: (e)=>setSelectedUserToAdd(e.target.value),
                                                    className: "w-full text-slate-600 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none font-poppins",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Choose a user..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 761,
                                                            columnNumber: 37
                                                        }, this),
                                                        unassignedUsers.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: u.id,
                                                                children: [
                                                                    u.user_name || u.email,
                                                                    " (",
                                                                    u.email,
                                                                    ")"
                                                                ]
                                                            }, u.id, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 763,
                                                                columnNumber: 41
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 756,
                                                    columnNumber: 33
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "p-4 rounded-xl bg-slate-50 text-center border border-slate-100 border-dashed",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-semibold text-slate-500 font-poppins",
                                                        children: "No unassigned users available."
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 770,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 769,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 753,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-3 pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowUserModal(false),
                                                    className: "flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors font-poppins",
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 776,
                                                    columnNumber: 30
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleAddUser,
                                                    disabled: !selectedUserToAdd || addingUser,
                                                    className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed font-poppins",
                                                    children: addingUser ? 'Assigning...' : 'Assign Selected User'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 782,
                                                    columnNumber: 30
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 775,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 752,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/organization/[id].tsx",
                            lineNumber: 744,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 743,
                        columnNumber: 13
                    }, this),
                    showRenewalModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-semibold text-gray-800",
                                            style: {
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: "Renew Organization"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 800,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowRenewalModal(false),
                                            className: "text-gray-500 hover:text-gray-700 transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-cross text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                lineNumber: 807,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 803,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 799,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-6 space-y-6 text-left font-poppins",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium mb-3 text-gray-700",
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Select Renewal Period"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 813,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-4 gap-3 mb-4",
                                                    children: [
                                                        "1",
                                                        "2",
                                                        "3",
                                                        "custom"
                                                    ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setRenewalMonths(option),
                                                            className: `py-3 px-4 rounded-xl font-bold text-sm transition-all ${renewalMonths === option ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                                                            children: option === "custom" ? "Custom" : `${option}M`
                                                        }, option, false, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 819,
                                                            columnNumber: 37
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 817,
                                                    columnNumber: 29
                                                }, this),
                                                renewalMonths === "custom" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-3 mt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block t text-xs font-medium mb-2 text-gray-600 font-poppins",
                                                                    children: "Month"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 836,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: customMonth,
                                                                    onChange: (e)=>setCustomMonth(e.target.value),
                                                                    className: "w-full px-3 text-slate-600 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Select Month"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 842,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        Array.from({
                                                                            length: 12
                                                                        }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: i + 1,
                                                                                children: new Date(2000, i, 1).toLocaleString('default', {
                                                                                    month: 'long'
                                                                                })
                                                                            }, i + 1, false, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 844,
                                                                                columnNumber: 49
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 837,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 835,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs font-medium mb-2 text-gray-600 font-poppins",
                                                                    children: "Year"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 851,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                    value: customYear,
                                                                    onChange: (e)=>setCustomYear(e.target.value),
                                                                    className: "w-full px-3 text-slate-600 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Select Year"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 857,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        Array.from({
                                                                            length: 10
                                                                        }, (_, i)=>{
                                                                            const year = new Date().getFullYear() + i;
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                                value: year,
                                                                                children: year
                                                                            }, year, false, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 860,
                                                                                columnNumber: 56
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 852,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 850,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 834,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 812,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-50 border border-blue-200 rounded-lg p-4 font-poppins",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-info text-blue-600 text-sm mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 870,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-blue-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold mb-1",
                                                                children: "Renewal Information"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 872,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    "• Current Expiry: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatDate"])(organization?.expiry_date)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 873,
                                                                        columnNumber: 58
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 873,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    "• Renewal Date: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatDate"])(new Date().toISOString())
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 874,
                                                                        columnNumber: 56
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 874,
                                                                columnNumber: 37
                                                            }, this),
                                                            previewExpiryDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    "• New Expiry: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        className: "text-indigo-600",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatDate"])(previewExpiryDate)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 876,
                                                                        columnNumber: 58
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 876,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "• Organization will be marked as Active"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 878,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 871,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                lineNumber: 869,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 868,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex gap-3 pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowRenewalModal(false),
                                                    className: "flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors font-poppins",
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 884,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: handleRenewalOrganization,
                                                    disabled: renewingOrg,
                                                    className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed font-poppins",
                                                    children: renewingOrg ? 'Renewing...' : 'Confirm Renewal'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 890,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 883,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 811,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/organization/[id].tsx",
                            lineNumber: 798,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 797,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        show: showImportModal,
                        onClose: ()=>setShowImportModal(false),
                        onSuccess: ()=>{
                            refreshData(true);
                        },
                        preselectedOrgId: organization?.id || "",
                        preselectedCampaignId: ""
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 904,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/organization/[id].tsx",
                lineNumber: 344,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(OrganizationDetail, "3YOhMPStDyBUfPMVH6MErewII+w=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useOrganizationDetailData"]
    ];
});
_c = OrganizationDetail;
var _c;
__turbopack_context__.k.register(_c, "OrganizationDetail");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=pages_portal_organization_%5Bid%5D_tsx_db9b7df4._.js.map