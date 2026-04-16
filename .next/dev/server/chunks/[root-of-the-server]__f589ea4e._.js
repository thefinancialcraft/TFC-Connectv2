module.exports = [
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-api-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@supabase/supabase-js");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/supabase.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "supabase",
    ()=>supabase,
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://qcglmkmhqvmkugaqvqih.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTA5MTUsImV4cCI6MjA4MjA2NjkxNX0.XRbQNB4sbRgSppMH76ED7OruPYHJgI-xOMLQM7ZT6Lc");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__["createClient"])(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceRoleKey ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
}) : null;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/dateUtils.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/lib/dashboardUtils.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
"[project]/pages/api/dashboard_overview.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dateUtils.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dashboardUtils.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
/**
 * Calculate date range based on filter
 */ // getDateRange moved to lib/dateUtils.ts
/**
 * Helper function to fetch only specific columns for summing (handles 1000 row limit)
 */ async function fetchSumData(client, table, column, filters) {
    const BATCH_SIZE = 1000;
    let total = 0;
    let from = 0;
    let hasMore = true;
    const dateCol = filters.dateColumn || "created_at";
    // CRITICAL: Empty array in .in() filter causes 500 Error in PostgREST
    if (Array.isArray(filters.userId) && filters.userId.length === 0) return 0;
    if (Array.isArray(filters.employeeId) && filters.employeeId.length === 0) return 0;
    while(hasMore){
        let query = client.from(table).select(column).range(from, from + BATCH_SIZE - 1);
        if (filters.orgId && table !== 'call_history') query = query.eq("organization_id", filters.orgId);
        if (filters.userId && table === 'customers') {
            if (Array.isArray(filters.userId)) query = query.in('assigned_to', filters.userId);
            else query = query.eq('assigned_to', filters.userId);
        }
        if (filters.employeeId && table === 'call_history') {
            if (Array.isArray(filters.employeeId)) query = query.in('employee_id', filters.employeeId);
            else query = query.eq('employee_id', filters.employeeId);
        }
        if (filters.startDate) query = query.gte(dateCol, filters.startDate);
        if (filters.endDate) query = query.lte(dateCol, filters.endDate);
        if (filters.extraFilter) query = filters.extraFilter(query);
        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) break;
        total += data.reduce((acc, entry)=>acc + (Number(entry[column]) || 0), 0);
        if (data.length < BATCH_SIZE) hasMore = false;
        else from += BATCH_SIZE;
    }
    return total;
}
async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }
    console.log("==> Dashboard Overview API Handler Started <==");
    const startTime = Date.now();
    try {
        // Get the auth token from headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }
        const token = authHeader.split("Bearer ")[1];
        // Verify the token and get user
        const { data: { user: authUser }, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"].auth.getUser(token);
        if (authError || !authUser) {
            return res.status(401).json({
                success: false,
                error: "Invalid or expired token"
            });
        }
        const userId = authUser.id;
        const { dateFilter = "this_month", orgId, userId: filterUserId } = req.query;
        console.log(`[API Params] dateFilter: ${dateFilter}, orgId: ${orgId}, filterUserId: ${filterUserId}`);
        // Ensure the standard supabase client is authenticated for RLS
        // Even if using supabaseAdmin later, we need to fetch the profile first
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"].auth.setSession({
                access_token: token,
                refresh_token: ""
            });
        }
        // Fetch user profile to validate org access
        const { data: userProfile, error: profileError } = await (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"]).from("user_profiles").select("organization_id, role, designation, is_client").eq("user_id", userId).maybeSingle();
        if (profileError) {
            console.error("Profile fetch error:", profileError);
            return res.status(500).json({
                success: false,
                error: "Database error"
            });
        }
        // Determine dashboard level
        const userRole = userProfile?.role || 'user';
        const userDesignation = userProfile?.designation || '';
        const dashboardLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["getUserDashboardLevel"])({
            isClient: userProfile?.is_client ?? false,
            role: userRole,
            designation: userDesignation
        });
        // Team Leader IDs tracking
        let restrictedUserIds = undefined;
        let restrictedEmployeeIds = undefined;
        if (dashboardLevel === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["DashboardLevel"].LEVEL_3_TL_SALES) {
            const { data: teams } = await (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"]).from('teams').select('members').eq('leader_id', userId).eq('is_active', true);
            const memberIds = new Set();
            memberIds.add(userId);
            teams?.forEach((t)=>{
                if (Array.isArray(t.members)) {
                    t.members.forEach((m)=>{
                        if (m) memberIds.add(m);
                    });
                }
            });
            restrictedUserIds = Array.from(memberIds);
            // Also get employee IDs for call_history filtering
            const { data: memberProfiles } = await (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"]).from('user_profiles').select('employee_id').in('user_id', restrictedUserIds);
            restrictedEmployeeIds = memberProfiles?.map((p)=>p.employee_id).filter((id)=>!!id);
        }
        // Determine which org to query
        // If user requests specific org, validate they have access
        let targetOrgId = undefined;
        if (orgId && orgId !== "all") {
            // If user has profile, validate org access
            if (userProfile) {
                if (userProfile.role === "admin" || userProfile.role === "super_admin" || orgId === userProfile.organization_id) {
                    targetOrgId = orgId;
                } else {
                    return res.status(403).json({
                        success: false,
                        error: "Organization access denied"
                    });
                }
            } else {
                // No profile - allow access to requested org (or could restrict here)
                targetOrgId = orgId;
            }
        } else if (orgId !== "all") {
            // Default to user's org if not admin viewing all
            if (userProfile && userProfile.role !== "admin" && userProfile.role !== "super_admin") {
                targetOrgId = userProfile.organization_id;
            }
        }
        const range = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["getISTDateRange"])(dateFilter);
        const { start: todayStart, end: todayEnd } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["getISTDateRange"])("today");
        // Use admin client to bypass RLS and get all data
        const dbClient = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"];
        // If filterUserId provided, get employee_id for call_history matching
        let filterEmployeeId;
        if (filterUserId && filterUserId !== 'all') {
            const { data: filterUser } = await dbClient.from('user_profiles').select('employee_id').eq('user_id', filterUserId).maybeSingle();
            if (filterUser?.employee_id) filterEmployeeId = filterUser.employee_id;
        }
        // --- HIGH PERFORMANCE OPTIMIZED CALL (RPC) ---
        try {
            console.log("🚀 [Performance] Attempting optimized database RPC call...");
            const { data: rpcStats, error: rpcError } = await dbClient.rpc('get_dashboard_stats_advanced', {
                p_start_date: range.start,
                p_end_date: range.end,
                p_org_id: targetOrgId || null,
                p_filter_user_id: filterUserId && filterUserId !== 'all' ? filterUserId : null,
                p_restricted_user_ids: restrictedUserIds && restrictedUserIds.length > 0 ? restrictedUserIds : null,
                p_filter_employee_id: filterEmployeeId || null,
                p_restricted_employee_ids: restrictedEmployeeIds && restrictedEmployeeIds.length > 0 ? restrictedEmployeeIds : null
            });
            if (rpcError) throw rpcError;
            console.log("✅ [Performance] RPC Success. Metrics aggregated in-database.");
            const totalCustomers = rpcStats.totalCustomers || 0;
            const totalConverted = rpcStats.totalConverted || 0;
            const totalPremium = 0;
            const totalDials = rpcStats.totalDials || 0;
            const totalTalktime = rpcStats.totalTalktime || 0;
            const totalConnections = rpcStats.totalConnections || 0;
            const todayCallsCount = rpcStats.todayCalls || 0;
            const campaignsCount = rpcStats.activeCampaigns || 0;
            const teamCount = rpcStats.teamCount || 0;
            const freshGlobalCount = rpcStats.freshGlobalCount || 0;
            const allTimeRecords = rpcStats.allTimeRecords || 0;
            const allTimeFollowups = rpcStats.allTimeFollowups || 0;
            const allTimeOverdue = rpcStats.allTimeOverdue || 0;
            const allTimeConnections = rpcStats.allTimeConnections || 0;
            return sendDashboardResponse(res, {
                totalCustomers,
                totalConverted,
                totalPremium,
                totalDials,
                totalTalktime,
                totalConnections,
                todayCallsCount,
                campaignsCount,
                teamCount,
                freshGlobalCount,
                allTimeRecords,
                allTimeFollowups,
                allTimeOverdue,
                allTimeConnections,
                startTime
            });
        } catch (err) {
            console.warn("⚠️ [Performance] RPC failed or not found. Falling back to parallel count strategy.");
        }
        const fetchPromises = [
            // 1. Total Customers (Count Only)
            (async ()=>{
                let q = dbClient.from("customers").select("*", {
                    count: "exact",
                    head: true
                }).gte("created_at", range.start).lte("created_at", range.end);
                if (targetOrgId) q = q.eq("organization_id", targetOrgId);
                if (filterUserId && filterUserId !== 'all') q = q.eq('assigned_to', filterUserId);
                else if (restrictedUserIds && restrictedUserIds.length > 0) q = q.in('assigned_to', restrictedUserIds);
                const { count } = await q;
                return count || 0;
            })(),
            // 2. Total Converted (Count Only)
            (async ()=>{
                let q = dbClient.from("customers").select("*", {
                    count: "exact",
                    head: true
                }).gte("created_at", range.start).lte("created_at", range.end).or('disposition.ilike.%Sold%,disposition.ilike.%Success%,disposition.ilike.%Converted%,disposition.ilike.%Closed%');
                if (targetOrgId) q = q.eq("organization_id", targetOrgId);
                if (filterUserId && filterUserId !== 'all') q = q.eq('assigned_to', filterUserId);
                else if (restrictedUserIds && restrictedUserIds.length > 0) q = q.in('assigned_to', restrictedUserIds);
                const { count } = await q;
                return count || 0;
            })(),
            // 4. Total Dials (Count Only)
            (async ()=>{
                let q = dbClient.from("call_history").select("*", {
                    count: "exact",
                    head: true
                }).gte("timestamp", range.start).lte("timestamp", range.end);
                if (filterEmployeeId) q = q.eq('employee_id', filterEmployeeId);
                else if (restrictedEmployeeIds && restrictedEmployeeIds.length > 0) q = q.in('employee_id', restrictedEmployeeIds);
                const { count } = await q;
                return count || 0;
            })(),
            // 5. Total Talktime (The ONLY one needing row fetch if no RPC)
            (async ()=>{
                return fetchSumData(dbClient, "call_history", "duration", {
                    startDate: range.start,
                    endDate: range.end,
                    dateColumn: "timestamp",
                    employeeId: filterEmployeeId || restrictedEmployeeIds
                });
            })(),
            // 6. Total Connections (Count Only)
            (async ()=>{
                let q = dbClient.from("call_history").select("*", {
                    count: "exact",
                    head: true
                }).gte("timestamp", range.start).lte("timestamp", range.end).gt('duration', 0);
                if (filterEmployeeId) q = q.eq('employee_id', filterEmployeeId);
                else if (restrictedEmployeeIds && restrictedEmployeeIds.length > 0) q = q.in('employee_id', restrictedEmployeeIds);
                const { count } = await q;
                return count || 0;
            })(),
            // 7. Today Calls
            (async ()=>{
                let q = dbClient.from("call_history").select("*", {
                    count: "exact",
                    head: true
                }).gte("timestamp", todayStart).lte("timestamp", todayEnd);
                if (filterEmployeeId) q = q.eq('employee_id', filterEmployeeId);
                else if (restrictedEmployeeIds && restrictedEmployeeIds.length > 0) q = q.in('employee_id', restrictedEmployeeIds);
                const { count } = await q;
                return count || 0;
            })(),
            // 10-13. Global Counts
            (async ()=>{
                const [fresh, totalRecs, followups, overdue] = await Promise.all([
                    // Fresh Global
                    (async ()=>{
                        let q = dbClient.from("customers").select("*", {
                            count: "exact",
                            head: true
                        }).is('disposition', null).eq('attempt_count', 0);
                        if (targetOrgId) q = q.eq("organization_id", targetOrgId);
                        if (filterUserId && filterUserId !== 'all') q = q.eq('assigned_to', filterUserId);
                        else if (restrictedUserIds && restrictedUserIds.length > 0) q = q.in('assigned_to', restrictedUserIds);
                        const { count } = await q;
                        return count || 0;
                    })(),
                    // All-time Total
                    (async ()=>{
                        let q = dbClient.from("customers").select("*", {
                            count: "exact",
                            head: true
                        });
                        if (targetOrgId) q = q.eq("organization_id", targetOrgId);
                        if (filterUserId && filterUserId !== 'all') q = q.eq('assigned_to', filterUserId);
                        else if (restrictedUserIds && restrictedUserIds.length > 0) q = q.in('assigned_to', restrictedUserIds);
                        const { count } = await q;
                        return count || 0;
                    })(),
                    // Followups
                    (async ()=>{
                        let q = dbClient.from("customers").select("*", {
                            count: "exact",
                            head: true
                        }).in('disposition', [
                            'Callback',
                            'Call Back',
                            'Follow Up',
                            'FollowUp'
                        ]);
                        if (targetOrgId) q = q.eq("organization_id", targetOrgId);
                        if (filterUserId && filterUserId !== 'all') q = q.eq('assigned_to', filterUserId);
                        else if (restrictedUserIds && restrictedUserIds.length > 0) q = q.in('assigned_to', restrictedUserIds);
                        const { count } = await q;
                        return count || 0;
                    })(),
                    // Overdue
                    (async ()=>{
                        const nowIso = new Date().toISOString();
                        let q = dbClient.from("customers").select("*", {
                            count: "exact",
                            head: true
                        }).in('disposition', [
                            'Callback',
                            'Call Back',
                            'Follow Up',
                            'FollowUp'
                        ]).or(`next_called_at.lt.${nowIso},next_called_at.is.null`);
                        if (targetOrgId) q = q.eq("organization_id", targetOrgId);
                        if (filterUserId && filterUserId !== 'all') q = q.eq('assigned_to', filterUserId);
                        else if (restrictedUserIds && restrictedUserIds.length > 0) q = q.in('assigned_to', restrictedUserIds);
                        const { count } = await q;
                        return count || 0;
                    })()
                ]);
                return {
                    fresh,
                    totalRecs,
                    followups,
                    overdue
                };
            })(),
            // Misc
            (async ()=>{
                const [campaigns, team] = await Promise.all([
                    dbClient.from("campaigns").select("*", {
                        count: "exact",
                        head: true
                    }).eq("status", "active"),
                    dbClient.from("user_profiles").select("*", {
                        count: "exact",
                        head: true
                    }).eq("approval_status", "approved")
                ]);
                return {
                    campaigns: campaigns.count || 0,
                    team: team.count || 0
                };
            })()
        ];
        const results = await Promise.all(fetchPromises);
        const totalCustomers = results[0];
        const totalConverted = results[1];
        const totalPremium = 0;
        const totalDials = results[2];
        const totalTalktime = results[3];
        const totalConnections = results[4];
        const todayCallsCount = results[5];
        const freshGlobalCount = results[6].fresh;
        const allTimeRecords = results[6].totalRecs;
        const allTimeFollowups = results[6].followups;
        const allTimeOverdue = results[6].overdue;
        const campaignsCount = results[7].campaigns;
        const teamCount = results[7].team;
        const allTimeConnections = 0; // Simplified for fallback
        return sendDashboardResponse(res, {
            totalCustomers,
            totalConverted,
            totalPremium,
            totalDials,
            totalTalktime,
            totalConnections,
            todayCallsCount,
            campaignsCount,
            teamCount,
            freshGlobalCount,
            allTimeRecords,
            allTimeFollowups,
            allTimeOverdue,
            allTimeConnections,
            startTime
        });
    } catch (err) {
        console.error("Dashboard overview API error:", err);
        return res.status(500).json({
            success: false,
            error: err.message || JSON.stringify(err) || "Internal server error"
        });
    }
}
/**
 * Finalize response with calculations
 */ function sendDashboardResponse(res, data) {
    const { totalCustomers, totalConverted, totalPremium, totalDials, totalTalktime, totalConnections, todayCallsCount, campaignsCount, teamCount, freshGlobalCount, allTimeRecords, allTimeFollowups, allTimeOverdue, allTimeConnections, startTime } = data;
    // --- CALCULATIONS ---
    const conversionRate = totalCustomers ? totalConverted / totalCustomers * 100 : 0;
    const connectedRate = totalDials ? totalConnections / totalDials * 100 : 0;
    const avgSecs = totalDials ? totalTalktime / totalDials : 0;
    const mins = Math.floor(avgSecs / 60);
    const secs = Math.floor(avgSecs % 60);
    const efficiencyScore = Math.min(100, Math.round(conversionRate * 0.4 + connectedRate * 0.3 + totalDials / 100 * 0.3));
    const responseData = {
        success: true,
        data: {
            stats: {
                totalCustomers,
                totalPremium: Math.round(totalPremium),
                totalConverted,
                conversionRate: Math.round(conversionRate * 10) / 10,
                activeCampaigns: campaignsCount,
                totalDials,
                totalTalktime,
                efficiencyScore
            },
            secondaryStats: {
                todayCalls: todayCallsCount,
                assignedMembers: teamCount,
                freshProspects: freshGlobalCount,
                followupCalls: allTimeFollowups,
                newProspects: allTimeRecords,
                overdueFollowups: allTimeOverdue
            },
            performanceMetrics: {
                avgDuration: `${mins}m ${secs}s`,
                connectedRate: `${connectedRate.toFixed(1)}%`,
                roi: `${(conversionRate / 2 + 1).toFixed(1)}x`
            }
        }
    };
    const endTime = Date.now();
    console.log(`[API] dashboard_overview - Status: 200 - Duration: ${endTime - startTime}ms`);
    return res.status(200).json(responseData);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f589ea4e._.js.map