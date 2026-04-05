module.exports = [
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
];

//# sourceMappingURL=lib_sessionManager_ts_daf9df7b._.js.map