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
    // --- Level 1: Super Admin / Management (TFC Internal) ---
    if (user.isClient === false) {
        return "LEVEL_1";
    }
    const role = user.role;
    const designation = user.designation?.toLowerCase() || '';
    // --- Level 2: Client CEO / Org Owner ---
    if (user.isClient === true && (role === 'super_admin' || designation === 'ceo' || designation === 'owner')) {
        return "LEVEL_2";
    }
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
"[project]/pages/api/agent_performance.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [api] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dashboardUtils.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
/**
 * Calculate date range based on filter
 */ function getDateRange(filter) {
    const IST_OFFSET = 5.5 * 60 * 60 * 1000;
    const nowUtc = new Date();
    const nowIst = new Date(nowUtc.getTime() + IST_OFFSET);
    // Helper to get midnight IST for a given IST date
    const getMidnightIstAsUtc = (dateIst)=>{
        const midnight = new Date(dateIst);
        midnight.setUTCHours(0, 0, 0, 0);
        return new Date(midnight.getTime() - IST_OFFSET);
    };
    const todayStart = getMidnightIstAsUtc(nowIst);
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000 - 1000);
    let start = todayStart.toISOString();
    let end = todayEnd.toISOString();
    switch(filter){
        case "yesterday":
            {
                const yesterdayIst = new Date(nowIst.getTime() - 24 * 60 * 60 * 1000);
                const yStart = getMidnightIstAsUtc(yesterdayIst);
                start = yStart.toISOString();
                end = new Date(yStart.getTime() + 24 * 60 * 60 * 1000 - 1000).toISOString();
                break;
            }
        case "this_week":
            {
                const day = nowIst.getDay();
                const diff = nowIst.getDate() - day + (day === 0 ? -6 : 1);
                const mondayIst = new Date(nowIst);
                mondayIst.setDate(diff);
                start = getMidnightIstAsUtc(mondayIst).toISOString();
                end = nowUtc.toISOString();
                break;
            }
        case "last_7_days":
            {
                const dStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
                start = dStart.toISOString();
                end = nowUtc.toISOString();
                break;
            }
        case "this_month":
            {
                const firstDayIst = new Date(nowIst.getFullYear(), nowIst.getMonth(), 1);
                start = getMidnightIstAsUtc(firstDayIst).toISOString();
                end = nowUtc.toISOString();
                break;
            }
        case "last_month":
            {
                const firstDayLastMonthIst = new Date(nowIst.getFullYear(), nowIst.getMonth() - 1, 1);
                const lastDayLastMonthIst = new Date(nowIst.getFullYear(), nowIst.getMonth(), 0);
                start = getMidnightIstAsUtc(firstDayLastMonthIst).toISOString();
                const lEnd = getMidnightIstAsUtc(lastDayLastMonthIst);
                end = new Date(lEnd.getTime() + 24 * 60 * 60 * 1000 - 1000).toISOString();
                break;
            }
        case "this_year":
            {
                const firstDayYearIst = new Date(nowIst.getFullYear(), 0, 1);
                start = getMidnightIstAsUtc(firstDayYearIst).toISOString();
                end = nowUtc.toISOString();
                break;
            }
        case "multi_year":
            {
                const threeYearsAgoIst = new Date(nowIst.getFullYear() - 3, 0, 1);
                start = getMidnightIstAsUtc(threeYearsAgoIst).toISOString();
                end = nowUtc.toISOString();
                break;
            }
        case "all_time":
            start = "2020-01-01T00:00:00.000Z";
            end = nowUtc.toISOString();
            break;
    }
    return {
        start,
        end
    };
}
/**
 * Helper function to fetch ALL rows (bypasses 1000 row limit)
 */ async function fetchAllRows(client, table, selectQuery, filters) {
    const BATCH_SIZE = 1000;
    let allData = [];
    let from = 0;
    let hasMore = true;
    const dateCol = filters.dateColumn || "created_at";
    while(hasMore){
        let query = client.from(table).select(selectQuery).range(from, from + BATCH_SIZE - 1);
        if (filters.orgId && table !== 'call_history') {
            query = query.eq("organization_id", filters.orgId);
        }
        // Apply user filters
        if (filters.userId && (table === 'customers' || table === 'user_profiles')) {
            if (Array.isArray(filters.userId)) {
                query = query.in(table === 'customers' ? 'assigned_to' : 'user_id', filters.userId);
            } else {
                query = query.eq(table === 'customers' ? 'assigned_to' : 'user_id', filters.userId);
            }
        }
        if (filters.employeeId && table === 'call_history') {
            if (Array.isArray(filters.employeeId)) {
                query = query.in('employee_id', filters.employeeId);
            } else {
                query = query.eq('employee_id', filters.employeeId);
            }
        }
        if (filters.startDate) {
            query = query.gte(dateCol, filters.startDate);
        }
        if (filters.endDate) {
            query = query.lte(dateCol, filters.endDate);
        }
        const { data, error } = await query;
        if (error) throw error;
        if (!data || data.length === 0) {
            hasMore = false;
            break;
        }
        allData = [
            ...allData,
            ...data
        ];
        if (data.length < BATCH_SIZE) {
            hasMore = false;
        } else {
            from += BATCH_SIZE;
        }
    }
    return allData;
}
async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }
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
        const { dateFilter = "this_month", orgId, startDate, endDate, userId: filterUserId } = req.query;
        const startTime = Date.now();
        // Ensure the standard supabase client is authenticated for RLS
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"].auth.setSession({
                access_token: token,
                refresh_token: ""
            });
        }
        // Fetch user profile to validate org access
        const { data: userProfile, error: profileError } = await (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"]).from("user_profiles").select("organization_id, role, designation").eq("user_id", userId).maybeSingle();
        if (profileError) {
            console.error("Agent Performance API - Profile fetch error:", profileError);
            return res.status(500).json({
                success: false,
                error: "Database error"
            });
        }
        // Determine dashboard level
        const userRole = userProfile?.role || 'user';
        const userDesignation = userProfile?.designation || '';
        const dashboardLevel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dashboardUtils$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["getUserDashboardLevel"])({
            isClient: true,
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
        // Determine target org
        let targetOrgId = undefined;
        // Use admin client
        const dbClient = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"];
        // If filterUserId provided, get employee_id for call_history matching
        let filterEmployeeId;
        if (filterUserId && filterUserId !== 'all') {
            const { data: filterUser } = await dbClient.from('user_profiles').select('employee_id').eq('user_id', filterUserId).maybeSingle();
            if (filterUser?.employee_id) filterEmployeeId = filterUser.employee_id;
        }
        if (orgId && orgId !== "all") {
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
                targetOrgId = orgId;
            }
        } else if (orgId !== "all") {
            if (userProfile && userProfile.role !== "admin" && userProfile.role !== "super_admin") {
                targetOrgId = userProfile.organization_id;
            }
        }
        // Determine date range priorities:
        // 1. Custom startDate/endDate query params
        // 2. dateFilter preset (unless "all_time")
        let start;
        let end;
        if (startDate && endDate) {
            start = startDate;
            end = endDate;
        } else {
            const range = getDateRange(dateFilter);
            if (dateFilter !== "all_time") {
                start = range.start;
                end = range.end;
            }
        }
        // --- HIGH PERFORMANCE OPTIMIZED CALL (RPC) ---
        try {
            console.log("🚀 [Performance] Attempting optimized agent performance RPC call...");
            const { data: agentsRaw, error: rpcError } = await dbClient.rpc('get_agent_performance_optimized', {
                p_start_date: start,
                p_end_date: end,
                p_org_id: targetOrgId || null,
                p_restricted_user_ids: restrictedUserIds && restrictedUserIds.length > 0 ? restrictedUserIds : null,
                p_filter_user_id: filterUserId && filterUserId !== 'all' ? filterUserId : null
            });
            if (rpcError) throw rpcError;
            // Safe extract as RPC sometimes returns single object or array
            const agentsUnwrapped = Array.isArray(agentsRaw) ? agentsRaw : agentsRaw ? [
                agentsRaw
            ] : [];
            // Extract data
            const agents = (agentsUnwrapped || []).map((a)=>({
                    ...a,
                    connected_count: Number(a.connected_count) || 0,
                    count: Number(a.count) || 0,
                    duration: Number(a.duration) || 0,
                    deals_count: Number(a.deals_count) || 0,
                    follow_ups_count: Number(a.follow_ups_count) || 0,
                    last_active: a.last_active || null,
                    last_online: a.last_online || null,
                    on_call: !!a.on_call,
                    is_personal: !!a.is_personal,
                    consecutive_failed_stats: a.consecutive_failed_stats || '0/0s'
                }));
            const totalDials = agents.reduce((acc, a)=>acc + a.count, 0);
            const totalDuration = agents.reduce((acc, a)=>acc + a.duration, 0);
            const endTime = Date.now();
            console.log(`✅ [Performance] Agent Performance RPC Success - Duration: ${endTime - startTime}ms`);
            return res.status(200).json({
                success: true,
                data: {
                    agents,
                    totalDials,
                    totalDuration
                }
            });
        } catch (err) {
            console.error("Agent performance API error:", err);
            return res.status(500).json({
                success: false,
                error: err.message || "Internal server error"
            });
        }
    } catch (error) {
        console.error("Fatal Agent Performance API error:", error);
        return res.status(500).json({
            success: false,
            error: error.message || "Internal server error"
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ae3d509f._.js.map