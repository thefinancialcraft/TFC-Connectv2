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
"[project]/pages/api/auth/update-call-session.ts [api] (ecmascript)", ((__turbopack_context__) => {
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
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Unauthorized'
            });
        }
        const token = authHeader.split('Bearer ')[1];
        const { data: { user }, error: userError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"].auth.getUser(token);
        if (userError || !user) {
            return res.status(401).json({
                error: 'Invalid session'
            });
        }
        const client = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabaseAdmin"] || __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$api$5d$__$28$ecmascript$29$__["supabase"];
        const { campaign_id, customer_id, status, is_manual_event, manual_override, terminate, is_unassigned } = req.body;
        console.log(`[API-Session] Request Target: User=${user.id}, Campaign=${campaign_id}, Manual=${is_manual_event}, Terminate=${terminate}, Unassigned=${is_unassigned}`);
        // ACTION: TERMINATE SESSION
        if (terminate) {
            const { error: deleteError } = await client.from('call_sessions').delete().eq('user_id', user.id).eq('campaign_id', campaign_id);
            if (deleteError) {
                console.error('[API-Session] Delete Error:', deleteError);
                return res.status(500).json({
                    error: deleteError.message
                });
            }
            const responseData = {
                success: true,
                message: 'Session terminated'
            };
            return res.status(200).json(responseData);
        }
        // 0. FETCH ORGANIZATION ID FOR SESSION TRACKING
        const { data: campaignMeta } = await client.from('campaigns').select('organization_id').eq('id', campaign_id).maybeSingle();
        let updatePayload = {
            user_id: user.id,
            campaign_id: campaign_id,
            organization_id: campaignMeta?.organization_id || null,
            updated_at: new Date().toISOString()
        };
        if (manual_override) {
            // Clear manual state and RESTORE primary lead context
            console.log(`[API-Session] Force clearing manual state and restoring lead: ${customer_id}`);
            updatePayload = {
                ...updatePayload,
                customer_id: customer_id,
                status: status || 'assigned',
                is_manual: false,
                manual_campaign_id: null,
                manual_customer_id: null,
                manual_status: null,
                is_unassigned: false,
                call_start_at: null
            };
        } else if (is_manual_event) {
            // TARGETED MANUAL UPDATE: 
            // We find if this user already has a lead assigned in this specific campaign
            const { data: existing } = await client.from('call_sessions').select('customer_id, status').eq('user_id', user.id).eq('campaign_id', campaign_id).maybeSingle();
            console.log(`[API-Session] Manual Event for Lead Campaign: ${campaign_id}. Existing Primary Lead: ${existing?.customer_id || 'None'}`);
            // 🔄 REFRESH LOGIC: We no longer delete and recreate here. 
            // Upsert below handles the transition without triggering DELETE events in Realtime.
            updatePayload = {
                ...updatePayload,
                // If row exists, keep primary lead. If new, set this lead as primary too as fallback.
                customer_id: existing?.customer_id || customer_id,
                status: existing?.status || 'assigned',
                is_manual: true,
                manual_campaign_id: campaign_id,
                manual_customer_id: customer_id,
                manual_status: status,
                is_unassigned: is_unassigned || false,
                ...status === 'active' ? {
                    call_start_at: new Date().toISOString()
                } : {}
            };
        } else {
            // STANDARD CRM WORKFLOW
            updatePayload = {
                ...updatePayload,
                customer_id: customer_id,
                status: status,
                is_manual: false,
                manual_campaign_id: null,
                manual_customer_id: null,
                manual_status: null,
                ...status === 'active' ? {
                    call_start_at: new Date().toISOString()
                } : {
                    call_start_at: null
                }
            };
        }
        const { data: updated, error: upsertError } = await client.from('call_sessions').upsert(updatePayload, {
            onConflict: 'user_id,campaign_id'
        }).select('*').single();
        if (upsertError) {
            console.error('[API-Session] DB Error:', upsertError);
            return res.status(500).json({
                error: upsertError.message
            });
        }
        return res.status(200).json({
            success: true,
            session: updated,
            server_now: new Date().toISOString()
        });
    } catch (error) {
        console.error('[API-Session] Fatal:', error);
        return res.status(500).json({
            error: 'Internal server error'
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b8c8236f._.js.map