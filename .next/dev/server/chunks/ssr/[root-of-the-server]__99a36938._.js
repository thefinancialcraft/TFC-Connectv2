module.exports = [
"[project]/lib/dateUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shared date range utilities for dashboard APIs
 * All calculations are standardized to Asia/Kolkata (IST)
 */ __turbopack_context__.s([
    "calculateMonthsToTarget",
    ()=>calculateMonthsToTarget,
    "calculateNewExpiryDate",
    ()=>calculateNewExpiryDate,
    "formatDate",
    ()=>formatDate,
    "getISTDateRange",
    ()=>getISTDateRange
]);
function getISTDateRange(filter) {
    const now = new Date();
    // Get date string in YYYY-MM-DD for IST
    const istDateString = now.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata"
    });
    // Midnight IST in ISO format
    const todayStart = new Date(`${istDateString}T00:00:00+05:30`).toISOString();
    // End of day IST in ISO format
    const todayEnd = new Date(`${istDateString}T23:59:59+05:30`).toISOString();
    let start = todayStart;
    let end = todayEnd;
    switch(filter){
        case "yesterday":
            {
                const yesterday = new Date(`${istDateString}T00:00:00+05:30`);
                yesterday.setDate(yesterday.getDate() - 1);
                const yStr = yesterday.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata"
                });
                start = new Date(`${yStr}T00:00:00+05:30`).toISOString();
                end = new Date(`${yStr}T23:59:59+05:30`).toISOString();
                break;
            }
        case "this_week":
            {
                const d = new Date(`${istDateString}T00:00:00+05:30`);
                const day = d.getDay();
                const diff = day === 0 ? -6 : 1 - day; // Monday
                d.setDate(d.getDate() + diff);
                const monStr = d.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata"
                });
                start = new Date(`${monStr}T00:00:00+05:30`).toISOString();
                break;
            }
        case "last_7_days":
            {
                const d = new Date(now);
                d.setDate(d.getDate() - 7);
                start = d.toISOString();
                break;
            }
        case "this_month":
            {
                const parts = istDateString.split("-");
                start = new Date(`${parts[0]}-${parts[1]}-01T00:00:00+05:30`).toISOString();
                break;
            }
        case "last_month":
            {
                const parts = istDateString.split("-");
                let year = parseInt(parts[0]);
                let month = parseInt(parts[1]) - 1;
                if (month === 0) {
                    month = 12;
                    year--;
                }
                const prevMonthStr = month.toString().padStart(2, '0');
                start = new Date(`${year}-${prevMonthStr}-01T00:00:00+05:30`).toISOString();
                const lastDay = new Date(year, month, 0).getDate();
                end = new Date(`${year}-${prevMonthStr}-${lastDay}T23:59:59+05:30`).toISOString();
                break;
            }
        case "this_year":
            const yStr = istDateString.split("-")[0];
            start = new Date(`${yStr}-01-01T00:00:00+05:30`).toISOString();
            break;
        case "multi_year":
            const yearInt = parseInt(istDateString.split("-")[0]);
            start = new Date(`${yearInt - 3}-01-01T00:00:00+05:30`).toISOString();
            break;
        case "all_time":
            start = "2020-01-01T00:00:00.000Z";
            break;
    }
    return {
        start,
        end
    };
}
function formatDate(date) {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
function calculateNewExpiryDate(currentExpiry, monthsToAdd) {
    const baseDate = currentExpiry ? new Date(currentExpiry) : new Date();
    if (isNaN(baseDate.getTime())) return new Date().toISOString().split('T')[0];
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);
    return newDate.toISOString().split('T')[0];
}
function calculateMonthsToTarget(year, month) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const targetYear = typeof year === 'string' ? parseInt(year) : year;
    const targetMonth = typeof month === 'string' ? parseInt(month) : month;
    if (isNaN(targetYear) || isNaN(targetMonth)) return 0;
    // Note: targetMonth expected as 1-12 from UI select, convert to 0-11
    return (targetYear - currentYear) * 12 + (targetMonth - 1 - currentMonth);
}
}),
"[project]/pages/portal/team/[id].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>TeamDetails
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/AreaChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Area.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dateUtils.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
function TeamDetails() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { id } = router.query;
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // RAW Data States - Used as base for derived useMemo values
    const [team, setTeam] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [members, setMembers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawLogs, setRawLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawCustomers, setRawCustomers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawSyncMeta, setRawSyncMeta] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawCallLogs, setRawCallLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawSessions, setRawSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [dateFilter, setDateFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("today");
    // Recharts Constants
    const COLORS = [
        '#4b33e8',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#6366f1'
    ];
    // Abort Controllers for request safety
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    /**
   * Safe Date Range Generation (Standardized to IST)
   */ const getDateRange = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((filter)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getISTDateRange"])(filter);
    }, []);
    /**
   * Main Data Fetcher with granular error handling
   */ const fetchTeamData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (!id || Array.isArray(id)) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            console.log("Starting team data fetch for:", id);
            // 1. Fetch Team Details
            const { data: teamData, error: teamError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('teams').select(`
          id, 
          name, 
          is_active, 
          members, 
          leader_id, 
          organization:organizations(company_name), 
          leader:user_profiles!leader_id(user_name)
        `).eq('id', id).maybeSingle();
            if (teamError) {
                console.error("Team Query Error:", teamError);
                throw new Error(`Failed to fetch team details: ${teamError.message}`);
            }
            if (!teamData) {
                console.warn("No team found for ID:", id);
                setError("Team not found or access denied.");
                setLoading(false);
                return;
            }
            setTeam(teamData);
            const memberIds = Array.isArray(teamData.members) ? teamData.members : [];
            if (memberIds.length === 0) {
                setMembers([]);
                setRawLogs([]);
                setRawCustomers([]);
                setLoading(false);
                return;
            }
            // 2. Fetch Members (Profiles) First to get Employee IDs & Names
            const { data: membersData, error: membersError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, user_name, employee_id, profile_pic_url, status, last_online').in('user_id', memberIds).eq('status', 'active');
            if (membersError) throw new Error(`Members fetch failed: ${membersError.message}`);
            const validMembers = (membersData || []).sort((a, b)=>(a.user_name || '').localeCompare(b.user_name || ''));
            setMembers(validMembers);
            const employeeIds = validMembers.map((m)=>m.employee_id).filter((id)=>!!id);
            // 3. Fetch History (using employee IDs) & Customers (using user IDs)
            const { start, end } = getDateRange(dateFilter);
            const queries = [
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('assigned_to, next_called_at, created_at, customer_details, disposition').in('assigned_to', memberIds)
            ];
            // Only fetch history if we have employee IDs
            if (employeeIds.length > 0) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_history').select('employee_id, duration, call_type, timestamp, device_id, number, name') // Added extra fields for potential future use or debugging
                .in('employee_id', employeeIds).gte('timestamp', dateFilter !== 'all_time' ? start : '2000-01-01').lte('timestamp', dateFilter !== 'all_time' ? end : '2099-01-01'));
            } else {
                queries.push(Promise.resolve({
                    data: []
                })); // Empty history if no employee IDs
            }
            // Fetch Sync Meta
            if (employeeIds.length > 0) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('employee_id, on_call, is_personal, last_seen').in('employee_id', employeeIds));
            } else {
                queries.push(Promise.resolve({
                    data: []
                }));
            }
            // 4. Fetch Dial Logs (call_logs) for Ringing Duration
            if (memberIds.length > 0) {
                queries.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('agent_id, duration, is_connected, created_at').in('agent_id', memberIds).gte('created_at', dateFilter !== 'all_time' ? start : '2000-01-01').lte('created_at', dateFilter !== 'all_time' ? end : '2099-01-01'));
            } else {
                queries.push(Promise.resolve({
                    data: []
                }));
            }
            // Execute promises
            const results = await Promise.all(queries);
            const customersRes = results[0];
            const historyRes = results[1];
            const syncMetaRes = results[2];
            const callLogsRes = results[3];
            if (customersRes.error) throw new Error(`Customers fetch failed: ${customersRes.error.message}`);
            if (historyRes.error) throw new Error(`History fetch failed: ${historyRes.error.message}`);
            if (callLogsRes.error) throw new Error(`Call Logs fetch failed: ${callLogsRes.error.message}`);
            const historyData = historyRes.data || [];
            const uniqueEntries = [];
            const seenKeys = new Set();
            historyData.forEach((item)=>{
                const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const dateStr = new Date(item.timestamp).toLocaleDateString();
                const key = `${item.number}-${item.employee_id}-${dateStr}-${timeStr}-${item.duration}`;
                if (!seenKeys.has(key)) {
                    uniqueEntries.push(item);
                    seenKeys.add(key);
                }
            });
            setRawLogs(uniqueEntries);
            setRawCustomers(customersRes.data || []);
            setRawSyncMeta(syncMetaRes?.data || []);
            setRawCallLogs(callLogsRes?.data || []);
            if (memberIds.length > 0) {
                const { data: sessionData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_sessions').select('user_id, last_accessed_at').in('user_id', memberIds).order('last_accessed_at', {
                    ascending: false
                });
                // Group sessions to find the latest one per member
                const latestSessions = [];
                const seenUsers = new Set();
                (sessionData || []).forEach((s)=>{
                    if (!seenUsers.has(s.user_id)) {
                        latestSessions.push(s);
                        seenUsers.add(s.user_id);
                    }
                });
                setRawSessions(latestSessions);
            }
        } catch (err) {
            console.error("Fatal Error in fetchTeamData:", err);
            setError(err.message || "Failed to load team analytics. Please try again.");
        } finally{
            setLoading(false);
        }
    }, [
        id,
        dateFilter,
        getDateRange
    ]);
    // Request cancellation on unmount/re-fetch
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (router.isReady && id && mounted && user) {
            console.log("Effect triggered: Fetching team data for", id);
            fetchTeamData();
        }
        return ()=>{
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [
        router.isReady,
        id,
        mounted,
        user,
        fetchTeamData
    ]);
    // Auto-refresh every 30 seconds
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let interval;
        if (router.isReady && id && mounted && user) {
            interval = setInterval(()=>{
                fetchTeamData();
            }, 30000); // 30 seconds
        }
        return ()=>{
            if (interval) clearInterval(interval);
        };
    }, [
        router.isReady,
        id,
        mounted,
        user,
        fetchTeamData
    ]);
    // Helper to handle Supabase joins that might return arrays
    const getSingle = (val)=>Array.isArray(val) ? val[0] : val;
    /**
   * Derived Computations (Memoized)
   * Eliminates O(N*M) filtering inside the render loop
   */ const processedData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const emptyStats = {};
        if (!members.length) return {
            memberStats: emptyStats,
            summary: {
                totalCalls: 0,
                deals: 0,
                revenue: 0,
                avgConnectRate: 0
            },
            charts: {
                outcome: [],
                hourly: [],
                dailyTrend: [],
                disposition: []
            },
            topAgents: []
        };
        try {
            const now = new Date();
            const stats = {};
            // 1. Build Lookup Maps for efficiency
            const logsByAgent = {};
            const customersByAgent = {};
            const employeeIdToUserId = {};
            members.forEach((m)=>{
                logsByAgent[m.user_id] = [];
                customersByAgent[m.user_id] = [];
                if (m.employee_id) employeeIdToUserId[m.employee_id] = m.user_id;
            });
            // Distribute logs (history) to agents via employeeID -> userID mapping
            rawLogs.forEach((l)=>{
                // l is now from call_history: { employee_id, ... }
                if (l.employee_id && employeeIdToUserId[l.employee_id]) {
                    const uId = employeeIdToUserId[l.employee_id];
                    logsByAgent[uId].push(l);
                }
            });
            rawCustomers.forEach((c)=>{
                if (customersByAgent[c.assigned_to]) customersByAgent[c.assigned_to].push(c);
            });
            let totalCallsAll = 0;
            let totalConnectedAll = 0;
            let totalDealsAll = 0;
            let totalRevenueSum = 0;
            // 2. Process Member Stats
            members.forEach((member)=>{
                const mId = member.user_id;
                const userLogs = logsByAgent[mId] || []; // These are call_history items
                const userCustomers = customersByAgent[mId] || [];
                const totalCalls = userLogs.length;
                // Connected logic for call_history
                const connectedCount = userLogs.filter((l)=>{
                    const type = (l.call_type || '').toLowerCase();
                    const duration = Number(l.duration) || 0;
                    return (type.includes('outgoing') || type.includes('incoming')) && duration > 0;
                }).length;
                const totalDuration = userLogs.reduce((acc, l)=>acc + (Number(l.duration) || 0), 0);
                const avgDurationSec = connectedCount ? Math.floor(totalDuration / connectedCount) : 0;
                // Deals are NOT available in call_history. We'll leave it as 0 for now.
                // If we want deals, we'd need to fetch legacy call_logs specifically for dispositions.
                const dealsCount = 0;
                // Calculate revenue - Try to find premium in associated customer_details
                const revenue = userCustomers.reduce((acc, c)=>{
                    let pVal = 0;
                    try {
                        const details = typeof c.customer_details === 'string' ? JSON.parse(c.customer_details) : c.customer_details;
                        if (details) {
                            // Look for "Premium" or similar keys
                            const premiumKey = Object.keys(details).find((k)=>k.toLowerCase().includes('premium'));
                            if (premiumKey) pVal = Number(details[premiumKey]) || 0;
                        }
                    } catch (e) {}
                    return acc + pVal;
                }, 0);
                const followUpsCount = userCustomers.filter((c)=>c.next_called_at && new Date(c.next_called_at) > now).length;
                let lastActive = null;
                let idleMins = -1;
                let idleTimeStr = "N/A";
                if (userLogs.length > 0) {
                    // call_history uses 'timestamp'
                    const recentLog = userLogs.reduce((prev, curr)=>new Date(curr.timestamp).getTime() > new Date(prev.timestamp).getTime() ? curr : prev);
                    lastActive = recentLog.timestamp;
                    const diffMs = now.getTime() - new Date(recentLog.timestamp).getTime();
                    const diffSec = Math.floor(diffMs / 1000);
                    if (diffSec < 60) {
                        idleTimeStr = `${diffSec}s`;
                    } else if (diffSec < 3600) {
                        idleTimeStr = `${Math.floor(diffSec / 60)}m`;
                    } else {
                        const h = Math.floor(diffSec / 3600);
                        const m = Math.floor(diffSec % 3600 / 60);
                        idleTimeStr = `${h}h ${m}m`;
                    }
                    idleMins = Math.floor(diffSec / 60);
                }
                const syncData = rawSyncMeta.find((s)=>s.employee_id === member.employee_id);
                const isActuallyOnline = lastActive && now.getTime() - new Date(lastActive).getTime() < 30000; // 30s threshold
                const sessionData = rawSessions.find((s)=>s.user_id === mId);
                // Streak/Gap Calculation (Consecutive Fails since last success)
                const sortedLogs = [
                    ...rawLogs
                ].filter((l)=>l.employee_id === member.employee_id).sort((a, b)=>new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                const lastSuccessIdx = sortedLogs.map((l)=>l.duration > 0).lastIndexOf(true);
                const currentStreak = lastSuccessIdx === -1 ? sortedLogs : sortedLogs.slice(lastSuccessIdx + 1);
                let streakCount = 0;
                let avgGapStr = '0s';
                if (currentStreak.length > 0) {
                    streakCount = currentStreak.length;
                    let totalGap = 0;
                    let gapCounts = 0;
                    for(let i = 1; i < currentStreak.length; i++){
                        const gap = (new Date(currentStreak[i].timestamp).getTime() - new Date(currentStreak[i - 1].timestamp).getTime()) / 1000;
                        if (gap > 0) {
                            totalGap += gap;
                            gapCounts++;
                        }
                    }
                    const avgGapSec = gapCounts > 0 ? Math.round(totalGap / gapCounts) : 0;
                    const mins = Math.floor(avgGapSec / 60);
                    const secs = avgGapSec % 60;
                    avgGapStr = (mins > 0 ? `${mins}m ` : '') + `${secs}s`;
                }
                stats[mId] = {
                    totalCalls,
                    connected: connectedCount,
                    connectedRate: totalCalls ? (connectedCount / totalCalls * 100).toFixed(1) : "0.0",
                    avgDuration: `${Math.floor(avgDurationSec / 60)}m ${avgDurationSec % 60}s`,
                    totalTalkTime: `${Math.floor(totalDuration / 3600)}h ${Math.floor(totalDuration % 3600 / 60)}m ${totalDuration % 60}s`,
                    streakGap: `${streakCount}/${avgGapStr}`,
                    deals: dealsCount,
                    followUps: followUpsCount,
                    lastActive,
                    lastOnline: member.last_online || syncData?.last_seen || sessionData?.last_accessed_at || null,
                    idleTime: idleTimeStr,
                    idleMins,
                    onCall: !!syncData?.on_call,
                    isPersonal: !!syncData?.is_personal,
                    status: syncData?.on_call ? syncData.is_personal ? 'Personal Call' : 'On Call' : isActuallyOnline ? 'Online' : 'Idle'
                };
                totalCallsAll += totalCalls;
                totalConnectedAll += connectedCount;
                totalDealsAll += dealsCount;
                totalRevenueSum += revenue;
            });
            // 3. Chart Data Generation
            const outcomeCounts = {};
            rawLogs.forEach((l)=>{
                // Map call_type to Outcome Status
                // Incoming, Outgoing, Missed, Rejected
                const type = (l.call_type || 'Unknown').toLowerCase();
                let status = 'Unknown';
                if (type.includes('outgoing')) status = 'Outgoing';
                else if (type.includes('incoming')) status = 'Incoming';
                else if (type.includes('missed')) status = 'Missed';
                else if (type.includes('reject')) status = 'Rejected';
                outcomeCounts[status] = (outcomeCounts[status] || 0) + 1;
            });
            const outcomeData = Object.entries(outcomeCounts).map(([name, value])=>({
                    name,
                    value
                }));
            const hourLabels = [];
            for(let i = 8; i <= 20; i += 2){
                hourLabels.push(`${i > 12 ? i - 12 : i}${i >= 12 ? 'pm' : 'am'} - ${i + 2 > 12 ? i + 2 - 12 : i + 2}${i + 2 >= 12 ? 'pm' : 'am'}`);
            }
            const hourlyMap = Object.fromEntries(hourLabels.map((l)=>[
                    l,
                    0
                ]));
            rawLogs.forEach((l)=>{
                const h = new Date(l.timestamp).getHours(); // Use timestamp
                for(let i = 8; i <= 20; i += 2){
                    if (h >= i && h < i + 2) {
                        hourlyMap[hourLabels[(i - 8) / 2]]++;
                        break;
                    }
                }
            });
            const hourlyData = hourLabels.map((name)=>({
                    name,
                    count: hourlyMap[name]
                }));
            // Disposition Data (From customers, assumes customers have disposition) - this remains valid
            const dispCounts = {};
            rawCustomers.forEach((c)=>{
                const d = c.disposition || 'Fresh';
                dispCounts[d] = (dispCounts[d] || 0) + 1;
            });
            const dispositionData = Object.entries(dispCounts).map(([name, count])=>({
                    name,
                    count
                })).sort((a, b)=>b.count - a.count).slice(0, 5);
            const dailyMap = {};
            rawLogs.forEach((l)=>{
                const d = new Date(l.timestamp); // Use timestamp
                const dateStr = d.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                });
                const dayStartTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
                if (!dailyMap[dateStr]) {
                    dailyMap[dateStr] = {
                        ts: dayStartTs,
                        label: dateStr,
                        count: 0
                    };
                }
                dailyMap[dateStr].count++;
            });
            const dailyTrendData = Object.values(dailyMap).sort((a, b)=>a.ts - b.ts).map((item)=>({
                    name: item.label,
                    count: item.count
                }));
            const topAgents = members.map((m)=>({
                    name: m.user_name || 'Unknown',
                    connected: stats[m.user_id]?.connected || 0,
                    profilePic: m.profile_pic_url
                })).sort((a, b)=>b.connected - a.connected).slice(0, 3);
            return {
                memberStats: stats,
                summary: {
                    totalCalls: totalCallsAll,
                    deals: totalDealsAll,
                    revenue: totalRevenueSum,
                    avgConnectRate: totalCallsAll ? (totalConnectedAll / totalCallsAll * 100).toFixed(1) : "0.0"
                },
                charts: {
                    outcome: outcomeData,
                    hourly: hourlyData,
                    dailyTrend: dailyTrendData,
                    disposition: dispositionData
                },
                topAgents
            };
        } catch (e) {
            console.error("Error in processedData calculation:", e);
            return {
                memberStats: emptyStats,
                summary: {
                    totalCalls: 0,
                    deals: 0,
                    revenue: 0,
                    avgConnectRate: 0
                },
                charts: {
                    outcome: [],
                    hourly: [],
                    dailyTrend: [],
                    disposition: []
                },
                topAgents: []
            };
        }
    }, [
        members,
        rawLogs,
        rawCustomers,
        rawSyncMeta,
        rawSessions
    ]);
    const formatTime = (dateStr)=>{
        if (!dateStr) return "Never";
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    if (loading && !team || loading && members.length === 0 && team) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex h-[80vh] items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "animate-spin rounded-full h-12 w-12 border-4 border-[#4b33e8] border-t-transparent"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 514,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-gray-400",
                            children: "Loading team analytics..."
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 515,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 513,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/team/[id].tsx",
                lineNumber: 512,
                columnNumber: 9
            }, this)
        }, void 0, false);
    }
    if (error || !team) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex h-[80vh] items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center gap-6 max-w-md text-center px-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-20 h-20 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-3xl",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-exclamation"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/team/[id].tsx",
                                lineNumber: 528,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 527,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-gray-800 mb-2",
                                    children: error || "Team Not Found"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 531,
                                    columnNumber: 20
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-gray-500 text-sm",
                                    children: error ? "There was a problem loading the data." : "The requested team could not be found or you don't have permission to view it."
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 532,
                                    columnNumber: 20
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 530,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push('/team'),
                            className: "px-6 py-2 bg-[#4b33e8] text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-100",
                            children: "Back to Teams"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 536,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 526,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/team/[id].tsx",
                lineNumber: 525,
                columnNumber: 9
            }, this)
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: [
                        team?.name || 'Team Details',
                        " • TFC Nexus"
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 551,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/team/[id].tsx",
                lineNumber: 550,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col w-full min-w-0 font-poppins",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push('/team'),
                                    className: "flex items-center gap-2 text-sm text-gray-500 hover:text-[#4b33e8] mb-4 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-arrow-left"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 563,
                                            columnNumber: 21
                                        }, this),
                                        " Back to Teams"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 559,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col md:flex-row md:items-end justify-between gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-left",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                            className: "text-2xl font-bold text-gray-800",
                                                            style: {
                                                                fontFamily: "'Poppins', sans-serif"
                                                            },
                                                            children: team?.name || 'Loading Team...'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 569,
                                                            columnNumber: 28
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: `px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${team?.is_active ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`,
                                                            children: team?.is_active ? 'Active' : 'Inactive'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 572,
                                                            columnNumber: 28
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 568,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-500 text-sm flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-building"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 577,
                                                            columnNumber: 29
                                                        }, this),
                                                        " ",
                                                        getSingle(team?.organization)?.company_name || 'No Organization',
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "w-1 h-1 rounded-full bg-gray-300"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 578,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "Leader: ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "font-semibold text-gray-700",
                                                                    children: getSingle(team?.leader)?.user_name || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 579,
                                                                    columnNumber: 43
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 579,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 576,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 567,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: dateFilter,
                                                    onChange: (e)=>setDateFilter(e.target.value),
                                                    className: "bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#4b33e8]/20 font-medium cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "today",
                                                            children: "Today"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 589,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "yesterday",
                                                            children: "Yesterday"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 590,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "this_week",
                                                            children: "This Week"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 591,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "this_month",
                                                            children: "This Month"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 592,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "all_time",
                                                            children: "All Time"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 593,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 584,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: "bg-[#4b33e8] text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-indigo-100 hover:shadow-xl transition-all",
                                                    children: "Download Report"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 595,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 583,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 566,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 558,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 md:grid-cols-5 gap-4 mb-8",
                            children: [
                                {
                                    label: 'Total Members',
                                    value: members.length,
                                    icon: 'fi-rr-users-alt',
                                    color: 'text-blue-600',
                                    bg: 'bg-blue-50'
                                },
                                {
                                    label: 'Total Calls',
                                    value: processedData.summary.totalCalls,
                                    icon: 'fi-rr-phone-call',
                                    color: 'text-indigo-600',
                                    bg: 'bg-indigo-50'
                                },
                                {
                                    label: 'Deals Closed',
                                    value: processedData.summary.deals,
                                    icon: 'fi-rr-trophy',
                                    color: 'text-yellow-600',
                                    bg: 'bg-yellow-50'
                                },
                                {
                                    label: 'Revenue',
                                    value: `₹${processedData.summary.revenue.toLocaleString()}`,
                                    icon: 'fi-rr-dollar',
                                    color: 'text-emerald-600',
                                    bg: 'bg-emerald-50'
                                },
                                {
                                    label: 'Avg Connect Rate',
                                    value: `${processedData.summary.avgConnectRate}%`,
                                    icon: 'fi-rr-chart-histogram',
                                    color: 'text-purple-600',
                                    bg: 'bg-purple-50'
                                }
                            ].map((stat, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.bg} ${stat.color}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: `fi ${stat.icon}`
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 613,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 612,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-gray-500 font-medium uppercase tracking-wide",
                                                    children: stat.label
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 616,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xl font-bold text-gray-800",
                                                    children: stat.value
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 617,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 615,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 611,
                                    columnNumber: 21
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 603,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-gray-800 font-bold mb-4",
                                            children: "Call Outcomes"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 627,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-h-[250px]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                width: "100%",
                                                height: "100%",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["PieChart"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Pie"], {
                                                            data: processedData.charts.outcome,
                                                            cx: "50%",
                                                            cy: "50%",
                                                            innerRadius: 60,
                                                            outerRadius: 80,
                                                            fill: "#8884d8",
                                                            paddingAngle: 5,
                                                            dataKey: "value",
                                                            children: processedData.charts.outcome.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Cell"], {
                                                                    fill: COLORS[index % COLORS.length]
                                                                }, `cell-${index}`, false, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 642,
                                                                    columnNumber: 41
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 631,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 645,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Legend"], {}, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 646,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 630,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 629,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 628,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 626,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:col-span-2 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-gray-800 font-bold mb-4",
                                            children: "Hourly Activity"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 654,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-h-[250px]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                width: "100%",
                                                height: "100%",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["BarChart"], {
                                                    data: processedData.charts.hourly,
                                                    margin: {
                                                        top: 5,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                            strokeDasharray: "3 3",
                                                            vertical: false
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 666,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                                            dataKey: "name",
                                                            axisLine: false,
                                                            tickLine: false,
                                                            tick: {
                                                                fontSize: 12,
                                                                fill: '#9ca3af'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 667,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                                            axisLine: false,
                                                            tickLine: false,
                                                            tick: {
                                                                fontSize: 12,
                                                                fill: '#9ca3af'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 668,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                            cursor: {
                                                                fill: '#f3f4f6'
                                                            },
                                                            contentStyle: {
                                                                borderRadius: '12px',
                                                                border: 'none',
                                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 669,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Bar"], {
                                                            dataKey: "count",
                                                            fill: "#4b33e8",
                                                            radius: [
                                                                4,
                                                                4,
                                                                0,
                                                                0
                                                            ],
                                                            barSize: 40
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 670,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 657,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 656,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 655,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 653,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 624,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:col-span-2 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-gray-800 font-bold mb-4",
                                            children: "Daily Call Trend"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 681,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-h-[250px]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                width: "100%",
                                                height: "100%",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["AreaChart"], {
                                                    data: processedData.charts.dailyTrend,
                                                    margin: {
                                                        top: 10,
                                                        right: 30,
                                                        left: 0,
                                                        bottom: 0
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("defs", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("linearGradient", {
                                                                id: "colorCalls",
                                                                x1: "0",
                                                                y1: "0",
                                                                x2: "0",
                                                                y2: "1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("stop", {
                                                                        offset: "5%",
                                                                        stopColor: "#4b33e8",
                                                                        stopOpacity: 0.8
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                                        lineNumber: 695,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("stop", {
                                                                        offset: "95%",
                                                                        stopColor: "#4b33e8",
                                                                        stopOpacity: 0
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                                        lineNumber: 696,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 694,
                                                                columnNumber: 37
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 693,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                                            dataKey: "name",
                                                            axisLine: false,
                                                            tickLine: false,
                                                            tick: {
                                                                fontSize: 12,
                                                                fill: '#9ca3af'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 699,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                                            axisLine: false,
                                                            tickLine: false,
                                                            tick: {
                                                                fontSize: 12,
                                                                fill: '#9ca3af'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 700,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                            strokeDasharray: "3 3",
                                                            vertical: false
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 701,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                            cursor: {
                                                                fill: 'transparent'
                                                            },
                                                            contentStyle: {
                                                                borderRadius: '12px',
                                                                border: 'none',
                                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 702,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Area"], {
                                                            type: "monotone",
                                                            dataKey: "count",
                                                            stroke: "#4b33e8",
                                                            fillOpacity: 1,
                                                            fill: "url(#colorCalls)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 703,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 684,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 683,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 682,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 680,
                                    columnNumber: 18
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-gray-800 font-bold mb-4",
                                            children: "Lead Status"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 711,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex-1 min-h-[250px]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                width: "100%",
                                                height: "100%",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["BarChart"], {
                                                    layout: "vertical",
                                                    data: processedData.charts.disposition,
                                                    margin: {
                                                        top: 5,
                                                        right: 30,
                                                        left: 40,
                                                        bottom: 5
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                            strokeDasharray: "3 3",
                                                            horizontal: true,
                                                            vertical: false
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 724,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                                            type: "number",
                                                            hide: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 725,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                                            dataKey: "name",
                                                            type: "category",
                                                            width: 80,
                                                            axisLine: false,
                                                            tickLine: false,
                                                            tick: {
                                                                fontSize: 11,
                                                                fill: '#4b5563'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 726,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                            cursor: {
                                                                fill: '#f3f4f6'
                                                            },
                                                            contentStyle: {
                                                                borderRadius: '12px',
                                                                border: 'none',
                                                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 727,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Bar"], {
                                                            dataKey: "count",
                                                            fill: "#10b981",
                                                            radius: [
                                                                0,
                                                                4,
                                                                4,
                                                                0
                                                            ],
                                                            barSize: 20
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 728,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 714,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 713,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 712,
                                            columnNumber: 22
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 710,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 678,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-8 text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-gray-800 font-bold mb-4 text-lg",
                                    children: "Top Performers"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 737,
                                    columnNumber: 16
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                                    children: [
                                        processedData.topAgents.map((agent, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4 relative overflow-hidden",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: `absolute top-0 right-0 p-2 font-bold text-6xl text-gray-100 -z-0 pointer-events-none select-none`,
                                                        children: [
                                                            "#",
                                                            i + 1
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 741,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-14 h-14 rounded-full border-2 border-[#4b33e8]/20 p-0.5 z-10 bg-white flex items-center justify-center overflow-hidden",
                                                        children: agent.profilePic ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                            src: agent.profilePic,
                                                            className: "w-full h-full rounded-full object-cover",
                                                            alt: agent.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 746,
                                                            columnNumber: 33
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-user text-2xl text-gray-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 748,
                                                            columnNumber: 33
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 744,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "z-10",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-gray-800",
                                                                children: agent.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 752,
                                                                columnNumber: 31
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-gray-500",
                                                                children: [
                                                                    agent.connected,
                                                                    " Connected Calls"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 753,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 751,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, i, true, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 740,
                                                columnNumber: 23
                                            }, this)),
                                        processedData.topAgents.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-gray-400 text-sm col-span-3",
                                            children: "No data available for leaderboard."
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 757,
                                            columnNumber: 60
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 738,
                                    columnNumber: 16
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 736,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-4 border-b border-gray-100 flex justify-between items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-gray-800 text-lg",
                                            children: "Member Performance"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 764,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>fetchTeamData(),
                                                    disabled: loading,
                                                    className: "group flex items-center gap-2 px-2.5 py-1 bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all border border-indigo-100",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: `fi flex fi-rr-refresh ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 771,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            children: "Refresh"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 772,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 766,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2 text-xs font-medium",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "w-2 h-2 rounded-full bg-green-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 775,
                                                                    columnNumber: 121
                                                                }, this),
                                                                " Online"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 775,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "flex items-center gap-1.5 px-2 py-1 bg-gray-50 text-gray-500 rounded-md",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "w-2 h-2 rounded-full bg-gray-400"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 776,
                                                                    columnNumber: 119
                                                                }, this),
                                                                " Idle"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 776,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 774,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 765,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 763,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                        className: "w-full text-left border-collapse",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    className: "bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-3 font-bold",
                                                            children: "Agent"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 785,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-2 py-3 font-bold text-center",
                                                            children: "Last Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 786,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-2 py-3 font-bold text-center",
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 787,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-2 py-3 font-bold text-center text-indigo-500/80",
                                                            children: "Follow Ups"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 788,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-2 py-3 font-bold text-center",
                                                            children: "Talk Time"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 789,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-2 py-3 font-bold text-center",
                                                            children: "Connected"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 790,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-2 py-3 font-bold text-center",
                                                            children: "Avg Talk"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 791,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-2 py-3 font-bold text-center",
                                                            children: "Streak/Gap"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 792,
                                                            columnNumber: 33
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                            className: "px-4 py-3 font-bold text-right",
                                                            children: "Last Call"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 793,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 784,
                                                    columnNumber: 29
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 783,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-gray-50",
                                                children: members.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        colSpan: 9,
                                                        className: "px-6 py-8 text-center text-gray-500 text-sm",
                                                        children: "No members in this team"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 799,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 798,
                                                    columnNumber: 33
                                                }, this) : members.map((member)=>{
                                                    const mId = member.user_id;
                                                    const statsMap = processedData.memberStats;
                                                    const mStats = statsMap[mId] || {
                                                        totalCalls: 0,
                                                        connected: 0,
                                                        connectedRate: 0,
                                                        avgDuration: '0m 0s',
                                                        deals: 0,
                                                        followUps: 0,
                                                        lastActive: null,
                                                        idleTime: 'N/A',
                                                        status: 'Idle'
                                                    };
                                                    const isOnline = mStats.status === 'Online';
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                        className: "hover:bg-gray-50/80 transition-colors group",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "w-10 h-10 rounded-full bg-gray-100 border border-white shadow-sm overflow-hidden flex items-center justify-center text-gray-500 font-bold text-xs",
                                                                            children: member.profile_pic_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                                src: member.profile_pic_url,
                                                                                alt: "",
                                                                                className: "w-full h-full object-cover"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                                lineNumber: 813,
                                                                                columnNumber: 57
                                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-user text-lg text-gray-400"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                                lineNumber: 815,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                                            lineNumber: 811,
                                                                            columnNumber: 49
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-semibold text-gray-800",
                                                                                    children: member.user_name || 'Unknown'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                                    lineNumber: 819,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs text-gray-400",
                                                                                    children: [
                                                                                        "ID: ",
                                                                                        member.employee_id || '--'
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                                    lineNumber: 820,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                                            lineNumber: 818,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 810,
                                                                    columnNumber: 45
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 809,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-4 text-center",
                                                                children: mStats.lastOnline ? (()=>{
                                                                    const diff = Date.now() - new Date(mStats.lastOnline).getTime();
                                                                    const diffMins = diff / 60000;
                                                                    let dotColor = "bg-gray-400";
                                                                    let textColor = "text-gray-500";
                                                                    let bgColor = "bg-gray-50";
                                                                    let borderColor = "border-gray-100";
                                                                    let statusText = "Offline";
                                                                    if (diffMins <= 1) {
                                                                        dotColor = "bg-green-500 animate-pulse";
                                                                        textColor = "text-green-700";
                                                                        bgColor = "bg-green-50";
                                                                        borderColor = "border-green-100";
                                                                        statusText = "Online";
                                                                    } else if (diffMins <= 3) {
                                                                        dotColor = "bg-orange-500";
                                                                        textColor = "text-orange-700";
                                                                        bgColor = "bg-orange-50";
                                                                        borderColor = "border-orange-100";
                                                                        statusText = "Away";
                                                                    }
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] font-bold text-gray-500",
                                                                                children: formatTime(mStats.lastOnline)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                                lineNumber: 850,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] uppercase font-bold border ${bgColor} ${textColor} ${borderColor}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: `w-1 h-1 rounded-full ${dotColor}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                                                        lineNumber: 852,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    statusText
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                                lineNumber: 851,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                                        lineNumber: 849,
                                                                        columnNumber: 53
                                                                    }, this);
                                                                })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-gray-300",
                                                                    children: "-"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 858,
                                                                    columnNumber: 49
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 824,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-4 text-center",
                                                                children: mStats.onCall ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${mStats.isPersonal ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: `fi flex ${mStats.isPersonal ? 'fi-rr-book-user text-amber-500' : 'fi-rr-headset text-indigo-500'} text-[10px] animate-pulse`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                                            lineNumber: 864,
                                                                            columnNumber: 51
                                                                        }, this),
                                                                        mStats.isPersonal ? 'Personal Call' : 'On Call'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 863,
                                                                    columnNumber: 47
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isOnline ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: `w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                                            lineNumber: 869,
                                                                            columnNumber: 51
                                                                        }, this),
                                                                        isOnline ? 'Active' : `Idle ${mStats.idleTime !== 'N/A' ? mStats.idleTime : ''}`
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 868,
                                                                    columnNumber: 47
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 861,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-4 text-center",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold border border-gray-200",
                                                                    children: [
                                                                        mStats.totalCalls,
                                                                        " CALLS"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 875,
                                                                    columnNumber: 45
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 874,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-4 text-center text-xs text-gray-600 font-bold",
                                                                children: mStats.totalTalkTime
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 879,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-4 text-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-bold text-gray-800",
                                                                        children: mStats.connected
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                                        lineNumber: 883,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-[9px] text-indigo-500 font-bold",
                                                                        children: [
                                                                            mStats.connectedRate,
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                                        lineNumber: 884,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 882,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-4 text-center text-xs text-gray-600 font-bold",
                                                                children: mStats.avgDuration
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 886,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-2 py-4 text-center text-xs text-amber-600 font-bold",
                                                                children: mStats.streakGap
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 889,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                className: "px-4 py-4 text-right",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-xs font-bold text-gray-800",
                                                                        children: formatTime(mStats.lastActive)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                                        lineNumber: 893,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-[9px] text-gray-400 font-medium",
                                                                        children: mStats.lastActive ? new Date(mStats.lastActive).toLocaleDateString() : 'N/A'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                                        lineNumber: 894,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 892,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, member.user_id, true, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 808,
                                                        columnNumber: 37
                                                    }, this);
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 796,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 782,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                    lineNumber: 781,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/team/[id].tsx",
                            lineNumber: 762,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 555,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/team/[id].tsx",
                lineNumber: 554,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__99a36938._.js.map