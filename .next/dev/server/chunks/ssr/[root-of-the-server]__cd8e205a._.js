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
"[project]/pages/portal/call-sessions.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>CallSessionsPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
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
;
// Module-level cache to persist data across page navigation in the same session
let cachedSessions = [];
let lastFetchTime = 0;
const CACHE_DURATION = 30000; // 30 seconds
function CallSessionsPage() {
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [sessions, setSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(cachedSessions);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(cachedSessions.length === 0);
    const [isRefetching, setIsRefetching] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isAuthorized, setIsAuthorized] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [selectedKeys, setSelectedKeys] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    // Filter States
    const [agentFilter, setAgentFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("All Agents");
    const [campaignFilter, setCampaignFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("All Campaigns");
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("Status");
    const [orgFilter, setOrgFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("Organization");
    const [showFilterModal, setShowFilterModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [expandedSessions, setExpandedSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const filteredItems = sessions.filter((s)=>{
        // 1. Search Query Filter
        const q = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || s.agentName?.toLowerCase().includes(q) || s.employeeId?.toLowerCase().includes(q) || s.campaignName?.toLowerCase().includes(q) || s.customerName?.toLowerCase().includes(q) || s.manualCampaignName?.toLowerCase().includes(q) || s.manualCustomerName?.toLowerCase().includes(q) || s.status?.toLowerCase().includes(q);
        // 2. Dropdown Filters
        const matchesAgent = agentFilter === "All Agents" || s.agentName === agentFilter;
        const matchesCampaign = campaignFilter === "All Campaigns" || s.campaignName === campaignFilter;
        const matchesStatus = statusFilter === "Status" || s.status === statusFilter.toLowerCase().replace(' ', '_');
        const matchesOrg = orgFilter === "Organization" || s.orgName === orgFilter;
        return matchesSearch && matchesAgent && matchesCampaign && matchesStatus && matchesOrg;
    });
    // Extract unique options for dropdowns
    const availableAgents = Array.from(new Set(sessions.map((s)=>s.agentName))).sort();
    const availableCampaigns = Array.from(new Set(sessions.map((s)=>s.campaignName))).sort();
    const availableStatuses = Array.from(new Set(sessions.map((s)=>s.status))).map((st)=>st.charAt(0).toUpperCase() + st.slice(1).replace('_', ' '));
    const availableOrgs = Array.from(new Set(sessions.map((s)=>s.orgName))).filter((o)=>!!o).sort();
    const formatTimeSafe = (date)=>{
        if (!date) return '--:--:--';
        try {
            return new Date(date).toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        } catch (e) {
            return '--:--:--';
        }
    };
    const formatDateSafe = (date)=>{
        if (!date) return '-- -- --';
        try {
            return new Date(date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
        } catch (e) {
            return '-- -- --';
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && user) {
            // Check authorization: only NXUS-001
            if (user.employeeId === 'NXUS-001') {
                setIsAuthorized(true);
                const now = Date.now();
                if (cachedSessions.length === 0 || now - lastFetchTime > CACHE_DURATION) {
                    fetchSessions(cachedSessions.length === 0); // Only show full loader if no cache
                }
            } else {
                setIsAuthorized(false);
                setLoading(false);
            }
        } else if (mounted && !user) {
            setIsAuthorized(false);
            setLoading(false);
        }
    }, [
        user,
        mounted
    ]);
    const fetchSessions = async (showFullLoader = true)=>{
        try {
            if (showFullLoader) setLoading(true);
            else setIsRefetching(true);
            // 1. Fetch sessions
            const { data: sessionData, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').order('updated_at', {
                ascending: false
            });
            if (sessionError) throw sessionError;
            if (!sessionData || sessionData.length === 0) {
                setSessions([]);
                cachedSessions = [];
                return;
            }
            // 2. Collect ALL IDs for enrichment (both auto and manual)
            const isUUID = (str)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
            const userIds = Array.from(new Set(sessionData.map((s)=>s.user_id)));
            const campaignIds = Array.from(new Set([
                ...sessionData.map((s)=>s.campaign_id),
                ...sessionData.map((s)=>s.manual_campaign_id).filter((id)=>!!id)
            ]));
            const customerIds = Array.from(new Set([
                ...sessionData.map((s)=>s.customer_id).filter((id)=>!!id && isUUID(id)),
                ...sessionData.map((s)=>s.manual_customer_id).filter((id)=>!!id && isUUID(id))
            ]));
            // 3. Fetch related data in stages to avoid circular dependency
            const organizationIds = Array.from(new Set(sessionData.map((s)=>s.organization_id).filter((id)=>!!id)));
            const { data: userData, error: userDataError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, user_name, employee_id').in('user_id', userIds);
            if (userDataError) throw userDataError;
            const employeeIds = (userData || []).map((u)=>u.employee_id).filter((id)=>!!id);
            const [campaignsRes, customersRes, orgsRes, syncMetaRes, logsRes, historyRes] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('id, name').in('id', campaignIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, phone_no, customer_details').in('id', customerIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').select('id, company_name').in('id', organizationIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('employee_id, customer_name, dialed_no').in('employee_id', employeeIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('customer_id, customer_name').in('customer_id', customerIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_history').select('id, name, number').in('id', customerIds)
            ]);
            // 4. Map names
            const userMap = Object.fromEntries((userData || []).map((u)=>[
                    u.user_id,
                    u
                ]));
            const campaignMap = Object.fromEntries((campaignsRes.data || []).map((c)=>[
                    c.id,
                    c.name
                ]));
            const customerMap = Object.fromEntries((customersRes.data || []).map((c)=>[
                    c.id,
                    c
                ]));
            const orgMap = Object.fromEntries((orgsRes.data || []).map((o)=>[
                    o.id,
                    o.company_name
                ]));
            const syncMap = Object.fromEntries((syncMetaRes.data || []).map((s)=>[
                    s.employee_id?.trim(),
                    s
                ]));
            const logMap = Object.fromEntries((logsRes.data || []).reverse().map((l)=>[
                    l.customer_id,
                    l.customer_name
                ])); // Use latest log name
            const historyMap = Object.fromEntries((historyRes.data || []).map((h)=>[
                    h.id,
                    h
                ]));
            // 5. Enrich sessions
            const enriched = sessionData.map((s)=>{
                const uProfile = userMap[s.user_id];
                const empId = uProfile?.employee_id?.trim();
                const cust = customerMap[s.customer_id];
                const manualCust = customerMap[s.manual_customer_id];
                const liveSync = empId ? syncMap[empId] : null;
                // Status-based formatting
                const isActuallyManual = s.is_manual && (s.manual_customer_id || s.manual_status);
                // Fallback names
                const manualLogName = logMap[s.manual_customer_id];
                const manualHist = historyMap[s.manual_customer_id];
                const resolvedManualName = manualCust?.customer_name || manualLogName || manualHist?.name || (isActuallyManual ? liveSync?.customer_name : null);
                // Priority for Manual Phone: Live Sync > DB Record > History
                const resolvedManualPhone = (isActuallyManual ? liveSync?.dialed_no : null) || (manualCust?.phone_no ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(manualCust.phone_no) : null) || manualHist?.number;
                // Auto fallback
                const autoLogName = logMap[s.customer_id];
                const autoHist = historyMap[s.customer_id];
                const resolvedAutoName = cust?.customer_name || s.customer_name || autoLogName || autoHist?.name || (!s.is_manual ? liveSync?.customer_name : '') || 'N/A';
                const resolvedAutoPhone = (cust?.phone_no ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["decryptPhone"])(cust.phone_no) : null) || autoHist?.number || (!s.is_manual ? liveSync?.dialed_no : '');
                return {
                    ...s,
                    agentName: uProfile?.user_name || 'Unknown',
                    employeeId: uProfile?.employee_id || '--',
                    campaignName: campaignMap[s.campaign_id] || s.campaign_id,
                    // Primary Customer Logic
                    customerName: resolvedAutoName,
                    customerPhone: resolvedAutoPhone,
                    customerDetails: cust?.customer_details || '',
                    orgName: orgMap[s.organization_id] || 'NO_ORG',
                    // Manual/Override Logic
                    manualCampaignName: campaignMap[s.manual_campaign_id] || s.manual_campaign_id || '---',
                    manualCustomerName: resolvedManualName || 'Manual Entry',
                    manualCustomerPhone: resolvedManualPhone || '',
                    manualCustomerDetails: manualCust?.customer_details || ''
                };
            });
            setSessions(enriched);
            cachedSessions = enriched;
            lastFetchTime = Date.now();
        } catch (err) {
            console.error("Error fetching call sessions:", err);
        } finally{
            setLoading(false);
            setIsRefetching(false);
        }
    };
    const handleDelete = async (userId, campaignId)=>{
        if (!window.confirm("Are you sure you want to delete this session? This will force the agent off their current lead session.")) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').delete().match({
                user_id: userId,
                campaign_id: campaignId
            });
            if (error) throw error;
            // Update local state
            const updated = sessions.filter((s)=>!(s.user_id === userId && s.campaign_id === campaignId));
            setSessions(updated);
            cachedSessions = updated;
            setSelectedKeys((prev)=>prev.filter((k)=>k !== `${userId}|${campaignId}`));
        } catch (err) {
            console.error("Error deleting session:", err);
            alert("Failed to delete session.");
        }
    };
    const handleBulkDelete = async ()=>{
        if (selectedKeys.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedKeys.length} selected sessions?`)) return;
        try {
            setIsRefetching(true);
            // Supabase delete doesn't support multiple .match in one go easily for composite keys in a simple way
            // We can use an RPC or run multiple deletes, or use a filter that matches the combination
            // For composite keys, the safest/cleanest way without a custom RPC is to run them in parallel or loop
            const deletePromises = selectedKeys.map((key)=>{
                const [uId, cId] = key.split('|'); // Using | as separator to avoid - issues in UUIDs
                return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').delete().match({
                    user_id: uId,
                    campaign_id: cId
                });
            });
            const results = await Promise.all(deletePromises);
            const errors = results.filter((r)=>r.error);
            if (errors.length > 0) throw errors[0].error;
            // Update local state
            const updated = sessions.filter((s)=>!selectedKeys.includes(`${s.user_id}|${s.campaign_id}`));
            setSessions(updated);
            cachedSessions = updated;
            setSelectedKeys([]);
        } catch (err) {
            console.error("Error bulk deleting sessions:", err);
            alert("Failed to delete some sessions.");
        } finally{
            setIsRefetching(false);
        }
    };
    const toggleSelectAll = ()=>{
        if (selectedKeys.length === filteredItems.length && filteredItems.length > 0) {
            setSelectedKeys([]);
        } else {
            setSelectedKeys(filteredItems.map((s)=>`${s.user_id}|${s.campaign_id}`));
        }
    };
    const toggleSelectRow = (uId, cId)=>{
        const key = `${uId}|${cId}`;
        setSelectedKeys((prev)=>prev.includes(key) ? prev.filter((k)=>k !== key) : [
                ...prev,
                key
            ]);
    };
    const toggleExpand = (uId, cId)=>{
        const key = `${uId}|${cId}`;
        setExpandedSessions((prev)=>prev.includes(key) ? prev.filter((k)=>k !== key) : [
                ...prev,
                key
            ]);
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'assigned':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'disposition_pending':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'paused':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'closed':
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    };
    if (!mounted || loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center min-h-screen bg-slate-50",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 317,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/call-sessions.tsx",
            lineNumber: 316,
            columnNumber: 7
        }, this);
    }
    if (isAuthorized === false) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                        className: "flex fi fi-rr-lock text-2xl"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 326,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 325,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-bold text-gray-900 mb-2",
                    children: "Access Restricted"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 328,
                    columnNumber: 11
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 max-w-md",
                    children: "This module is reserved for system administrators (NXUS-001). Please contact support if you believe this is an error."
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 329,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/call-sessions.tsx",
            lineNumber: 324,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "p-4 w-full h-full min-h-0 overflow-auto bg-[#fbfcfe]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row items-stretch md:items-center gap-3 flex-1 w-full lg:max-w-4xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative flex-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "flex fi fi-rr-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[14px]"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 342,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search agent, campaign, customer...",
                                        value: searchQuery,
                                        onChange: (e)=>setSearchQuery(e.target.value),
                                        className: "w-full pl-11 pr-14 py-3 bg-white border border-gray-100 rounded-xl text-[12px] font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-gray-300 shadow-none h-12"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 343,
                                        columnNumber: 13
                                    }, this),
                                    searchQuery && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSearchQuery(""),
                                        className: "absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg uppercase transition-colors",
                                        style: {
                                            zIndex: 10
                                        },
                                        children: "Clear"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 351,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 341,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 hide-scrollbar shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowFilterModal(!showFilterModal),
                                                className: `w-12 h-12 rounded-xl flex items-center justify-center transition-all border shrink-0 ${showFilterModal ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-200'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "flex fi fi-rr-filter text-[16px]"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 365,
                                                columnNumber: 13
                                            }, this),
                                            showFilterModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "absolute top-full mt-2 left-0 md:right-0 md:left-auto w-[280px] bg-white rounded-2xl border border-slate-200 p-5 z-[100] animate-in fade-in zoom-in-95 duration-200 origin-top-left md:origin-top-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none",
                                                                children: "Global Filters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 375,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setAgentFilter("All Agents");
                                                                    setCampaignFilter("All Campaigns");
                                                                    setStatusFilter("Status");
                                                                    setOrgFilter("Organization");
                                                                    setSearchQuery("");
                                                                },
                                                                className: "text-[10px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest",
                                                                children: "Reset"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 376,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 374,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col gap-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1",
                                                                        children: "Agent"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 392,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                        value: agentFilter,
                                                                        onChange: (e)=>setAgentFilter(e.target.value),
                                                                        className: "w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:border-indigo-200 cursor-pointer transition-all outline-none",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                children: "All Agents"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                                lineNumber: 398,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            availableAgents.map((a)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    children: a
                                                                                }, a, false, {
                                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                                    lineNumber: 399,
                                                                                    columnNumber: 59
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 393,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 391,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col gap-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1",
                                                                        children: "Campaign"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 404,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                        value: campaignFilter,
                                                                        onChange: (e)=>setCampaignFilter(e.target.value),
                                                                        className: "w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:border-indigo-200 cursor-pointer transition-all outline-none",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                children: "All Campaigns"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                                lineNumber: 410,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            availableCampaigns.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    children: c
                                                                                }, c, false, {
                                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                                    lineNumber: 411,
                                                                                    columnNumber: 62
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 405,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 403,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col gap-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1",
                                                                        children: "Status"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 416,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                        value: statusFilter,
                                                                        onChange: (e)=>setStatusFilter(e.target.value),
                                                                        className: "w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:border-indigo-200 cursor-pointer transition-all outline-none",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                children: "Status"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                                lineNumber: 422,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            availableStatuses.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    children: s
                                                                                }, s, false, {
                                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                                    lineNumber: 423,
                                                                                    columnNumber: 61
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 417,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 415,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col gap-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                        className: "text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1",
                                                                        children: "Organization"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 428,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                        value: orgFilter,
                                                                        onChange: (e)=>setOrgFilter(e.target.value),
                                                                        className: "w-full px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 hover:border-indigo-200 cursor-pointer transition-all outline-none",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                children: "Organization"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                                lineNumber: 434,
                                                                                columnNumber: 33
                                                                            }, this),
                                                                            availableOrgs.map((o)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    children: o
                                                                                }, o, false, {
                                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                                    lineNumber: 435,
                                                                                    columnNumber: 57
                                                                                }, this))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 429,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 427,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setShowFilterModal(false),
                                                                className: "mt-2 w-full py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all",
                                                                children: "Apply Filters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 439,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 390,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 373,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 364,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        className: "flex items-center justify-center gap-2 h-12 px-5 bg-white border border-gray-100 rounded-xl text-[12px] font-black text-gray-700 hover:bg-gray-50 transition-all uppercase tracking-tight shadow-none shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "flex fi fi-rr-file-export text-[14px]"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 451,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "hidden sm:inline",
                                                children: "Export"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 452,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 450,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>fetchSessions(true),
                                        className: "h-12 px-5 bg-indigo-600 text-white rounded-xl text-[10px] font-black cursor-pointer hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest whitespace-nowrap shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: `flex fi fi-rr-refresh text-[10px] ${isRefetching ? 'animate-spin' : ''}`
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 459,
                                                columnNumber: 13
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "hidden sm:inline",
                                                children: "Refresh"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 460,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 455,
                                        columnNumber: 11
                                    }, this),
                                    selectedKeys.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleBulkDelete,
                                        className: "h-12 px-5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-[10px] font-black hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2 uppercase tracking-widest animate-in fade-in slide-in-from-right-2 whitespace-nowrap shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "flex fi fi-rr-trash text-[12px]"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 468,
                                                columnNumber: 17
                                            }, this),
                                            "Delete (",
                                            selectedKeys.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 464,
                                        columnNumber: 14
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 361,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 340,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-2 w-full lg:w-auto mt-2 lg:mt-0 p-3 lg:p-0 bg-slate-50 lg:bg-transparent rounded-xl lg:rounded-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-start lg:items-end gap-1",
                                children: [
                                    isRefetching && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-black text-indigo-400 animate-pulse uppercase tracking-widest leading-none",
                                        children: "Syncing..."
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 478,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none",
                                        children: "Status: Active"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 480,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 476,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-end gap-1",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none",
                                    children: [
                                        "Updated: ",
                                        lastFetchTime > 0 ? formatTimeSafe(new Date(lastFetchTime)) : '--:--'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 483,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 482,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 475,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 339,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "hidden lg:block bg-white rounded-xl border border-gray-100 overflow-hidden mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                        className: "w-full text-left border-collapse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    className: "bg-gray-50/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer",
                                                checked: selectedKeys.length === filteredItems.length && filteredItems.length > 0,
                                                onChange: toggleSelectAll
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 497,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 496,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap",
                                            children: "Agent & Org"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 504,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap",
                                            children: "Auto Session"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 505,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap",
                                            children: "Overrides / Manual"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 506,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Flags"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 507,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-right pr-8",
                                            children: "Heartbeat"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 508,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-4 border-b border-gray-100 text-[12px] font-black text-gray-500 uppercase tracking-widest whitespace-nowrap text-center",
                                            children: "Actions"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 509,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 495,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 494,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                className: "divide-y divide-gray-50",
                                children: filteredItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                        colSpan: 9,
                                        className: "px-6 py-24 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center gap-3 opacity-30",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "flex fi fi-rr-search-heart text-5xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 517,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[12px] font-black uppercase tracking-widest text-slate-400",
                                                    children: searchQuery ? `No sessions found for "${searchQuery}"` : 'No active sessions monitored'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 518,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 516,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 515,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 514,
                                    columnNumber: 17
                                }, this) : filteredItems.map((session, i)=>{
                                    const key = `${session.user_id}|${session.campaign_id}`;
                                    const isSelected = selectedKeys.includes(key);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        className: `hover:bg-slate-50 transition-colors group ${isSelected ? 'bg-indigo-50/30' : ''}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer",
                                                    checked: isSelected,
                                                    onChange: ()=>toggleSelectRow(session.user_id, session.campaign_id)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 531,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 530,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3 pr-4 py-1.5 pl-1.5 border border-indigo-100 rounded-full bg-indigo-50/50 w-fit",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-[14px]",
                                                                    children: session.agentName.charAt(0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 541,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[14px] font-black text-gray-900 leading-none",
                                                                            children: session.agentName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                            lineNumber: 545,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[11px] font-bold text-indigo-500 leading-none mt-1 uppercase tracking-wider",
                                                                            children: session.employeeId || 'ID_ERR'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                            lineNumber: 546,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 544,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 540,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-black text-gray-400 pl-2 uppercase tracking-widest",
                                                            children: session.orgName || 'NO_ORGANIZATION'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 549,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 539,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 538,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 min-w-[180px]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1.5 p-3 rounded-2xl bg-slate-50/50 border border-slate-100/50",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: `inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase ${session.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : session.status === 'assigned' ? 'bg-blue-50 text-blue-600 border-blue-100' : session.status === 'disposition_pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-white text-gray-400 border-gray-100'}`,
                                                                children: session.status.replace('_', ' ')
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 555,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 554,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[12px] font-black text-gray-800 leading-tight flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-bullhorn text-[11px] text-gray-400 flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 564,
                                                                    columnNumber: 119
                                                                }, this),
                                                                " ",
                                                                session.campaignName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 564,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[12px] font-bold text-indigo-600 leading-tight flex items-center gap-2 mt-0.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-user-md text-[11px] flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 565,
                                                                    columnNumber: 127
                                                                }, this),
                                                                " ",
                                                                session.customerName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 565,
                                                            columnNumber: 29
                                                        }, this),
                                                        session.customerPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] font-bold text-gray-400 pl-4 flex items-center gap-1 italic opacity-70 leading-none",
                                                            children: session.customerPhone
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 567,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 553,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 552,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 min-w-[180px]",
                                                children: session.manual_status || session.manual_campaign_id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col gap-1.5 p-3 rounded-2xl bg-purple-50/30 border border-purple-100/30",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2 mb-1",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: `inline-flex items-center px-2 py-0.5 rounded-lg text-[9px] font-black border uppercase ${session.manual_status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : session.manual_status === 'disposition_pending' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-purple-100 text-purple-700 border-purple-200'}`,
                                                                children: session.manual_status?.replace('_', ' ') || 'MANUAL'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 575,
                                                                columnNumber: 33
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 574,
                                                            columnNumber: 31
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[12px] font-black text-gray-800 leading-tight flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-bullhorn text-[11px] text-purple-400 flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 583,
                                                                    columnNumber: 121
                                                                }, this),
                                                                " ",
                                                                session.manualCampaignName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 583,
                                                            columnNumber: 31
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[12px] font-bold text-purple-600 leading-tight flex items-center gap-2 mt-0.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-user-md text-[11px] flex"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 584,
                                                                    columnNumber: 129
                                                                }, this),
                                                                " ",
                                                                session.manualCustomerName
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 584,
                                                            columnNumber: 31
                                                        }, this),
                                                        session.manualCustomerPhone && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] font-bold text-gray-400 pl-4 flex items-center gap-1 italic opacity-70 leading-none",
                                                            children: session.manualCustomerPhone
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 586,
                                                            columnNumber: 33
                                                        }, this),
                                                        session.manualCustomerDetails && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[9px] font-bold text-gray-300 pl-4 mt-0.5 truncate max-w-[140px] leading-none",
                                                            children: session.manualCustomerDetails
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 589,
                                                            columnNumber: 33
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 573,
                                                    columnNumber: 27
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "text-center w-full py-4 bg-gray-50/30 rounded-2xl border border-dashed border-gray-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-black text-gray-300 uppercase tracking-widest",
                                                        children: "--- No Override ---"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 594,
                                                        columnNumber: 30
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 593,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 571,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: `px-3 py-1.5 rounded-xl text-[10px] font-black border flex tracking-wider ${session.is_manual ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`,
                                                            children: session.is_manual ? 'M-MODE' : 'A-SYNC'
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 600,
                                                            columnNumber: 29
                                                        }, this),
                                                        session.is_unassigned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "bg-red-50 text-red-500 px-3 py-1.5 rounded-xl text-[10px] font-black border border-red-100 flex",
                                                            children: "UNASGND"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 604,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 599,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 598,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 text-right pr-8",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex flex-col items-end gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[13px] font-black text-indigo-700 flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-bolt animate-pulse flex text-[14px]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                    lineNumber: 610,
                                                                    columnNumber: 105
                                                                }, this),
                                                                " ",
                                                                formatTimeSafe(session.updated_at)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 610,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[11px] font-bold text-gray-300 leading-none",
                                                            children: formatDateSafe(session.updated_at)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                                            lineNumber: 611,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 609,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 608,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleDelete(session.user_id, session.campaign_id),
                                                    className: "w-8 h-8 rounded-lg bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center group/del",
                                                    title: "Delete Session",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "flex fi fi-rr-trash text-[14px] group-hover/del:scale-110 transition-transform"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 620,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 615,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 614,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, key, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 529,
                                        columnNumber: 21
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 512,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 493,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 492,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 491,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "lg:hidden flex flex-col gap-4 mb-6",
                children: filteredItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "px-6 py-24 text-center bg-white rounded-2xl border border-slate-100",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-3 opacity-30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "flex fi fi-rr-search-heart text-5xl"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 637,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-[12px] font-black uppercase tracking-widest text-slate-400",
                                children: "No active sessions found"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 638,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 636,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/call-sessions.tsx",
                    lineNumber: 635,
                    columnNumber: 11
                }, this) : filteredItems.map((session)=>{
                    const key = `${session.user_id}|${session.campaign_id}`;
                    const isSelected = selectedKeys.includes(key);
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: `bg-white rounded-xl border ${isSelected ? 'border-indigo-500' : 'border-gray-100'} overflow-hidden transition-all duration-300`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/30",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                className: "rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer",
                                                checked: isSelected,
                                                onChange: ()=>toggleSelectRow(session.user_id, session.campaign_id)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 652,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-black text-[12px]",
                                                        children: session.agentName.charAt(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 659,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[13px] font-black text-gray-900 leading-none",
                                                                children: session.agentName
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 663,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] font-bold text-indigo-500 leading-none uppercase tracking-wider",
                                                                        children: session.employeeId
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 665,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[9px] font-black text-gray-300 uppercase tracking-widest truncate max-w-[120px]",
                                                                        children: session.orgName || 'No Org'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                        lineNumber: 666,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 664,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 662,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 658,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 651,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleDelete(session.user_id, session.campaign_id),
                                        className: "w-8 h-8 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "flex fi fi-rr-trash text-[12px]"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 675,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 671,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 650,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: `grid transition-all duration-300 ease-in-out ${expandedSessions.includes(key) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "overflow-hidden",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "p-4 flex flex-col gap-4 bg-white border-b border-slate-50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-black text-slate-400 uppercase tracking-widest",
                                                                children: "Auto Session"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 686,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: `px-2 py-0.5 rounded text-[9px] font-black border uppercase ${session.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : session.status === 'assigned' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`,
                                                                children: session.status.replace('_', ' ')
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 687,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 685,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "p-3 bg-slate-50 rounded-xl border border-slate-100/50",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[12px] font-black text-gray-800 leading-tight truncate",
                                                                children: session.campaignName
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 696,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[12px] font-bold text-indigo-600 leading-tight mt-1",
                                                                children: session.customerName
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 697,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 695,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 684,
                                                columnNumber: 23
                                            }, this),
                                            (session.manual_status || session.manual_campaign_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-black text-purple-400 uppercase tracking-widest",
                                                                children: "Manual Override"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 705,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-[9px] font-black uppercase",
                                                                children: session.manual_status?.replace('_', ' ') || 'MANUAL'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 706,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 704,
                                                        columnNumber: 28
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "p-3 bg-purple-50/30 rounded-xl border border-purple-100/30",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[12px] font-black text-gray-800 leading-tight truncate",
                                                                children: session.manualCampaignName
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 711,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[12px] font-bold text-purple-600 leading-tight mt-1",
                                                                children: session.manualCustomerName
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                                lineNumber: 712,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                                        lineNumber: 710,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 703,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 682,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                    lineNumber: 681,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 680,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "px-4 py-3 flex items-center justify-between bg-white overflow-hidden",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-1.5",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>toggleExpand(session.user_id, session.campaign_id),
                                                className: `w-7 h-7 rounded-lg flex items-center justify-center transition-all ${expandedSessions.includes(key) ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: `flex fi fi-rr-angle-small-${expandedSessions.includes(key) ? 'up' : 'down'} text-[14px]`
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 727,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 723,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-1 rounded-lg text-[8px] font-black border ${session.is_manual ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`,
                                                children: session.is_manual ? 'MANUAL' : 'A-SYNC'
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 730,
                                                columnNumber: 21
                                            }, this),
                                            session.is_unassigned && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "bg-red-50 text-red-500 px-2 py-1 rounded-lg text-[8px] font-black border border-red-100 uppercase",
                                                children: "Unasgd"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                                lineNumber: 734,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 722,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-right",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-[11px] font-black text-indigo-700 flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-bolt text-[10px]"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/call-sessions.tsx",
                                                    lineNumber: 739,
                                                    columnNumber: 23
                                                }, this),
                                                " ",
                                                formatTimeSafe(session.updated_at)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/call-sessions.tsx",
                                            lineNumber: 738,
                                            columnNumber: 21
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 737,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 721,
                                columnNumber: 17
                            }, this)
                        ]
                    }, key, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 648,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 633,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 order-2 sm:order-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 transition-all hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "flex fi fi-rr-arrow-small-left text-[14px]"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 753,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "hidden xs:inline",
                                        children: "Prev"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 754,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 752,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        className: "w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-xl text-[11px] font-black transition-all active:scale-90",
                                        children: "1"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 758,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        className: "w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-400 rounded-xl text-[11px] font-black hover:border-indigo-100 hover:text-indigo-600 transition-all active:scale-90",
                                        children: "2"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 759,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 757,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                className: "flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 transition-all hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "hidden xs:inline",
                                        children: "Next"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 763,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "flex fi fi-rr-arrow-small-right text-[14px]"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/call-sessions.tsx",
                                        lineNumber: 764,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/call-sessions.tsx",
                                lineNumber: 762,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 751,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-[10px] font-black text-slate-300 uppercase tracking-widest order-1 sm:order-2",
                        children: [
                            "Showing ",
                            filteredItems.length,
                            " of ",
                            sessions.length,
                            " Sessions"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/call-sessions.tsx",
                        lineNumber: 768,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/call-sessions.tsx",
                lineNumber: 750,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/portal/call-sessions.tsx",
        lineNumber: 337,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__cd8e205a._.js.map