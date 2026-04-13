module.exports = [
"[project]/pages/portal/organization/create.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// pages/organization/create.tsx
__turbopack_context__.s([
    "default",
    ()=>CreateOrganization
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
const companyTypes = [
    'Sales',
    'Marketing',
    'Information Technology (IT)',
    'Finance',
    'Accounts',
    'Human Resources (HR)',
    'Operations',
    'Customer Support / Customer Success',
    'Administration',
    'Legal & Compliance',
    'Procurement / Purchase',
    'Supply Chain / Logistics',
    'Research & Development (R&D)',
    'Quality Assurance (QA)',
    'Product Management',
    'Business Development',
    'Strategy & Planning',
    'Training & Learning',
    'Security',
    'Facilities Management',
    'Insurance',
    'School',
    'Others'
];
const formatDate = (dateString)=>{
    if (!dateString) return "—";
    // Extract only YYYY-MM-DD part
    const datePart = dateString.split('T')[0];
    if (!datePart.includes('-')) return "—";
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
};
function CreateOrganization() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, mounted, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        company_name: '',
        company_type: '',
        description: '',
        owner_name: '',
        owner_phone_no: '',
        gst_no: '',
        address: '',
        email: '',
        renewal_date: new Date().toISOString().split('T')[0],
        expiry_date: (()=>{
            const today = new Date();
            // Logic: Set expiry to the last day of the current month
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            const year = lastDay.getFullYear();
            const month = String(lastDay.getMonth() + 1).padStart(2, '0');
            const day = String(lastDay.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        })(),
        is_active: true,
        company_joined: new Date().toISOString().split('T')[0],
        org_code: ''
    });
    const [unassignedUsers, setUnassignedUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedUserIds, setSelectedUserIds] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loadingUsers, setLoadingUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [ownerMode, setOwnerMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('new');
    const [selectedOwnerId, setSelectedOwnerId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [ownerPassword, setOwnerPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [submitting, setSubmitting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const handleLogoutClick = async ()=>{
    // router.push already handled by AppLayout logout but we can keep the callback if needed for consistency
    };
    // Page level protection logic (Strict: Hidden by default)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && user) {
            const isOrgVisible = user.isClient === false || user.isClient === true && user.designation?.toLowerCase() === 'ceo';
            if (!isOrgVisible) {
                console.warn("Unauthorized access to organization create, redirecting...");
                router.replace('/dashboard');
            }
        }
    }, [
        mounted,
        user,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchUnassignedUsers();
    }, []);
    const fetchUnassignedUsers = async ()=>{
        setLoadingUsers(true);
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').is('organization_id', null);
            if (data) setUnassignedUsers(data);
            if (error) throw error;
        } catch (err) {
            console.error('Error fetching users:', err);
        } finally{
            setLoadingUsers(false);
        }
    };
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setForm((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const handleOwnerModeChange = (mode)=>{
        setOwnerMode(mode);
        if (mode === 'new') {
            setForm((prev)=>({
                    ...prev,
                    owner_name: '',
                    owner_phone_no: '',
                    email: ''
                }));
            setSelectedOwnerId('');
        }
    };
    const handleOwnerSelect = (userId)=>{
        const selectedUser = unassignedUsers.find((u)=>u.user_id === userId);
        if (selectedUser) {
            setSelectedOwnerId(userId);
            setForm((prev)=>({
                    ...prev,
                    owner_name: selectedUser.user_name || '',
                    owner_phone_no: selectedUser.contact_no || '',
                    email: selectedUser.email || ''
                }));
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            // 1. Create the Organization
            const { data: newOrg, error: insertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').insert([
                {
                    company_name: form.company_name,
                    company_type: form.company_type || null,
                    description: form.description || null,
                    owner_name: form.owner_name || null,
                    owner_phone_no: form.owner_phone_no || null,
                    email: form.email || null,
                    gst_no: form.gst_no || null,
                    address: form.address || null,
                    renewal_date: form.renewal_date || null,
                    expiry_date: form.expiry_date || null,
                    is_active: form.is_active,
                    company_joined: form.company_joined ? new Date(form.company_joined).toISOString() : new Date().toISOString(),
                    org_code: form.org_code ? form.org_code.toUpperCase() : null,
                    company_code: form.org_code ? `CM${form.org_code.toUpperCase()}1` : null
                }
            ]).select().single();
            if (insertError) throw insertError;
            if (!newOrg) throw new Error("Failed to create organization record.");
            // 2. Handle Owner Association/Creation
            let finalOwnerUserId = selectedOwnerId;
            if (ownerMode === 'new') {
                // Create new user via signup API
                const signupRes = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: form.email,
                        password: ownerPassword,
                        user_name: form.owner_name,
                        contact_no: form.owner_phone_no,
                        user_type: 'employee',
                        organization_id: newOrg.id,
                        from_admin_panel: true,
                        is_client: true,
                        joined_at: form.company_joined ? new Date(form.company_joined).toISOString() : new Date().toISOString(),
                        renewal_at: form.renewal_date ? new Date(form.renewal_date).toISOString() : new Date().toISOString(),
                        expire_at: form.expiry_date ? new Date(form.expiry_date).toISOString() : (()=>{
                            const today = new Date();
                            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                            const year = lastDay.getFullYear();
                            const month = String(lastDay.getMonth() + 1).padStart(2, '0');
                            const day = String(lastDay.getDate()).padStart(2, '0');
                            return `${year}-${month}-${day}`;
                        })()
                    })
                });
                const signupData = await signupRes.json();
                if (!signupRes.ok) throw new Error(signupData.error || 'Failed to create owner profile');
            // No need to update organization_id separately as it's passed to signup
            } else if (ownerMode === 'existing' && selectedOwnerId) {
                // Update existing user's organization_id
                const { error: ownerUpdateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                    organization_id: newOrg.id,
                    role: 'admin'
                }) // Make owner an admin
                .eq('user_id', selectedOwnerId);
                if (ownerUpdateError) throw ownerUpdateError;
            }
            // 3. Handle additional members deployment
            const allUserIdsToAssociate = [
                ...ownerMode === 'existing' ? [] : [],
                ...selectedUserIds.filter((id)=>id !== selectedOwnerId)
            ];
            if (allUserIdsToAssociate.length > 0) {
                const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                    organization_id: newOrg.id
                }).in('user_id', allUserIdsToAssociate);
                if (updateError) throw updateError;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Onboard Organization: ${form.company_name}`,
                metadata: {
                    organization_id: newOrg.id,
                    organization_name: form.company_name,
                    org_code: form.org_code,
                    initial_members: allUserIdsToAssociate.length + 1,
                    owner_mode: ownerMode
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])(form),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.uid ? undefined : undefined // This is internal staff action usually
            });
            router.push('/organization');
        } catch (err) {
            console.error('Submission error:', err);
            setError(err.message || 'Failed to register organization');
        } finally{
            setSubmitting(false);
        }
    };
    if (!mounted || authLoading) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    className: "jsx-cfac28d390e9fe8e",
                    children: "Onboard Asset • TFC Nexus"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/organization/create.tsx",
                    lineNumber: 253,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/organization/create.tsx",
                lineNumber: 252,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "cfac28d390e9fe8e",
                children: "@keyframes float{0%{transform:translateY(0)}50%{transform:translateY(-10px)}to{transform:translateY(0)}}.animate-float{animation:6s ease-in-out infinite float}.glass-panel{-webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);background:#fffc;border:1px solid #ffffff4d}"
            }, void 0, false, void 0, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-cfac28d390e9fe8e" + " " + "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-2 text-xs text-gray-400 mb-8 px-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                onClick: ()=>router.push("/dashboard"),
                                className: "jsx-cfac28d390e9fe8e" + " " + "cursor-pointer hover:text-[#4b33e8] transition-colors",
                                children: "Dashboard"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization/create.tsx",
                                lineNumber: 273,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "jsx-cfac28d390e9fe8e" + " " + "fi flex fi-rr-angle-small-right text-[10px]"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization/create.tsx",
                                lineNumber: 276,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                onClick: ()=>router.push("/organization"),
                                className: "jsx-cfac28d390e9fe8e" + " " + "cursor-pointer hover:text-[#4b33e8] transition-colors",
                                children: "Organizations"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization/create.tsx",
                                lineNumber: 277,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "jsx-cfac28d390e9fe8e" + " " + "fi flex fi-rr-angle-small-right text-[10px]"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization/create.tsx",
                                lineNumber: 280,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "jsx-cfac28d390e9fe8e" + " " + "text-gray-600 font-bold",
                                children: "Onboard New"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization/create.tsx",
                                lineNumber: 281,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/organization/create.tsx",
                        lineNumber: 272,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-cfac28d390e9fe8e" + " " + "relative w-full overflow-hidden rounded-3xl pt-12 pb-32 mb-8 shadow-xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-cfac28d390e9fe8e" + " " + "absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#4338ca] z-0"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization/create.tsx",
                                lineNumber: 286,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-cfac28d390e9fe8e" + " " + "absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] -mr-64 -mt-64 animate-pulse"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization/create.tsx",
                                lineNumber: 288,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-cfac28d390e9fe8e" + " " + "absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[80px] -ml-40 -mb-40"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization/create.tsx",
                                lineNumber: 289,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-cfac28d390e9fe8e" + " " + "px-8 relative z-10",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-cfac28d390e9fe8e" + " " + "flex flex-col md:flex-row items-center md:items-end justify-between gap-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-center md:text-left",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white/70 text-[10px] font-semibold uppercase tracking-[0.2em] mb-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-sparkles text-amber-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 295,
                                                            columnNumber: 26
                                                        }, this),
                                                        "New Onboarding Sequence"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4 drop-shadow-sm",
                                                    children: [
                                                        "Asset ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-blue-200",
                                                            children: "Registration"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 299,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-indigo-100/60 max-w-xl font-medium text-base leading-relaxed",
                                                    children: "Configure organizational identity, operational compliance, and license life-cycles within our secure infrastructure."
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 301,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                            lineNumber: 293,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-4 bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 ",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "flex -space-x-3",
                                                    children: [
                                                        1,
                                                        2,
                                                        3
                                                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + `w-10 h-10 rounded-full border-2 border-[#1e1b4b] flex items-center justify-center text-xs font-semibold transition-all ${i === 1 ? 'bg-indigo-400 text-white' : 'bg-white/10 text-white/40'}`,
                                                            children: [
                                                                "0",
                                                                i
                                                            ]
                                                        }, i, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 310,
                                                            columnNumber: 28
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 308,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "h-10 w-[1px] bg-white/10 mx-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-white/30 uppercase tracking-widest leading-none mb-1.5",
                                                            children: "Current Phase"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 317,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-xs font-bold text-white tracking-widest uppercase",
                                                            children: "Identity Mapping"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 318,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                            lineNumber: 307,
                                            columnNumber: 20
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                    lineNumber: 292,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/organization/create.tsx",
                                lineNumber: 291,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/organization/create.tsx",
                        lineNumber: 285,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-cfac28d390e9fe8e" + " " + "px-0 sm:px-4 -mt-20 relative z-20",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            className: "jsx-cfac28d390e9fe8e" + " " + "flex flex-col lg:flex-row gap-10 max-w-6xl mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-cfac28d390e9fe8e" + " " + "flex-1 space-y-8",
                                    children: [
                                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-cfac28d390e9fe8e" + " " + "bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-4 animate-shake",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-200",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-cross-small text-xl font-bold"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 333,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-red-400 uppercase tracking-widest leading-none mb-1",
                                                            children: "Upload Error"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 337,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-sm font-bold text-red-700",
                                                            children: error
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 338,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 336,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                            lineNumber: 332,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-cfac28d390e9fe8e" + " " + "bg-white rounded-2xl p-10  shadow-gray-200/50 border border-gray-50 relative overflow-hidden group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl transition-colors group-hover:bg-indigo-100/50"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 345,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center justify-between mb-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-building text-2xl"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 350,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 349,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-xl font-semibold text-gray-800 tracking-tight",
                                                                            children: "Identity & Branding"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 353,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-xs font-bold text-gray-400 uppercase tracking-widest",
                                                                            children: "Company Core Details"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 354,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 352,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 348,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-lg uppercase tracking-widest",
                                                            children: "Step 01"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 357,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "grid grid-cols-1 md:grid-cols-4 gap-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "md:col-span-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                    children: "Legal Company Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 362,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-shop absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 364,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "text",
                                                                            name: "company_name",
                                                                            value: form.company_name,
                                                                            onChange: handleChange,
                                                                            required: true,
                                                                            placeholder: "e.g. Nexus Global Innovations",
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-500 focus:shadow-xl focus:shadow-indigo-500/5 transition-all outline-none"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 365,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 363,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 361,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "md:col-span-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1 text-center",
                                                                    children: "Org Prefix"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 378,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "org_code",
                                                                    value: form.org_code,
                                                                    onChange: (e)=>setForm({
                                                                            ...form,
                                                                            org_code: e.target.value.toUpperCase().substring(0, 3)
                                                                        }),
                                                                    required: true,
                                                                    maxLength: 3,
                                                                    placeholder: "NXI",
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 text-center tracking-[0.5em] focus:outline-none focus:bg-white focus:border-indigo-500 focus:shadow-xl focus:shadow-indigo-500/5 transition-all outline-none uppercase"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 379,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 377,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "md:col-span-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                    children: "Industry Vertical / Sector"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 392,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-apps absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 394,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                            name: "company_type",
                                                                            value: form.company_type,
                                                                            onChange: handleChange,
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all appearance-none cursor-pointer outline-none",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                                    children: "Choose Industry Sector"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 401,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                companyTypes.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                        value: t,
                                                                                        className: "jsx-cfac28d390e9fe8e",
                                                                                        children: t
                                                                                    }, t, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 402,
                                                                                        columnNumber: 54
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 395,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-angle-small-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 404,
                                                                            columnNumber: 28
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 393,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 391,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "md:col-span-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                    children: "Vision & Mission"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 409,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                                    name: "description",
                                                                    value: form.description,
                                                                    onChange: handleChange,
                                                                    rows: 4,
                                                                    placeholder: "Briefly describe the business model and core values...",
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-full px-6 py-5 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 resize-none focus:outline-none focus:bg-white focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 410,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                            lineNumber: 344,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-cfac28d390e9fe8e" + " " + "bg-white rounded-2xl p-10 shadow-gray-200/50 border border-gray-50 group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center justify-between mb-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-xl shadow-emerald-100",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-shield-check text-2xl"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 427,
                                                                        columnNumber: 28
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 426,
                                                                    columnNumber: 26
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-xl font-semibold text-gray-800 tracking-tight",
                                                                            children: "Compliance & Registry"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 430,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-xs font-bold text-gray-400 uppercase tracking-widest",
                                                                            children: "Owner & Contact Interface"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 431,
                                                                            columnNumber: 28
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 429,
                                                                    columnNumber: 26
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 425,
                                                            columnNumber: 24
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg uppercase tracking-widest",
                                                            children: "Step 02"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 434,
                                                            columnNumber: 24
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "space-y-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-4 p-1.5 bg-slate-100/50 rounded-2xl w-fit",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>handleOwnerModeChange('new'),
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + `px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${ownerMode === 'new' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-user-add mr-2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 445,
                                                                            columnNumber: 30
                                                                        }, this),
                                                                        "New Profile"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 440,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    type: "button",
                                                                    onClick: ()=>handleOwnerModeChange('existing'),
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + `px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${ownerMode === 'existing' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-user-check mr-2"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 453,
                                                                            columnNumber: 30
                                                                        }, this),
                                                                        "Existing Citizen"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 448,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 439,
                                                            columnNumber: 24
                                                        }, this),
                                                        ownerMode === 'existing' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "animate-in fade-in slide-in-from-top-4 duration-500",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                    children: "Select Unassigned Member"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 460,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 462,
                                                                            columnNumber: 30
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                            value: selectedOwnerId,
                                                                            onChange: (e)=>handleOwnerSelect(e.target.value),
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all appearance-none cursor-pointer outline-none",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                                    children: "Choose User Profile..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 468,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                unassignedUsers.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                        value: u.user_id,
                                                                                        className: "jsx-cfac28d390e9fe8e",
                                                                                        children: [
                                                                                            u.user_name || u.email,
                                                                                            " (",
                                                                                            u.email,
                                                                                            ")"
                                                                                        ]
                                                                                    }, u.user_id, true, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 470,
                                                                                        columnNumber: 35
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 463,
                                                                            columnNumber: 30
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-angle-small-down absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 475,
                                                                            columnNumber: 30
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 461,
                                                                    columnNumber: 28
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 459,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "grid grid-cols-1 md:grid-cols-2 gap-8",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                            children: "Principal / Owner Name"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 482,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 484,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    name: "owner_name",
                                                                                    value: form.owner_name,
                                                                                    onChange: handleChange,
                                                                                    readOnly: ownerMode === 'existing',
                                                                                    placeholder: "Full Name",
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + `w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none ${ownerMode === 'existing' ? 'opacity-70 grayscale-[0.5]' : ''}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 485,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 483,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 481,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                            children: "Operational Contact"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 497,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-phone-call absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 499,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "tel",
                                                                                    name: "owner_phone_no",
                                                                                    value: form.owner_phone_no,
                                                                                    onChange: handleChange,
                                                                                    readOnly: ownerMode === 'existing',
                                                                                    placeholder: "+91 XXX XXX XXXX",
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + `w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none ${ownerMode === 'existing' ? 'opacity-70 grayscale-[0.5]' : ''}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 500,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 498,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 496,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                            children: "Official Support Email"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 512,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 514,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "email",
                                                                                    name: "email",
                                                                                    value: form.email,
                                                                                    onChange: handleChange,
                                                                                    readOnly: ownerMode === 'existing',
                                                                                    placeholder: "admin@organization.com",
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + `w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none ${ownerMode === 'existing' ? 'opacity-70 grayscale-[0.5]' : ''}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 515,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 513,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 511,
                                                                    columnNumber: 27
                                                                }, this),
                                                                ownerMode === 'new' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "animate-in zoom-in-95 duration-300",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1 text-emerald-600",
                                                                            children: "Secure Access Key (Password)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 529,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-lock absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 531,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "password",
                                                                                    value: ownerPassword,
                                                                                    onChange: (e)=>setOwnerPassword(e.target.value),
                                                                                    required: ownerMode === 'new',
                                                                                    placeholder: "••••••••",
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 pl-14 pr-6 bg-emerald-50/50 border-2 border-dashed border-emerald-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 532,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 530,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 528,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + ((ownerMode === 'existing' ? 'md:col-span-1' : 'md:col-span-2') || ""),
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                            children: "GST Identification (GSTIN)"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 545,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-document-signed absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 547,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    name: "gst_no",
                                                                                    value: form.gst_no,
                                                                                    onChange: handleChange,
                                                                                    placeholder: "Compliance Code",
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 uppercase focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 548,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 546,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 544,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "md:col-span-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                            children: "Registered Business Address"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 559,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-marker absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 561,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    name: "address",
                                                                                    value: form.address,
                                                                                    onChange: handleChange,
                                                                                    placeholder: "Building, Street, City, State, ZIP",
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 pl-14 pr-6 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 transition-all outline-none"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 562,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 560,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 558,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 480,
                                                            columnNumber: 24
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 437,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                            lineNumber: 423,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-cfac28d390e9fe8e" + " " + "bg-white rounded-2xl p-10  shadow-gray-200/50 border border-gray-50 overflow-hidden relative group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "absolute bottom-0 right-0 w-48 h-48 bg-amber-50 rounded-full -mr-24 -mb-24 blur-3xl opacity-50"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 578,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-xl shadow-amber-100",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-crown text-2xl"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 583,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 582,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-xl font-semibold text-gray-800 tracking-tight",
                                                                            children: "Lifecycle & Licensing"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 586,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-xs font-bold text-gray-400 uppercase tracking-widest",
                                                                            children: "Validations & Deadlines"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 587,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 585,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 581,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            type: "button",
                                                            onClick: ()=>setForm({
                                                                    ...form,
                                                                    is_active: !form.is_active
                                                                }),
                                                            className: "jsx-cfac28d390e9fe8e" + " " + `px-6 py-3 rounded-2xl flex items-center gap-4 transition-all ${form.is_active ? 'bg-green-500 text-white shadow-lg shadow-green-100 ring-4 ring-green-500/10' : 'bg-slate-100 text-slate-400 border border-slate-200'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + `w-5 h-5 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ${form.is_active ? 'translate-x-0 rotate-0' : 'translate-x-0 opacity-20'}`,
                                                                    children: form.is_active && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-check text-[10px] text-green-500"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 601,
                                                                        columnNumber: 47
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 600,
                                                                    columnNumber: 26
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-xs font-semibold uppercase tracking-widest",
                                                                    children: "Active Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 603,
                                                                    columnNumber: 26
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 591,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 580,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "grid grid-cols-1 md:grid-cols-3 gap-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                    children: "Engagement Date"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 609,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "relative group/date",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-calendar-check absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 z-10"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 611,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 pl-14 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 flex items-center group-focus-within/date:bg-white group-focus-within/date:border-amber-500 transition-all",
                                                                            children: formatDate(form.company_joined)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 612,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "date",
                                                                            name: "company_joined",
                                                                            value: form.company_joined,
                                                                            onChange: handleChange,
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "absolute inset-0 opacity-0 cursor-pointer z-20"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 615,
                                                                            columnNumber: 28
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 610,
                                                                    columnNumber: 26
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 608,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                    children: "Next Renewal"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 625,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "relative group/date",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-refresh absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 animate-spin-slow z-10"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 627,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 pl-14 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 flex items-center group-focus-within/date:bg-white group-focus-within/date:border-amber-500 transition-all",
                                                                            children: formatDate(form.renewal_date)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 628,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "date",
                                                                            name: "renewal_date",
                                                                            value: form.renewal_date,
                                                                            onChange: handleChange,
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "absolute inset-0 opacity-0 cursor-pointer z-20"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 631,
                                                                            columnNumber: 28
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 626,
                                                                    columnNumber: 26
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 624,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-3 block px-1",
                                                                    children: "Expiration Cut-off"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 641,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "relative group/date",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-alarm-clock absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 z-10"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 643,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-14 pl-14 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-700 flex items-center group-focus-within/date:bg-white group-focus-within/date:border-amber-500 transition-all",
                                                                            children: formatDate(form.expiry_date)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 644,
                                                                            columnNumber: 28
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "date",
                                                                            name: "expiry_date",
                                                                            value: form.expiry_date,
                                                                            onChange: handleChange,
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "absolute inset-0 opacity-0 cursor-pointer z-20"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 647,
                                                                            columnNumber: 28
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 642,
                                                                    columnNumber: 26
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 640,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 607,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                            lineNumber: 577,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-cfac28d390e9fe8e" + " " + "bg-white rounded-2xl p-10 shadow-gray-200/50 border border-gray-50 overflow-hidden relative group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-100",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-users-alt text-2xl"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 664,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 663,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-xl font-semibold text-gray-800 tracking-tight",
                                                                            children: "Member Deployment"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 667,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-xs font-bold text-gray-400 uppercase tracking-widest",
                                                                            children: "Assign Unassigned Personnel"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 668,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 666,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 662,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-semibold text-blue-500 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-widest",
                                                            children: [
                                                                unassignedUsers.length,
                                                                " Potential Leads"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 671,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 661,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-cfac28d390e9fe8e" + " " + "grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar",
                                                    children: loadingUsers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-cfac28d390e9fe8e" + " " + "col-span-full py-12 flex flex-col items-center justify-center gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 679,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "text-xs font-bold text-slate-400 uppercase tracking-widest",
                                                                children: "Registry Sync in Progress..."
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 680,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                        lineNumber: 678,
                                                        columnNumber: 26
                                                    }, this) : unassignedUsers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-cfac28d390e9fe8e" + " " + "col-span-full py-12 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-search-user text-3xl text-slate-300 mb-4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 684,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "text-sm font-bold text-slate-400 uppercase tracking-widest",
                                                                children: "No Unassigned Assets Found"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 685,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                        lineNumber: 683,
                                                        columnNumber: 26
                                                    }, this) : unassignedUsers.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            onClick: ()=>{
                                                                if (selectedUserIds.includes(u.user_id)) {
                                                                    setSelectedUserIds((prev)=>prev.filter((id)=>id !== u.user_id));
                                                                } else {
                                                                    setSelectedUserIds((prev)=>[
                                                                            ...prev,
                                                                            u.user_id
                                                                        ]);
                                                                }
                                                            },
                                                            className: "jsx-cfac28d390e9fe8e" + " " + `group flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer ${selectedUserIds.includes(u.user_id) ? 'bg-indigo-50 border-indigo-200 shadow-lg shadow-indigo-100/50' : 'bg-white border-slate-50 hover:border-indigo-100 hover:bg-slate-50/50'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "relative",
                                                                    children: [
                                                                        u.profile_pic_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                            src: u.profile_pic_url,
                                                                            alt: "",
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "w-10 h-10 rounded-xl object-cover shadow-md"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 706,
                                                                            columnNumber: 38
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-sm",
                                                                            children: (u.user_name || u.email).charAt(0).toUpperCase()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 708,
                                                                            columnNumber: 38
                                                                        }, this),
                                                                        selectedUserIds.includes(u.user_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-check text-[8px] font-bold"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 714,
                                                                                columnNumber: 41
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 713,
                                                                            columnNumber: 38
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 704,
                                                                    columnNumber: 32
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "flex-1 min-w-0",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-sm font-bold text-slate-700 truncate",
                                                                            children: u.user_name || 'Personnel Undefined'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 719,
                                                                            columnNumber: 35
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[9px] font-semibold text-slate-400 truncate uppercase tracking-widest",
                                                                            children: u.email
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 720,
                                                                            columnNumber: 35
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 718,
                                                                    columnNumber: 32
                                                                }, this)
                                                            ]
                                                        }, u.user_id, true, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 689,
                                                            columnNumber: 29
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                    lineNumber: 676,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                            lineNumber: 660,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                    lineNumber: 329,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-cfac28d390e9fe8e" + " " + "lg:w-[360px] shrink-0 space-y-8",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-cfac28d390e9fe8e" + " " + "sticky top-24 space-y-8",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-cfac28d390e9fe8e" + " " + "relative overflow-hidden group rounded-2xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-cfac28d390e9fe8e" + " " + "absolute inset-0 bg-gradient-to-tr from-[#1e1b4b] to-[#4338ca]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                        lineNumber: 735,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-cfac28d390e9fe8e" + " " + "absolute top-0 right-0 p-10 text-white/5 opacity-50 transform group-hover:scale-125 transition-transform duration-700",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-building text-[10rem]"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                            lineNumber: 737,
                                                            columnNumber: 26
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                        lineNumber: 736,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-cfac28d390e9fe8e" + " " + "relative p-10 z-10 flex flex-col items-center text-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "w-24 h-24 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 flex items-center justify-center text-white mb-8 ring-4 ring-white/5 animate-float shadow-2xl",
                                                                children: form.org_code ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "text-4xl font-semibold tracking-tighter",
                                                                    children: form.org_code
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 743,
                                                                    columnNumber: 30
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-mountains text-4xl text-indigo-200"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                    lineNumber: 745,
                                                                    columnNumber: 30
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 741,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                style: {
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "text-2xl font-semibold text-white mb-3 tracking-tight leading-tight",
                                                                children: form.company_name || 'Organization Identity'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 749,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "inline-flex py-1 px-4 rounded-full bg-white/10 text-indigo-200 text-[9px] font-semibold uppercase tracking-[0.3em] mb-6 backdrop-blur-md",
                                                                children: form.company_type || 'Uncategorized Asset'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 752,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "text-white/40 text-xs font-medium leading-relaxed mb-8 line-clamp-3 italic bg-white/5 p-5 rounded-2xl border border-white/5",
                                                                children: [
                                                                    '"',
                                                                    form.description || 'Provide a vision statement to populate the neural descriptors for this asset...',
                                                                    '"'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 756,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "w-full space-y-4 pt-4 border-t border-white/10 text-left",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "p-2 rounded-lg bg-green-500/20 text-green-400",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-shield-check text-[10px]"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                            lineNumber: 765,
                                                                                            columnNumber: 36
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 764,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-white/30 text-[9px] font-semibold uppercase tracking-widest",
                                                                                        children: "Global Status"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 767,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 763,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + `text-[10px] font-semibold uppercase tracking-widest ${form.is_active ? 'text-green-400' : 'text-red-400'}`,
                                                                                children: form.is_active ? 'Authorized' : 'Deactivated'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 769,
                                                                                columnNumber: 30
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 762,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "p-2 rounded-lg bg-indigo-500/20 text-indigo-400",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-users text-[10px]"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                            lineNumber: 777,
                                                                                            columnNumber: 36
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 776,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-white/30 text-[9px] font-semibold uppercase tracking-widest",
                                                                                        children: "Initial Deployment"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 779,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 775,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "text-white/70 text-[10px] font-semibold tracking-[0.3em]",
                                                                                children: [
                                                                                    selectedUserIds.length,
                                                                                    " Members"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 781,
                                                                                columnNumber: 30
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 774,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "p-2 rounded-lg bg-blue-500/20 text-blue-400",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-key text-[10px]"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                            lineNumber: 787,
                                                                                            columnNumber: 36
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 786,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-white/30 text-[9px] font-semibold uppercase tracking-widest",
                                                                                        children: "Asset Code"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 789,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 785,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "text-white/70 text-[10px] font-semibold tracking-[0.3em]",
                                                                                children: form.org_code || '---'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 791,
                                                                                columnNumber: 30
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 784,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center justify-between",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "p-2 rounded-lg bg-amber-500/20 text-amber-400",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-fingerprint text-[10px]"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                            lineNumber: 797,
                                                                                            columnNumber: 37
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 796,
                                                                                        columnNumber: 34
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-white/30 text-[9px] font-semibold uppercase tracking-widest",
                                                                                        children: "System Identifier"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 799,
                                                                                        columnNumber: 34
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 795,
                                                                                columnNumber: 31
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "text-white/70 text-[10px] font-semibold tracking-[0.3em]",
                                                                                children: form.org_code ? `CM${form.org_code.toUpperCase()}1` : '---'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 801,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 794,
                                                                        columnNumber: 28
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "pt-4 border-t border-white/5 grid grid-cols-2 gap-4",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "space-y-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-[8px] font-black text-white/20 uppercase tracking-widest",
                                                                                        children: "Engagement Date"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 807,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-bold text-white/70",
                                                                                        children: formatDate(form.company_joined)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 808,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 806,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "space-y-1 text-right",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-[8px] font-black text-white/20 uppercase tracking-widest",
                                                                                        children: "Next Renewal"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 811,
                                                                                        columnNumber: 33
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-[10px] font-bold text-white/70",
                                                                                        children: formatDate(form.renewal_date)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 812,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 810,
                                                                                columnNumber: 30
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "col-span-2 pt-2 border-t border-white/5",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center justify-between",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "text-[8px] font-black text-white/20 uppercase tracking-widest",
                                                                                            children: "Expiration Cut-off"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                            lineNumber: 816,
                                                                                            columnNumber: 36
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                            className: "jsx-cfac28d390e9fe8e" + " " + `text-[11px] font-bold ${form.is_active ? 'text-indigo-200' : 'text-red-400'}`,
                                                                                            children: formatDate(form.expiry_date)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                            lineNumber: 817,
                                                                                            columnNumber: 36
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 815,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 814,
                                                                                columnNumber: 30
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 805,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 760,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                        lineNumber: 740,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                lineNumber: 734,
                                                columnNumber: 20
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-cfac28d390e9fe8e" + " " + "bg-white rounded-2xl p-8 border border-gray-100 relative overflow-hidden group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-cfac28d390e9fe8e" + " " + "absolute inset-0 bg-gradient-to-br from-indigo-50/20 to-transparent pointer-events-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                        lineNumber: 827,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-cfac28d390e9fe8e" + " " + "relative z-10 space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                type: "submit",
                                                                disabled: submitting,
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "group relative w-full h-16 rounded-2xl bg-[#1e1b4b] text-white overflow-hidden shadow-indigo-200/50 transition-all active:scale-95 disabled:opacity-50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 835,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "relative z-10 flex items-center justify-center gap-4 text-sm font-semibold uppercase tracking-[0.2em]",
                                                                        children: submitting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-cfac28d390e9fe8e" + " " + "w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/create.tsx",
                                                                            lineNumber: 838,
                                                                            columnNumber: 35
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-rocket-lunch text-lg group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 841,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-cfac28d390e9fe8e",
                                                                                    children: "Sync & Publish"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 842,
                                                                                    columnNumber: 37
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 836,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 830,
                                                                columnNumber: 26
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>router.push('/organization'),
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "w-full h-12 rounded-xl text-slate-400 hover:text-indigo-600 font-semibold uppercase tracking-widest text-[10px] transition-colors",
                                                                children: "Terminate Sequence"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 848,
                                                                columnNumber: 26
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-cfac28d390e9fe8e" + " " + "pt-6 mt-6 border-t border-slate-50 flex flex-col gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-4 group/item",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-lock text-[10px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 859,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 858,
                                                                                columnNumber: 32
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "flex-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-[9px] font-semibold text-slate-800 uppercase tracking-widest leading-none mb-1",
                                                                                        children: "Encrypted Payload"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 862,
                                                                                        columnNumber: 36
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-[8px] font-bold text-slate-400",
                                                                                        children: "256-bit AES DB Injection"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 863,
                                                                                        columnNumber: 36
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 861,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 857,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "flex items-center gap-4 group/item",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover/item:bg-emerald-500 group-hover/item:text-white transition-all",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-cfac28d390e9fe8e" + " " + "fi flex flex fi-rr-database text-[10px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                    lineNumber: 868,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 867,
                                                                                columnNumber: 32
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-cfac28d390e9fe8e" + " " + "flex-1",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-[9px] font-semibold text-slate-800 uppercase tracking-widest leading-none mb-1",
                                                                                        children: "Neural Indexing"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 871,
                                                                                        columnNumber: 36
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                        className: "jsx-cfac28d390e9fe8e" + " " + "text-[8px] font-bold text-slate-400",
                                                                                        children: "Instant Registry Conflict Check"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                        lineNumber: 872,
                                                                                        columnNumber: 36
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                                lineNumber: 870,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                                        lineNumber: 866,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                                lineNumber: 856,
                                                                columnNumber: 26
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                                        lineNumber: 829,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization/create.tsx",
                                                lineNumber: 826,
                                                columnNumber: 20
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/organization/create.tsx",
                                        lineNumber: 733,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/organization/create.tsx",
                                    lineNumber: 730,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/organization/create.tsx",
                            lineNumber: 326,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/create.tsx",
                        lineNumber: 325,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/organization/create.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this)
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

//# sourceMappingURL=%5Broot-of-the-server%5D__5d11cc80._.js.map