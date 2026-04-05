(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/monitoring.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "estimateSize",
    ()=>estimateSize,
    "logSystemEvent",
    ()=>logSystemEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
;
// Cache to store user profile name during the session to avoid redundant queries
let cachedUserName = null;
const logSystemEvent = async (log)=>{
    try {
        let finalUserId = log.user_id;
        let finalUserName = log.user_name;
        let finalOrgId = log.organization_id;
        // 1. Resolve User ID and Name
        if (!finalUserId || !finalUserName) {
            const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
            if (user) {
                finalUserId = finalUserId || user.id;
                if (!finalUserName) {
                    // Check cache first
                    if (cachedUserName) {
                        finalUserName = cachedUserName;
                    } else {
                        // Attempt to get name from profile table
                        // Use maybeSingle to prevent error if profile doesn't exist yet
                        const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_name').eq('id', user.id).maybeSingle();
                        if (profile?.user_name) {
                            finalUserName = profile.user_name;
                            cachedUserName = profile.user_name; // Cache it
                        }
                    }
                }
            }
        }
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('system_monitoring_logs').insert({
            user_id: finalUserId,
            user_name: finalUserName || 'System/Anonymous',
            event_type: log.event_type,
            description: log.description,
            path: log.path || (("TURBOPACK compile-time truthy", 1) ? window.location.pathname : "TURBOPACK unreachable"),
            metadata: log.metadata || {},
            payload_size: log.payload_size || 0,
            response_size: log.response_size || 0,
            organization_id: finalOrgId
        });
        if (error) {
            console.error('[Sentinel] Failed to log event:', error);
        }
    } catch (err) {
        console.warn('[Sentinel] Logging error:', err);
    }
};
const estimateSize = (obj)=>{
    try {
        return JSON.stringify(obj).length;
    } catch  {
        return 0;
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=lib_monitoring_ts_8ee80718._.js.map