module.exports = [
"[externals]/crypto-js/sha256.js [external] (crypto-js/sha256.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/sha256.js", () => require("crypto-js/sha256.js"));

module.exports = mod;
}),
"[externals]/crypto-js/aes.js [external] (crypto-js/aes.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/aes.js", () => require("crypto-js/aes.js"));

module.exports = mod;
}),
"[externals]/crypto-js/enc-utf8.js [external] (crypto-js/enc-utf8.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/enc-utf8.js", () => require("crypto-js/enc-utf8.js"));

module.exports = mod;
}),
"[project]/lib/phoneUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computePhoneHash",
    ()=>computePhoneHash,
    "decryptPhone",
    ()=>decryptPhone,
    "encryptPhone",
    ()=>encryptPhone,
    "formatMaskedPhone",
    ()=>formatMaskedPhone
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$sha256$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$sha256$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto-js/sha256.js [external] (crypto-js/sha256.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$aes$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$aes$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto-js/aes.js [external] (crypto-js/aes.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$enc$2d$utf8$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$enc$2d$utf8$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto-js/enc-utf8.js [external] (crypto-js/enc-utf8.js, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/localStorageUtils.ts [ssr] (ecmascript)");
;
;
;
;
/**
 * Utility for phone number encryption and decryption
 * Currently Active: v1 (Simple XOR) - prefix "__enc__"
 * Supported for Read: v2 (AES-256) - prefix "__v2__"
 */ const SECRET_KEY = ("TURBOPACK compile-time value", "TfcV2_Secure_9Xk2Lp5Nm8Qj4Rs7Vw1Zy3Bd6G") || "RYNXLY_SECURE_PHONE_VAULT";
const computePhoneHash = (phone)=>{
    if (!phone) return null;
    const normalized = phone.replace(/[^0-9]/g, '');
    if (!normalized) return null;
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$sha256$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$sha256$2e$js$2c$__cjs$29$__["default"])(normalized).toString();
};
const encryptPhone = (phone)=>{
    if (!phone) return "";
    // Safety check: Don't re-encrypt
    if (phone.startsWith("__enc__") || phone.startsWith("__v2__")) return phone;
    try {
        // XOR Cipher Logic
        const encrypted = phone.split('').map((char, i)=>String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join('');
        // Convert to Base64 for storage
        return `__enc__${btoa(encrypted)}`;
    } catch (e) {
        console.error("XOR Encryption Failed:", e);
        return phone;
    }
};
const decryptPhone = (phone, orgId)=>{
    if (!phone) return "";
    // CASE 1: Legacy XOR (v1) - Primary
    if (phone.startsWith("__enc__")) {
        try {
            const base64Data = phone.substring(7);
            const encrypted = atob(base64Data);
            const decrypted = encrypted.split('').map((char, i)=>String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join('');
            return decrypted;
        } catch (e) {
            return phone;
        }
    }
    // CASE 2: AES-256 (v2) - Fallback for newly saved data
    if (phone.startsWith("__v2__")) {
        try {
            const INTERNAL_SALT = "TFC_SMART_SHIELD_V2_2024"; // Support for transition data
            const contextOrgId = orgId || (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "");
            const dynamicKey = SECRET_KEY + (contextOrgId || "");
            const ciphertext = phone.substring(6);
            const bytes = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$aes$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$aes$2e$js$2c$__cjs$29$__["default"].decrypt(ciphertext, dynamicKey);
            let decryptedWithSalt = bytes.toString(__TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$enc$2d$utf8$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$enc$2d$utf8$2e$js$2c$__cjs$29$__["default"]);
            if (decryptedWithSalt && decryptedWithSalt.endsWith(INTERNAL_SALT)) {
                return decryptedWithSalt.substring(0, decryptedWithSalt.length - INTERNAL_SALT.length);
            }
            return decryptedWithSalt || phone;
        } catch (e) {
            return phone;
        }
    }
    return phone;
};
const formatMaskedPhone = (phone, orgId)=>{
    const realPhone = decryptPhone(phone, orgId);
    if (!realPhone) return "—";
    if (realPhone.length < 4) return realPhone;
    return realPhone.substring(0, 2) + "******" + realPhone.substring(realPhone.length - 2);
};
}),
"[project]/hooks/useActivityData.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useActivityData",
    ()=>useActivityData
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function useActivityData() {
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [source, setSource] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('crm');
    const [activities, setActivities] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [mobileActivities, setMobileActivities] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]); // New state for mobile history
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        // Correctly get Today's date in IST (YYYY-MM-DD)
        return new Date().toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata"
        });
    });
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    // Advanced Filters
    const [agentFilter, setAgentFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("All Agents");
    const [campaignFilter, setCampaignFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("All Campaigns");
    const [dispositionFilter, setDispositionFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("All Dispositions");
    const [orgFilter, setOrgFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("All Organizations");
    const [callTypeFilter, setCallTypeFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("All Types");
    // Global filter options states
    const [globalOrganizations, setGlobalOrganizations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [globalCampaigns, setGlobalCampaigns] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [globalAgents, setGlobalAgents] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [globalDispositions, setGlobalDispositions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        totalDials: 0,
        totalTalkTime: 0,
        contactable: 0,
        uncontactable: 0,
        lastCallTime: "N/A",
        idleFrom: "N/A"
    });
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const fetchIdRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0);
    const fetchActivities = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (isBackground = false)=>{
        if (!mounted || !user) return;
        // Abort previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        const fetchId = ++fetchIdRef.current;
        try {
            if (!isBackground) setLoading(true);
            setError("");
            // selectedDate is already YYYY-MM-DD in IST
            // We need to define the boundaries of that specific date in IST and convert to ISO
            const startOfDay = new Date(`${selectedDate}T00:00:00+05:30`).toISOString();
            const endOfDay = new Date(`${selectedDate}T23:59:59+05:30`).toISOString();
            // Base query
            // Note: We use !inner on agent join to allow filtering by agent's organization_id for Level 3
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("call_logs").select(`
          *,
          customer_name,
          agent:user_profiles!agent_id!inner(user_name, employee_id, organization_id),
          campaign:campaigns!campaign_id(name)
        `).gte("created_at", startOfDay).lte("created_at", endOfDay).order("created_at", {
                ascending: false
            });
            // Apply Security Levels
            if (user.isClient) {
                // Level 1: Client Agent (Own activities only)
                if (user.designation === 'agent' || !user.designation) {
                    if (user.uid) {
                        query = query.eq('agent_id', user.uid);
                    }
                } else if (user.designation === 'team_leader') {
                    let teamMemberIds = [
                        user.uid
                    ];
                    if (user.uid) {
                        const { data: teamData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
                        if (teamData) {
                            teamData.forEach((team)=>{
                                // Parse members JSONB similar to other pages
                                if (Array.isArray(team.members)) {
                                    team.members.forEach((m)=>{
                                        if (typeof m === 'string') teamMemberIds.push(m);
                                    });
                                } else if (typeof team.members === 'string') {
                                    try {
                                        const parsed = JSON.parse(team.members);
                                        if (Array.isArray(parsed)) parsed.forEach((id)=>teamMemberIds.push(String(id)));
                                    } catch (e) {}
                                }
                            });
                        }
                    }
                    teamMemberIds = [
                        ...new Set(teamMemberIds)
                    ]; // Unique keys
                    if (teamMemberIds.length > 0) {
                        query = query.in('agent_id', teamMemberIds);
                    }
                } else if ([
                    'ceo',
                    'developer'
                ].includes(user.designation || '')) {
                    if (user.organization_id) {
                        // Filter by agent's organization_id (using the !inner join alias)
                        query = query.eq('agent.organization_id', user.organization_id);
                    } else {
                        // Fail secure
                        query = query.eq('id', '00000000-0000-0000-0000-000000000000');
                    }
                }
            }
            // Level 4: Internal Staff (!isClient) gets explicit Global Access (no filters added)
            // --- START: COMBINED FETCH LOGIC ---
            // 1. Fetch Call Logs (Primary source)
            const { data: callLogs, error: logError } = await query;
            if (logError) throw logError;
            // 2. Fetch Rejected Leads for the same day
            let rejectedQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('*, agent:user_profiles!agent_id(user_name, employee_id, organization_id), campaign:campaigns!campaign_id(name)').gte('rejected_at', startOfDay).lte('rejected_at', endOfDay);
            // 3. Fetch Closed Deals for the same day
            let closedQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('*, agent:user_profiles!agent_id(user_name, employee_id, organization_id), campaign:campaigns!campaign_id(name)').gte('closed_at', startOfDay).lte('closed_at', endOfDay);
            // Apply same user filters to rejected/closed queries
            if (user.isClient) {
                if (user.designation === 'agent' || !user.designation) {
                    rejectedQuery = rejectedQuery.eq('agent_id', user.uid);
                    closedQuery = closedQuery.eq('agent_id', user.uid);
                } else if (user.organization_id && [
                    'ceo',
                    'developer'
                ].includes(user.designation)) {
                    rejectedQuery = rejectedQuery.eq('agent.organization_id', user.organization_id);
                    closedQuery = closedQuery.eq('agent.organization_id', user.organization_id);
                }
            // (TL filter skipped for brevity but usually follows similar logic if needed)
            }
            const [{ data: rejectedLeads }, { data: closedDeals }] = await Promise.all([
                rejectedQuery,
                closedQuery
            ]);
            // --- 4. MAP AND MERGE ---
            const mappedLogs = (callLogs || []).map((log)=>({
                    ...log,
                    created_at: log.created_at,
                    customer: log.customer_name ? {
                        customer_name: log.customer_name
                    } : null,
                    activity_type: 'call'
                }));
            const mappedRejected = (rejectedLeads || []).filter((r)=>!mappedLogs.some((l)=>l.customer_id === r.customer_id && Math.abs(new Date(l.created_at).getTime() - new Date(r.rejected_at).getTime()) < 5000)).map((r)=>({
                    ...r,
                    id: `rej-${r.id}`,
                    created_at: r.rejected_at,
                    customer: {
                        customer_name: r.customer_name
                    },
                    is_connected: 'contactable',
                    activity_type: 'rejection'
                }));
            const mappedClosed = (closedDeals || []).filter((c)=>!mappedLogs.some((l)=>l.customer_id === c.customer_id && Math.abs(new Date(l.created_at).getTime() - new Date(c.closed_at).getTime()) < 5000)).map((c)=>({
                    ...c,
                    id: `cls-${c.id}`,
                    created_at: c.closed_at,
                    customer: {
                        customer_name: c.customer_name
                    },
                    status: 'closed',
                    is_connected: 'contactable',
                    activity_type: 'closing',
                    disposition: c.final_disposition
                }));
            const combined = [
                ...mappedLogs,
                ...mappedRejected,
                ...mappedClosed
            ].sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setActivities(combined);
            // Hydrate missing customer names AND phone numbers
            try {
                // Hydrate Logic: 
                // 1. Identify missing IDs
                const missingCustomerIds = combined.filter((a)=>!a.customer?.customer_name && a.customer_id).map((a)=>a.customer_id);
                const uniqueIds = [
                    ...new Set(missingCustomerIds)
                ];
                // 2. Identify missing Hashes (mostly for mobile history if any)
                const missingHashes = combined.filter((a)=>!a.customer?.customer_name && !a.customer_id && a.phone_search_hash).map((a)=>a.phone_search_hash);
                const uniqueHashes = [
                    ...new Set(missingHashes)
                ];
                let activeHydrate = [], rHydrate = [], cHydrate = [];
                const promises = [];
                if (uniqueIds.length > 0 || uniqueHashes.length > 0) {
                    const CHUNK_SIZE = 150;
                    const idChunks = Array.from({
                        length: Math.ceil(uniqueIds.length / CHUNK_SIZE)
                    }, (_, i)=>uniqueIds.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE));
                    const hashChunks = Array.from({
                        length: Math.ceil(uniqueHashes.length / CHUNK_SIZE)
                    }, (_, i)=>uniqueHashes.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE));
                    // 1. Hydrate by ID
                    for (const batch of idChunks){
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, phone_no, phone_search_hash').in('id', batch).then((r)=>activeHydrate.push(...r.data || [])));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('customer_id', batch).then((r)=>rHydrate.push(...r.data || [])));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('id', batch).then((r)=>rHydrate.push(...r.data || [])));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('customer_id', batch).then((r)=>cHydrate.push(...r.data || [])));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('id, customer_id, customer_name, phone_no, phone_search_hash').in('id', batch).then((r)=>cHydrate.push(...r.data || [])));
                    }
                    // 2. Hydrate by Hash
                    for (const batch of hashChunks){
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', batch).then((r)=>activeHydrate.push(...r.data || [])));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('rejected_leads').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', batch).then((r)=>rHydrate.push(...r.data || [])));
                        promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('closed_deals').select('customer_name, phone_no, phone_search_hash').in('phone_search_hash', batch).then((r)=>cHydrate.push(...r.data || [])));
                    }
                }
                if (promises.length > 0) {
                    await Promise.all(promises);
                    if (fetchIdRef.current !== fetchId) return;
                    setActivities((prev)=>prev.map((act)=>{
                            if (act.customer?.customer_name) return act;
                            // Match Priority: 
                            // 1. Customer ID (Exact match to id or customer_id)
                            // 2. Phone Hash
                            let match = null;
                            if (act.customer_id) {
                                match = activeHydrate.find((a)=>a.id === act.customer_id) || rHydrate.find((r)=>r.id === act.customer_id || r.customer_id === act.customer_id) || cHydrate.find((c)=>c.id === act.customer_id || c.customer_id === act.customer_id);
                            }
                            if (!match && act.phone_search_hash) {
                                match = activeHydrate.find((a)=>a.phone_search_hash === act.phone_search_hash) || rHydrate.find((r)=>r.phone_search_hash === act.phone_search_hash) || cHydrate.find((c)=>c.phone_search_hash === act.phone_search_hash);
                            }
                            if (match) {
                                return {
                                    ...act,
                                    customer: {
                                        ...act.customer,
                                        customer_name: match.customer_name || "Unknown"
                                    },
                                    phone_no: match.phone_no
                                };
                            }
                            return act;
                        }));
                }
            } catch (err) {
                console.error("Hydration failed:", err);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Error fetching activities:", err);
                setError("Failed to load activities");
            }
        } finally{
            if (!isBackground) setLoading(false);
        }
    }, [
        selectedDate,
        user,
        mounted
    ]);
    // Fetch Mobile History
    const fetchMobileHistory = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (isBackground = false)=>{
        if (!mounted || !user) return;
        try {
            if (!isBackground) setLoading(true);
            // Parse Date Range
            const localDate = new Date(selectedDate + 'T00:00:00');
            const startOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 0, 0, 0, 0).toISOString();
            const endOfDay = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate(), 23, 59, 59, 999).toISOString();
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_history').select('*').gte('timestamp', startOfDay).lte('timestamp', endOfDay).order('timestamp', {
                ascending: false
            });
            // Filter by Employee ID (Security)
            if (user.isClient) {
                if (user.designation === 'agent' || !user.designation) {
                    if (user.employeeId) query = query.eq('employee_id', user.employeeId);
                    else if (user.uid) query = query.eq('id', '00000000-0000-0000-0000-000000000000'); // Fail safe
                } else if (user.organization_id && [
                    'ceo',
                    'developer'
                ].includes(user.designation || '')) {
                    // Admin sees all? call_history has employee_id. We might need to join user_profiles to check org?
                    // call_history doesn't have org_id. It has employee_id.
                    // We'd need to fetch all employee_ids for the org first.
                    const { data: orgUsers } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('employee_id').eq('organization_id', user.organization_id);
                    if (orgUsers) {
                        const empIds = orgUsers.map((u)=>u.employee_id).filter(Boolean);
                        if (empIds.length > 0) query = query.in('employee_id', empIds);
                    }
                }
            }
            const { data, error } = await query;
            if (error) throw error;
            let finalUniqueData = [];
            if (data && data.length > 0) {
                const empIds = [
                    ...new Set(data.map((d)=>d.employee_id).filter(Boolean))
                ];
                let profileMap = {};
                if (empIds.length > 0) {
                    const { data: profiles } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('employee_id, user_name, organization_id').in('employee_id', empIds);
                    profileMap = Object.fromEntries((profiles || []).map((p)=>[
                            p.employee_id,
                            p.user_name
                        ]));
                    // Separate map for Org ID hydration
                    const orgMap = Object.fromEntries((profiles || []).map((p)=>[
                            p.employee_id,
                            p.organization_id
                        ]));
                    const hydratedData = data.map((d)=>({
                            ...d,
                            user_name: profileMap[d.employee_id] || "Unknown",
                            organization_id: orgMap[d.employee_id] || null
                        }));
                    // DEDUPLICATION LOGIC
                    const seenKeys = new Set();
                    finalUniqueData = hydratedData.filter((item)=>{
                        const timestamp = new Date(item.timestamp);
                        const timeStr = timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                        const dateStr = timestamp.toLocaleDateString();
                        const key = `${item.number}-${item.employee_id}-${dateStr}-${timeStr}-${item.duration}`;
                        if (!seenKeys.has(key)) {
                            seenKeys.add(key);
                            return true;
                        }
                        return false;
                    });
                }
                setMobileActivities(finalUniqueData);
            }
        } catch (e) {
            console.error("Error fetching mobile history:", e);
        } finally{
            if (!isBackground) setLoading(false);
        }
    }, [
        selectedDate,
        user,
        mounted,
        source
    ]);
    // Reset data when date changes to force a fresh fetch
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setActivities([]);
        setMobileActivities([]);
    }, [
        selectedDate
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (source === 'mobile' && mobileActivities.length === 0) {
            fetchMobileHistory();
        } else if (source === 'crm' && activities.length === 0) {
            fetchActivities();
        }
    }, [
        source,
        fetchActivities,
        fetchMobileHistory,
        activities.length,
        mobileActivities.length
    ]);
    const filteredActivities = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        let result = source === 'mobile' ? mobileActivities : activities;
        const query = searchQuery.toLowerCase();
        // 1. Core Filtration
        if (query) {
            const cleanQuery = query.replace(/\D/g, '');
            const isPhoneSearch = cleanQuery.length > 3;
            const queryHash = isPhoneSearch ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])(cleanQuery) : null;
            result = result.filter((a)=>{
                if (isPhoneSearch) {
                    if (a.phone_search_hash && a.phone_search_hash === queryHash) return true;
                    const phoneField = a.phone_no || a.number;
                    if (phoneField && (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(phoneField).includes(cleanQuery)) return true;
                }
                if (source === 'mobile') {
                    return a.name && a.name.toLowerCase().includes(query) || a.number && a.number.toLowerCase().includes(query) || a.employee_id && a.employee_id.toLowerCase().includes(query) || a.device_id && a.device_id.toLowerCase().includes(query);
                }
                return a.agent?.user_name?.toLowerCase().includes(query) || a.customer?.customer_name?.toLowerCase().includes(query) || a.disposition && a.disposition.toLowerCase().includes(query) || a.sub_disposition && a.sub_disposition.toLowerCase().includes(query) || a.agent?.employee_id?.toLowerCase().includes(query) || a.campaign?.name?.toLowerCase().includes(query) || a.notes && a.notes.toLowerCase().includes(query);
            });
        }
        // 2. Advanced Filters
        if (agentFilter !== "All Agents") {
            result = result.filter((a)=>{
                const empId = source === 'mobile' ? a.employee_id : a.agent?.employee_id;
                return empId === agentFilter;
            });
        }
        if (orgFilter !== "All Organizations") {
            result = result.filter((a)=>{
                const orgId = source === 'mobile' ? a.organization_id : a.agent?.organization_id || a.organization_id;
                return orgId === orgFilter;
            });
        }
        if (campaignFilter !== "All Campaigns") {
            result = result.filter((a)=>{
                const campName = source === 'mobile' ? a.campaign_name || "General" : a.campaign?.name || "General";
                return campName === campaignFilter;
            });
        }
        if (dispositionFilter !== "All Dispositions") {
            result = result.filter((a)=>a.disposition === dispositionFilter);
        }
        if (callTypeFilter !== "All Types") {
            result = result.filter((a)=>{
                const type = (a.call_type || (a.is_connected === 'contactable' ? 'outgoing' : 'missed')).toLowerCase();
                if (callTypeFilter === 'Outgoing') return type.includes('outgoing');
                if (callTypeFilter === 'Incoming') return type.includes('incoming');
                if (callTypeFilter === 'Missed') return type.includes('missed') || type.includes('reject');
                return true;
            });
        }
        return result;
    }, [
        activities,
        mobileActivities,
        searchQuery,
        source,
        agentFilter,
        campaignFilter,
        dispositionFilter,
        orgFilter,
        callTypeFilter
    ]);
    // Reactive Stats Update
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const totalDials = filteredActivities.length;
        const totalTalkTimeSec = filteredActivities.reduce((acc, curr)=>acc + (curr.duration || 0), 0);
        const contactableCount = filteredActivities.filter((a)=>a.is_connected === 'contactable').length;
        let lastCall = "N/A";
        if (totalDials > 0) {
            const sorted = [
                ...filteredActivities
            ].sort((a, b)=>new Date(b.created_at || b.timestamp).getTime() - new Date(a.created_at || a.timestamp).getTime());
            lastCall = new Date(sorted[0].created_at || sorted[0].timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        setStats({
            totalDials,
            totalTalkTime: totalTalkTimeSec,
            contactable: contactableCount,
            uncontactable: totalDials - contactableCount,
            lastCallTime: lastCall,
            idleFrom: totalDials > 0 ? lastCall : "N/A"
        });
    }, [
        filteredActivities
    ]);
    // Fetch all global filter data on mount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchGlobalFilters = async ()=>{
            // 1. All Organizations
            const { data: orgs } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').select('id, company_name').order('company_name');
            if (orgs) setGlobalOrganizations(orgs);
            // 2. All Campaigns
            const { data: camps } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('id, name').order('name');
            if (camps) setGlobalCampaigns(camps);
            // 3. All Agents
            const { data: agents } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('employee_id, user_name').order('user_name');
            if (agents) setGlobalAgents(agents.filter((a)=>a.employee_id && a.user_name));
            // 4. Unique Dispositions from call_logs
            const { data: logs } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('disposition').not('disposition', 'is', null);
            if (logs) {
                const uniqueDisps = Array.from(new Set(logs.map((l)=>l.disposition))).sort();
                setGlobalDispositions(uniqueDisps);
            }
        };
        fetchGlobalFilters();
    }, []);
    // Use global options for dropdowns
    const filterOptions = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return {
            agents: globalAgents.map((a)=>({
                    id: a.employee_id,
                    name: a.user_name
                })),
            campaigns: globalCampaigns.map((c)=>c.name),
            dispositions: globalDispositions,
            organizations: globalOrganizations.map((o)=>({
                    id: o.id,
                    name: o.company_name
                }))
        };
    }, [
        globalAgents,
        globalCampaigns,
        globalDispositions,
        globalOrganizations
    ]);
    // Utility formatters memoized or optimized
    const formatSeconds = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((seconds)=>{
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor(seconds % 3600 / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }, []);
    const formatTime = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((dateString)=>{
        return new Date(dateString).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    }, []);
    const formatDisplayDate = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((dateString)=>{
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }, []);
    return {
        loading,
        error,
        activities,
        filteredActivities,
        stats,
        selectedDate,
        setSelectedDate,
        searchQuery,
        setSearchQuery,
        fetchActivities,
        formatSeconds,
        formatTime,
        formatDisplayDate,
        source,
        setSource,
        mobileActivities,
        // Add shared filter states
        agentFilter,
        setAgentFilter,
        campaignFilter,
        setCampaignFilter,
        dispositionFilter,
        setDispositionFilter,
        orgFilter,
        setOrgFilter,
        callTypeFilter,
        setCallTypeFilter,
        filterOptions
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/portal/activity.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Activity
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
// Removed AppLayout import as it's now handled globally in PortalContainer
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useActivityData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useActivityData.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useActivityData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useActivityData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function Activity() {
    const { loading, error, filteredActivities, stats, selectedDate, setSelectedDate, searchQuery, setSearchQuery, formatSeconds, formatTime, formatDisplayDate, source, setSource, activities, mobileActivities, orgFilter, setOrgFilter, agentFilter, setAgentFilter, campaignFilter, setCampaignFilter, dispositionFilter, setDispositionFilter, callTypeFilter, setCallTypeFilter, filterOptions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useActivityData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useActivityData"])();
    const [activeNav] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("activity");
    const [showDatePicker, setShowDatePicker] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [currentMonth, setCurrentMonth] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date());
    const [showFilterModal, setShowFilterModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Combined filtration logic - Consolidated into useActivityData hook
    // Reset all filters
    const resetFilters = ()=>{
        setAgentFilter("All Agents");
        setCampaignFilter("All Campaigns");
        setDispositionFilter("All Dispositions");
        setOrgFilter("All Organizations");
        setCallTypeFilter("All Types");
    };
    const getDaysInMonth = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((date)=>{
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        const days = [];
        for(let i = 0; i < startingDayOfWeek; i++){
            const prevMonthDay = new Date(year, month, -startingDayOfWeek + i + 1);
            days.push({
                date: prevMonthDay,
                isCurrentMonth: false
            });
        }
        for(let i = 1; i <= daysInMonth; i++){
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: true
            });
        }
        const remainingDays = 42 - days.length;
        for(let i = 1; i <= remainingDays; i++){
            days.push({
                date: new Date(year, month + 1, i),
                isCurrentMonth: false
            });
        }
        return days;
    }, []);
    const formatMonthYear = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((date)=>{
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    }, []);
    const isSameDay = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((date1, date2)=>{
        const d2 = new Date(date2);
        return date1.getDate() === d2.getDate() && date1.getMonth() === d2.getMonth() && date1.getFullYear() === d2.getFullYear();
    }, []);
    const handlePrevMonth = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        setCurrentMonth((prev)=>new Date(prev.getFullYear(), prev.getMonth() - 1));
    }, []);
    const handleNextMonth = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        setCurrentMonth((prev)=>new Date(prev.getFullYear(), prev.getMonth() + 1));
    }, []);
    const handleDateSelect = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((date)=>{
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        setSelectedDate(`${year}-${month}-${day}`);
        setShowDatePicker(false);
    }, [
        setSelectedDate
    ]);
    const calendarDays = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>getDaysInMonth(currentMonth), [
        currentMonth,
        getDaysInMonth
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-6 sm:space-y-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mb-6 flex items-start justify-between",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-xl sm:text-2xl md:text-3xl font-bold mb-2",
                                    style: {
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: "Activity"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 110,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm sm:text-base",
                                    style: {
                                        color: "#787E9D",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    children: "Track your calling activities and performance metrics"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 119,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/activity.tsx",
                            lineNumber: 109,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/activity.tsx",
                        lineNumber: 108,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md",
                                style: {
                                    backgroundColor: "white"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0",
                                        style: {
                                            background: "radial-gradient(circle at top right, rgba(75, 51, 232, 0.08), transparent 60%)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 136,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-purple-100/30 blur-2xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 143,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-purple-200/20 blur-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 144,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-purple-300/15 blur-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 145,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute -right-2 -bottom-2 opacity-5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-phone-call text-5xl sm:text-6xl",
                                            style: {
                                                color: "#4b33e8"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 147,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 146,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 152,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "relative flex flex-col h-full z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between mb-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm font-medium",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Total Dials"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 162,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                        style: {
                                                            backgroundColor: "transparent"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-phone-call text-lg sm:text-xl",
                                                            style: {
                                                                color: "#4b33e8"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 177,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 171,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 161,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "mt-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl sm:text-4xl font-semibold",
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        children: stats.totalDials
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 184,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm mt-1",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Total calls made"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 193,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 183,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 160,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/activity.tsx",
                                lineNumber: 132,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md",
                                style: {
                                    backgroundColor: "white"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0",
                                        style: {
                                            background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.08), transparent 60%)"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 210,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-green-100/30 blur-2xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 217,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-green-200/20 blur-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 218,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-green-300/15 blur-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 219,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute -right-2 -bottom-2 opacity-5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-clock text-5xl sm:text-6xl",
                                            style: {
                                                color: "#10b981"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 221,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 220,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, #10b981 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 226,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "relative flex flex-col h-full z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between mb-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm font-medium",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Total Talk Time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                        style: {
                                                            backgroundColor: "transparent"
                                                        },
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-clock text-lg sm:text-xl",
                                                            style: {
                                                                color: "#10b981"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 251,
                                                            columnNumber: 25
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 235,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "mt-auto",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-3xl sm:text-4xl font-semibold",
                                                        style: {
                                                            color: "#263238",
                                                            fontFamily: "'Poppins', sans-serif"
                                                        },
                                                        children: formatSeconds(stats.totalTalkTime).substring(0, 5)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 258,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm mt-1",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "HH:MM"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 267,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 257,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 234,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/activity.tsx",
                                lineNumber: 206,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative p-0 flex flex-col overflow-hidden",
                                style: {
                                    backgroundColor: "transparent",
                                    border: "none"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                            style: {
                                                background: "linear-gradient(135deg, #10b981, #059669)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    style: {
                                                        background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 298,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 299,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute -right-1 -bottom-1 opacity-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-check-circle text-3xl text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 301,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 300,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 opacity-[0.08]",
                                                    style: {
                                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                        backgroundSize: "15px 15px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 303,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative flex flex-col justify-between h-full z-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-end mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-check-circle text-base sm:text-lg",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 313,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 312,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-xl sm:text-2xl font-bold mb-1",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: stats.contactable
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 319,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] sm:text-xs font-medium",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: "Contactable"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 328,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 318,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 311,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 285,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                            style: {
                                                background: "linear-gradient(135deg, #ef4444, #dc2626)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    style: {
                                                        background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 355,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute -right-1 -bottom-1 opacity-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-cross-circle text-3xl text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 opacity-[0.08]",
                                                    style: {
                                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                        backgroundSize: "15px 15px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 359,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative flex flex-col justify-between h-full z-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-end mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-cross-circle text-base sm:text-lg",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 369,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 368,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-xl sm:text-2xl font-bold mb-1",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: stats.uncontactable
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 375,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] sm:text-xs font-medium",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: "Uncontactable"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 384,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 374,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 367,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 341,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 284,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/activity.tsx",
                                lineNumber: 280,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative p-0 flex flex-col overflow-hidden",
                                style: {
                                    backgroundColor: "transparent",
                                    border: "none"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3 h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                            style: {
                                                background: "linear-gradient(135deg, #f59e0b, #d97706)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    style: {
                                                        background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 410,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 418,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute -right-1 -bottom-1 opacity-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-time-forward text-3xl text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 420,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 419,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 opacity-[0.08]",
                                                    style: {
                                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                        backgroundSize: "15px 15px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative flex flex-col justify-between h-full z-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-end mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-time-forward text-base sm:text-lg",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 432,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 431,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs sm:text-sm font-bold mb-1",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: stats.idleFrom
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 438,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] sm:text-xs font-medium",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: "Idle From"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 447,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 437,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 430,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 404,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative overflow-hidden rounded-xl p-3 transition-shadow duration-200 hover:shadow-md",
                                            style: {
                                                background: "linear-gradient(135deg, #3b82f6, #2563eb)"
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0",
                                                    style: {
                                                        background: "radial-gradient(circle at top left, rgba(255,255,255,0.15), transparent 50%)"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 466,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 473,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-2 left-2 w-16 h-16 rounded-full bg-white/8 blur-lg"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 474,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute -right-1 -bottom-1 opacity-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-phone-pause text-3xl text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 476,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 opacity-[0.08]",
                                                    style: {
                                                        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)",
                                                        backgroundSize: "15px 15px"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 478,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative flex flex-col justify-between h-full z-10",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-end mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-pause text-base sm:text-lg",
                                                                style: {
                                                                    color: "#ffffff"
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 488,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 487,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs sm:text-sm font-bold mb-1",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: stats.lastCallTime !== "N/A" ? `${formatDisplayDate(selectedDate)} / ${stats.lastCallTime}` : "N/A"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 494,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] sm:text-xs font-medium",
                                                                    style: {
                                                                        color: "#ffffff",
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: "Last Call At"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 503,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 493,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 486,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 460,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 403,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/activity.tsx",
                                lineNumber: 399,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/activity.tsx",
                        lineNumber: 131,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mt-8",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-xl border border-gray-200 p-4 sm:p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-4 sm:hidden",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                    className: "text-lg font-bold",
                                                    style: {
                                                        color: "#263238",
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Activity Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 523,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowDatePicker(!showDatePicker),
                                                            className: "px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 hover:border-purple-400 transition-colors flex items-center gap-2",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-calendar text-xs",
                                                                    style: {
                                                                        color: "#4b33e8"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 538,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    children: formatDisplayDate(selectedDate)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 539,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 533,
                                                            columnNumber: 25
                                                        }, this),
                                                        showDatePicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-72",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between mb-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: handlePrevMonth,
                                                                            className: "p-1 hover:bg-gray-100 rounded-full transition-colors",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-angle-left text-sm",
                                                                                style: {
                                                                                    color: "#263238"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 548,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 544,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-semibold",
                                                                            style: {
                                                                                color: "#263238",
                                                                                fontFamily: "'Poppins', sans-serif"
                                                                            },
                                                                            children: formatMonthYear(currentMonth)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 550,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: handleNextMonth,
                                                                            className: "p-1 hover:bg-gray-100 rounded-full transition-colors",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-angle-right text-sm",
                                                                                style: {
                                                                                    color: "#263238"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 557,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 553,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 543,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-7 gap-1 mb-2",
                                                                    children: [
                                                                        'Su',
                                                                        'Mo',
                                                                        'Tu',
                                                                        'We',
                                                                        'Th',
                                                                        'Fr',
                                                                        'Sa'
                                                                    ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "text-center text-xs font-medium py-2",
                                                                            style: {
                                                                                color: "#787E9D",
                                                                                fontFamily: "'Roboto', sans-serif"
                                                                            },
                                                                            children: day
                                                                        }, day, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 562,
                                                                            columnNumber: 33
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 560,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-7 gap-1",
                                                                    children: calendarDays.map((day, index)=>{
                                                                        const isSelected = isSameDay(day.date, selectedDate);
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleDateSelect(day.date),
                                                                            className: `text-xs py-2 rounded-lg transition-all ${isSelected ? 'text-white font-semibold' : day.isCurrentMonth ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400'}`,
                                                                            style: {
                                                                                backgroundColor: isSelected ? '#4b33e8' : 'transparent',
                                                                                fontFamily: "'Roboto', sans-serif"
                                                                            },
                                                                            children: day.date.getDate()
                                                                        }, index, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 571,
                                                                            columnNumber: 35
                                                                        }, this);
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 567,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 542,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 532,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 522,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xs mb-3",
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Detailed view of all employee activities"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 596,
                                            columnNumber: 22
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex bg-gray-100 p-1 rounded-lg mb-4 w-full sm:w-auto self-start",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSource('crm'),
                                                    className: `flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${source === 'crm' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "CRM Activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 608,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSource('mobile'),
                                                    className: `flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${source === 'mobile' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Mobile History"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 619,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 607,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mb-3 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative flex-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex  fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 634,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "Search activities...",
                                                            value: searchQuery,
                                                            onChange: (e)=>setSearchQuery(e.target.value),
                                                            className: "w-full pl-9 h-9 pr-4 py-2 text-xs border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 635,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 633,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowFilterModal(!showFilterModal),
                                                            className: `h-9 w-9 border rounded-lg transition-all flex items-center justify-center ${showFilterModal ? 'bg-[#4b33e8] border-[#4b33e8] text-white shadow-lg' : 'bg-white border-gray-300 text-gray-600 hover:border-[#4b33e8] hover:text-[#4b33e8]'}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-filter text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 650,
                                                                columnNumber: 28
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 646,
                                                            columnNumber: 25
                                                        }, this),
                                                        showFilterModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "mb-3 flex items-center justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                            className: "text-xs font-black uppercase tracking-widest text-gray-400",
                                                                            children: "Filters"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 656,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: resetFilters,
                                                                            className: "text-[10px] font-black text-indigo-600 uppercase",
                                                                            children: "Reset"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 657,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 655,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Organization"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 662,
                                                                                    columnNumber: 36
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: orgFilter,
                                                                                    onChange: (e)=>setOrgFilter(e.target.value),
                                                                                    className: "w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            children: "All Organizations"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 668,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        filterOptions.organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                                value: org.id,
                                                                                                children: org.name
                                                                                            }, org.id, false, {
                                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                                lineNumber: 670,
                                                                                                columnNumber: 41
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 663,
                                                                                    columnNumber: 36
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 661,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Select Agent"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 676,
                                                                                    columnNumber: 36
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: agentFilter,
                                                                                    onChange: (e)=>setAgentFilter(e.target.value),
                                                                                    className: "w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            children: "All Agents"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 682,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        filterOptions.agents.map((agent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                                value: agent.id,
                                                                                                children: [
                                                                                                    agent.name,
                                                                                                    " (",
                                                                                                    agent.id,
                                                                                                    ")"
                                                                                                ]
                                                                                            }, agent.id, true, {
                                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                                lineNumber: 684,
                                                                                                columnNumber: 41
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 677,
                                                                                    columnNumber: 36
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 675,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Campaign"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 690,
                                                                                    columnNumber: 36
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: campaignFilter,
                                                                                    onChange: (e)=>setCampaignFilter(e.target.value),
                                                                                    className: "w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            children: "All Campaigns"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 696,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        filterOptions.campaigns.map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                                value: camp,
                                                                                                children: camp
                                                                                            }, camp, false, {
                                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                                lineNumber: 698,
                                                                                                columnNumber: 41
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 691,
                                                                                    columnNumber: 36
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 689,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Disposition"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 704,
                                                                                    columnNumber: 36
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: dispositionFilter,
                                                                                    onChange: (e)=>setDispositionFilter(e.target.value),
                                                                                    className: "w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            children: "All Dispositions"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 710,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        filterOptions.dispositions.map((disp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                                value: disp,
                                                                                                children: disp
                                                                                            }, disp, false, {
                                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                                lineNumber: 712,
                                                                                                columnNumber: 41
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 705,
                                                                                    columnNumber: 36
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 703,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        source === 'mobile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Call Type"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 719,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: callTypeFilter,
                                                                                    onChange: (e)=>setCallTypeFilter(e.target.value),
                                                                                    className: "w-full h-10 px-3 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: "All Types",
                                                                                            children: "All Types"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 725,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: "Outgoing",
                                                                                            children: "Outgoing"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 726,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: "Incoming",
                                                                                            children: "Incoming"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 727,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: "Missed",
                                                                                            children: "Missed / Reject"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 728,
                                                                                            columnNumber: 42
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 720,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 718,
                                                                            columnNumber: 36
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 660,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 654,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 645,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 632,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 521,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "hidden sm:flex sm:items-center sm:justify-between mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-bold mb-1",
                                                    style: {
                                                        color: "#263238",
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Activity Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 742,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-sm",
                                                    style: {
                                                        color: "#787E9D",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: "Detailed view of all employee activities"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 751,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 741,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex bg-gray-100 p-1 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSource('crm'),
                                                    className: `px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${source === 'crm' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "CRM Activity"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 764,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSource('mobile'),
                                                    className: `px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${source === 'mobile' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Mobile History"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 775,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 763,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative w-64",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 790,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "Search activities...",
                                                            value: searchQuery,
                                                            onChange: (e)=>setSearchQuery(e.target.value),
                                                            className: "w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 791,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 789,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowFilterModal(!showFilterModal),
                                                            className: `h-10 w-10 border rounded-xl transition-all flex items-center justify-center ${showFilterModal ? 'bg-[#4b33e8] border-[#4b33e8] text-white shadow-lg' : 'bg-white border-gray-300 text-gray-600 hover:border-[#4b33e8] hover:text-[#4b33e8]'}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-filter text-base"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 806,
                                                                columnNumber: 28
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 802,
                                                            columnNumber: 25
                                                        }, this),
                                                        showFilterModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-0 top-full mt-2 w-72 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 p-5 animate-in fade-in slide-in-from-top-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "mb-4 flex items-center justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                            className: "text-xs font-black uppercase tracking-widest text-gray-400",
                                                                            children: "Advanced Filters"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 812,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: resetFilters,
                                                                            className: "text-[10px] font-black text-indigo-600 hover:underline uppercase",
                                                                            children: "Reset All"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 813,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 811,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Organization Name"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 818,
                                                                                    columnNumber: 36
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: orgFilter,
                                                                                    onChange: (e)=>setOrgFilter(e.target.value),
                                                                                    className: "w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            children: "All Organizations"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 824,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        filterOptions.organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                                value: org.id,
                                                                                                children: org.name
                                                                                            }, org.id, false, {
                                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                                lineNumber: 826,
                                                                                                columnNumber: 41
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 819,
                                                                                    columnNumber: 36
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 817,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Select Agent Name / ID"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 832,
                                                                                    columnNumber: 36
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: agentFilter,
                                                                                    onChange: (e)=>setAgentFilter(e.target.value),
                                                                                    className: "w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            children: "All Agents"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 838,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        filterOptions.agents.map((agent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                                value: agent.id,
                                                                                                children: [
                                                                                                    agent.name,
                                                                                                    " (",
                                                                                                    agent.id,
                                                                                                    ")"
                                                                                                ]
                                                                                            }, agent.id, true, {
                                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                                lineNumber: 840,
                                                                                                columnNumber: 41
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 833,
                                                                                    columnNumber: 36
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 831,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Campaign Filter"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 846,
                                                                                    columnNumber: 36
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: campaignFilter,
                                                                                    onChange: (e)=>setCampaignFilter(e.target.value),
                                                                                    className: "w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            children: "All Campaigns"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 852,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        filterOptions.campaigns.map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                                value: camp,
                                                                                                children: camp
                                                                                            }, camp, false, {
                                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                                lineNumber: 854,
                                                                                                columnNumber: 41
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 847,
                                                                                    columnNumber: 36
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 845,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Disposition Filter"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 860,
                                                                                    columnNumber: 36
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: dispositionFilter,
                                                                                    onChange: (e)=>setDispositionFilter(e.target.value),
                                                                                    className: "w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            children: "All Dispositions"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 866,
                                                                                            columnNumber: 39
                                                                                        }, this),
                                                                                        filterOptions.dispositions.map((disp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                                value: disp,
                                                                                                children: disp
                                                                                            }, disp, false, {
                                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                                lineNumber: 868,
                                                                                                columnNumber: 41
                                                                                            }, this))
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 861,
                                                                                    columnNumber: 36
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 859,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        source === 'mobile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "text-[10px] font-bold text-gray-500 mb-1 block uppercase",
                                                                                    children: "Call Type Filter"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 875,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                    value: callTypeFilter,
                                                                                    onChange: (e)=>setCallTypeFilter(e.target.value),
                                                                                    className: "w-full h-11 px-4 bg-gray-50 border-none rounded-xl text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer font-sans",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: "All Types",
                                                                                            children: "All Types"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 881,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: "Outgoing",
                                                                                            children: "Outgoing"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 882,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: "Incoming",
                                                                                            children: "Incoming"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 883,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: "Missed",
                                                                                            children: "Missed / Reject"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                                            lineNumber: 884,
                                                                                            columnNumber: 42
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                                    lineNumber: 876,
                                                                                    columnNumber: 39
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 874,
                                                                            columnNumber: 36
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 816,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 810,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 801,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowDatePicker(!showDatePicker),
                                                            className: "pl-5 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-700 hover:border-purple-400 transition-colors flex items-center gap-2 w-38",
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-calendar absolute top-1/2 transform -translate-y-1/2 text-sm",
                                                                    style: {
                                                                        color: "#4b33e8"
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 898,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "ml-6",
                                                                    children: formatDisplayDate(selectedDate)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 899,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 893,
                                                            columnNumber: 25
                                                        }, this),
                                                        showDatePicker && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50 w-80",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center justify-between mb-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: handlePrevMonth,
                                                                            className: "p-1.5 hover:bg-gray-100 rounded-full transition-colors",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-angle-left text-base",
                                                                                style: {
                                                                                    color: "#263238"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 908,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 904,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-semibold",
                                                                            style: {
                                                                                color: "#263238",
                                                                                fontFamily: "'Poppins', sans-serif"
                                                                            },
                                                                            children: formatMonthYear(currentMonth)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 910,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: handleNextMonth,
                                                                            className: "p-1.5 hover:bg-gray-100 rounded-full transition-colors",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-angle-right text-base",
                                                                                style: {
                                                                                    color: "#263238"
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 917,
                                                                                columnNumber: 33
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 913,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 903,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-7 gap-1 mb-2",
                                                                    children: [
                                                                        'Su',
                                                                        'Mo',
                                                                        'Tu',
                                                                        'We',
                                                                        'Th',
                                                                        'Fr',
                                                                        'Sa'
                                                                    ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "text-center text-xs font-medium py-2",
                                                                            style: {
                                                                                color: "#787E9D",
                                                                                fontFamily: "'Roboto', sans-serif"
                                                                            },
                                                                            children: day
                                                                        }, day, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 922,
                                                                            columnNumber: 33
                                                                        }, this))
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 920,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "grid grid-cols-7 gap-1",
                                                                    children: calendarDays.map((day, index)=>{
                                                                        const isSelected = isSameDay(day.date, selectedDate);
                                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleDateSelect(day.date),
                                                                            className: `text-sm py-2.5 rounded-lg transition-all ${isSelected ? 'text-white font-semibold' : day.isCurrentMonth ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-400'}`,
                                                                            style: {
                                                                                backgroundColor: isSelected ? '#4b33e8' : 'transparent',
                                                                                fontFamily: "'Roboto', sans-serif"
                                                                            },
                                                                            children: day.date.getDate()
                                                                        }, index, false, {
                                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                                            lineNumber: 931,
                                                                            columnNumber: 35
                                                                        }, this);
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 927,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 902,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 892,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/activity.tsx",
                                            lineNumber: 788,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 740,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                        className: "w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                className: "bg-[#e4ebf5] sticky top-0 z-10 text-[10px] md:text-xs",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: source === 'mobile' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider",
                                                                children: "Emp. ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 963,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider",
                                                                children: "Emp. Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 964,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider",
                                                                children: "Time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 965,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider",
                                                                children: "Type"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 966,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider",
                                                                children: "Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 967,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider",
                                                                children: "Number"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 968,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider",
                                                                children: "Duration"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 969,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-4 py-3 text-left font-semibold text-gray-600 uppercase tracking-wider",
                                                                children: "Device"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 970,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]",
                                                                children: "Emp. ID"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 974,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[180px]",
                                                                children: "Emp Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 975,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[180px]",
                                                                children: "Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 976,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]",
                                                                children: "Callback"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 977,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[180px]",
                                                                children: "Disposition"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 978,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]",
                                                                children: "Campaign"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 979,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] md:min-w-[150px]",
                                                                children: "Last Call"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 980,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]",
                                                                children: "Talk Time"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 981,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] md:min-w-[120px]",
                                                                children: "Dialed"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 982,
                                                                columnNumber: 33
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                className: "px-2 md:px-6 py-3 md:py-4 text-left font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] md:min-w-[200px]",
                                                                children: "Remark"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 983,
                                                                columnNumber: 33
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 960,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 959,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                className: "bg-white divide-y divide-gray-100",
                                                children: filteredActivities.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        colSpan: source === 'mobile' ? 8 : 10,
                                                        className: "px-6 py-20 text-center opacity-40",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-search-heart text-5xl mb-3 text-gray-300 justify-center"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 992,
                                                                columnNumber: 32
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-bold uppercase tracking-widest text-gray-400",
                                                                children: "No activities found"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                lineNumber: 993,
                                                                columnNumber: 32
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                        lineNumber: 991,
                                                        columnNumber: 30
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                    lineNumber: 990,
                                                    columnNumber: 28
                                                }, this) : filteredActivities.map((activity, index)=>{
                                                    if (source === 'mobile') {
                                                        // Mobile History Row
                                                        const callDate = new Date(activity.timestamp);
                                                        const type = (activity.call_type || 'unknown').toLowerCase();
                                                        let iconClass = "fi-rr-question";
                                                        let iconColor = "text-gray-400";
                                                        if (type.includes('outgoing')) {
                                                            iconClass = "fi-rr-arrow-up-right";
                                                            iconColor = "text-blue-500";
                                                        } else if (type.includes('incoming')) {
                                                            iconClass = "fi-rr-arrow-down-left";
                                                            iconColor = "text-green-500";
                                                        } else if (type.includes('missed')) {
                                                            iconClass = "fi-rr-cross-circle";
                                                            iconColor = "text-red-500";
                                                        } else if (type.includes('reject')) {
                                                            iconClass = "fi-rr-ban";
                                                            iconColor = "text-red-500";
                                                        }
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            className: "hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-blue-600 font-bold",
                                                                    children: activity.employee_id || "N/A"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1015,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-800 font-semibold",
                                                                    children: activity.user_name || "Unknown"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1018,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-600",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "font-medium text-gray-800",
                                                                                children: callDate.toLocaleTimeString([], {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit'
                                                                                })
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1023,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-gray-400",
                                                                                children: [
                                                                                    callDate.getDate(),
                                                                                    "/",
                                                                                    callDate.getMonth() + 1
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1024,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 1022,
                                                                        columnNumber: 42
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1021,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: `fi flex ${iconClass} ${iconColor} text-sm`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1029,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-xs uppercase font-semibold text-gray-600",
                                                                                children: type
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1030,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 1028,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1027,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-800 font-medium",
                                                                    children: activity.name || "Unknown"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1033,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-blue-600 font-mono",
                                                                    children: activity.number || "—"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1036,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-600",
                                                                    children: formatSeconds(activity.duration || 0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1039,
                                                                    columnNumber: 39
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-4 py-3 whitespace-nowrap text-xs text-gray-500",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-1",
                                                                        title: activity.device_id,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-smartphone text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1044,
                                                                                columnNumber: 45
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "max-w-[100px] truncate",
                                                                                children: activity.device_id || "Unknown"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1045,
                                                                                columnNumber: 45
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 1043,
                                                                        columnNumber: 41
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1042,
                                                                    columnNumber: 39
                                                                }, this)
                                                            ]
                                                        }, activity.id || index, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 1011,
                                                            columnNumber: 37
                                                        }, this);
                                                    } else {
                                                        // Default CRM Row
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            className: "hover:bg-gray-50 transition-colors",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs font-medium text-gray-900",
                                                                    children: activity.agent?.employee_id || "N/A"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1054,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs font-semibold text-gray-800",
                                                                    children: activity.agent?.user_name || "Unknown Agent"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1057,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-gray-700 font-medium",
                                                                    children: activity.customer?.customer_name || activity.rejected_customer?.customer_name || "Unknown Customer"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1060,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-gray-600",
                                                                    children: activity.next_called_at ? formatDisplayDate(activity.next_called_at) : "No Followup"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1063,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs font-bold text-slate-700",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-indigo-600 font-black tracking-tight",
                                                                                children: activity.disposition || "N/A"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1068,
                                                                                columnNumber: 40
                                                                            }, this),
                                                                            activity.sub_disposition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-gray-400 font-medium lowercase italic leading-none",
                                                                                children: activity.sub_disposition
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1070,
                                                                                columnNumber: 42
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 1067,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1066,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-indigo-600 font-bold uppercase tracking-tighter",
                                                                    children: activity.campaign?.name || "General"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1074,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-gray-600",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-gray-900 font-medium",
                                                                                children: formatTime(activity.created_at)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1079,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                className: "text-[10px] text-gray-400",
                                                                                children: formatDisplayDate(activity.created_at)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/activity.tsx",
                                                                                lineNumber: 1080,
                                                                                columnNumber: 39
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 1078,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1077,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs font-mono font-bold text-gray-600",
                                                                    children: activity.duration ? formatSeconds(activity.duration) : "00:00:00"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1083,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: `px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${activity.is_connected === 'contactable' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`,
                                                                        children: activity.is_connected || "N/A"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/activity.tsx",
                                                                        lineNumber: 1087,
                                                                        columnNumber: 37
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1086,
                                                                    columnNumber: 35
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                    className: "px-2 md:px-6 py-3 md:py-4 text-xs text-gray-500 italic max-w-xs truncate",
                                                                    title: activity.notes,
                                                                    children: activity.notes || "No remark provided"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/activity.tsx",
                                                                    lineNumber: 1091,
                                                                    columnNumber: 35
                                                                }, this)
                                                            ]
                                                        }, activity.id, true, {
                                                            fileName: "[project]/pages/portal/activity.tsx",
                                                            lineNumber: 1053,
                                                            columnNumber: 33
                                                        }, this);
                                                    }
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/activity.tsx",
                                                lineNumber: 988,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/activity.tsx",
                                        lineNumber: 958,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/activity.tsx",
                                    lineNumber: 957,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/activity.tsx",
                            lineNumber: 520,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/activity.tsx",
                        lineNumber: 519,
                        columnNumber: 15
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/activity.tsx",
                lineNumber: 107,
                columnNumber: 13
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/activity.tsx",
            lineNumber: 106,
            columnNumber: 11
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

//# sourceMappingURL=%5Broot-of-the-server%5D__fa122bd2._.js.map