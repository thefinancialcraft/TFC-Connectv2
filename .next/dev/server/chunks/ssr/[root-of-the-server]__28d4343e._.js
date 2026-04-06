module.exports = [
"[project]/pages/portal/call-sessions.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>CallSessionsPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function CallSessionsPage() {
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [isAuthorized, setIsAuthorized] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const formatTimeSafe = (date)=>{
        if (!date) return '--:--:--';
        try {
            return new Date(date).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (e) {
            return '--:--:--';
        }
    };
    const formatDateSafe = (date)=>{
        if (!date) return '-- -- --';
        try {
            return new Date(date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return '-- -- --';
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && user) {
            // Check authorization: only NXUS-001
            if (user.employeeId === 'NXUS-001') {
                setIsAuthorized(true);
                fetchSessions();
            } else {
                setIsAuthorized(false);
                setLoading(false);
            }
        } else if (mounted && !user) {
            setIsAuthorized(false);
            setLoading(false);
        }
    }, [
        user,
        mounted
    ]);
    const fetchSessions = async ()=>{
        try {
            setLoading(true);
            // 1. Fetch sessions
            const { data: sessionData, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').order('updated_at', {
                ascending: false
            });
            if (sessionError) throw sessionError;
            if (!sessionData || sessionData.length === 0) {
                setSessions([]);
                return;
            }
            // 2. Collect IDs for enrichment
            const userIds = Array.from(new Set(sessionData.map((s)=>s.user_id)));
            const campaignIds = Array.from(new Set(sessionData.map((s)=>s.campaign_id)));
            const customerIds = Array.from(new Set(sessionData.map((s)=>s.customer_id).filter((id)=>!!id)));
            // 3. Fetch related data in parallel
            const [usersRes, campaignsRes, customersRes] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, user_name, employee_id').in('user_id', userIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('id, name').in('id', campaignIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, phone_no').in('id', customerIds)
            ]);
            // 4. Map names
            const userMap = Object.fromEntries((usersRes.data || []).map((u)=>[
                    u.user_id,
                    u
                ]));
            const campaignMap = Object.fromEntries((campaignsRes.data || []).map((c)=>[
                    c.id,
                    c.name
                ]));
            const customerMap = Object.fromEntries((customersRes.data || []).map((c)=>[
                    c.id,
                    c
                ]));
            // 5. Enrich sessions
            const enriched = sessionData.map((s)=>({
                    ...s,
                    agentName: userMap[s.user_id]?.user_name || 'Unknown',
                    employeeId: userMap[s.user_id]?.employee_id || '--',
                    campaignName: campaignMap[s.campaign_id] || s.campaign_id,
                    customerName: customerMap[s.customer_id]?.customer_name || 'N/A',
                    customerPhone: customerMap[s.customer_id]?.phone_no || ''
                }));
            setSessions(enriched);
        } catch (err) {
            console.error("Error fetching call sessions:", err);
        } finally{
            setLoading(false);
        }
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'assigned':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'disposition_pending':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'paused':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'closed':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };
    if (!mounted || loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-slate-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/call-sessions.tsx",
            lineNumber: 119,
            columnNumber: 7
        }, this);
    }
    if (isAuthorized === false) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                        className: "fi fi-rr-lock text-2xl"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 129,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 128,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-gray-900 mb-2",
                    children: "Access Restricted"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 131,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 max-w-md",
                    children: "This module is reserved for system administrators (NXUS-001). Please contact support if you believe this is an error."
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 132,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/call-sessions.tsx",
            lineNumber: 127,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 w-full h-full min-h-0 overflow-auto bg-[#fbfcfe]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-wrap items-center justify-between gap-3 mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            [
                                'All Agents',
                                'All Campaigns',
                                'Status'
                            ].map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm hover:border-gray-200 cursor-pointer transition-all",
                                    children: [
                                        filter,
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-angle-small-down"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 147,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, filter, true, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 145,
                                    columnNumber: 13
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm hover:text-indigo-600 cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-filter"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 151,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 150,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 flex-1 max-w-md md:ml-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search sessions...",
                                        className: "w-full pl-9 pr-4 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[10px] font-bold text-gray-600 shadow-sm hover:bg-gray-50 uppercase tracking-tight",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-file-export"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 165,
                                        columnNumber: 13
                                    }, this),
                                    "Export"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 164,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                        className: "w-full text-left border-collapse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    className: "bg-gray-50/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 178,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 177,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap",
                                            children: "Agent & Org"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 180,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap",
                                            children: "Auto Session"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 181,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Status"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 182,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Overrides"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 183,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Flags"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 184,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-3 py-3 border-b border-gray-100 text-[11px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-right",
                                            children: "Heartbeat"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 185,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 176,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 175,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                className: "divide-y divide-gray-50",
                                children: sessions.length > 0 ? sessions.map((session, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-slate-50 transition-colors group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 193,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 192,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 pr-3 py-1 pl-1 border border-indigo-100 rounded-full bg-indigo-50/50 w-fit",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-[10px]",
                                                                    children: session.agentName.charAt(0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 198,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[12px] font-black text-gray-800 leading-none",
                                                                            children: session.agentName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                            lineNumber: 202,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[9px] font-bold text-indigo-400 leading-none mt-1 uppercase",
                                                                            children: session.employeeId || 'ID_ERR'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                            lineNumber: 203,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 201,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 197,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-[9px] font-bold text-gray-400 pl-1 uppercase tracking-tight",
                                                            children: session.organization_id || 'NO_ORGANIZATION'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 206,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 196,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 195,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] font-black text-gray-700 leading-none flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-bullhorn text-[10px] text-gray-400 flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 211,
                                                                    columnNumber: 118
                                                                }, this),
                                                                " ",
                                                                session.campaignName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 211,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] font-bold text-indigo-500 leading-none flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-user-md text-[10px] flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 212,
                                                                    columnNumber: 119
                                                                }, this),
                                                                " ",
                                                                session.customerName !== 'N/A' ? `${session.customerName} (${session.customerPhone})` : 'IDLE'
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 212,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 210,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 209,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: `inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black leading-none border uppercase ${session.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : session.status === 'assigned' ? 'bg-blue-50 text-blue-600 border-blue-100' : session.status === 'disposition_pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-slate-50 text-gray-500 border-gray-100'}`,
                                                    children: session.status.replace('_', ' ')
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 216,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 215,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-center gap-1",
                                                    children: session.manual_status || session.manual_campaign_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] font-black text-purple-600 border border-purple-100 bg-purple-50 px-2 py-0.5 rounded-lg flex",
                                                                children: session.manual_status || 'MANUAL'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 229,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[8px] font-bold text-gray-400 uppercase",
                                                                children: session.manual_campaign_id || '---'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 230,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-bold text-gray-200",
                                                        children: "NONE"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 29
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 226,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 225,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-center text-[10px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: `px-2 py-1 rounded-lg text-[8px] font-black border flex ${session.is_manual ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`,
                                                            children: session.is_manual ? 'M-MODE' : 'A-SYNC'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 27
                                                        }, this),
                                                        session.is_unassigned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "bg-red-50 text-red-500 px-2 py-1 rounded-lg text-[8px] font-black border border-red-100 flex",
                                                            children: "UNASGND"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 243,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 238,
                                                    columnNumber: 24
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 237,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-3 py-3 text-right",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-end gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] font-black text-indigo-600 flex items-center gap-1.5 transition-all",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-bolt animate-pulse flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 249,
                                                                    columnNumber: 120
                                                                }, this),
                                                                " ",
                                                                formatTimeSafe(session.updated_at)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 249,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[9px] font-bold text-gray-300 leading-none",
                                                            children: formatDateSafe(session.updated_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 247,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, `${session.user_id}-${session.campaign_id}`, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 191,
                                        columnNumber: 19
                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                        colSpan: 8,
                                        className: "px-6 py-20 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center gap-2 opacity-30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-box-open text-4xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-black uppercase tracking-widest",
                                                    children: "No active sessions matched"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 260,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 258,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 257,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 256,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 188,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 174,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 173,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 172,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-center gap-2 mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "px-3 py-1 bg-white border border-gray-100 rounded text-[10px] font-bold text-gray-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-angle-left"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 272,
                                columnNumber: 115
                            }, this),
                            " Previous"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "w-6 h-6 flex items-center justify-center bg-indigo-600 text-white rounded text-[10px] font-bold",
                        children: "1"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        className: "px-3 py-1 bg-white border border-gray-100 rounded text-[10px] font-bold text-gray-400 font-bold",
                        children: [
                            "Next ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-angle-right"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 274,
                                columnNumber: 130
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 271,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/portal/call-sessions.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__28d4343e._.js.map