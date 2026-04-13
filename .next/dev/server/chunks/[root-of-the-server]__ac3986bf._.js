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
"[project]/pages/api/auth/user-profile.ts [api] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>handler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [api] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    try {
        // Get the auth token from headers
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        const token = authHeader.split('Bearer ')[1];
        // Verify the token and get user
        const { data: { user: authUser }, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"].auth.getUser(token);
        if (authError || !authUser) {
            return res.status(401).json({
                error: 'Invalid or expired token'
            });
        }
        // Get user profile from user_profiles table
        // First try to get the session to set it on the client for RLS
        // Or use admin client to bypass RLS (since we're in server-side API)
        const clientToUse = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"];
        // If using regular client (not admin), we need to set the session first for RLS
        let profile;
        let profileError;
        if (__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"]) {
            // Use admin client - bypasses RLS
            const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"].from('user_profiles').select('user_name, contact_no, email, employee_id, role, approval_status, status, updated_at, profile_pic_url, profile_complete, status_reason, hold_start_date, hold_end_date, all_time_active, is_caller, is_client, designation, organization_id, google_calendar_connected, google_calendar_skipped').eq('user_id', authUser.id).maybeSingle();
            profile = result.data;
            profileError = result.error;
        } else {
            // Use regular client with user token - RLS will be enforced
            // Set session first so RLS policies can check auth.uid()
            const { data: sessionData, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"].auth.setSession({
                access_token: token,
                refresh_token: ''
            });
            if (!sessionError && sessionData.session) {
                const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_name, contact_no, email, employee_id, role, approval_status, status, updated_at, profile_pic_url, profile_complete, status_reason, hold_start_date, hold_end_date, all_time_active, is_caller, is_client, designation, organization_id, google_calendar_connected, google_calendar_skipped').eq('user_id', authUser.id).maybeSingle();
                profile = result.data;
                profileError = result.error;
            } else {
                profileError = sessionError || new Error('Failed to set session');
            }
        }
        if (profileError) {
            // Log all errors for debugging
            console.error('Profile fetch error:', profileError);
        // Don't fail the request, but log the error
        }
        // Debug: Log if profile is null
        if (!profile) {
            console.warn('Profile is null for user_id:', authUser.id, 'Error:', profileError?.message);
        }
        // Get user metadata from auth (stored in user_metadata)
        const userMetadata = authUser.user_metadata || {};
        const providers = authUser.app_metadata?.providers || [];
        const providerType = providers.length > 0 ? providers[0] : null;
        // Priority: user_metadata > profile table > null
        const displayName = userMetadata.display_name || userMetadata.user_name || profile?.user_name || null;
        const phone = userMetadata.phone || userMetadata.contact_no || profile?.contact_no || null;
        // Fetch most important call session (active or disposition_pending)
        const { data: callSession } = await clientToUse.from('call_sessions').select('campaign_id, customer_id, status, call_start_at').eq('user_id', authUser.id).in('status', [
            'active',
            'disposition_pending'
        ]).order('updated_at', {
            ascending: false
        }).limit(1).maybeSingle();
        return res.status(200).json({
            success: true,
            server_now: new Date().toISOString(),
            user: {
                uid: authUser.id,
                displayName: displayName,
                email: authUser.email || profile?.email || '',
                phone: phone,
                providers: providers,
                providerType: providerType,
                createdAt: authUser.created_at,
                lastSignInAt: authUser.last_sign_in_at || null,
                employeeId: profile?.employee_id || null,
                role: profile?.role || null,
                approvalStatus: profile?.approval_status || null,
                accountStatus: profile?.status || null,
                updatedAt: profile?.updated_at || null,
                profile_pic_url: profile?.profile_pic_url || userMetadata.picture || userMetadata.avatar_url || null,
                user_name: profile?.user_name || null,
                profile_complete: profile?.profile_complete ?? false,
                activeCampaignId: userMetadata.active_campaign_id || null,
                activeCustomerId: userMetadata.active_customer_id || null,
                activeSessionState: userMetadata.active_session_state || null,
                activeSessionStart: userMetadata.active_session_start || null,
                currentCallSession: callSession || null,
                statusReason: profile?.status_reason || null,
                holdStartDate: profile?.hold_start_date || null,
                holdEndDate: profile?.hold_end_date || null,
                allTimeActive: profile?.all_time_active ?? true,
                isCaller: profile?.is_caller ?? false,
                isClient: profile?.is_client ?? false,
                designation: profile?.designation || null,
                organization_id: profile?.organization_id || null,
                googleCalendarConnected: profile?.google_calendar_connected ?? userMetadata.google_calendar_connected ?? providers.includes('google') ?? false,
                googleCalendarSkipped: profile?.google_calendar_skipped ?? userMetadata.google_calendar_skipped ?? false
            }
        });
    } catch (error) {
        console.error('User profile error:', error);
        return res.status(500).json({
            error: 'An error occurred while fetching user profile'
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ac3986bf._.js.map