module.exports = [
"[project]/components/dashboard/SecondaryStats.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SecondaryStats
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function SecondaryStats({ stats, secondaryStats, loading = false }) {
    const items = [
        {
            label: "Active Campaigns",
            value: stats.activeCampaigns,
            icon: "fi-rr-bullhorn",
            color: "#6366f1",
            bg: "#eef2ff"
        },
        {
            label: "Team Members",
            value: secondaryStats.assignedMembers,
            icon: "fi-rr-users",
            color: "#ec4899",
            bg: "#fdf2f8"
        },
        {
            label: "Total Records",
            value: secondaryStats.newProspects,
            icon: "fi-rr-user-add",
            color: "#8b5cf6",
            bg: "#f5f3ff"
        },
        {
            label: "Fresh Prospects",
            value: secondaryStats.freshProspects,
            icon: "fi-rr-address-card",
            color: "#10b981",
            bg: "#ecfdf5"
        },
        {
            label: "Total Followups",
            value: secondaryStats.followupCalls,
            icon: "fi-rr-phone-call",
            color: "#f59e0b",
            bg: "#fffbeb"
        },
        {
            label: "Overdue",
            value: secondaryStats.overdueFollowups,
            icon: "fi-rr-calendar-exclamation",
            color: "#ef4444",
            bg: "#fef2f2"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3",
        children: items.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-[16px] p-3.5 border border-gray-50 flex flex-col gap-2.5 hover:shadow-md transition-all h-[100px]",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "animate-pulse flex flex-col justify-between h-full",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-7 h-7 bg-gray-100 rounded-lg"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                            lineNumber: 71,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "h-5 bg-gray-200 rounded w-1/2 mb-2"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                                    lineNumber: 73,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "h-2 bg-gray-100 rounded w-3/4"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                                    lineNumber: 74,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                            lineNumber: 72,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                    lineNumber: 70,
                    columnNumber: 14
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-7 h-7 rounded-lg flex items-center justify-center",
                            style: {
                                backgroundColor: item.bg,
                                color: item.color
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: `fi ${item.icon} text-xs flex`
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                                lineNumber: 83,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                            lineNumber: 79,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                    className: "text-base font-bold text-[#263238] leading-tight",
                                    children: (item.value || 0).toLocaleString()
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                                    lineNumber: 86,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-[9px] font-bold text-[#787E9D] uppercase tracking-wider",
                                    children: item.label
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                                    lineNumber: 89,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                            lineNumber: 85,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true)
            }, i, false, {
                fileName: "[project]/components/dashboard/SecondaryStats.tsx",
                lineNumber: 65,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/dashboard/SecondaryStats.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/sessionManager.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "ensureValidSession",
    ()=>ensureValidSession,
    "generateTokenId",
    ()=>generateTokenId,
    "getEnvDeviceInfo",
    ()=>getEnvDeviceInfo,
    "getStoredAccounts",
    ()=>getStoredAccounts,
    "removeAccount",
    ()=>removeAccount,
    "saveAccount",
    ()=>saveAccount
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const getEnvDeviceInfo = async (flutterDeviceInfo = null)=>{
    // If we have flutter info, use it
    if (flutterDeviceInfo) {
        return {
            device_name: `${flutterDeviceInfo.brand} ${flutterDeviceInfo.model}`,
            browser: "Nexus App",
            user_agent: flutterDeviceInfo.androidId || "Nexus-Android",
            device_type: "mobile"
        };
    }
    // Otherwise detect from browser
    const ua = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : '';
    let browser = "Unknown Browser";
    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari")) browser = "Safari";
    else if (ua.includes("Edge")) browser = "Edge";
    let os = "Unknown OS";
    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac")) os = "MacOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone")) os = "iOS";
    return {
        device_name: os,
        browser: browser,
        user_agent: ua,
        device_type: ua.includes("Mobi") ? "mobile" : "desktop"
    };
};
const ensureValidSession = async ()=>{
    const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
    return session;
};
const getStoredAccounts = ()=>[];
const saveAccount = (user)=>{};
const removeAccount = (tokenId)=>{};
const generateTokenId = ()=>`token_${Math.random().toString(36).substring(2, 12)}`;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/hooks/useDashboardStats.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useDashboardStats",
    ()=>useDashboardStats
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sessionManager.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const CACHE_TTL = 60 * 1000; // 60 seconds
function useDashboardStats() {
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        totalCustomers: 0,
        totalPremium: 0,
        totalConverted: 0,
        conversionRate: 0,
        totalDials: 0,
        totalTalktime: 0,
        activeCampaigns: 0,
        teamSize: 0,
        efficiencyScore: 75
    });
    const [secondaryStats, setSecondaryStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        todayCalls: 0,
        freshProspects: 0,
        followupCalls: 0,
        overdueFollowups: 0,
        newProspects: 0,
        assignedMembers: 0
    });
    const [performanceMetrics, setPerformanceMetrics] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        avgDuration: "0m 0s",
        connectedRate: "0%",
        roi: "1.0x"
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const cacheRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])({});
    // Clean up abort controller on unmount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        return ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    const fetchStats = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (orgId, dateFilter = "this_month", userId, restrictedUserIds)=>{
        const cacheKey = `${orgId || 'all'}-${dateFilter}-${userId || 'all'}-${restrictedUserIds ? restrictedUserIds.join(',') : 'none'}`;
        // Check cache
        const cached = cacheRef.current[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            setStats(cached.data.stats);
            setSecondaryStats(cached.data.secondaryStats);
            setPerformanceMetrics(cached.data.performanceMetrics);
            loading && setLoading(false); // Ensure loading is false if cache hit
            return;
        }
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
            setLoading(true);
            setError(null);
            // Wait for session using the robust helper (handles hydration race conditions)
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["ensureValidSession"])();
            if (!session) {
                setLoading(false);
                return; // Graceful exit on session expiry
            }
            const params = new URLSearchParams({
                dateFilter,
                ...orgId && {
                    orgId
                },
                ...userId && {
                    userId
                },
                ...restrictedUserIds && {
                    restrictedUserIds: JSON.stringify(restrictedUserIds)
                }
            });
            const response = await fetch(`/api/dashboard_overview?${params}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
                signal: controller.signal
            });
            // ⚡ INSTANT AUTH CHECK (Before parsing JSON)
            if (response.status === 401) {
                console.warn("🔐 [Dashboard Stats] 401 Detected. Silently stopping.");
                setLoading(false);
                return;
            }
            let result;
            try {
                result = await response.json();
            } catch (e) {
                throw new Error(`API error: ${response.status}`);
            }
            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || `API error: ${response.status}`);
            }
            const data = {
                stats: result.data.stats,
                secondaryStats: result.data.secondaryStats,
                performanceMetrics: result.data.performanceMetrics
            };
            // Update State
            setStats(data.stats);
            setSecondaryStats(data.secondaryStats);
            setPerformanceMetrics(data.performanceMetrics);
            // Update Cache
            cacheRef.current[cacheKey] = {
                data,
                timestamp: Date.now()
            };
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error("Dashboard Stats Fetch Error:", err);
            setError(err.message || "Unknown error");
        } finally{
            if (controller.signal.aborted) {
            // Do nothing
            } else {
                setLoading(false);
                if (abortControllerRef.current === controller) {
                    abortControllerRef.current = null;
                }
            }
        }
    }, []);
    return {
        stats,
        secondaryStats,
        performanceMetrics,
        loading,
        error,
        fetchStats
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/hooks/useDashboardCharts.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useDashboardCharts",
    ()=>useDashboardCharts
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sessionManager.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const CACHE_TTL = 60 * 1000;
function useDashboardCharts() {
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [pieData, setPieData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [heatmapData, setHeatmapData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [campaignData, setCampaignData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [hourlyStats, setHourlyStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const cacheRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        return ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    const fetchChartData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (orgId, dateFilter = "this_month", customRange, userId, restrictedUserIds)=>{
        const cacheKey = `${orgId || 'all'}-${dateFilter}-${customRange ? JSON.stringify(customRange) : ''}-${userId || 'all'}-${restrictedUserIds ? restrictedUserIds.join(',') : 'none'}`;
        const cached = cacheRef.current[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            setChartData(cached.data.chartData);
            setPieData(cached.data.pieData);
            setHeatmapData(cached.data.heatmapData);
            setCampaignData(cached.data.campaignData);
            setHourlyStats(cached.data.hourlyStats);
            loading && setLoading(false);
            return;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
            setLoading(true);
            setError(null);
            // Wait for session
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["ensureValidSession"])();
            if (!session) {
                setLoading(false);
                return;
            }
            const params = new URLSearchParams({
                dateFilter,
                ...orgId && {
                    orgId
                },
                ...customRange && {
                    startDate: customRange.start,
                    endDate: customRange.end
                },
                ...userId && {
                    userId
                },
                ...restrictedUserIds && {
                    restrictedUserIds: JSON.stringify(restrictedUserIds)
                }
            });
            const response = await fetch(`/api/dashboard_charts?${params}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
                signal: controller.signal
            });
            // ⚡ INSTANT AUTH CHECK (Before parsing JSON)
            if (response.status === 401) {
                console.warn("🔐 [Dashboard Charts] 401 Detected. Silently stopping.");
                setLoading(false);
                return;
            }
            let result;
            try {
                result = await response.json();
            } catch (e) {
                throw new Error(`API error: ${response.status}`);
            }
            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || `API error: ${response.status}`);
            }
            const data = result.data;
            setChartData(data.chartData);
            setPieData(data.pieData);
            setHeatmapData(data.heatmapData);
            setCampaignData(data.campaignData);
            setHourlyStats(data.hourlyStats);
            cacheRef.current[cacheKey] = {
                data,
                timestamp: Date.now()
            };
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error("Dashboard Charts Fetch Error:", err);
            setError(err.message || "Unknown error");
        } finally{
            if (controller.signal.aborted) {
            // Do nothing
            } else {
                // Only turn off loading if THIS was the active request
                if (abortControllerRef.current === controller) {
                    setLoading(false);
                    abortControllerRef.current = null;
                }
            }
        }
    }, []);
    return {
        chartData,
        pieData,
        heatmapData,
        campaignData,
        hourlyStats,
        loading,
        error,
        fetchChartData
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/hooks/useAgentPerformance.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useAgentPerformance",
    ()=>useAgentPerformance
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/sessionManager.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
const CACHE_TTL = 60 * 1000;
// Global cache to persist across remounts/tab switches
const globalCache = {};
function useAgentPerformance() {
    const [agentData, setAgentData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [totalDials, setTotalDials] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [totalDuration, setTotalDuration] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        return ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    const fetchAgentPerformance = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (orgId, dateFilter = "this_month", customRange, force = false, userId, restrictedUserIds)=>{
        const cacheKey = `${orgId || 'all'}-${dateFilter}-${customRange ? JSON.stringify(customRange) : ''}-${userId || 'all'}-${restrictedUserIds ? restrictedUserIds.join(',') : 'none'}`;
        const cached = globalCache[cacheKey];
        if (!force && cached && Date.now() - cached.timestamp < CACHE_TTL) {
            setAgentData(cached.data.agentData);
            setTotalDials(cached.data.totalDials);
            setTotalDuration(cached.data.totalDuration);
            if (loading) setLoading(false);
            return;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
            setLoading(true);
            setError(null);
            // Wait for session
            const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$sessionManager$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["ensureValidSession"])();
            if (!session) {
                setLoading(false);
                return;
            }
            const params = new URLSearchParams({
                dateFilter,
                ...orgId && {
                    orgId
                },
                ...customRange && {
                    startDate: customRange.start,
                    endDate: customRange.end
                },
                ...userId && {
                    userId
                },
                ...restrictedUserIds && {
                    restrictedUserIds: JSON.stringify(restrictedUserIds)
                }
            });
            const response = await fetch(`/api/agent_performance?${params}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
                signal: controller.signal
            });
            // ⚡ INSTANT AUTH CHECK (Before parsing JSON)
            if (response.status === 401) {
                console.warn("🔐 [Agent Performance] 401 Detected. Silently stopping.");
                setLoading(false);
                return;
            }
            let result;
            try {
                result = await response.json();
            } catch (e) {
                throw new Error(`API error: ${response.status}`);
            }
            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || `API error: ${response.status}`);
            }
            const data = {
                agentData: result.data.agents,
                totalDials: result.data.totalDials || 0,
                totalDuration: result.data.totalDuration || 0
            };
            setAgentData(data.agentData);
            setTotalDials(data.totalDials);
            setTotalDuration(data.totalDuration);
            globalCache[cacheKey] = {
                data,
                timestamp: Date.now()
            };
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error("Agent Performance Fetch Error:", err);
            setError(err.message || "Unknown error");
        } finally{
            if (controller.signal.aborted) {
            // Do nothing
            } else {
                setLoading(false);
                if (abortControllerRef.current === controller) {
                    abortControllerRef.current = null;
                }
            }
        }
    }, []);
    return {
        agentData,
        totalDials,
        totalDuration,
        loading,
        error,
        fetchAgentPerformance
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/DashboardErrorBoundary.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardErrorBoundary",
    ()=>DashboardErrorBoundary
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
class DashboardErrorBoundary extends __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["Component"] {
    state = {
        hasError: false,
        error: null
    };
    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error
        };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error in Dashboard:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "w-full min-h-[400px] flex items-center justify-center bg-white rounded-2xl border border-red-100 p-8 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-exclamation text-2xl text-red-500"
                            }, void 0, false, {
                                fileName: "[project]/components/DashboardErrorBoundary.tsx",
                                lineNumber: 32,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/DashboardErrorBoundary.tsx",
                            lineNumber: 31,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold text-gray-900 mb-2",
                            children: "Something went wrong"
                        }, void 0, false, {
                            fileName: "[project]/components/DashboardErrorBoundary.tsx",
                            lineNumber: 34,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 mb-6 max-w-md mx-auto",
                            children: "We encountered an error while loading this section of the dashboard. Please try refreshing the page."
                        }, void 0, false, {
                            fileName: "[project]/components/DashboardErrorBoundary.tsx",
                            lineNumber: 35,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "text-xs text-left bg-red-50 p-4 rounded-lg overflow-auto max-w-lg mx-auto mb-6 text-red-800 font-mono",
                            children: this.state.error?.message
                        }, void 0, false, {
                            fileName: "[project]/components/DashboardErrorBoundary.tsx",
                            lineNumber: 39,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>window.location.reload(),
                            className: "px-6 py-2 bg-[#4b33e8] text-white rounded-xl font-bold hover:bg-[#3b27b8] transition-colors",
                            children: "Refresh Page"
                        }, void 0, false, {
                            fileName: "[project]/components/DashboardErrorBoundary.tsx",
                            lineNumber: 42,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DashboardErrorBoundary.tsx",
                    lineNumber: 30,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/DashboardErrorBoundary.tsx",
                lineNumber: 29,
                columnNumber: 9
            }, this);
        }
        return this.props.children;
    }
}
}),
"[project]/lib/dashboardUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardLevel",
    ()=>DashboardLevel,
    "getUserDashboardLevel",
    ()=>getUserDashboardLevel
]);
var DashboardLevel = /*#__PURE__*/ function(DashboardLevel) {
    DashboardLevel["LEVEL_1_ADMIN"] = "LEVEL_1";
    DashboardLevel["LEVEL_2_CLIENT_CEO"] = "LEVEL_2";
    DashboardLevel["LEVEL_3_TL_SALES"] = "LEVEL_3";
    DashboardLevel["LEVEL_4_AGENT_SALES"] = "LEVEL_4";
    DashboardLevel["UNKNOWN"] = "UNKNOWN";
    return DashboardLevel;
}({});
const getUserDashboardLevel = (user)=>{
    if (!user) return "UNKNOWN";
    const role = (user.role || '').toLowerCase();
    const designation = (user.designation || '').toLowerCase();
    // --- Level 1: Super Admin / Management (TFC Internal) ---
    if (user.isClient === false && (role === 'superadmin' || role === 'super_admin') && (designation === 'ceo' || designation === 'developer')) {
        return "LEVEL_1";
    }
    // --- Level 2: Client CEO / Org Owner / Developer ---
    if (user.isClient === true && (role === 'super_admin' || role === 'superadmin' || designation === 'ceo' || designation === 'developer' || designation === 'owner')) {
        return "LEVEL_2";
    }
    // If we don't have enough data to determine level, return UNKNOWN
    if (!role) return "UNKNOWN";
    // --- Level 3: Team Leader ---
    // Role is 'admin' and designation is 'team_leader'
    if (user.isClient === true && role === 'admin' && (designation === 'team_leader' || designation === 'teamleader' || designation.includes('tl'))) {
        return "LEVEL_3";
    }
    // --- Level 4: Sales Agent ---
    // Default for normal users (role = 'user' or any other non-admin/non-owner)
    return "LEVEL_4";
};
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
"[project]/pages/portal/dashboard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Dashboard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
// TopStats is now dynamically imported below with other chart components
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$SecondaryStats$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/dashboard/SecondaryStats.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
// Hooks
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardStats.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardCharts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardCharts.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAgentPerformance.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardErrorBoundary$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DashboardErrorBoundary.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dashboardUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSessionState.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardCharts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardCharts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
;
;
;
;
;
// Dynamically import dashboard tabs to prevent Recharts SSR sizing issues
const TopStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/dashboard/TopStats.tsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/dashboard/TopStats.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const ProspectTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/dashboard/ProspectTab.tsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/dashboard/ProspectTab.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const AgentPerformanceTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/dashboard/AgentPerformanceTab.tsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/dashboard/AgentPerformanceTab.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
const HourlyAnalyticsTab = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/dashboard/HourlyAnalyticsTab.tsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/dashboard/HourlyAnalyticsTab.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
function Dashboard() {
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    // Organization filter
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedOrgId, setSelectedOrgId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("dash_selectedOrgId", "all");
    // User filter
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedUserId, setSelectedUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("dash_selectedUserId", "all");
    // Filters Dropdown state
    const [showFilters, setShowFilters] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const filterRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("dash_activeTab", "prospect");
    // Security Restrictions
    const [restrictedUserIds, setRestrictedUserIds] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // Close filters when clicking outside
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleClickOutside = (event)=>{
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return ()=>document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    // Data hooks
    const { stats, secondaryStats, performanceMetrics, loading: statsLoading, fetchStats } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useDashboardStats"])();
    const { chartData, pieData, heatmapData, campaignData, hourlyStats, loading: chartsLoading, fetchChartData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardCharts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useDashboardCharts"])();
    const { agentData, loading: agentLoading, fetchAgentPerformance } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAgentPerformance"])();
    // Dashboard Level State
    const [dashboardLevel, setDashboardLevel] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].UNKNOWN);
    const [isOrgLocked, setIsOrgLocked] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isUserLocked, setIsUserLocked] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const hasInitialized = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    const [isInitialLoad, setIsInitialLoad] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    // Initialize Dashboard Level Logic & Constraints
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!mounted || !user) return;
        const level = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getUserDashboardLevel"])(user);
        const currentId = user.uid || user.id || user.user_id;
        setDashboardLevel(level);
        // Apply Constraints based on level
        // Apply Constraints based on level
        if (level === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_1_ADMIN) {
            // Level 1: Full Access, default to ALL stats
            setIsOrgLocked(false);
            setIsUserLocked(false);
            setSelectedOrgId("all");
            setSelectedUserId("all");
            setRestrictedUserIds(null);
        } else if (level === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_2_CLIENT_CEO) {
            setIsOrgLocked(true);
            setIsUserLocked(false);
            if (user.organization_id) setSelectedOrgId(user.organization_id);
            setRestrictedUserIds(null);
        } else if (level === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_3_TL_SALES) {
            setIsOrgLocked(true);
            setIsUserLocked(false);
            if (user.organization_id) setSelectedOrgId(user.organization_id);
            // Fail secure: Default to self only until team members are fetched
            setRestrictedUserIds([
                currentId
            ]);
        } else if (level === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_4_AGENT_SALES) {
            setIsOrgLocked(true);
            setIsUserLocked(true);
            // FORCE selections immediately for Level 4
            if (user.organization_id) setSelectedOrgId(user.organization_id);
            if (currentId) {
                setSelectedUserId(currentId);
                setRestrictedUserIds([
                    currentId
                ]);
            }
        }
        hasInitialized.current = true;
    }, [
        mounted,
        user?.uid,
        user?.organization_id
    ]); // Trigger when key user info changes
    // Fetch organizations
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchOrgs = async ()=>{
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name").order("company_name");
            if (data) setOrganizations(data);
        };
        fetchOrgs();
    }, []);
    // Fetch users when org changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Skip if level isn't determined yet
        if (dashboardLevel === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].UNKNOWN) return;
        // Skip if user is locked to self (Level 4)
        if (isUserLocked) return;
        const fetchUsers = async ()=>{
            // Basic query for profiles
            const queryBase = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("user_id, user_name, role").neq("approval_status", "rejected");
            let finalQuery;
            // Stage for Level 3: Strictly Fetch Team Members
            if (dashboardLevel === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_3_TL_SALES && user?.uid) {
                console.log(`[Dashboard] Filtering users for TL:`, user.uid);
                // Fetch teams where current user is leader
                const { data: teamData, error: teamError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
                if (teamError) {
                    console.error("[Dashboard] Error fetching TL teams:", teamError);
                }
                const memberIds = new Set();
                memberIds.add(user.uid); // Always include the TL themself
                if (teamData && teamData.length > 0) {
                    teamData.forEach((team)=>{
                        if (Array.isArray(team.members)) {
                            team.members.forEach((id)=>{
                                if (id && typeof id === 'string') memberIds.add(id);
                            });
                        }
                    });
                }
                const finalIds = Array.from(memberIds);
                console.log(`[Dashboard] Restricting User Selection to ${finalIds.length} members`);
                setRestrictedUserIds(finalIds);
                // Apply membership filter
                finalQuery = queryBase.in("user_id", finalIds);
            } else if (selectedOrgId !== "all") {
                // Fallback for CEO (Level 2) or Admin (Level 1) selecting an org
                finalQuery = queryBase.eq("organization_id", selectedOrgId);
            } else {
                // Global view for Admin (Level 1)
                finalQuery = queryBase;
                setRestrictedUserIds(null);
            }
            const { data, error: userError } = await finalQuery.order("user_name");
            if (userError) {
                console.error("[Dashboard] Error fetching users:", userError);
            }
            if (data) {
                setUsers(data);
            } else {
                setUsers([]);
            }
        };
        if (mounted) {
            // For Level 4, we don't fetch users list, stay locked to self
            if (dashboardLevel !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_4_AGENT_SALES) {
                fetchUsers();
                // Only reset to "all" if NOT locked
                if (!isUserLocked) {
                    setSelectedUserId("all");
                }
            }
        }
    }, [
        selectedOrgId,
        isUserLocked,
        dashboardLevel,
        mounted,
        user?.uid
    ]);
    // Date filter state
    const [dateFilter, setDateFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useSessionState"])("dash_dateFilter", "today");
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && user && dashboardLevel !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].UNKNOWN) {
            if (dashboardLevel === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_4_AGENT_SALES) {
                setRestrictedUserIds([
                    user.uid
                ]);
            }
        }
    }, [
        mounted,
        user,
        dashboardLevel
    ]);
    // Fetch all dashboard data when filters change
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && user) {
            const currentId = user.uid || user.id || user.user_id;
            let orgFilter = selectedOrgId === "all" ? undefined : selectedOrgId;
            let userFilter = selectedUserId === "all" ? undefined : selectedUserId;
            // --- CRITICAL OVERRIDE FOR LEVEL 4 (AGENT) ---
            // This ensures that even if UI state is in transition, the data fetched is always their own.
            if (dashboardLevel === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_4_AGENT_SALES) {
                orgFilter = user.organization_id || undefined;
                userFilter = currentId || undefined;
            }
            // Fetch all data in parallel
            Promise.all([
                fetchStats(orgFilter, dateFilter, userFilter, restrictedUserIds),
                fetchChartData(orgFilter, dateFilter, undefined, userFilter, restrictedUserIds),
                fetchAgentPerformance(orgFilter, dateFilter, undefined, false, userFilter, restrictedUserIds)
            ]);
        }
    }, [
        selectedOrgId,
        selectedUserId,
        dateFilter,
        user?.uid,
        user?.organization_id,
        mounted,
        dashboardLevel,
        fetchStats,
        fetchChartData,
        fetchAgentPerformance,
        restrictedUserIds
    ]);
    const loading = statsLoading || chartsLoading || agentLoading;
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!loading) {
            setIsInitialLoad(false);
        }
    }, [
        loading
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DashboardErrorBoundary$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardErrorBoundary"], {
            children: isInitialLoad && statsLoading && chartsLoading && agentLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col min-h-[80vh] items-center justify-center animate-in fade-in duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 261,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "mt-4 text-[#263238] font-bold text-lg animate-pulse",
                        style: {
                            fontFamily: "'Poppins', sans-serif"
                        },
                        children: "Loading Dashboard..."
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 262,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-[#787E9D] text-sm font-medium mt-1",
                        children: "Please wait while we gather your statistics"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 265,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/dashboard.tsx",
                lineNumber: 260,
                columnNumber: 11
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-6 sm:space-y-8 max-w-[1400px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl sm:text-3xl font-bold text-[#263238]",
                                        style: {
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: "Dashboard Overview"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                        lineNumber: 272,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-[#787E9D] mt-1 line-clamp-1 sm:line-clamp-none",
                                        children: [
                                            "Welcome back,",
                                            " ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "font-semibold text-[#4b33e8]",
                                                children: mounted ? user?.displayName || "User" : "User"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/dashboard.tsx",
                                                lineNumber: 280,
                                                columnNumber: 17
                                            }, this),
                                            ". Here's what's happening today."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                        lineNumber: 278,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/dashboard.tsx",
                                lineNumber: 271,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        ref: filterRef,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowFilters(!showFilters),
                                                className: `h-10 px-4 rounded-xl border flex items-center gap-2 transition-all  font-bold text-sm ${showFilters ? "border-[#4b33e8] bg-[#4b33e8] text-white" : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-filter"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                                        lineNumber: 298,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "hidden sm:inline",
                                                        children: "Filters"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                                        lineNumber: 299,
                                                        columnNumber: 19
                                                    }, this),
                                                    (selectedOrgId !== "all" || selectedUserId !== "all" || dateFilter !== "today") && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: `flex items-center justify-center w-2 h-2 rounded-full ${showFilters ? 'bg-white' : 'bg-[#4b33e8]'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/dashboard.tsx",
                                                lineNumber: 290,
                                                columnNumber: 17
                                            }, this),
                                            showFilters && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full right-0 mt-2 w-[240px] sm:w-[300px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-[100] animate-in fade-in zoom-in duration-200",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1",
                                                                    children: "Organization"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                    lineNumber: 310,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                            value: selectedOrgId,
                                                                            onChange: (e)=>setSelectedOrgId(e.target.value),
                                                                            className: `w-full appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm font-bold text-[#263238] focus:outline-none focus:border-[#4b33e8] transition-all ${isOrgLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`,
                                                                            disabled: isOrgLocked,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "all",
                                                                                    disabled: isOrgLocked,
                                                                                    children: "Global (All Orgs)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 318,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                        value: org.id,
                                                                                        disabled: isOrgLocked && selectedOrgId !== org.id,
                                                                                        children: org.company_name
                                                                                    }, org.id, false, {
                                                                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                        lineNumber: 320,
                                                                                        columnNumber: 31
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                                            lineNumber: 312,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi fi-rr-building absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                                            lineNumber: 325,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: `fi ${isOrgLocked ? 'fi-rr-lock' : 'fi-rr-angle-small-down'} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                                            lineNumber: 326,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                    lineNumber: 311,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                            lineNumber: 309,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1",
                                                                    children: "User Selection"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                    lineNumber: 332,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                            value: selectedUserId,
                                                                            onChange: (e)=>setSelectedUserId(e.target.value),
                                                                            className: `w-full appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm font-bold text-[#263238] focus:outline-none focus:border-[#4b33e8] transition-all ${isUserLocked ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`,
                                                                            disabled: isUserLocked,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "all",
                                                                                    disabled: isUserLocked,
                                                                                    children: dashboardLevel === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_3_TL_SALES ? "All Team Members" : "All Users"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 340,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                isUserLocked ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: user?.uid,
                                                                                    children: user?.displayName || 'Me'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 344,
                                                                                    columnNumber: 33
                                                                                }, this) : users.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                        value: u.user_id,
                                                                                        children: u.user_name || "Unknown User"
                                                                                    }, u.user_id, false, {
                                                                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                        lineNumber: 347,
                                                                                        columnNumber: 35
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                                            lineNumber: 334,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi fi-rr-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                                            lineNumber: 353,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: `fi ${isUserLocked ? 'fi-rr-lock' : 'fi-rr-angle-small-down'} absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                                            lineNumber: 354,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                    lineNumber: 333,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                            lineNumber: 331,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1",
                                                                    children: "Time Period"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                    lineNumber: 360,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "relative",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                            value: dateFilter,
                                                                            onChange: (e)=>setDateFilter(e.target.value),
                                                                            className: "w-full appearance-none pl-9 pr-8 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs sm:text-sm font-bold text-[#263238] focus:outline-none focus:border-[#4b33e8] transition-all cursor-pointer",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "today",
                                                                                    children: "Today"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 367,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "yesterday",
                                                                                    children: "Yesterday"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 368,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "this_week",
                                                                                    children: "This Week"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 369,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "last_7_days",
                                                                                    children: "Last 7 Days"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 370,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "this_month",
                                                                                    children: "This Month"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 371,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "last_month",
                                                                                    children: "Last Month"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 372,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "this_year",
                                                                                    children: "1 Year"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 373,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "multi_year",
                                                                                    children: "Multi-Year"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 374,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "all_time",
                                                                                    children: "All Time"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                                    lineNumber: 375,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                                            lineNumber: 362,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi fi-rr-calendar absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                                            lineNumber: 377,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi fi-rr-angle-small-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                                            lineNumber: 378,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                                    lineNumber: 361,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                            lineNumber: 359,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "pt-2",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setSelectedOrgId(isOrgLocked ? selectedOrgId : "all");
                                                                    setSelectedUserId(isUserLocked ? selectedUserId : "all");
                                                                    setDateFilter("all_time");
                                                                    setShowFilters(false);
                                                                },
                                                                className: "w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-all",
                                                                children: "Reset Filters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/dashboard.tsx",
                                                                lineNumber: 383,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/dashboard.tsx",
                                                            lineNumber: 382,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                    lineNumber: 307,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/dashboard.tsx",
                                                lineNumber: 306,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                        lineNumber: 289,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-3 h-10 bg-[#4b33e8] rounded-xl text-xs font-bold text-white cursor-default flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: `w-1.5 h-1.5 rounded-full bg-white ${statsLoading || chartsLoading || agentLoading ? '' : 'animate-pulse'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                                        lineNumber: 402,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "hidden sm:inline",
                                                        children: statsLoading || chartsLoading || agentLoading ? "Updating..." : "Live Updates"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "sm:hidden",
                                                        children: statsLoading || chartsLoading || agentLoading ? "..." : "Live"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/dashboard.tsx",
                                                lineNumber: 401,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    const oid = selectedOrgId === "all" ? "all" : selectedOrgId;
                                                    const uid = selectedUserId === "all" ? "all" : selectedUserId;
                                                    const dFilter = dateFilter;
                                                    window.open(`/dashboard_report?orgId=${oid}&userId=${uid}&dateFilter=${dFilter}`, '_blank');
                                                },
                                                className: "w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl text-gray-400 hover:text-[#4b33e8] hover:border-[#4b33e8] transition-all",
                                                title: "Generate Report",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-print"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/dashboard.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/dashboard.tsx",
                                                lineNumber: 407,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                        lineNumber: 400,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/dashboard.tsx",
                                lineNumber: 287,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 270,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(TopStats, {
                        stats: stats,
                        chartData: chartData,
                        loading: statsLoading || chartsLoading
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 424,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$dashboard$2f$SecondaryStats$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        stats: stats,
                        secondaryStats: secondaryStats,
                        loading: statsLoading
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 427,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-gray-100/50 p-1 rounded-2xl inline-flex gap-1 w-full sm:w-auto",
                        children: [
                            {
                                id: "prospect",
                                label: "Prospect Wise Performance",
                                short: "Prospects"
                            },
                            {
                                id: "callDetails",
                                label: "Call Hourly Analytics",
                                short: "Hours"
                            },
                            {
                                id: "agentPerf",
                                label: "Agent Performance",
                                short: "Agents"
                            }
                        ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab(tab.id),
                                className: `flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === tab.id ? "bg-white text-[#4b33e8] shadow-sm scale-[1.02]" : "text-gray-500 hover:text-gray-900"}`,
                                style: {
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "hidden sm:inline",
                                        children: tab.label
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                        lineNumber: 446,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "sm:hidden",
                                        children: tab.short
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/dashboard.tsx",
                                        lineNumber: 447,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, tab.id, true, {
                                fileName: "[project]/pages/portal/dashboard.tsx",
                                lineNumber: 436,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 430,
                        columnNumber: 11
                    }, this),
                    activeTab === "prospect" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(ProspectTab, {
                        stats: stats,
                        performanceMetrics: performanceMetrics,
                        campaignData: campaignData,
                        pieData: pieData,
                        loading: statsLoading || chartsLoading
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 454,
                        columnNumber: 13
                    }, this),
                    activeTab === "agentPerf" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(AgentPerformanceTab, {
                        agentData: agentData,
                        totalDials: stats.totalDials,
                        selectedOrgId: selectedOrgId,
                        selectedUserId: selectedUserId,
                        dateFilter: dateFilter,
                        restrictedUserIds: restrictedUserIds,
                        loading: agentLoading
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 464,
                        columnNumber: 13
                    }, this),
                    activeTab === "callDetails" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(HourlyAnalyticsTab, {
                        heatmapData: heatmapData,
                        hourlyStats: hourlyStats,
                        selectedOrgId: selectedOrgId,
                        selectedUserId: selectedUserId,
                        dateFilter: dateFilter,
                        loading: chartsLoading
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/dashboard.tsx",
                        lineNumber: 476,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/dashboard.tsx",
                lineNumber: 268,
                columnNumber: 11
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/dashboard.tsx",
            lineNumber: 258,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ffe164a2._.js.map