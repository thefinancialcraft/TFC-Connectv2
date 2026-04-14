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
"[project]/hooks/useFollowUpLeads.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useFollowUpLeads",
    ()=>useFollowUpLeads
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function useFollowUpLeads() {
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [leads, setLeads] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        organizationId: "",
        assignedTo: "",
        status: "",
        campaignId: "",
        callbackDate: "" // yyyy-mm-dd
    });
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const fetchLeads = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (isBackground = false)=>{
        if (!mounted || !user) return;
        // Abort previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        try {
            if (!isBackground) setLoading(true);
            setError("");
            const now = new Date();
            // Fetch customers first (Joins disabled due to missing FKs on campaign_id/assigned_to)
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*').in('disposition', [
                'Callback',
                'Call Back',
                'Follow Up',
                'FollowUp'
            ]).order('next_called_at', {
                ascending: true
            }).abortSignal(abortControllerRef.current.signal);
            // Apply Security Levels
            if (user.isClient) {
                // Level 1: Client Agent (Own leads only)
                if (user.designation === 'agent' || !user.designation) {
                    if (user.uid) {
                        query = query.eq('assigned_to', user.uid);
                    }
                } else if (user.designation === 'team_leader') {
                    let teamMemberIds = [
                        user.uid
                    ];
                    if (user.uid) {
                        const { data: teamData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
                        if (teamData) {
                            teamData.forEach((team)=>{
                                // Parse members JSONB consistent with other pages
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
                        query = query.in('assigned_to', teamMemberIds);
                    } else {
                        query = query.eq('assigned_to', user.uid);
                    }
                } else if ([
                    'ceo',
                    'developer',
                    'admin'
                ].includes(user.designation || '')) {
                    if (user.organization_id) {
                        query = query.eq('organization_id', user.organization_id);
                    } else {
                        // Fail secure
                        query = query.eq('id', '00000000-0000-0000-0000-000000000000');
                    }
                }
            }
            // Level 4: Internal Staff (!isClient) gets explicit Global Access (no filters applied)
            const { data: customerData, error: customerError } = await query;
            if (customerError) {
                if (customerError.name === 'AbortError') return;
                throw customerError;
            }
            if (customerData) {
                // Parallel fetch related data (Manual Join Pattern)
                const campaignIds = [
                    ...new Set(customerData.map((c)=>c.campaign_id).filter(Boolean))
                ];
                const orgIds = [
                    ...new Set(customerData.map((c)=>c.organization_id).filter(Boolean))
                ];
                const userIds = [
                    ...new Set(customerData.map((c)=>c.assigned_to).filter(Boolean))
                ];
                const [campaignsResult, orgsResult, usersResult] = await Promise.all([
                    campaignIds.length > 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('id, name').in('id', campaignIds).abortSignal(abortControllerRef.current.signal) : Promise.resolve({
                        data: []
                    }),
                    orgIds.length > 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').select('id, company_name').in('id', orgIds).abortSignal(abortControllerRef.current.signal) : Promise.resolve({
                        data: []
                    }),
                    userIds.length > 0 ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, user_name, employee_id').in('user_id', userIds).abortSignal(abortControllerRef.current.signal) : Promise.resolve({
                        data: []
                    })
                ]);
                // Create Lookup Maps
                const campaignMap = Object.fromEntries(campaignsResult.data?.map((c)=>[
                        c.id,
                        c.name
                    ]) || []);
                const orgMap = Object.fromEntries(orgsResult.data?.map((o)=>[
                        o.id,
                        o.company_name
                    ]) || []);
                const userMap = Object.fromEntries(usersResult.data?.map((u)=>[
                        u.user_id,
                        {
                            name: u.user_name,
                            employee_id: u.employee_id
                        }
                    ]) || []);
                const enrichedLeads = customerData.map((lead)=>{
                    let isOverdue = false;
                    let isUpcoming = false;
                    if (lead.next_called_at) {
                        const nextCallDate = new Date(lead.next_called_at);
                        if (nextCallDate < now) {
                            isOverdue = true;
                        } else {
                            isUpcoming = true;
                        }
                    } else {
                        isOverdue = true;
                    }
                    const userInfo = userMap[lead.assigned_to] || {
                        name: 'Unassigned',
                        employee_id: ''
                    };
                    return {
                        ...lead,
                        phone_no: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(lead.phone_no),
                        isOverdue,
                        isUpcoming,
                        campaign_name: campaignMap[lead.campaign_id] || 'Unknown Campaign',
                        organization_name: orgMap[lead.organization_id] || '—',
                        assigned_name: userInfo.name,
                        employee_id: userInfo.employee_id,
                        status_label: isOverdue ? 'Overdue' : 'Upcoming'
                    };
                });
                setLeads(enrichedLeads);
            } else {
                setLeads([]);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Error fetching follow-up leads:", err);
                setError("Failed to load follow-up schedule");
            }
        } finally{
            if (!isBackground) setLoading(false);
        }
    }, [
        user,
        mounted
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let interval;
        if (mounted && user) {
            if (leads.length === 0) {
                fetchLeads();
            }
            interval = setInterval(()=>{
                fetchLeads(true);
            }, 60000);
        }
        return ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (interval) clearInterval(interval);
        };
    }, [
        fetchLeads,
        mounted,
        user
    ]);
    const filteredLeads = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        let result = leads;
        // Search query filter
        const query = searchQuery.toLowerCase();
        if (query) {
            result = result.filter((lead)=>lead.customer_name?.toLowerCase().includes(query) || lead.phone_no?.includes(query) || lead.disposition?.toLowerCase().includes(query) || lead.campaign_name?.toLowerCase().includes(query) || lead.organization_name?.toLowerCase().includes(query) || lead.assigned_name?.toLowerCase().includes(query) || lead.employee_id?.toLowerCase().includes(query));
        }
        // Structured filters
        if (filters.organizationId) {
            result = result.filter((lead)=>lead.organization_id === filters.organizationId);
        }
        if (filters.assignedTo) {
            result = result.filter((lead)=>lead.assigned_to === filters.assignedTo);
        }
        if (filters.status) {
            if (filters.status === 'overdue') {
                result = result.filter((lead)=>lead.isOverdue);
            } else if (filters.status === 'upcoming') {
                result = result.filter((lead)=>lead.isUpcoming);
            }
        }
        if (filters.campaignId) {
            result = result.filter((lead)=>lead.campaign_id === filters.campaignId);
        }
        if (filters.callbackDate) {
            result = result.filter((lead)=>{
                if (!lead.next_called_at) return false;
                const date = new Date(lead.next_called_at).toISOString().split('T')[0];
                return date === filters.callbackDate;
            });
        }
        return result;
    }, [
        leads,
        searchQuery,
        filters
    ]);
    const stats = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return filteredLeads.reduce((acc, lead)=>{
            acc.total++;
            if (lead.isOverdue) acc.overdue++;
            if (lead.isUpcoming) acc.upcoming++;
            return acc;
        }, {
            total: 0,
            overdue: 0,
            upcoming: 0
        });
    }, [
        filteredLeads
    ]);
    const formatDate = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((dateStr)=>{
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '—';
            return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return '—';
        }
    }, []);
    return {
        leads,
        filteredLeads,
        loading,
        error,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        stats,
        fetchLeads,
        formatDate
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/portal/followup.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>FollowUp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/SessionContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFollowUpLeads$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useFollowUpLeads.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFollowUpLeads$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFollowUpLeads$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
function FollowUp() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const { allSessions, startManualLock } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const { loading, error, leads, filteredLeads, searchQuery, setSearchQuery, filters, setFilters, stats, fetchLeads, formatDate } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useFollowUpLeads$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useFollowUpLeads"])();
    const [showFilterModal, setShowFilterModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [viewMode, setViewMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('table');
    const [currentMonth, setCurrentMonth] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date());
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [selectedHour, setSelectedHour] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [pipelines, setPipelines] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showConfig, setShowConfig] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editingPipelineId, setEditingPipelineId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [showMenuId, setShowMenuId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [newPipeline, setNewPipeline] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: '',
        dispositions: [],
        sub_dispositions: [],
        outcomes: []
    });
    const [userOutcomes, setUserOutcomes] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // Fetch user outcomes when config opens
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (showConfig && user?.uid) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_outcomes').select('*').eq('user_id', user.uid).then(({ data })=>setUserOutcomes(data || []));
        }
    }, [
        showConfig,
        user?.uid
    ]);
    const toggleSelection = (list, item)=>{
        return list.includes(item) ? list.filter((i)=>i !== item) : [
            ...list,
            item
        ];
    };
    const dispositionHierarchy = {
        "Not Intrested": [],
        "Language barrier": [],
        "DND": [],
        "Wrong NO": [],
        "Ported / Expired": [],
        "Not Contactable": [
            "busy",
            "Switch off",
            "Ring",
            "not reacable",
            "others"
        ],
        "Call Back": [
            "Interested",
            "Follow up",
            "Not Connected"
        ],
        "Deal Done": []
    };
    const addPipeline = ()=>{
        if (!newPipeline.name) return;
        if (editingPipelineId) {
            // Update existing
            setPipelines(pipelines.map((p)=>p.id === editingPipelineId ? {
                    ...p,
                    name: newPipeline.name,
                    filters: {
                        dispositions: newPipeline.dispositions,
                        sub_dispositions: newPipeline.sub_dispositions,
                        outcomes: newPipeline.outcomes
                    }
                } : p));
            setEditingPipelineId(null);
        } else {
            // Add new
            const id = Date.now().toString();
            setPipelines([
                ...pipelines,
                {
                    id,
                    name: newPipeline.name,
                    filters: {
                        dispositions: newPipeline.dispositions,
                        sub_dispositions: newPipeline.sub_dispositions,
                        outcomes: newPipeline.outcomes
                    }
                }
            ]);
        }
        setNewPipeline({
            name: '',
            dispositions: [],
            sub_dispositions: [],
            outcomes: []
        });
        setShowConfig(false);
    };
    const removePipeline = (id)=>{
        setPipelines(pipelines.filter((p)=>p.id !== id));
        setShowMenuId(null);
    };
    const startEdit = (p)=>{
        setNewPipeline({
            name: p.name,
            dispositions: p.filters.dispositions,
            sub_dispositions: p.filters.sub_dispositions,
            outcomes: p.filters.outcomes || []
        });
        setEditingPipelineId(p.id);
        setShowConfig(true);
        setShowMenuId(null);
    };
    // --- PERSISTENCE LOGIC ---
    // 1. Fetch settings on mount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!user?.uid) return;
        const fetchSettings = async ()=>{
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_kanban_settings').select('*').eq('user_id', user.uid).single();
            if (data) {
                if (data.view_mode) setViewMode(data.view_mode);
                if (data.pipelines) setPipelines(data.pipelines);
            } else if (error && error.code === 'PGRST116') {
                // No settings found, create initial
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_kanban_settings').insert({
                    user_id: user.uid,
                    view_mode: 'table',
                    pipelines: [
                        {
                            id: '1',
                            name: 'Interested',
                            filters: {
                                dispositions: [
                                    'Call Back'
                                ],
                                sub_dispositions: [
                                    'intrested'
                                ],
                                outcomes: []
                            }
                        },
                        {
                            id: '2',
                            name: 'Follow Up',
                            filters: {
                                dispositions: [
                                    'Call Back'
                                ],
                                sub_dispositions: [
                                    'follow up'
                                ],
                                outcomes: []
                            }
                        }
                    ]
                });
            }
        };
        fetchSettings();
    }, [
        user?.uid
    ]);
    // 2. Save settings when viewMode or pipelines change
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!user?.uid) return;
        const saveSettings = async ()=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_kanban_settings').upsert({
                user_id: user.uid,
                view_mode: viewMode,
                pipelines: pipelines,
                updated_at: new Date().toISOString()
            });
        };
        // Use a small delay/debounce or just sync (since this is low frequency)
        const timeout = setTimeout(saveSettings, 1000);
        return ()=>clearTimeout(timeout);
    }, [
        viewMode,
        pipelines,
        user?.uid
    ]);
    // --- MANUAL NAVIGATION HANDLER ---
    const handleManualLeadOpen = (campaignId, customerId)=>{
        console.log("[Follow-up] Manual Lead Open triggered for:", customerId);
        // Create a mock session to lock the target lead for manual inspection
        if (user?.uid) {
            startManualLock({
                id: 'manual-' + Date.now(),
                user_id: user.uid,
                campaign_id: campaignId,
                customer_id: customerId,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            });
        }
        // Explicitly using the masked path to trigger rewrites correctly
        router.push(`/portal/campaign/${campaignId}/${customerId}`);
    };
    // Derive filter options from leads
    const filterOptions = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const orgs = new Map();
        const campaigns = new Map();
        const agents = new Map();
        leads.forEach((lead)=>{
            if (lead.organization_id) orgs.set(lead.organization_id, lead.organization_name);
            if (lead.campaign_id) campaigns.set(lead.campaign_id, lead.campaign_name);
            if (lead.assigned_to) agents.set(lead.assigned_to, {
                name: lead.assigned_name,
                empId: lead.employee_id
            });
        });
        return {
            organizations: Array.from(orgs.entries()).map(([id, name])=>({
                    id,
                    name
                })),
            campaigns: Array.from(campaigns.entries()).map(([id, name])=>({
                    id,
                    name
                })),
            agents: Array.from(agents.entries()).map(([id, info])=>({
                    id,
                    name: info.name,
                    empId: info.empId
                }))
        };
    }, [
        leads
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                            className: "text-xl sm:text-2xl md:text-3xl font-bold",
                            style: {
                                color: "#263238",
                                fontFamily: "'Poppins', sans-serif"
                            },
                            children: "Follow Up Scheduler"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 222,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-sm text-gray-500 mt-1",
                            style: {
                                fontFamily: "'Roboto', sans-serif"
                            },
                            children: "Manage upcoming calls and overdue tasks spanning all your campaigns."
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 225,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/followup.tsx",
                    lineNumber: 221,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md h-40",
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
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 237,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-indigo-100/30 blur-2xl"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 244,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-indigo-200/20 blur-xl"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 245,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-indigo-300/15 blur-lg"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 246,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute -right-2 -bottom-2 opacity-5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-calendar-clock text-5xl sm:text-6xl",
                                        style: {
                                            color: "#4b33e8"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 248,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 247,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 opacity-[0.03]",
                                    style: {
                                        backgroundImage: "radial-gradient(circle, #4b33e8 1px, transparent 1px)",
                                        backgroundSize: "20px 20px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 253,
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
                                                    children: "Total Follow Ups"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                    style: {
                                                        backgroundColor: "transparent"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-calendar-clock text-lg sm:text-xl",
                                                        style: {
                                                            color: "#4b33e8"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 262,
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
                                                    children: stats.total
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 285,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xs sm:text-sm mt-1",
                                                    style: {
                                                        color: "#787E9D",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: "Active Callbacks"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 294,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 284,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 261,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 233,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md h-40",
                            style: {
                                backgroundColor: "white"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0",
                                    style: {
                                        background: "radial-gradient(circle at top right, rgba(239, 68, 68, 0.08), transparent 60%)"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 312,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-red-100/30 blur-2xl"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 319,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-red-200/20 blur-xl"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 320,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-red-300/15 blur-lg"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 321,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute -right-2 -bottom-2 opacity-5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-time-past text-5xl sm:text-6xl",
                                        style: {
                                            color: "#ef4444"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 323,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 322,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 opacity-[0.03]",
                                    style: {
                                        backgroundImage: "radial-gradient(circle, #ef4444 1px, transparent 1px)",
                                        backgroundSize: "20px 20px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 328,
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
                                                    children: "Overdue"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 338,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                    style: {
                                                        backgroundColor: "transparent"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-time-past text-lg sm:text-xl",
                                                        style: {
                                                            color: "#ef4444"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 353,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 347,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 337,
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
                                                    children: stats.overdue
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 360,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xs sm:text-sm mt-1",
                                                    style: {
                                                        color: "#787E9D",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: "Action Required"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 359,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 336,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 308,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-shadow duration-200 flex flex-col hover:shadow-md h-40",
                            style: {
                                backgroundColor: "white"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0",
                                    style: {
                                        background: "radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 60%)"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 387,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-blue-100/30 blur-2xl"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 394,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-32 h-32 rounded-full bg-blue-200/20 blur-xl"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 395,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute top-8 right-8 w-16 h-16 rounded-full bg-blue-300/15 blur-lg"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 396,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute -right-2 -bottom-2 opacity-5",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-calendar-lines text-5xl sm:text-6xl",
                                        style: {
                                            color: "#3b82f6"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 398,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 397,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 opacity-[0.03]",
                                    style: {
                                        backgroundImage: "radial-gradient(circle, #3b82f6 1px, transparent 1px)",
                                        backgroundSize: "20px 20px"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 403,
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
                                                    children: "Upcoming"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl",
                                                    style: {
                                                        backgroundColor: "transparent"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-calendar-lines text-lg sm:text-xl",
                                                        style: {
                                                            color: "#3b82f6"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 428,
                                                        columnNumber: 25
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 422,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 412,
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
                                                    children: stats.upcoming
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 435,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xs sm:text-sm mt-1",
                                                    style: {
                                                        color: "#787E9D",
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    children: "Scheduled for Later"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 444,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 434,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 411,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 383,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/followup.tsx",
                    lineNumber: 231,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-4 sm:hidden",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "text-lg font-bold mb-1",
                                    style: {
                                        color: "rgb(38, 50, 56)",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: "Scheduled Leads"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 463,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xs",
                                    style: {
                                        color: "rgb(120, 126, 157)",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    children: "Manage upcoming and overdue calls"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 466,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 462,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-4 sm:hidden space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex-1 relative",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 475,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    placeholder: "Search leads...",
                                                    className: "w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                                                    type: "text",
                                                    style: {
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    value: searchQuery,
                                                    onChange: (e)=>setSearchQuery(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 476,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 474,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowFilterModal(true),
                                            className: `h-9 w-9 border border-gray-300 rounded-lg transition-colors flex items-center justify-center flex-shrink-0 ${Object.values(filters).some((v)=>v !== "") ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white text-gray-600'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-filter text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 489,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 485,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowConfig(!showConfig),
                                            className: `h-9 w-9 border border-gray-300 rounded-lg transition-colors flex items-center justify-center flex-shrink-0 ${showConfig ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white text-gray-600'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-settings-sliders text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 495,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 491,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>fetchLeads(),
                                            disabled: loading,
                                            className: "h-9 w-9 border border-gray-300 rounded-lg bg-white flex items-center justify-center flex-shrink-0",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: `fi flex fi-rr-refresh text-sm text-gray-600 ${loading ? 'animate-spin' : ''}`
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 502,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 497,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 473,
                                    columnNumber: 22
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex bg-gray-100 rounded-lg p-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('table'),
                                            className: `flex-1 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all flex flex-row items-center justify-center gap-1.5 whitespace-nowrap ${viewMode === 'table' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-apps-sort"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 511,
                                                    columnNumber: 29
                                                }, this),
                                                "Table"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 507,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('kanban'),
                                            className: `flex-1 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all flex flex-row items-center justify-center gap-1.5 whitespace-nowrap ${viewMode === 'kanban' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-layout-fluid flex"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 29
                                                }, this),
                                                "Kanban"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 514,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setViewMode('calendar'),
                                            className: `flex-1 py-1.5 rounded-md text-[10px] sm:text-xs font-bold transition-all flex flex-row items-center justify-center gap-1.5 whitespace-nowrap ${viewMode === 'calendar' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-calendar"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 525,
                                                    columnNumber: 29
                                                }, this),
                                                "Calendar"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 521,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 506,
                                    columnNumber: 22
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 472,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "hidden sm:flex sm:items-center sm:justify-between mb-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-bold mb-1",
                                            style: {
                                                color: "rgb(38, 50, 56)",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: "Scheduled Leads"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 534,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm",
                                            style: {
                                                color: "rgb(120, 126, 157)",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Manage upcoming and overdue calls"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 537,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 533,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex bg-gray-100 rounded-lg p-1 mr-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setViewMode('table'),
                                                    className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex flex-row items-center gap-2 ${viewMode === 'table' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-apps-sort mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 547,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Table"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 543,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setViewMode('kanban'),
                                                    className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex flex-row items-center gap-2 ${viewMode === 'kanban' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi fi-rr-layout-fluid flex mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 554,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Kanban"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setViewMode('calendar'),
                                                    className: `px-3 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex flex-row items-center gap-2 ${viewMode === 'calendar' ? 'bg-white text-[#4b33e8] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-calendar mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 561,
                                                            columnNumber: 33
                                                        }, this),
                                                        "Calendar"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 557,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 542,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative w-64",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 567,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    placeholder: "Search leads...",
                                                    className: "w-full pl-9 pr-4 py-2 text-sm border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all",
                                                    type: "text",
                                                    style: {
                                                        fontFamily: "'Roboto', sans-serif"
                                                    },
                                                    value: searchQuery,
                                                    onChange: (e)=>setSearchQuery(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 568,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 566,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowFilterModal(true),
                                            className: `h-10 px-3 border border-gray-300 rounded-lg transition-colors flex items-center justify-center ${Object.values(filters).some((v)=>v !== "") ? 'bg-purple-50 border-purple-200 text-purple-600' : 'bg-white hover:bg-gray-50 text-gray-600'}`,
                                            title: "Filter Leads",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-filter text-sm mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 582,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-xs font-bold",
                                                    children: "Filter"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 583,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 577,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowConfig(!showConfig),
                                            className: `h-10 px-3 border border-gray-300 rounded-lg transition-colors flex items-center justify-center ${showConfig ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white hover:bg-gray-50 text-gray-600'}`,
                                            title: "Kanban Settings",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-settings-sliders text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 591,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 586,
                                            columnNumber: 26
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>fetchLeads(),
                                            disabled: loading,
                                            className: `h-10 px-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`,
                                            title: "Refresh Data",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: `fi flex fi-rr-refresh text-sm text-gray-600 ${loading ? 'animate-spin' : ''}`
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 599,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 593,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 541,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 532,
                            columnNumber: 17
                        }, this),
                        showConfig && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl relative",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowConfig(false),
                                    className: "absolute top-4 right-4 text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-cross-small"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 608,
                                        columnNumber: 30
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 607,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-settings text-indigo-600"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 611,
                                            columnNumber: 29
                                        }, this),
                                        "Configure Kanban Pipelines"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 610,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-4 mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-full",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "block text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-1",
                                                    children: editingPipelineId ? 'Update Pipeline Name' : 'Pipeline Name'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 617,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    className: "w-full px-3 text-gray-800 py-2 text-sm border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500",
                                                    placeholder: "e.g. Interested & Language",
                                                    value: newPipeline.name,
                                                    onChange: (e)=>setNewPipeline({
                                                            ...newPipeline,
                                                            name: e.target.value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 620,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 616,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "p-3 bg-white border border-indigo-100 rounded-lg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "block text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-2",
                                                            children: "Dispositions (Multiple)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 630,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-1.5 max-h-32 overflow-y-auto",
                                                            children: Object.keys(dispositionHierarchy).map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setNewPipeline({
                                                                            ...newPipeline,
                                                                            dispositions: toggleSelection(newPipeline.dispositions, d)
                                                                        }),
                                                                    className: `px-2 py-1 rounded text-[10px] font-bold transition-all border ${newPipeline.dispositions.includes(d) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'}`,
                                                                    children: d
                                                                }, d, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 633,
                                                                    columnNumber: 45
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 631,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 629,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "p-3 bg-white border border-indigo-100 rounded-lg",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "block text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-2",
                                                            children: "Sub-Dispositions (Multiple)"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 645,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-1.5 max-h-32 overflow-y-auto",
                                                            children: Array.from(new Set(newPipeline.dispositions.flatMap((d)=>dispositionHierarchy[d] || []))).length > 0 ? Array.from(new Set(newPipeline.dispositions.flatMap((d)=>dispositionHierarchy[d] || []))).map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setNewPipeline({
                                                                            ...newPipeline,
                                                                            sub_dispositions: toggleSelection(newPipeline.sub_dispositions, s)
                                                                        }),
                                                                    className: `px-2 py-1 rounded text-[10px] font-bold transition-all border ${newPipeline.sub_dispositions.includes(s) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'}`,
                                                                    children: s
                                                                }, s, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 650,
                                                                    columnNumber: 49
                                                                }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-400 italic",
                                                                children: "Select disposition first"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 659,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 646,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 644,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 628,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "p-3 bg-white border border-indigo-100 rounded-lg",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "block text-[10px] font-bold text-indigo-900 uppercase tracking-wider mb-2",
                                                    children: "Outcomes (Multiple)"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 666,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-wrap gap-1.5 max-h-32 overflow-y-auto custom-scrollbar",
                                                    children: [
                                                        newPipeline.sub_dispositions.length > 0 ? userOutcomes && userOutcomes.length > 0 ? userOutcomes.filter((out)=>newPipeline.sub_dispositions.includes(out.parent_category)).map((out)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setNewPipeline({
                                                                        ...newPipeline,
                                                                        outcomes: toggleSelection(newPipeline.outcomes || [], out.outcome_label)
                                                                    }),
                                                                className: `px-2 py-1 rounded text-[10px] font-bold transition-all border ${newPipeline.outcomes?.includes(out.outcome_label) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100'}`,
                                                                children: [
                                                                    out.outcome_label,
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "opacity-60 text-[9px] lowercase",
                                                                        children: [
                                                                            "(",
                                                                            out.parent_category,
                                                                            ")"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 678,
                                                                        columnNumber: 73
                                                                    }, this)
                                                                ]
                                                            }, out.id, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 673,
                                                                columnNumber: 49
                                                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-400 italic",
                                                            children: "No custom outcomes found. Add them from the calling page."
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 682,
                                                            columnNumber: 45
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-400 italic",
                                                            children: "Select sub-disposition first to view outcomes"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 685,
                                                            columnNumber: 41
                                                        }, this),
                                                        newPipeline.sub_dispositions.length > 0 && userOutcomes.filter((out)=>newPipeline.sub_dispositions.includes(out.parent_category)).length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-400 italic w-full",
                                                            children: "No outcomes found for selected sub-dispositions."
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 689,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 667,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 665,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex justify-end",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: addPipeline,
                                                    className: "h-10 px-6 bg-indigo-600 text-white rounded-lg text-[11px] font-bold hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: editingPipelineId ? "fi fi-rr-check" : "fi fi-rr-plus"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 699,
                                                            columnNumber: 37
                                                        }, this),
                                                        editingPipelineId ? 'Update Pipeline' : 'Create Pipeline'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 695,
                                                    columnNumber: 33
                                                }, this),
                                                editingPipelineId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        setEditingPipelineId(null);
                                                        setNewPipeline({
                                                            name: '',
                                                            dispositions: [],
                                                            sub_dispositions: [],
                                                            outcomes: []
                                                        });
                                                        setShowConfig(false);
                                                    },
                                                    className: "h-10 px-4 text-gray-500 text-[11px] font-bold hover:text-gray-700",
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 703,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 694,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 615,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap gap-2",
                                    children: pipelines.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 px-3 py-1.5 bg-white border border-indigo-100 rounded-full text-xs font-medium text-indigo-700 shadow-sm",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: p.name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 720,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-[10px] opacity-40 px-1 bg-indigo-50 rounded",
                                                    children: [
                                                        p.filters.dispositions.length > 0 ? p.filters.dispositions.join(', ') : 'Any',
                                                        p.filters.sub_dispositions.length > 0 ? ` > ${p.filters.sub_dispositions.join(', ')}` : '',
                                                        p.filters.outcomes && p.filters.outcomes.length > 0 ? ` [${p.filters.outcomes.join(', ')}]` : ''
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 721,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>removePipeline(p.id),
                                                    className: "hover:text-red-500 transition-colors",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi fi-rr-cross-circle"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 727,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 726,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, p.id, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 719,
                                            columnNumber: 33
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 717,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 606,
                            columnNumber: 21
                        }, this),
                        showFilterModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "fixed inset-0 z-[120] backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 text-xs font-sans",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-gray-800",
                                                    children: "Filter Follow-ups"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 742,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 741,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowFilterModal(false),
                                                className: "text-gray-400 hover:text-gray-600 p-1",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-cross-small text-xl leading-none"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 745,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 744,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 740,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "p-5 space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                                children: "Organization"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 753,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: filters.organizationId,
                                                                onChange: (e)=>setFilters({
                                                                        ...filters,
                                                                        organizationId: e.target.value
                                                                    }),
                                                                className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "All Organizations"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 759,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    filterOptions.organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: org.id,
                                                                            children: org.name
                                                                        }, org.id, false, {
                                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                                            lineNumber: 761,
                                                                            columnNumber: 49
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 754,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 752,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                                children: "Campaign"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 768,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: filters.campaignId,
                                                                onChange: (e)=>setFilters({
                                                                        ...filters,
                                                                        campaignId: e.target.value
                                                                    }),
                                                                className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "All Campaigns"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 774,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    filterOptions.campaigns.map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: camp.id,
                                                                            children: camp.name
                                                                        }, camp.id, false, {
                                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                                            lineNumber: 776,
                                                                            columnNumber: 49
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 769,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 767,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 750,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                                children: "Sequence Status"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 785,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: filters.status,
                                                                onChange: (e)=>setFilters({
                                                                        ...filters,
                                                                        status: e.target.value
                                                                    }),
                                                                className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "All Statuses"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 791,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "overdue",
                                                                        children: "Overdue"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 792,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "upcoming",
                                                                        children: "Upcoming"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 793,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 786,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 784,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                                children: "Assigned Personnel"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 799,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: filters.assignedTo,
                                                                onChange: (e)=>setFilters({
                                                                        ...filters,
                                                                        assignedTo: e.target.value
                                                                    }),
                                                                className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Everyone"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 805,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    filterOptions.agents.map((agent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: agent.id,
                                                                            children: [
                                                                                agent.name,
                                                                                " ",
                                                                                agent.empId ? `(${agent.empId})` : ''
                                                                            ]
                                                                        }, agent.id, true, {
                                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                                            lineNumber: 807,
                                                                            columnNumber: 49
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 800,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 798,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 782,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "space-y-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                        children: "Execution Date"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 817,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "date",
                                                            value: filters.callbackDate,
                                                            onChange: (e)=>setFilters({
                                                                    ...filters,
                                                                    callbackDate: e.target.value
                                                                }),
                                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 819,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 818,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 816,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 749,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-between shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setFilters({
                                                        organizationId: "",
                                                        assignedTo: "",
                                                        status: "",
                                                        campaignId: "",
                                                        callbackDate: ""
                                                    }),
                                                className: "px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all",
                                                children: "Clear Config"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 830,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowFilterModal(false),
                                                className: "px-6 py-1.5 bg-[#4b33e8] text-white rounded font-bold uppercase tracking-widest transition-all hover:bg-indigo-700",
                                                children: "Apply Configuration"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 836,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 829,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/followup.tsx",
                                lineNumber: 738,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 737,
                            columnNumber: 21
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-info"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 849,
                                    columnNumber: 25
                                }, this),
                                error
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 848,
                            columnNumber: 21
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center py-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 856,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-400 font-bold",
                                    children: "Syncing schedule..."
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 857,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 855,
                            columnNumber: 21
                        }, this) : filteredLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center py-16 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-calendar-check text-2xl text-gray-300"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 862,
                                        columnNumber: 29
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 861,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                    className: "text-gray-500 font-bold text-sm mb-1",
                                    children: "All Caught Up!"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 864,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-400",
                                    children: "You have no pending follow-up calls matching your criteria."
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 865,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 860,
                            columnNumber: 21
                        }, this) : viewMode === 'table' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto -mx-2 sm:mx-0",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                className: "w-full text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            className: "border-b border-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 w-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer",
                                                            type: "checkbox"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 875,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 874,
                                                        columnNumber: 41
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 873,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Customer Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 878,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Contact Info"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 879,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 880,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Disposition"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 881,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Organization"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 882,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Campaign"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 883,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Scheduled Time"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 884,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Assigned To"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 885,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-right",
                                                    children: "Action"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 886,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 872,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 871,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-gray-50",
                                        children: filteredLeads.map((lead)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                className: "group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0",
                                                onClick: ()=>handleManualLeadOpen(lead.campaign_id, lead.id),
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        onClick: (e)=>e.stopPropagation(),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer",
                                                                type: "checkbox"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 894,
                                                                columnNumber: 49
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 893,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 892,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase",
                                                                    children: lead.customer_name?.charAt(0) || 'C'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 899,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-medium text-gray-800",
                                                                    style: {
                                                                        fontFamily: "'Poppins', sans-serif",
                                                                        color: "rgb(38, 50, 56)"
                                                                    },
                                                                    children: lead.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 902,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 898,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 897,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-medium text-gray-700 leading-none mb-1",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(lead.phone_no)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 909,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-gray-400 font-medium uppercase tracking-tighter",
                                                                    children: "Verified Lead"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 910,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 908,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 907,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-center",
                                                            children: lead.isOverdue ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-red-50 text-red-600 border border-red-100",
                                                                children: "Overdue"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 916,
                                                                columnNumber: 53
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-100",
                                                                children: "Upcoming"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 920,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 914,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 913,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-[11px] font-bold text-indigo-600 uppercase tracking-tight",
                                                            children: lead.disposition || 'Call Back'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 927,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 926,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi flex fi-rr-building text-[#4b33e8] text-xs"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 933,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[12px] font-medium text-gray-700",
                                                                    style: {
                                                                        fontFamily: "'Roboto', sans-serif"
                                                                    },
                                                                    children: lead.organization_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 934,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 932,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 931,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wide",
                                                            children: lead.campaign_name
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 940,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 939,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: `text-xs font-medium leading-none mb-1 ${lead.isOverdue ? 'text-red-500' : 'text-gray-700'}`,
                                                                    children: formatDate(lead.next_called_at)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 946,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-gray-400 font-medium uppercase tracking-tighter",
                                                                    children: "Scheduled"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 949,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 945,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 944,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-medium text-gray-600",
                                                            children: lead.assigned_name || 'Unassigned'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 953,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 952,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-right",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-end gap-2",
                                                            onClick: (e)=>e.stopPropagation(),
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleManualLeadOpen(lead.campaign_id, lead.id),
                                                                className: "inline-flex items-center gap-2 px-4 py-1.5 bg-[#4b33e8] text-white rounded-lg text-[10px] font-bold shadow-md hover:bg-[#3f2bc2] transition-colors",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-phone-call text-xs"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 963,
                                                                        columnNumber: 53
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        children: "Call"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 964,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 959,
                                                                columnNumber: 49
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 958,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 957,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, lead.id, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 891,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 889,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/followup.tsx",
                                lineNumber: 869,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 868,
                            columnNumber: 21
                        }, this) : viewMode === 'kanban' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide min-h-[500px] snap-x",
                            children: pipelines.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl py-20 text-gray-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-plus text-3xl mb-2"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 977,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-bold",
                                        children: "No pipelines configured."
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 978,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xs",
                                        children: "Click the gear icon to add pipelines."
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 979,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/followup.tsx",
                                lineNumber: 976,
                                columnNumber: 29
                            }, this) : pipelines.map((pipeline)=>{
                                const leadsInPipeline = filteredLeads.filter((l)=>{
                                    const matchDisp = pipeline.filters.dispositions.length === 0 || pipeline.filters.dispositions.includes(l.disposition);
                                    const matchSub = pipeline.filters.sub_dispositions.length === 0 || l.sub_disposition && pipeline.filters.sub_dispositions.includes(l.sub_disposition);
                                    const matchOutcome = !pipeline.filters.outcomes || pipeline.filters.outcomes.length === 0 || l.outcome && pipeline.filters.outcomes.includes(l.outcome);
                                    return matchDisp && matchSub && matchOutcome;
                                });
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex-shrink-0 w-[280px] sm:w-80 bg-gray-50/50 rounded-2xl p-3 border border-gray-100 flex flex-col h-full max-h-[700px] snap-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4 px-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            className: "text-sm font-bold text-slate-800 uppercase tracking-tighter",
                                                            children: pipeline.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 995,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "flex items-center justify-center w-5 h-5 rounded-full bg-white border border-gray-200 text-[10px] font-black text-indigo-600 shadow-sm",
                                                            children: leadsInPipeline.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 996,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 994,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setShowMenuId(showMenuId === pipeline.id ? null : pipeline.id),
                                                            className: `w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${showMenuId === pipeline.id ? 'bg-indigo-100 text-indigo-600' : 'text-gray-300 hover:text-indigo-600'}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-menu-dots-vertical"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1005,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1001,
                                                            columnNumber: 49
                                                        }, this),
                                                        showMenuId === pipeline.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-[100] animate-in fade-in zoom-in duration-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>startEdit(pipeline),
                                                                    className: "w-full px-3 py-2 text-left text-[11px] font-bold text-slate-700 hover:bg-indigo-50 flex items-center gap-2 transition-colors",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi fi-rr-edit text-indigo-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                                            lineNumber: 1014,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        "Edit Pipeline"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1010,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "h-px bg-gray-50 my-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1017,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>removePipeline(pipeline.id),
                                                                    className: "w-full px-3 py-2 text-left text-[11px] font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi fi-rr-trash"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                                            lineNumber: 1022,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        "Delete"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1018,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1009,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 1000,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 993,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar",
                                            children: leadsInPipeline.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col items-center justify-center py-10 opacity-30",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi fi-rr-box-open text-2xl mb-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1033,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] uppercase font-bold tracking-widest",
                                                        children: "No leads"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1034,
                                                        columnNumber: 54
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 1032,
                                                columnNumber: 49
                                            }, this) : leadsInPipeline.map((lead)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    onClick: ()=>handleManualLeadOpen(lead.campaign_id, lead.id),
                                                    className: "bg-white p-2.5 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group animate-fade-in relative overflow-hidden",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: `absolute left-0 top-0 bottom-0 w-1 ${lead.isOverdue ? 'bg-red-500' : 'bg-indigo-500 opacity-20'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1044,
                                                            columnNumber: 57
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-start justify-between mb-1 ml-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-bold",
                                                                            children: lead.customer_name?.charAt(0) || 'C'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                                            lineNumber: 1048,
                                                                            columnNumber: 65
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-col",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                                    className: "text-[14px] font-bold text-slate-800 leading-tight truncate max-w-[160px]",
                                                                                    children: lead.customer_name || 'Anonymous'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                                    lineNumber: 1052,
                                                                                    columnNumber: 69
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "flex items-center gap-1 text-gray-400",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "text-[10px] font-medium tracking-tight mb-0.5",
                                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(lead.phone_no)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                                        lineNumber: 1056,
                                                                                        columnNumber: 73
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                                    lineNumber: 1055,
                                                                                    columnNumber: 69
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                                            lineNumber: 1051,
                                                                            columnNumber: 65
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1047,
                                                                    columnNumber: 61
                                                                }, this),
                                                                lead.isOverdue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-time-past text-red-500 text-[10px] animate-pulse"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1060,
                                                                    columnNumber: 80
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1046,
                                                            columnNumber: 57
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-wrap gap-1 mb-1.5 ml-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-600 text-[8px] font-bold uppercase",
                                                                    children: lead.campaign_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1064,
                                                                    columnNumber: 61
                                                                }, this),
                                                                lead.sub_disposition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[8px] font-bold lowercase italic",
                                                                    children: lead.sub_disposition
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1068,
                                                                    columnNumber: 65
                                                                }, this),
                                                                lead.outcome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 text-[8px] font-bold uppercase tracking-tight",
                                                                    children: lead.outcome
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1073,
                                                                    columnNumber: 65
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1063,
                                                            columnNumber: 57
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "pt-1.5 border-t border-gray-50 flex items-center justify-between ml-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: `text-[9px] font-bold ${lead.isOverdue ? 'text-red-500' : 'text-gray-400'}`,
                                                                    children: formatDate(lead.next_called_at)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1080,
                                                                    columnNumber: 61
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    className: "w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-indigo-100 shadow-sm",
                                                                    onClick: (e)=>{
                                                                        e.stopPropagation();
                                                                        handleManualLeadOpen(lead.campaign_id, lead.id);
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-phone-call text-[8px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1090,
                                                                        columnNumber: 65
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1083,
                                                                    columnNumber: 61
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1079,
                                                            columnNumber: 57
                                                        }, this)
                                                    ]
                                                }, lead.id, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 1038,
                                                    columnNumber: 53
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/followup.tsx",
                                            lineNumber: 1030,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, pipeline.id, true, {
                                    fileName: "[project]/pages/portal/followup.tsx",
                                    lineNumber: 992,
                                    columnNumber: 37
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 974,
                            columnNumber: 21
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white p-4 rounded-xl border border-gray-200",
                            children: !selectedDate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: "text-lg font-bold text-gray-800",
                                                children: currentMonth.toLocaleString('default', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 1108,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)),
                                                        className: "w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi fi-rr-angle-left text-sm mt-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1116,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1112,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setCurrentMonth(new Date()),
                                                        className: "px-4 py-1.5 text-xs font-bold bg-[#EEF2FF] text-[#4F46E5] rounded-lg hover:bg-indigo-100 transition-colors",
                                                        children: "Today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1118,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)),
                                                        className: "w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi fi-rr-angle-right text-sm mt-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1128,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1124,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 1111,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 1107,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-7 mb-2 text-center",
                                        children: [
                                            'Sun',
                                            'Mon',
                                            'Tue',
                                            'Wed',
                                            'Thu',
                                            'Fri',
                                            'Sat'
                                        ].map((day)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-bold text-gray-400 uppercase py-2",
                                                children: day
                                            }, day, false, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 1136,
                                                columnNumber: 41
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 1134,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-7 gap-2",
                                        children: [
                                            Array.from({
                                                length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
                                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "min-h-[120px] bg-gray-50/30 rounded-lg"
                                                }, `empty-${i}`, false, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 1146,
                                                    columnNumber: 41
                                                }, this)),
                                            Array.from({
                                                length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
                                            }).map((_, i)=>{
                                                const day = i + 1;
                                                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();
                                                const dayLeads = filteredLeads.filter((l)=>{
                                                    if (!l.next_called_at) return false;
                                                    const leadDate = new Date(l.next_called_at);
                                                    return leadDate.getDate() === day && leadDate.getMonth() === currentMonth.getMonth() && leadDate.getFullYear() === currentMonth.getFullYear();
                                                });
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    onClick: ()=>setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)),
                                                    className: `min-h-[120px] p-2 rounded-lg border cursor-pointer hover:shadow-md ${isToday ? 'border-indigo-500 bg-indigo-50/10' : 'border-gray-100 bg-white hover:border-indigo-200'} transition-all relative group`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-between items-start mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: `text-sm font-bold ${isToday ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : 'text-gray-700'}`,
                                                                    children: day
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1168,
                                                                    columnNumber: 53
                                                                }, this),
                                                                dayLeads.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 rounded-full",
                                                                    children: dayLeads.length
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1172,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1167,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-1",
                                                            children: [
                                                                dayLeads.slice(0, 3).map((lead)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: `px-2 py-1 rounded text-[9px] font-bold truncate ${lead.isOverdue ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`,
                                                                        title: `${lead.customer_name} - ${lead.campaign_name}`,
                                                                        children: lead.customer_name || 'Anonymous'
                                                                    }, lead.id, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1180,
                                                                        columnNumber: 57
                                                                    }, this)),
                                                                dayLeads.length > 3 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "text-[9px] text-gray-400 font-medium pl-1",
                                                                    children: [
                                                                        "+",
                                                                        dayLeads.length - 3,
                                                                        " more"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1189,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1178,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "absolute inset-x-0 bottom-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center pointer-events-none",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-bold text-gray-400 bg-white/90 px-2 py-0.5 rounded-full shadow-sm border border-gray-100",
                                                                children: "View Day"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1197,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1196,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, day, true, {
                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                    lineNumber: 1162,
                                                    columnNumber: 45
                                                }, this);
                                            })
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 1143,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "animate-fade-in",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6 pb-4 border-b border-gray-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setSelectedDate(null),
                                                        className: "p-2 -ml-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi fi-rr-arrow-small-left text-xl"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1213,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1209,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                                className: "text-xl font-bold text-gray-800 leading-tight",
                                                                children: selectedDate.toLocaleDateString('default', {
                                                                    weekday: 'long',
                                                                    day: 'numeric',
                                                                    month: 'long'
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1216,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-500 font-medium",
                                                                children: "Hourly Schedule"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1219,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1215,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 1208,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        className: "px-3 py-1.5 text-xs font-bold bg-indigo-600 text-white rounded-lg shadow-sm",
                                                        children: "Day View"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1223,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setSelectedDate(null),
                                                        className: "px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50",
                                                        children: "Month View"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1226,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 1222,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 1207,
                                        columnNumber: 33
                                    }, this),
                                    !selectedHour ? /* Hourly Slots Grid */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1",
                                        children: Array.from({
                                            length: 16
                                        }).map((_, i)=>{
                                            const hour = i + 8;
                                            const timeLabel = new Date(0, 0, 0, hour).toLocaleTimeString('en-US', {
                                                hour: 'numeric',
                                                minute: '2-digit'
                                            });
                                            // Filter leads for this hour
                                            const slotLeads = filteredLeads.filter((l)=>{
                                                if (!l.next_called_at) return false;
                                                const d = new Date(l.next_called_at);
                                                return d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getHours() === hour;
                                            });
                                            const isCurrentHour = new Date().getHours() === hour && new Date().toDateString() === selectedDate.toDateString();
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                onClick: ()=>setSelectedHour(hour),
                                                className: `flex flex-col h-full min-h-[140px] rounded-2xl border ${isCurrentHour ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20' : 'border-gray-200 bg-white hover:border-indigo-300'} transition-all p-3 relative group hover:shadow-md cursor-pointer`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center mb-3 pb-2 border-b border-gray-100",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: `text-sm font-bold ${isCurrentHour ? 'text-indigo-700' : 'text-gray-700'}`,
                                                                children: timeLabel
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1260,
                                                                columnNumber: 57
                                                            }, this),
                                                            slotLeads.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: `text-[10px] font-bold px-2 py-0.5 rounded-full ${isCurrentHour ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`,
                                                                children: [
                                                                    slotLeads.length,
                                                                    " Calls"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1262,
                                                                columnNumber: 61
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1259,
                                                        columnNumber: 53
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: `flex-1 space-y-2 custom-scrollbar max-h-[200px] ${slotLeads.length > 0 ? 'overflow-y-auto' : 'overflow-hidden flex items-center justify-center'}`,
                                                        children: slotLeads.length > 0 ? slotLeads.map((lead)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    handleManualLeadOpen(lead.campaign_id, lead.id);
                                                                },
                                                                className: "flex items-start gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-colors",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: `w-1 h-8 rounded-full flex-shrink-0 ${lead.isOverdue ? 'bg-red-500' : 'bg-indigo-500'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1276,
                                                                        columnNumber: 69
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1 min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                                className: "text-xs font-medium text-gray-800 truncate",
                                                                                title: lead.customer_name,
                                                                                children: lead.customer_name || 'Anonymous'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                                lineNumber: 1278,
                                                                                columnNumber: 73
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "text-[9px] text-gray-500 truncate",
                                                                                children: lead.campaign_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                                lineNumber: 1279,
                                                                                columnNumber: 73
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1277,
                                                                        columnNumber: 69
                                                                    }, this),
                                                                    lead.isOverdue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-time-past text-red-500 text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1281,
                                                                        columnNumber: 88
                                                                    }, this)
                                                                ]
                                                            }, lead.id, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1271,
                                                                columnNumber: 65
                                                            }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "h-full flex flex-col items-center justify-center opacity-30 mt-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-minus-circle text-2xl text-gray-300 mb-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1286,
                                                                    columnNumber: 65
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-medium text-gray-400",
                                                                    children: "Free Slot"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                    lineNumber: 1287,
                                                                    columnNumber: 65
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1285,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1268,
                                                        columnNumber: 53
                                                    }, this)
                                                ]
                                            }, hour, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 1254,
                                                columnNumber: 49
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 1237,
                                        columnNumber: 37
                                    }, this) : /* Timeline View for Selected Hour */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "animate-fade-in",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 mb-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setSelectedHour(null),
                                                        className: "w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi fi-rr-arrow-small-left text-xl"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                            lineNumber: 1303,
                                                            columnNumber: 49
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1299,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "text-lg font-bold text-gray-800",
                                                                children: [
                                                                    new Date(0, 0, 0, selectedHour).toLocaleTimeString('en-US', {
                                                                        hour: 'numeric',
                                                                        minute: '2-digit'
                                                                    }),
                                                                    " - ",
                                                                    new Date(0, 0, 0, selectedHour + 1).toLocaleTimeString('en-US', {
                                                                        hour: 'numeric',
                                                                        minute: '2-digit'
                                                                    })
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1306,
                                                                columnNumber: 49
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-gray-500",
                                                                children: "Timeline view"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1309,
                                                                columnNumber: 49
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1305,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 1298,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "relative pl-4 space-y-8 py-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "absolute left-[85px] top-0 bottom-0 w-px bg-gray-200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                        lineNumber: 1315,
                                                        columnNumber: 45
                                                    }, this),
                                                    (()=>{
                                                        const hourLeads = filteredLeads.filter((l)=>{
                                                            if (!l.next_called_at) return false;
                                                            const d = new Date(l.next_called_at);
                                                            return d.getDate() === selectedDate.getDate() && d.getMonth() === selectedDate.getMonth() && d.getHours() === selectedHour;
                                                        });
                                                        // Group by minute
                                                        const groupedByMinute = {};
                                                        hourLeads.forEach((l)=>{
                                                            const d = new Date(l.next_called_at);
                                                            const timeKey = d.toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: '2-digit',
                                                                hour12: false
                                                            }); // Use 24h for sorting ease or just minute str
                                                            // Let's use formatted 12h string for Key 
                                                            const displayTime = d.toLocaleTimeString('en-US', {
                                                                hour: 'numeric',
                                                                minute: '2-digit'
                                                            });
                                                            if (!groupedByMinute[displayTime]) groupedByMinute[displayTime] = [];
                                                            groupedByMinute[displayTime].push(l);
                                                        });
                                                        // If no leads
                                                        if (Object.keys(groupedByMinute).length === 0) {
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col items-center justify-center py-20 opacity-50",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-time-forward text-4xl text-indigo-200 mb-3"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1341,
                                                                        columnNumber: 61
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-gray-400 font-medium",
                                                                        children: "No calls scheduled for this hour"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1342,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1340,
                                                                columnNumber: 57
                                                            }, this);
                                                        }
                                                        // Sort keys by time (simple since we are within same hour)
                                                        const sortedTimes = Object.keys(groupedByMinute).sort();
                                                        return sortedTimes.map((time)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex group relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "w-[70px] flex-shrink-0 text-right pr-6 pt-2",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-sm font-bold text-gray-600 font-mono",
                                                                            children: time
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                                            lineNumber: 1354,
                                                                            columnNumber: 61
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1353,
                                                                        columnNumber: 57
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "absolute left-[80.5px] top-3 w-2.5 h-2.5 rounded-full bg-white border-2 border-indigo-500 z-10"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1358,
                                                                        columnNumber: 57
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1 pl-6 pt-2 min-w-0",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-2 mb-1",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full",
                                                                                    children: [
                                                                                        groupedByMinute[time].length,
                                                                                        " Contact",
                                                                                        groupedByMinute[time].length > 1 ? 's' : ''
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/followup.tsx",
                                                                                    lineNumber: 1363,
                                                                                    columnNumber: 65
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                                lineNumber: 1362,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "flex gap-4 overflow-x-auto pb-4 custom-scrollbar",
                                                                                children: groupedByMinute[time].map((lead)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        onClick: ()=>handleManualLeadOpen(lead.campaign_id, lead.id),
                                                                                        className: "min-w-[250px] bg-white p-3 rounded-xl border border-gray-200 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "flex items-center gap-2 border-b border-gray-50 pb-2",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: `w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${lead.isOverdue ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`,
                                                                                                        children: lead.customer_name?.charAt(0)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                                                        lineNumber: 1375,
                                                                                                        columnNumber: 78
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "flex-1 min-w-0",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                                                                className: "text-sm font-bold text-gray-800 truncate",
                                                                                                                children: lead.customer_name || 'Anonymous'
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                                                                lineNumber: 1379,
                                                                                                                columnNumber: 82
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                className: "text-[10px] text-gray-500",
                                                                                                                children: lead.campaign_name
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                                                                lineNumber: 1380,
                                                                                                                columnNumber: 82
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                                                        lineNumber: 1378,
                                                                                                        columnNumber: 78
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                                                lineNumber: 1374,
                                                                                                columnNumber: 73
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "flex items-center justify-between",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "text-[10px] font-medium text-gray-500 flex items-center gap-1",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                                className: "fi fi-rr-smartphone"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                                                                lineNumber: 1385,
                                                                                                                columnNumber: 81
                                                                                                            }, this),
                                                                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(lead.phone_no)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                                                        lineNumber: 1384,
                                                                                                        columnNumber: 77
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                        className: "w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400",
                                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                            className: "fi fi-rr-arrow-right text-[10px]"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/followup.tsx",
                                                                                                            lineNumber: 1389,
                                                                                                            columnNumber: 81
                                                                                                        }, this)
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                                                        lineNumber: 1388,
                                                                                                        columnNumber: 77
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                                                lineNumber: 1383,
                                                                                                columnNumber: 73
                                                                                            }, this)
                                                                                        ]
                                                                                    }, lead.id, true, {
                                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                                        lineNumber: 1369,
                                                                                        columnNumber: 69
                                                                                    }, this))
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                                lineNumber: 1367,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/followup.tsx",
                                                                        lineNumber: 1361,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                ]
                                                            }, time, true, {
                                                                fileName: "[project]/pages/portal/followup.tsx",
                                                                lineNumber: 1351,
                                                                columnNumber: 53
                                                            }, this));
                                                    })()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/followup.tsx",
                                                lineNumber: 1313,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/followup.tsx",
                                        lineNumber: 1297,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/followup.tsx",
                                lineNumber: 1205,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/followup.tsx",
                            lineNumber: 1103,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/followup.tsx",
                    lineNumber: 459,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/followup.tsx",
            lineNumber: 218,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__40f046aa._.js.map