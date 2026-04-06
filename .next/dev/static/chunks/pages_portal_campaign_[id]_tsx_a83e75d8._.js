(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/pages/portal/campaign/[id].tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CampaignDetails
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authService.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSessionState.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCallSessionRedirect$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useCallSessionRedirect.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/AreaChart.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Area.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ImportCustomersModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$campaign$2f$CampaignStatsGrid$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/campaign/CampaignStatsGrid.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$campaign$2f$CampaignHeader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/campaign/CampaignHeader.tsx [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
const COLORS = [
    '#4b33e8',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#FF4560',
    '#775DD0'
];
function CampaignDetails() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { id } = router.query;
    const { user, loading: authLoading, mounted: userMounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    // Permission Flags using the global user
    const isLevel1User = user?.isClient === true && (user?.designation?.toLowerCase() === 'agent' || !user?.designation);
    const isLevel2User = user?.isClient === true && (user?.designation?.toLowerCase() === 'team_leader' || user?.designation?.toLowerCase() === 'manager');
    const userId = user?.uid;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCallSessionRedirect$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useCallSessionRedirect"])(userId);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [campaign, setCampaign] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        totalCustomers: 0,
        followupCount: 0,
        overdueCount: 0,
        freshProspects: 0,
        upcomingProspects: 0,
        recentCount: 0,
        managedCount: 0
    });
    const [analytics, setAnalytics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        hourly_calls: [],
        agent_performance: [],
        disposition_stats: [],
        hourly_detailed: [],
        caller_performance: []
    });
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"])("camp_selectedDate", new Date().toISOString().split('T')[0]);
    const [leads, setLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recentCalls, setRecentCalls] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [overdueLeads, setOverdueLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [upcomingLeads, setUpcomingLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [managedLeads, setManagedLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingLeads, setLoadingLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [expandedChart, setExpandedChart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [campaignStats, setCampaignStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        talkTime: '0h 0m',
        totalDials: 0
    });
    const dateInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"])("camp_currentPage", 1);
    const [leadsPerPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(10);
    const [totalLeadsCount, setTotalLeadsCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [teamMemberIds, setTeamMemberIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CampaignDetails.useEffect": ()=>{
            setMounted(true);
        }
    }["CampaignDetails.useEffect"], []);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"])("camp_searchQuery", "");
    const [selectedLeads, setSelectedLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedUserFilter, setSelectedUserFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"])("camp_selectedUserFilter", "");
    const [selectedDispositionFilter, setSelectedDispositionFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"])("camp_selectedDispFilter", "");
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const formatDate = (dateStr)=>{
        if (!dateStr) return '—';
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return '—';
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = String(date.getFullYear());
            return `${day}/${month}/${year}`;
        } catch (e) {
            return '—';
        }
    };
    const fetchCampaignData = async ()=>{
        if (!id) return;
        try {
            setLoading(true);
            // 1. Fetch Campaign Details with organization
            const { data: cRows, error: campaignError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('*, organizations(id, company_name, org_code)').eq('id', id).limit(1);
            const campaignData = cRows ? cRows[0] : null;
            if (campaignError) throw campaignError;
            setCampaign(campaignData);
            const now = new Date().toISOString();
            const twentyFourHoursAgoCount = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            // 2. Fetch Stats & Analytics in Parallel
            // User constraints are now defined at the component level
            // --- LEVEL 2: Fetch Team Members if applicable ---
            let effectiveTeamMembers = [];
            if (isLevel2User && userId) {
                const { data: teamData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', userId).eq('is_active', true);
                if (teamData && teamData.length > 0) {
                    // Collect all members from teams where user is leader
                    const allMembers = teamData.flatMap((t)=>t.members || []);
                    // Intersection with campaign users
                    const campaignUserIds = (campaignData?.users || []).map((u)=>u.user_id || u.id);
                    effectiveTeamMembers = allMembers.filter((mid)=>campaignUserIds.includes(mid));
                    // Also include the TL themselves if they are in the campaign
                    if (campaignUserIds.includes(userId) && !effectiveTeamMembers.includes(userId)) {
                        effectiveTeamMembers.push(userId);
                    }
                    console.log('--- TL Debug ---', {
                        userId,
                        allMembers,
                        campaignUserIds,
                        effectiveTeamMembers
                    });
                    setTeamMemberIds(effectiveTeamMembers);
                }
            }
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            // Prepare Queries based on User Level
            // Total Customers
            let qTotal = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id);
            if (isLevel1User && userId) qTotal = qTotal.eq('assigned_to', userId);
            if (isLevel2User) qTotal = effectiveTeamMembers.length > 0 ? qTotal.in('assigned_to', effectiveTeamMembers) : qTotal.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Follow-ups
            let qFollowup = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).eq('status', 'followup');
            if (isLevel1User && userId) qFollowup = qFollowup.eq('assigned_to', userId);
            if (isLevel2User) qFollowup = effectiveTeamMembers.length > 0 ? qFollowup.in('assigned_to', effectiveTeamMembers) : qFollowup.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Overdue
            let qOverdue = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).eq('status', 'followup').lt('expiry_date', now);
            if (isLevel1User && userId) qOverdue = qOverdue.eq('assigned_to', userId);
            if (isLevel2User) qOverdue = effectiveTeamMembers.length > 0 ? qOverdue.in('assigned_to', effectiveTeamMembers) : qOverdue.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Upcoming
            let qUpcoming = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).eq('status', 'followup').gte('expiry_date', now);
            if (isLevel1User && userId) qUpcoming = qUpcoming.eq('assigned_to', userId);
            if (isLevel2User) qUpcoming = effectiveTeamMembers.length > 0 ? qUpcoming.in('assigned_to', effectiveTeamMembers) : qUpcoming.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Managed
            let qManaged = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).not('managed_by', 'is', null);
            if (isLevel1User && userId) qManaged = qManaged.eq('assigned_to', userId);
            if (isLevel2User) qManaged = effectiveTeamMembers.length > 0 ? qManaged.in('assigned_to', effectiveTeamMembers) : qManaged.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            // Fresh (Unassigned or explicitly Fresh)
            let qFresh = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).is('disposition', null).eq('attempt_count', 0);
            // Recent (Calls made by specific user if L1, or team if L2)
            let qRecentCount = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id).gte('created_at', twentyFourHoursAgoCount);
            if (isLevel1User && userId) qRecentCount = qRecentCount.eq('agent_id', userId);
            if (isLevel2User) qRecentCount = effectiveTeamMembers.length > 0 ? qRecentCount.in('agent_id', effectiveTeamMembers) : qRecentCount.eq('agent_id', '00000000-0000-0000-0000-000000000000');
            // Analytics (Client-side aggregation to avoid RPC timeout)
            const rangeStart = new Date(selectedDate);
            rangeStart.setHours(0, 0, 0, 0);
            const rangeEnd = new Date(selectedDate);
            rangeEnd.setHours(23, 59, 59, 999);
            const startISO = rangeStart.toISOString();
            const endISO = rangeEnd.toISOString();
            const analyticsPromise = (async ()=>{
                try {
                    const { data: logs, error: logsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('agent_id, duration, created_at, disposition, is_connected').eq('campaign_id', id).gte('created_at', startISO).lte('created_at', endISO);
                    if (logsError) throw logsError;
                    const hourlyMap = {};
                    const callerMap = {};
                    const dispMap = {};
                    (logs || []).forEach((log)=>{
                        // Hourly Stats
                        const hour = new Date(log.created_at).getHours();
                        if (!hourlyMap[hour]) {
                            hourlyMap[hour] = {
                                hour,
                                total_calls: 0,
                                connected_calls: 0,
                                outgoing_calls: 0,
                                incoming_calls: 0,
                                missed_calls: 0,
                                total_duration: 0
                            };
                        }
                        const hStats = hourlyMap[hour];
                        hStats.total_calls++;
                        hStats.total_duration += log.duration || 0;
                        // Disposition Stats
                        const disp = log.disposition || 'No Disposition';
                        dispMap[disp] = (dispMap[disp] || 0) + 1;
                        // Caller Performance
                        const agentId = log.agent_id;
                        if (!callerMap[agentId]) {
                            callerMap[agentId] = {
                                user_id: agentId,
                                total_calls: 0,
                                connected_calls: 0,
                                total_duration: 0,
                                incoming_calls: 0,
                                outgoing_calls: 0,
                                missed_calls: 0
                            };
                        }
                        const cStats = callerMap[agentId];
                        cStats.total_calls++;
                        cStats.total_duration += log.duration || 0;
                        const isConnected = (log.duration || 0) > 0 || String(log.is_connected).toLowerCase() === 'true' || String(log.is_connected).toLowerCase() === 'yes';
                        if (isConnected) {
                            hStats.connected_calls++;
                            cStats.connected_calls++;
                        } else {
                            hStats.missed_calls++;
                            cStats.missed_calls++;
                        }
                        // Assuming outgoing for campaign dashboard stats
                        hStats.outgoing_calls++;
                        cStats.outgoing_calls++;
                    });
                    return {
                        data: {
                            hourly_calls: Object.values(hourlyMap).map((h)=>({
                                    hour: h.hour,
                                    count: h.total_calls
                                })).sort((a, b)=>a.hour - b.hour),
                            agent_performance: [],
                            disposition_stats: Object.entries(dispMap).map(([d, c])=>({
                                    name: d,
                                    value: c
                                })),
                            hourly_detailed: Object.values(hourlyMap).sort((a, b)=>a.hour - b.hour),
                            caller_performance: Object.values(callerMap)
                        },
                        error: null
                    };
                } catch (e) {
                    console.error("Failed to aggregate analytics:", e);
                    return {
                        data: null,
                        error: e
                    };
                }
            })();
            const [{ count: totalCount }, { count: followupCount }, { count: overdueCount }, { count: freshCount }, { count: upcomingCount }, { count: recentCount }, { count: managedCount }, analyticsResponse, todayStatsResponse] = await Promise.all([
                qTotal,
                qFollowup,
                qOverdue,
                qFresh,
                qUpcoming,
                qRecentCount,
                qManaged,
                analyticsPromise,
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].rpc('get_today_campaign_stats', {
                    campaign_id_input: id
                }) // 8
            ]);
            setStats({
                totalCustomers: totalCount || 0,
                followupCount: followupCount || 0,
                overdueCount: overdueCount || 0,
                freshProspects: freshCount || 0,
                upcomingProspects: upcomingCount || 0,
                recentCount: recentCount || 0,
                managedCount: managedCount || 0
            });
            // Process Analytics (Always use aggregation result)
            const { data: analyticsResult, error: analyticsError } = analyticsResponse;
            // --- USER PROFILES: Fetch all profiles needed for analytics and tiles ---
            // Collect all agent IDs that appear in today's analytics
            const analyticsAgentIds = (analyticsResult?.caller_performance || []).map((p)=>p.user_id).filter(Boolean);
            const allRequiredProfileIds = [
                ...new Set([
                    userId,
                    ...effectiveTeamMembers,
                    ...analyticsAgentIds
                ])
            ].filter(Boolean);
            let userProfiles = [];
            if (allRequiredProfileIds.length > 0) {
                const { data: profiles } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('id, user_id, user_name, employee_id').or(`user_id.in.(${allRequiredProfileIds.join(',')}),id.in.(${allRequiredProfileIds.join(',')})`);
                userProfiles = profiles || [];
            }
            const findUser = (targetId)=>userProfiles.find((p)=>p.user_id === targetId || p.id === targetId);
            if (!analyticsError && analyticsResult) {
                // Enrich caller_performance with names from userProfiles
                const enrichedCallerPerformance = (analyticsResult.caller_performance || []).map((perf)=>{
                    const profile = findUser(perf.user_id);
                    return {
                        ...perf,
                        caller: profile?.user_name || 'Unknown Agent',
                        user_name: profile?.user_name || 'Unknown Agent',
                        employee_id: profile?.employee_id || 'N/A'
                    };
                });
                setAnalytics({
                    hourly_calls: analyticsResult.hourly_calls || [],
                    agent_performance: analyticsResult.agent_performance || [],
                    disposition_stats: analyticsResult.disposition_stats || [],
                    hourly_detailed: analyticsResult.hourly_detailed || [],
                    caller_performance: enrichedCallerPerformance
                });
                // Update Campaign-wide Stats (Talktime & Dials) from the new data source
                const perfData = analyticsResult.caller_performance || [];
                const totalDials = perfData.reduce((sum, row)=>sum + (Number(row.total_calls) || 0), 0);
                const totalDuration = perfData.reduce((sum, row)=>sum + (Number(row.total_duration) || 0), 0);
                const hours = Math.floor(totalDuration / 3600);
                const minutes = Math.floor(totalDuration % 3600 / 60);
                setCampaignStats({
                    talkTime: `${hours}h ${minutes}m`,
                    totalDials: totalDials
                });
            } else if (analyticsError) {
                console.error("Analytics fetch error:", analyticsError);
            }
            // 3. Fetch Tile Data (Recent, Overdue, Upcoming, Managed) in Parallel
            // Prepare Tile Queries (Modified to avoid Relationship error on call_logs -> customers)
            let qRecentLogs = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select(`id, disposition, sub_disposition, created_at, agent_id, customer_id`).eq('campaign_id', id).gte('created_at', twentyFourHoursAgo).order('created_at', {
                ascending: false
            }).limit(3);
            if (isLevel1User && userId) qRecentLogs = qRecentLogs.eq('agent_id', userId);
            if (isLevel2User) qRecentLogs = effectiveTeamMembers.length > 0 ? qRecentLogs.in('agent_id', effectiveTeamMembers) : qRecentLogs.eq('agent_id', '00000000-0000-0000-0000-000000000000');
            let qOverdueLeads = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, disposition, sub_disposition, expiry_date, assigned_to, managed_by').eq('campaign_id', id).eq('status', 'followup').lt('expiry_date', now).order('expiry_date', {
                ascending: true
            }).limit(3);
            if (isLevel1User && userId) qOverdueLeads = qOverdueLeads.eq('assigned_to', userId);
            if (isLevel2User) qOverdueLeads = effectiveTeamMembers.length > 0 ? qOverdueLeads.in('assigned_to', effectiveTeamMembers) : qOverdueLeads.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            let qUpcomingLeads = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, disposition, sub_disposition, expiry_date, assigned_to, managed_by').eq('campaign_id', id).eq('status', 'followup').gte('expiry_date', now).order('expiry_date', {
                ascending: true
            }).limit(3);
            if (isLevel1User && userId) qUpcomingLeads = qUpcomingLeads.eq('assigned_to', userId);
            if (isLevel2User) qUpcomingLeads = effectiveTeamMembers.length > 0 ? qUpcomingLeads.in('assigned_to', effectiveTeamMembers) : qUpcomingLeads.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            let qManagedLeads = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, managed_by, assigned_to').eq('campaign_id', id).not('managed_by', 'is', null).order('created_at', {
                ascending: false
            }).limit(3);
            if (isLevel1User && userId) qManagedLeads = qManagedLeads.eq('assigned_to', userId);
            if (isLevel2User) qManagedLeads = effectiveTeamMembers.length > 0 ? qManagedLeads.in('assigned_to', effectiveTeamMembers) : qManagedLeads.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            const [recentRes, overdueRes, upcomingRes, managedRes] = await Promise.all([
                qRecentLogs,
                qOverdueLeads,
                qUpcomingLeads,
                qManagedLeads
            ]);
            const recentData = recentRes.data || [];
            const overdueData = overdueRes.data || [];
            const upcomingData = upcomingRes.data || [];
            const managedData = managedRes.data || [];
            // 4. Manual Join for Recent Logs Customers (Fixing missing FK)
            const recentCustomerIds = [
                ...new Set(recentData.map((d)=>d.customer_id).filter(Boolean))
            ];
            let recentCustomerMap = {};
            if (recentCustomerIds.length > 0) {
                const { data: cData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, expiry_date').in('id', recentCustomerIds);
                if (cData) {
                    cData.forEach((c)=>{
                        recentCustomerMap[c.id] = c;
                    });
                }
            }
            // 4b. Collect additional User IDs that might have appeared in Tile data but not in team/agent lists
            const extraUserIds = [
                ...new Set([
                    ...recentData.map((d)=>d.agent_id),
                    ...overdueData.map((d)=>d.assigned_to),
                    ...overdueData.map((d)=>d.managed_by),
                    ...upcomingData.map((d)=>d.assigned_to),
                    ...upcomingData.map((d)=>d.managed_by),
                    ...managedData.map((d)=>d.managed_by),
                    ...managedData.map((d)=>d.assigned_to)
                ])
            ].filter((id)=>id && !userProfiles.some((p)=>p.user_id === id || p.id === id));
            if (extraUserIds.length > 0) {
                const { data: extraProfiles } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('id, user_id, user_name, employee_id').or(`user_id.in.(${extraUserIds.join(',')}),id.in.(${extraUserIds.join(',')})`);
                if (extraProfiles) {
                    userProfiles = [
                        ...userProfiles,
                        ...extraProfiles
                    ];
                }
            }
            // Enrich Recent Calls
            setRecentCalls(recentData.map((log)=>{
                const caller = findUser(log.agent_id);
                const customer = recentCustomerMap[log.customer_id];
                return {
                    ...log,
                    caller_name: caller?.user_name || 'System',
                    caller_emp_id: caller?.employee_id || 'N/A',
                    customers: customer ? {
                        customer_name: customer.customer_name,
                        expiry_date: customer.expiry_date
                    } : null
                };
            }));
            // Enrich Overdue
            setOverdueLeads(overdueData.map((lead)=>{
                const agent = findUser(lead.assigned_to);
                return {
                    ...lead,
                    agent_name: agent?.user_name || 'Unassigned',
                    agent_emp_id: agent?.employee_id || '—'
                };
            }));
            // Enrich Upcoming
            setUpcomingLeads(upcomingData.map((lead)=>{
                const agent = findUser(lead.assigned_to);
                return {
                    ...lead,
                    agent_name: agent?.user_name || 'Unassigned',
                    agent_emp_id: agent?.employee_id || '—'
                };
            }));
            // Enrich Managed Leads
            setManagedLeads(managedData.map((lead)=>{
                const manager = findUser(lead.managed_by);
                const agent = findUser(lead.assigned_to);
                return {
                    ...lead,
                    manager_name: manager?.user_name || 'Unknown',
                    manager_emp_id: manager?.employee_id || 'N/A',
                    agent_name: agent?.user_name || 'Unassigned',
                    agent_emp_id: agent?.employee_id || '—'
                };
            }));
            // 2. Fetch Leads - Pass effective members directly to avoid waiting for state update
            fetchLeads(undefined, effectiveTeamMembers);
        } catch (err) {
            console.error("Error fetching campaign details:", err);
            setError(err.message || "Failed to load campaign details");
        } finally{
            setLoading(false);
        }
    };
    const fetchLeads = async (pageOverride, teamIdsOverride)=>{
        if (!id) return;
        try {
            setLoadingLeads(true);
            // Use the override if provided (e.g. when search changes), otherwise use state
            const targetPage = pageOverride || currentPage;
            // Build base query for count
            let countQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*', {
                count: 'exact',
                head: true
            }).eq('campaign_id', id);
            if (isLevel1User && user?.uid) {
                countQuery = countQuery.eq('assigned_to', user.uid);
            } else if (isLevel2User) {
                const activeTeamIds = teamIdsOverride || teamMemberIds;
                countQuery = activeTeamIds.length > 0 ? countQuery.in('assigned_to', activeTeamIds) : countQuery.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            }
            if (searchQuery) {
                let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%`;
                // If search looks like a phone number
                if (searchQuery.replace(/\D/g, '').length > 0) {
                    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["computePhoneHash"])(searchQuery);
                    if (hash) {
                        orConditions += `,phone_search_hash.eq.${hash}`;
                    }
                }
                countQuery = countQuery.or(orConditions);
            }
            if (selectedUserFilter && selectedUserFilter !== 'ALL') {
                countQuery = countQuery.eq('assigned_to', selectedUserFilter);
            }
            if (selectedDispositionFilter) {
                if (selectedDispositionFilter === 'Fresh') {
                    countQuery = countQuery.is('disposition', null);
                } else {
                    countQuery = countQuery.eq('disposition', selectedDispositionFilter);
                }
            }
            const { count: totalCount } = await countQuery;
            setTotalLeadsCount(totalCount || 0);
            const from = (targetPage - 1) * leadsPerPage;
            const to = from + leadsPerPage - 1;
            // Build base query for data
            let dataQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*').eq('campaign_id', id);
            if (isLevel1User && user?.uid) {
                dataQuery = dataQuery.eq('assigned_to', user.uid);
            } else if (isLevel2User) {
                const activeTeamIds = teamIdsOverride || teamMemberIds;
                dataQuery = activeTeamIds.length > 0 ? dataQuery.in('assigned_to', activeTeamIds) : dataQuery.eq('assigned_to', '00000000-0000-0000-0000-000000000000');
            }
            if (searchQuery) {
                let orConditions = `customer_name.ilike.%${searchQuery}%,phone_no.ilike.%${searchQuery}%`;
                // If search looks like a phone number
                if (searchQuery.replace(/\D/g, '').length > 0) {
                    const hash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["computePhoneHash"])(searchQuery);
                    if (hash) {
                        orConditions += `,phone_search_hash.eq.${hash}`;
                    }
                }
                dataQuery = dataQuery.or(orConditions);
            }
            if (selectedUserFilter && selectedUserFilter !== 'ALL') {
                dataQuery = dataQuery.eq('assigned_to', selectedUserFilter);
            }
            if (selectedDispositionFilter) {
                if (selectedDispositionFilter === 'Fresh') {
                    dataQuery = dataQuery.is('disposition', null);
                } else {
                    dataQuery = dataQuery.eq('disposition', selectedDispositionFilter);
                }
            }
            const { data, error } = await dataQuery.order('expiry_date', {
                ascending: true
            }).range(from, to);
            if (error) throw error;
            // Fetch assigned user names and last updated by info
            const allUserIds = [
                ...new Set((data || []).flatMap((c)=>[
                        c.assigned_to,
                        c.last_updated_by,
                        c.managed_by
                    ]).filter((userId)=>userId))
            ];
            let userMap = {};
            if (allUserIds.length > 0) {
                const { data: userData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("user_id, user_name, employee_id").in("user_id", allUserIds);
                if (userData) {
                    userData.forEach((u)=>{
                        const info = {
                            name: u.user_name || "Unknown",
                            empId: u.employee_id || "N/A"
                        };
                        userMap[u.user_id] = info;
                    });
                }
            }
            // Re-fetch with 'id' to be absolutely sure we can map both
            if (allUserIds.length > 0) {
                const { data: userDataById } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, user_name, employee_id").in("id", allUserIds);
                if (userDataById) {
                    userDataById.forEach((u)=>{
                        userMap[u.id] = {
                            name: u.user_name || "Unknown",
                            empId: u.employee_id || "N/A"
                        };
                    });
                }
            }
            const enrichedLeads = (data || []).map((lead)=>({
                    ...lead,
                    // assigned_to mapping
                    assigned_user_name: lead.assigned_to ? userMap[lead.assigned_to]?.name : "Unassigned",
                    assigned_user_info: lead.assigned_to ? userMap[lead.assigned_to] : null,
                    // managed_by mapping
                    managed_by_name: lead.managed_by ? userMap[lead.managed_by]?.name : "Self",
                    managed_by_id: lead.managed_by ? userMap[lead.managed_by]?.empId : null,
                    // last_updated_by mapping
                    last_updated_by_info: lead.last_updated_by ? userMap[lead.last_updated_by] : null
                }));
            setLeads(enrichedLeads);
        } catch (err) {
            console.error("Error fetching leads:", err);
            setLeads([]);
        } finally{
            setLoadingLeads(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CampaignDetails.useEffect": ()=>{
            if (!router.isReady || !id || authLoading || !userId) return;
            fetchCampaignData();
        }
    }["CampaignDetails.useEffect"], [
        router.isReady,
        id,
        userId,
        isLevel1User,
        authLoading,
        selectedDate
    ]);
    // Effect for Page Change (Standard pagination)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CampaignDetails.useEffect": ()=>{
            if (id) fetchLeads();
        }
    }["CampaignDetails.useEffect"], [
        id,
        currentPage
    ]);
    // Handle pagination change
    const onPageChange = (newPage)=>{
        setCurrentPage(newPage);
        fetchLeads(newPage);
    };
    // Handle Search
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CampaignDetails.useEffect": ()=>{
            const timer = setTimeout({
                "CampaignDetails.useEffect.timer": ()=>{
                    setCurrentPage(1);
                    fetchLeads(1);
                }
            }["CampaignDetails.useEffect.timer"], 500);
            return ({
                "CampaignDetails.useEffect": ()=>clearTimeout(timer)
            })["CampaignDetails.useEffect"];
        }
    }["CampaignDetails.useEffect"], [
        searchQuery
    ]);
    // Handle Filter Changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CampaignDetails.useEffect": ()=>{
            setCurrentPage(1);
            fetchLeads(1);
        }
    }["CampaignDetails.useEffect"], [
        selectedUserFilter,
        selectedDispositionFilter
    ]);
    const toggleSelect = (id)=>{
        setSelectedLeads((prev)=>prev.includes(id) ? prev.filter((l)=>l !== id) : [
                ...prev,
                id
            ]);
    };
    const toggleSelectAll = ()=>{
        const pageIds = leads.map((l)=>l.id);
        const allSelected = pageIds.every((id)=>selectedLeads.includes(id));
        if (allSelected) {
            setSelectedLeads((prev)=>prev.filter((id)=>!pageIds.includes(id)));
        } else {
            setSelectedLeads((prev)=>[
                    ...new Set([
                        ...prev,
                        ...pageIds
                    ])
                ]);
        }
    };
    const [calling, setCalling] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleStartCalling = async ()=>{
        if (!id || !user) return;
        try {
            setCalling(true);
            // 0. Check for active/pending sessions across ALL campaigns first
            const { data: allSessions } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').eq('user_id', user.uid).in('status', [
                'active',
                'disposition_pending'
            ]);
            if (allSessions && allSessions.length > 0) {
                const activeSession = allSessions[0];
                console.log('[Session] Found active session in cross-campaign check, redirecting...', activeSession);
                router.push(`/campaign/${activeSession.campaign_id}/${activeSession.customer_id}`);
                return;
            }
            // 1. Check if user already has a session for THIS campaign
            const { data: campaignSession } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').eq('user_id', user.uid).eq('campaign_id', id).maybeSingle();
            if (campaignSession && campaignSession.status === 'assigned') {
                console.log('[Session] Found existing assigned session for this campaign, resuming...', campaignSession);
                router.push(`/campaign/${campaignSession.campaign_id}/${campaignSession.customer_id}`);
                return;
            }
            // 1. Assign Next Lead via RPC
            const { data: leadId, error: rpcError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].rpc('assign_next_lead', {
                p_campaign_id: id,
                p_user_id: user.uid
            });
            if (rpcError) throw rpcError;
            if (!leadId) {
                alert("No compatible leads found for assignment.");
                return;
            }
            // 2. Create/Update Call Session
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').upsert({
                user_id: user.uid,
                campaign_id: id,
                customer_id: leadId,
                status: 'assigned',
                updated_at: new Date().toISOString()
            });
            // 3. Redirect to Lead Page
            if (id && leadId) {
                router.push(`/campaign/${id}/${leadId}`);
            } else {
                throw new Error("Missing campaign ID or lead ID for redirection");
            }
        } catch (err) {
            console.error("Error starting call assignment:", err);
            alert(err.message || "Failed to assign lead");
        } finally{
            setCalling(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CampaignDetails.useEffect": ()=>{
            if (id) {
                fetchCampaignData();
            }
        }
    }["CampaignDetails.useEffect"], [
        id
    ]);
    const handleLogoutClick = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["handleLogout"])(router);
    };
    const SkeletonTile = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl p-6 border border-gray-100 min-h-[320px] animate-pulse",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 rounded-xl bg-gray-100"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 843,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "h-4 w-24 bg-gray-100 rounded"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 844,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 842,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-7 h-7 rounded-full bg-gray-100"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 846,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 841,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-16 bg-gray-50 rounded-2xl"
                        }, i, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 850,
                            columnNumber: 21
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 848,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 840,
            columnNumber: 9
        }, this);
    const SkeletonTable = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 border-b border-gray-50 flex justify-between",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 w-48 bg-gray-100 rounded"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 859,
                        columnNumber: 17
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 858,
                    columnNumber: 13
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 space-y-4",
                    children: [
                        1,
                        2,
                        3,
                        4,
                        5
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-10 bg-gray-50 rounded"
                        }, i, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 863,
                            columnNumber: 21
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 861,
                    columnNumber: 13
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 857,
            columnNumber: 9
        }, this);
    if ((loading || authLoading) && !campaign) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[1600px] mx-auto space-y-8 p-4 md:p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-32 bg-white rounded-3xl border border-gray-100 animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 873,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4",
                    children: [
                        1,
                        2,
                        3,
                        4,
                        5,
                        6,
                        7
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-24 bg-white rounded-2xl border border-gray-100 animate-pulse"
                        }, i, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 878,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 876,
                    columnNumber: 17
                }, this),
                userMounted && !isLevel1User && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                    children: [
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-[300px] bg-white rounded-2xl border border-gray-100 animate-pulse"
                        }, i, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 886,
                            columnNumber: 29
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 884,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonTable, {}, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 892,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonTile, {}, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 896,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SkeletonTile, {}, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 897,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 895,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 871,
            columnNumber: 13
        }, this);
    }
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-[#f6f5f7]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center p-8 bg-white rounded-2xl shadow-sm border border-red-100 max-w-md",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fi flex fi-rr-cross-circle text-4xl text-red-500 mb-4 justify-center"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 907,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold text-gray-800 mb-2",
                        children: "Error Occurred"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 908,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-gray-500 mb-6",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 909,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push('/campaign'),
                        className: "px-6 py-2 bg-[#4b33e8] text-white rounded-xl font-semibold shadow-md hover:opacity-90 transition-all",
                        children: "Back to Campaigns"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 910,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/campaign/[id].tsx",
                lineNumber: 906,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 905,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-[1600px] mx-auto space-y-8 p-4 md:p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2 text-xs text-gray-400 mb-8 px-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "cursor-pointer hover:text-[#4b33e8] transition-colors",
                            onClick: ()=>router.push('/campaign'),
                            children: "Campaigns"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 926,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-angle-small-right text-[10px]"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 927,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-600 font-bold",
                            children: campaign?.name
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 928,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 925,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$campaign$2f$CampaignHeader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    id: id,
                    campaign: campaign,
                    campaignStats: campaignStats,
                    calling: calling,
                    onStartCalling: handleStartCalling
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 932,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$campaign$2f$CampaignStatsGrid$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    stats: stats
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 941,
                    columnNumber: 17
                }, this),
                (isLevel2User || !isLevel1User) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8",
                        children: [
                            (campaign?.ishourlyactivitywidgevisible || isLevel2User) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px] relative transition-all duration-300 ${expandedChart === 'hourly' ? 'lg:col-span-3' : 'col-span-1 lg:col-span-1'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-bold text-gray-800 mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-chart-histogram text-[#4b33e8]"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 953,
                                                columnNumber: 41
                                            }, this),
                                            "Hourly Activity (Today) ",
                                            isLevel2User && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-2",
                                                children: "Team Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 954,
                                                columnNumber: 82
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 952,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 w-full min-h-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                            width: "100%",
                                            height: "100%",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__["AreaChart"], {
                                                data: analytics.hourly_calls,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                                                            id: "colorCount",
                                                            x1: "0",
                                                            y1: "0",
                                                            x2: "0",
                                                            y2: "1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                    offset: "5%",
                                                                    stopColor: "#4b33e8",
                                                                    stopOpacity: 0.3
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 961,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                                                    offset: "95%",
                                                                    stopColor: "#4b33e8",
                                                                    stopOpacity: 0
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 962,
                                                                    columnNumber: 62
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 960,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 959,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                        strokeDasharray: "3 3",
                                                        vertical: false,
                                                        stroke: "#f0f0f0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 965,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                        dataKey: "hour",
                                                        tick: {
                                                            fontSize: 10,
                                                            fill: '#9ca3af'
                                                        },
                                                        axisLine: false,
                                                        tickLine: false,
                                                        tickFormatter: (tick)=>`${tick}:00`
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 966,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                                        hide: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 973,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                        contentStyle: {
                                                            borderRadius: '12px',
                                                            border: 'none',
                                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                                        },
                                                        labelStyle: {
                                                            color: '#6b7280',
                                                            fontSize: '10px',
                                                            fontWeight: 'bold'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 974,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Area"], {
                                                        type: "monotone",
                                                        dataKey: "count",
                                                        stroke: "#4b33e8",
                                                        strokeWidth: 3,
                                                        fillOpacity: 1,
                                                        fill: "url(#colorCount)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 978,
                                                        columnNumber: 54
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 958,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 957,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 956,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setExpandedChart(expandedChart === 'hourly' ? null : 'hourly'),
                                        className: "absolute bottom-4 right-4 text-gray-400 hover:text-[#4b33e8] transition-colors p-2 hover:bg-gray-50 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: `fi ${expandedChart === 'hourly' ? 'fi-rr-compress' : 'fi-rr-expand'} text-xs`
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 993,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 989,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 949,
                                columnNumber: 33
                            }, this),
                            (campaign?.istopagentvwidgetvisible || isLevel2User) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[300px] relative transition-all duration-300 ${expandedChart === 'users' ? 'lg:col-span-3' : 'col-span-1 lg:col-span-1'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-bold text-gray-800 mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-trophy text-yellow-500"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1004,
                                                columnNumber: 46
                                            }, this),
                                            "Top Agents (Today) ",
                                            isLevel2User && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-2",
                                                children: "Team Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1005,
                                                columnNumber: 82
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1003,
                                        columnNumber: 42
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 w-full min-h-0",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                            width: "100%",
                                            height: "100%",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                                data: analytics.agent_performance.filter((row)=>campaign?.users?.some((u)=>u.employee_id && u.employee_id === row.employee_id || u.name && u.name.toLowerCase() === row.name.toLowerCase())).slice(0, expandedChart === 'users' ? 20 : 5),
                                                layout: "vertical",
                                                barSize: 12,
                                                margin: {
                                                    top: 5,
                                                    right: 30,
                                                    left: 40,
                                                    bottom: 5
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                        strokeDasharray: "3 3",
                                                        horizontal: true,
                                                        vertical: false,
                                                        stroke: "#f0f0f0"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1022,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                        type: "number",
                                                        hide: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1023,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                                        dataKey: "name",
                                                        type: "category",
                                                        tick: {
                                                            fontSize: 10,
                                                            fill: '#4b5563',
                                                            fontWeight: 600
                                                        },
                                                        width: 60,
                                                        axisLine: false,
                                                        tickLine: false,
                                                        tickFormatter: (val)=>val.split(' ')[0]
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1024,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                        cursor: {
                                                            fill: 'transparent'
                                                        },
                                                        contentStyle: {
                                                            borderRadius: '8px'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1033,
                                                        columnNumber: 54
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                        dataKey: "calls",
                                                        fill: "#00C49F",
                                                        radius: [
                                                            0,
                                                            4,
                                                            4,
                                                            0
                                                        ],
                                                        background: {
                                                            fill: '#f9fafb',
                                                            radius: 4
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1034,
                                                        columnNumber: 54
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1009,
                                                columnNumber: 50
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1008,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1007,
                                        columnNumber: 42
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setExpandedChart(expandedChart === 'users' ? null : 'users'),
                                        className: "absolute bottom-4 right-4 text-gray-400 hover:text-[#4b33e8] transition-colors p-2 hover:bg-gray-50 rounded-lg",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                            className: `fi ${expandedChart === 'users' ? 'fi-rr-compress' : 'fi-rr-expand'} text-xs`
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1042,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1038,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1000,
                                columnNumber: 38
                            }, this),
                            (campaign?.iscalloutcomeswidgetvisible || isLevel2User) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 lg:col-span-1 flex flex-col h-[300px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-sm font-bold text-gray-800 mb-4 flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-pie-chart text-pink-500"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1051,
                                                columnNumber: 46
                                            }, this),
                                            "Call Outcomes ",
                                            isLevel2User && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full ml-2",
                                                children: "Team Mode"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1052,
                                                columnNumber: 77
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1050,
                                        columnNumber: 42
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 w-full min-h-0 relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                                width: "100%",
                                                height: "100%",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__["PieChart"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Pie"], {
                                                            data: analytics.disposition_stats,
                                                            cx: "50%",
                                                            cy: "50%",
                                                            innerRadius: 60,
                                                            outerRadius: 80,
                                                            paddingAngle: 5,
                                                            dataKey: "value",
                                                            children: analytics.disposition_stats.map((entry, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Cell"], {
                                                                    fill: COLORS[index % COLORS.length],
                                                                    strokeWidth: 0
                                                                }, `cell-${index}`, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1067,
                                                                    columnNumber: 62
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1057,
                                                            columnNumber: 54
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                            contentStyle: {
                                                                borderRadius: '8px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1070,
                                                            columnNumber: 54
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Legend"], {
                                                            verticalAlign: "middle",
                                                            align: "right",
                                                            layout: "vertical",
                                                            iconType: "circle",
                                                            iconSize: 8,
                                                            wrapperStyle: {
                                                                fontSize: '10px'
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1071,
                                                            columnNumber: 54
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1056,
                                                    columnNumber: 50
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1055,
                                                columnNumber: 46
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 flex items-center justify-center pointer-events-none pr-14",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs text-gray-400 font-bold block",
                                                            children: "TOTAL"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1077,
                                                            columnNumber: 54
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xl font-black text-gray-800",
                                                            children: analytics.disposition_stats.reduce((acc, curr)=>acc + curr.value, 0)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1078,
                                                            columnNumber: 54
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1076,
                                                    columnNumber: 50
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1075,
                                                columnNumber: 46
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1054,
                                        columnNumber: 42
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1049,
                                columnNumber: 38
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 946,
                        columnNumber: 25
                    }, this)
                }, void 0, false),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-8 mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6 border-b border-gray-50 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-bold text-gray-800 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-time-check text-[#4b33e8]"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1096,
                                                    columnNumber: 45
                                                }, this),
                                                "Hourly Performance Breakdown"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1095,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "group relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>dateInputRef.current?.showPicker(),
                                                        className: "flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-calendar text-indigo-500 text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1105,
                                                                columnNumber: 53
                                                            }, this),
                                                            new Date(selectedDate).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1101,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        ref: dateInputRef,
                                                        type: "date",
                                                        value: selectedDate,
                                                        onChange: (e)=>setSelectedDate(e.target.value),
                                                        className: "absolute inset-0 opacity-0 pointer-events-none w-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1108,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1100,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1099,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1094,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "bg-[#f9fafb]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Hour"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1122,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Total Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1123,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Connected Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1124,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Outgoing Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1125,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Incoming Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1126,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Missed Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1127,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Talktime"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1128,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1121,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1120,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-gray-50",
                                                children: analytics.hourly_detailed.length > 0 ? analytics.hourly_detailed.map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "hover:bg-gray-50/50 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-bold text-gray-700",
                                                                children: [
                                                                    "Time - ",
                                                                    row.hour % 12 === 0 ? 12 : row.hour % 12,
                                                                    " ",
                                                                    row.hour >= 12 ? 'pm' : 'am'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1135,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.total_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1138,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-green-600",
                                                                children: row.connected_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1139,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.outgoing_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1140,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.incoming_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1141,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-red-500",
                                                                children: row.missed_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1142,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: new Date(row.total_duration * 1000).toISOString().substr(11, 8)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1143,
                                                                columnNumber: 61
                                                            }, this)
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1134,
                                                        columnNumber: 57
                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        colSpan: 7,
                                                        className: "px-6 py-10 text-center text-xs text-gray-400 font-medium",
                                                        children: "No data available for today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1150,
                                                        columnNumber: 53
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1149,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1131,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1119,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1118,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1093,
                            columnNumber: 30
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-6 border-b border-gray-50 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-sm font-bold text-gray-800 flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-headset text-[#4b33e8]"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1164,
                                                    columnNumber: 45
                                                }, this),
                                                "Caller Performance Breakdown"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1163,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "group relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>dateInputRef.current?.showPicker(),
                                                        className: "flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-700 hover:border-indigo-200 hover:bg-white hover:shadow-sm transition-all focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-calendar text-indigo-500 text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1173,
                                                                columnNumber: 53
                                                            }, this),
                                                            new Date(selectedDate).toLocaleDateString('en-IN', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1169,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        ref: dateInputRef,
                                                        type: "date",
                                                        value: selectedDate,
                                                        onChange: (e)=>setSelectedDate(e.target.value),
                                                        className: "absolute inset-0 opacity-0 pointer-events-none w-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1176,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1168,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1167,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1162,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "overflow-x-auto",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                        className: "w-full text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                                className: "bg-[#f9fafb]",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Caller"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1190,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Total Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1191,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Connected Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1192,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Outgoing Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1193,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Incoming Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1194,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Missed Calls"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1195,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                            className: "px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider",
                                                            children: "Talktime"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1196,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1189,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1188,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                                className: "divide-y divide-gray-50",
                                                children: analytics.caller_performance.filter((row)=>campaign?.users?.some((u)=>u.employee_id && row.employee_id && u.employee_id === row.employee_id || u.name && row.caller && u.name.toLowerCase() === row.caller.toLowerCase() || u.id && row.user_id && u.id === row.user_id)).length > 0 ? analytics.caller_performance.filter((row)=>campaign?.users?.some((u)=>u.employee_id && row.employee_id && u.employee_id === row.employee_id || u.name && row.caller && u.name.toLowerCase() === row.caller.toLowerCase() || u.id && row.user_id && u.id === row.user_id)).map((row, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                        className: "hover:bg-gray-50/50 transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-bold text-gray-700 capitalize",
                                                                children: row.caller || 'Unknown Agent'
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1217,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.total_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1220,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-green-600",
                                                                children: row.connected_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1221,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.outgoing_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1222,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: row.incoming_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1223,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-red-500",
                                                                children: row.missed_calls
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1224,
                                                                columnNumber: 61
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                                className: "px-6 py-4 text-xs font-medium text-gray-600",
                                                                children: new Date((row.total_duration || 0) * 1000).toISOString().substr(11, 8)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1225,
                                                                columnNumber: 61
                                                            }, this)
                                                        ]
                                                    }, index, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1216,
                                                        columnNumber: 57
                                                    }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        colSpan: 7,
                                                        className: "px-6 py-10 text-center text-xs text-gray-400 font-medium",
                                                        children: "No data available for today"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1232,
                                                        columnNumber: 53
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1231,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1199,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1187,
                                        columnNumber: 37
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1186,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1161,
                            columnNumber: 29
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 1091,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0",
                                        style: {
                                            background: "#ffffff"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1251,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6 relative z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500 group-hover:bg-indigo-50 group-hover:text-[#4b33e8] transition-colors",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-time-past text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1255,
                                                            columnNumber: 50
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1254,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-gray-800 text-sm italic",
                                                                style: {
                                                                    color: "#263238",
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                children: "Recent Calls"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1258,
                                                                columnNumber: 50
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-1",
                                                                children: "Last 24 Hours"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1259,
                                                                columnNumber: 50
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1257,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1253,
                                                columnNumber: 42
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-gray-400 border border-gray-100",
                                                children: stats.recentCount
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1262,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1252,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex flex-col relative z-10",
                                        children: recentCalls.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center h-full py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2 border border-dashed border-gray-200",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-time-past text-gray-300 text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1270,
                                                        columnNumber: 54
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1269,
                                                    columnNumber: 50
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-400 font-black uppercase tracking-widest",
                                                    children: "No recent records"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1272,
                                                    columnNumber: 50
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1268,
                                            columnNumber: 46
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: recentCalls.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-3 rounded-2xl border border-gray-50 bg-gray-50/30 hover:bg-white hover:border-gray-200 transition-all group/item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col min-w-0 pr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize",
                                                                    children: item.customers?.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1279,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 flex-wrap",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-[#4b33e8] bg-indigo-50 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.caller_name?.split(' ')[0],
                                                                                        " (",
                                                                                        item.caller_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1282,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.disposition || 'Call',
                                                                                        item.sub_disposition && ` > ${item.sub_disposition}`
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1285,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1281,
                                                                            columnNumber: 66
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 text-gray-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-clock text-[8px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1291,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-bold leading-none",
                                                                                    children: formatDate(item.created_at)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1292,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-medium leading-none",
                                                                                    children: new Date(item.created_at).toLocaleTimeString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    })
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1293,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1290,
                                                                            columnNumber: 66
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1280,
                                                                    columnNumber: 63
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1278,
                                                            columnNumber: 58
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>{
                                                                if (id && item.customer_id) {
                                                                    router.push(`/campaign/${id}/${item.customer_id}`);
                                                                }
                                                            },
                                                            className: "w-8 h-8 rounded-lg bg-white flex items-center justify-center text-gray-400 hover:bg-[#4b33e8] hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-gray-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-call text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1305,
                                                                columnNumber: 62
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1297,
                                                            columnNumber: 58
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1277,
                                                    columnNumber: 54
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1275,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1266,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1250,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, rgb(239, 68, 68) 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1316,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6 relative z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-pending text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1320,
                                                            columnNumber: 50
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1319,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-gray-800 text-sm italic",
                                                                style: {
                                                                    color: "#263238",
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                children: "Overdue"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1323,
                                                                columnNumber: 50
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[9px] text-red-400 font-bold uppercase tracking-widest leading-none mt-1",
                                                                children: "Action Required"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1324,
                                                                columnNumber: 50
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1322,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1318,
                                                columnNumber: 42
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-7 h-7 rounded-full bg-red-500 flex items-center justify-center text-[11px] font-black text-white border border-red-600 shadow-lg shadow-red-100",
                                                children: stats.overdueCount
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1327,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1317,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex flex-col relative z-10",
                                        children: overdueLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center h-full py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-2 border border-red-100",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-check opacity-50 text-red-500 text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1335,
                                                        columnNumber: 54
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1334,
                                                    columnNumber: 50
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-red-500 font-black opacity-50 uppercase tracking-widest",
                                                    children: "All caught up"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1337,
                                                    columnNumber: 50
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1333,
                                            columnNumber: 46
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: overdueLeads.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-3 rounded-2xl border border-red-50 bg-red-50/10 hover:bg-white hover:border-red-200 transition-all group/item shadow-[0_0_15px_-10px_rgba(239,68,68,0.2)]",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col min-w-0 pr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize",
                                                                    children: item.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1344,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 flex-wrap",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-red-600 bg-red-50 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.agent_name?.split(' ')[0],
                                                                                        " (",
                                                                                        item.agent_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1347,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-red-400 border border-red-100 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.disposition || 'Follow Up',
                                                                                        item.sub_disposition && ` > ${item.sub_disposition}`
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1350,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1346,
                                                                            columnNumber: 66
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 text-red-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-calendar-clock text-[9px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1356,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-bold leading-none",
                                                                                    children: formatDate(item.expiry_date)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1357,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-medium leading-none",
                                                                                    children: item.expiry_date && String(item.expiry_date).includes('T') ? new Date(item.expiry_date).toLocaleTimeString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    }) : 'No Time'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1358,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1355,
                                                                            columnNumber: 66
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1345,
                                                                    columnNumber: 63
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1343,
                                                            columnNumber: 58
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>router.push(`/campaign/${id}/${item.id}`),
                                                            className: "w-8 h-8 rounded-lg bg-white flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-red-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-call text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1366,
                                                                columnNumber: 62
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1362,
                                                            columnNumber: 58
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1342,
                                                    columnNumber: 54
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1340,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1331,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1315,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, rgb(59, 130, 246) 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1377,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6 relative z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-clock text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1381,
                                                            columnNumber: 50
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1380,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-gray-800 text-sm italic",
                                                                style: {
                                                                    color: "#263238",
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                children: "Upcoming"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1384,
                                                                columnNumber: 50
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[9px] text-blue-400 font-bold uppercase tracking-widest leading-none mt-1",
                                                                children: "Scheduled Tasks"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1385,
                                                                columnNumber: 50
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1383,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1379,
                                                columnNumber: 42
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-gray-500 border border-gray-100",
                                                children: stats.upcomingProspects
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1388,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1378,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex flex-col relative z-10",
                                        children: upcomingLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center h-full py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-clock text-blue-300 text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1396,
                                                        columnNumber: 54
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1395,
                                                    columnNumber: 50
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-400 font-black uppercase tracking-widest",
                                                    children: "No scheduled tasks"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1398,
                                                    columnNumber: 50
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1394,
                                            columnNumber: 46
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: upcomingLeads.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-3 rounded-2xl border border-blue-50 bg-blue-50/10 hover:bg-white hover:border-blue-200 transition-all group/item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col min-w-0 pr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize",
                                                                    children: item.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1405,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col gap-1.5",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2 flex-wrap",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        "Agent: ",
                                                                                        item.agent_name?.split(' ')[0],
                                                                                        " (",
                                                                                        item.agent_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1408,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-blue-400 border border-blue-100 px-2 py-1 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        item.disposition || 'Scheduled',
                                                                                        item.sub_disposition && ` > ${item.sub_disposition}`
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1411,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1407,
                                                                            columnNumber: 66
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 text-blue-400",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-calendar-clock text-[9px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1417,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-bold leading-none",
                                                                                    children: formatDate(item.expiry_date)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1418,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-medium leading-none",
                                                                                    children: item.expiry_date && String(item.expiry_date).includes('T') ? new Date(item.expiry_date).toLocaleTimeString([], {
                                                                                        hour: '2-digit',
                                                                                        minute: '2-digit'
                                                                                    }) : 'No Time'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1419,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1416,
                                                                            columnNumber: 66
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1406,
                                                                    columnNumber: 63
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1404,
                                                            columnNumber: 58
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>router.push(`/campaign/${id}/${item.id}`),
                                                            className: "w-8 h-8 rounded-lg bg-white flex items-center justify-center text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-blue-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-call text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1427,
                                                                columnNumber: 62
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1423,
                                                            columnNumber: 58
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1403,
                                                    columnNumber: 54
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1401,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1392,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1376,
                                columnNumber: 34
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-2xl p-6  border border-gray-100 flex flex-col min-h-[320px] relative overflow-hidden group hover:shadow-lg transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute inset-0 opacity-[0.03]",
                                        style: {
                                            backgroundImage: "radial-gradient(circle, rgb(20, 184, 166) 1px, transparent 1px)",
                                            backgroundSize: "20px 20px"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1438,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6 relative z-10",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-500",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-briefcase text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1442,
                                                            columnNumber: 50
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1441,
                                                        columnNumber: 46
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-bold text-gray-800 text-sm italic",
                                                                style: {
                                                                    color: "#263238",
                                                                    fontFamily: "'Poppins', sans-serif"
                                                                },
                                                                children: "Managed By"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1445,
                                                                columnNumber: 50
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[9px] text-teal-400 font-bold uppercase tracking-widest leading-none mt-1",
                                                                children: "Assigned Leads"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1446,
                                                                columnNumber: 50
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1444,
                                                        columnNumber: 46
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1440,
                                                columnNumber: 42
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[11px] font-black text-gray-500 border border-gray-100",
                                                children: stats.managedCount
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1449,
                                                columnNumber: 42
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1439,
                                        columnNumber: 38
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 flex flex-col relative z-10",
                                        children: managedLeads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-col items-center justify-center h-full py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center mb-2",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-user-add text-teal-300 text-lg"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1457,
                                                        columnNumber: 54
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1456,
                                                    columnNumber: 50
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-400 font-black uppercase tracking-widest",
                                                    children: "No managed leads"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1459,
                                                    columnNumber: 50
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1455,
                                            columnNumber: 46
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: managedLeads.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-3 rounded-2xl border border-teal-50 bg-teal-50/10 hover:bg-white hover:border-teal-200 transition-all group/item",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col min-w-0 pr-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[11px] font-bold text-gray-800 truncate leading-none mb-2 capitalize",
                                                                    children: item.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1466,
                                                                    columnNumber: 62
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col gap-1.5 min-w-[120px]",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        "M: ",
                                                                                        item.manager_name?.split(' ')[0]
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1470,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-bold text-teal-400",
                                                                                    children: [
                                                                                        "(",
                                                                                        item.manager_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1473,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1469,
                                                                            columnNumber: 66
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded inline-block uppercase tracking-tighter",
                                                                                    children: [
                                                                                        "A: ",
                                                                                        item.agent_name?.split(' ')[0]
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1477,
                                                                                    columnNumber: 70
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "text-[8px] font-bold text-indigo-400",
                                                                                    children: [
                                                                                        "(",
                                                                                        item.agent_emp_id,
                                                                                        ")"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                                    lineNumber: 1480,
                                                                                    columnNumber: 70
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1476,
                                                                            columnNumber: 66
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1467,
                                                                    columnNumber: 62
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1465,
                                                            columnNumber: 58
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>router.push(`/campaign/${id}/${item.id}`),
                                                            className: "w-8 h-8 rounded-lg bg-white flex items-center justify-center text-teal-400 hover:bg-teal-500 hover:text-white transition-all shadow-sm group-hover/item:scale-110 active:scale-95 border border-teal-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-phone-call text-[10px]"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1488,
                                                                columnNumber: 62
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1484,
                                                            columnNumber: 58
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1464,
                                                    columnNumber: 54
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1462,
                                            columnNumber: 46
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1453,
                                        columnNumber: 38
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1437,
                                columnNumber: 34
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                        lineNumber: 1248,
                        columnNumber: 29
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 1246,
                    columnNumber: 25
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 min-h-[400px] relative overflow-hidden group hover:shadow-md transition-all",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute top-0 right-0 w-64 h-64 bg-indigo-50/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1501,
                            columnNumber: 33
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#4b33e8] border border-indigo-100/50 shadow-sm",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-users text-lg font-bold"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1506,
                                                columnNumber: 45
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1505,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-gray-800 text-xl leading-none mb-2",
                                                    style: {
                                                        color: "#263238",
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "All Leads"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1509,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-400 font-semibold tracking-[0.2em]",
                                                            children: [
                                                                "Campaign Database • ",
                                                                totalLeadsCount,
                                                                " Records"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1511,
                                                            columnNumber: 49
                                                        }, this),
                                                        selectedLeads.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "bg-[#4b33e8] text-white px-2 py-0.5 rounded text-[10px] font-bold  animate-in fade-in slide-in-from-left-4 duration-300",
                                                            children: [
                                                                selectedLeads.length,
                                                                " Selected"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1513,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1510,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1508,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1504,
                                    columnNumber: 37
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group/filter min-w-[140px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-user text-gray-400 text-xs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1525,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1524,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: selectedUserFilter || "ALL",
                                                    onChange: (e)=>setSelectedUserFilter(e.target.value),
                                                    className: "w-full h-[42px] pl-8 pr-8 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 focus:bg-white focus:border-[#4b33e8]/30 focus:ring-4 focus:ring-[#4b33e8]/5 outline-none transition-all uppercase tracking-wider appearance-none cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "ALL",
                                                            children: "All Users"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1532,
                                                            columnNumber: 49
                                                        }, this),
                                                        campaign?.users?.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: u.user_id || u.id,
                                                                children: u.name || u.displayName || 'User'
                                                            }, u.id, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1534,
                                                                columnNumber: 53
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1527,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-angle-small-down text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1538,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1537,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1523,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group/filter min-w-[140px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-filter text-gray-400 text-xs"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1545,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1544,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                    value: selectedDispositionFilter,
                                                    onChange: (e)=>setSelectedDispositionFilter(e.target.value),
                                                    className: "w-full h-[42px] pl-8 pr-8 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-600 focus:bg-white focus:border-[#4b33e8]/30 focus:ring-4 focus:ring-[#4b33e8]/5 outline-none transition-all uppercase tracking-wider appearance-none cursor-pointer",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "All Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1552,
                                                            columnNumber: 49
                                                        }, this),
                                                        [
                                                            'Fresh',
                                                            'Call Back',
                                                            'Not Interested',
                                                            'Converted',
                                                            'Follow Up',
                                                            'DNE',
                                                            'Busy',
                                                            'No Answer',
                                                            'Invalid Number',
                                                            'Wrong Number',
                                                            'Not Reachable'
                                                        ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: d,
                                                                children: d
                                                            }, d, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1554,
                                                                columnNumber: 53
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1547,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-angle-small-down text-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1558,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1557,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1543,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group/search min-w-[240px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-search text-gray-400 text-xs group-focus-within/search:text-[#4b33e8] transition-colors"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1564,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1563,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    placeholder: "SEARCH NAME OR PHONE...",
                                                    value: searchQuery,
                                                    onChange: (e)=>setSearchQuery(e.target.value),
                                                    className: "w-full h-[42px] pl-10 pr-4 rounded-xl bg-gray-50 border border-gray-100 text-[10px] font-black text-gray-600 focus:bg-white focus:border-[#4b33e8]/30 focus:ring-4 focus:ring-[#4b33e8]/5 outline-none transition-all placeholder:text-gray-300 tracking-widest uppercase"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1566,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1562,
                                            columnNumber: 41
                                        }, this),
                                        !isLevel1User && !isLevel2User && campaign?.isaddbulkbuttonvisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowImportModal(true),
                                            className: "flex items-center gap-2 px-6 h-[42px] bg-indigo-50 text-[#4b33e8] border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all uppercase tracking-widest",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-upload"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1584,
                                                    columnNumber: 50
                                                }, this),
                                                "Add Bulk"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1580,
                                            columnNumber: 46
                                        }, this),
                                        !isLevel1User && !isLevel2User && campaign?.isaddleadbuttonvisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "flex items-center gap-2 px-6 h-[42px] bg-[#4b33e8] text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:opacity-90 transition-all uppercase tracking-widest",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-plus"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1592,
                                                    columnNumber: 50
                                                }, this),
                                                "Add Lead"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1591,
                                            columnNumber: 46
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1521,
                                    columnNumber: 37
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1503,
                            columnNumber: 33
                        }, this),
                        loadingLeads ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center py-20",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-8 w-8 border-4 border-t-transparent border-[#4b33e8] mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1602,
                                    columnNumber: 41
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-gray-400 font-bold",
                                    children: "Fetching leads..."
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1603,
                                    columnNumber: 41
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1601,
                            columnNumber: 37
                        }, this) : leads.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1 flex flex-col items-center justify-center py-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-20 h-20 rounded-3xl bg-gray-50 flex items-center justify-center mb-6 border border-gray-100/50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-phone-call text-gray-200 text-3xl"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1608,
                                        columnNumber: 45
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1607,
                                    columnNumber: 41
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                    className: "text-gray-400 font-black text-sm mb-2",
                                    children: "No leads found"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1610,
                                    columnNumber: 41
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-gray-300 font-bold max-w-[200px] text-center",
                                    children: "There are no leads assigned to this campaign yet."
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1611,
                                    columnNumber: 41
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1606,
                            columnNumber: 37
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "overflow-x-auto -mx-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                className: "w-full text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "border-b border-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 w-10",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: leads.length > 0 && leads.every((l)=>selectedLeads.includes(l.id)),
                                                            onChange: toggleSelectAll,
                                                            className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1620,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1619,
                                                        columnNumber: 57
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1618,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Customer Name"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1628,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Contact Info"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1629,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center",
                                                    children: "Status"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1630,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center",
                                                    children: "Disposition/Sub"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1631,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Expiry Date"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1632,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Assigned To"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1633,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest text-center",
                                                    children: "Manage By"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1634,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Last Called"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1635,
                                                    columnNumber: 53
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                    className: "px-4 py-4 text-[10px] font-medium text-gray-400 uppercase tracking-widest",
                                                    children: "Last Updated By"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                    lineNumber: 1636,
                                                    columnNumber: 53
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1617,
                                            columnNumber: 49
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1616,
                                        columnNumber: 45
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                        className: "divide-y divide-gray-50",
                                        children: leads.map((lead)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                onClick: ()=>{
                                                    if (id && lead.id) {
                                                        router.push(`/campaign/${id}/${lead.id}`);
                                                    }
                                                },
                                                className: "group hover:bg-indigo-50/30 transition-all cursor-pointer border-b border-gray-50/50 last:border-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        onClick: (e)=>e.stopPropagation(),
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedLeads.includes(lead.id),
                                                                onChange: ()=>toggleSelect(lead.id),
                                                                className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8] cursor-pointer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1652,
                                                                columnNumber: 65
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1651,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1650,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-100 uppercase",
                                                                    children: lead.customer_name?.charAt(0) || 'C'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1662,
                                                                    columnNumber: 65
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-medium text-gray-800",
                                                                    style: {
                                                                        color: "#263238",
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: lead.customer_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1665,
                                                                    columnNumber: 65
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1661,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1660,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-medium text-gray-700 leading-none mb-1",
                                                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatMaskedPhone"])(lead.phone_no)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1670,
                                                                    columnNumber: 65
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-gray-400 font-medium uppercase tracking-tighter",
                                                                    children: "Verified Lead"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1671,
                                                                    columnNumber: 65
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1669,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1668,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex justify-center",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: `px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 ${lead.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' : lead.status === 'followup' ? 'bg-orange-50 text-orange-600 border border-orange-100' : lead.status === 'closed' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-50 text-gray-600 border border-gray-100'}`,
                                                                children: [
                                                                    lead.status === 'closed' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "fi fi-rr-check-circle flex text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                        lineNumber: 1682,
                                                                        columnNumber: 98
                                                                    }, this),
                                                                    lead.status
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                lineNumber: 1676,
                                                                columnNumber: 65
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1675,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1674,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-gray-700 leading-none mb-1",
                                                                    children: lead.disposition || 'Fresh'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1689,
                                                                    columnNumber: 65
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[8px] font-black text-indigo-400 uppercase tracking-widest",
                                                                    children: lead.sub_disposition || '---'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1692,
                                                                    columnNumber: 65
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1688,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1687,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-indigo-600",
                                                                    children: formatDate(lead.expiry_date)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1699,
                                                                    columnNumber: 65
                                                                }, this),
                                                                lead.expiry_date && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[8px] text-gray-400 font-medium",
                                                                    children: new Date(lead.expiry_date).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1701,
                                                                    columnNumber: 69
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1698,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1697,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: `w-1.5 h-1.5 rounded-full ${lead.assigned_user_name === 'Unassigned' ? 'bg-gray-300' : 'bg-indigo-400'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1709,
                                                                    columnNumber: 65
                                                                }, this),
                                                                lead.assigned_user_info ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-col",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[10px] font-medium text-gray-800 leading-none mb-0.5",
                                                                            children: lead.assigned_user_info.name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1712,
                                                                            columnNumber: 73
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "text-[8px] font-black text-gray-400 uppercase tracking-tighter",
                                                                            children: [
                                                                                "ID: ",
                                                                                lead.assigned_user_info.empId
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                            lineNumber: 1715,
                                                                            columnNumber: 73
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1711,
                                                                    columnNumber: 69
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-medium text-gray-600 uppercase tracking-tighter",
                                                                    children: lead.assigned_user_name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1720,
                                                                    columnNumber: 70
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1708,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1707,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4 text-center",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center justify-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "inline-flex items-center px-2 py-0.5 rounded-full bg-indigo-50/40 border border-indigo-100/50 backdrop-blur-sm",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] font-extrabold text-indigo-600 uppercase tracking-tighter",
                                                                        children: lead.managed_by_name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                        lineNumber: 1729,
                                                                        columnNumber: 69
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1728,
                                                                    columnNumber: 65
                                                                }, this),
                                                                lead.managed_by_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none",
                                                                    children: [
                                                                        "ID: ",
                                                                        lead.managed_by_id
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1732,
                                                                    columnNumber: 69
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1727,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1726,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-gray-700",
                                                                    children: formatDate(lead.last_called_at)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1738,
                                                                    columnNumber: 65
                                                                }, this),
                                                                lead.last_called_at && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[8px] text-gray-400 font-medium",
                                                                    children: new Date(lead.last_called_at).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1740,
                                                                    columnNumber: 69
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1737,
                                                            columnNumber: 61
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1736,
                                                        columnNumber: 57
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                        className: "px-4 py-4",
                                                        children: lead.last_updated_by_info ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-bold text-gray-800 leading-none mb-1",
                                                                    children: lead.last_updated_by_info.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1749,
                                                                    columnNumber: 69
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-indigo-500 font-black uppercase tracking-tighter",
                                                                    children: [
                                                                        "ID: ",
                                                                        lead.last_updated_by_info.empId
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                                    lineNumber: 1750,
                                                                    columnNumber: 69
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1748,
                                                            columnNumber: 65
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] text-gray-300 italic",
                                                            children: "No Updates"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                            lineNumber: 1753,
                                                            columnNumber: 65
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1746,
                                                        columnNumber: 57
                                                    }, this)
                                                ]
                                            }, lead.id, true, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1641,
                                                columnNumber: 53
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                        lineNumber: 1639,
                                        columnNumber: 45
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                lineNumber: 1615,
                                columnNumber: 41
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1614,
                            columnNumber: 37
                        }, this),
                        !loadingLeads && totalLeadsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-50 pt-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] text-gray-400 font-black uppercase tracking-widest",
                                    children: [
                                        "Showing ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: (currentPage - 1) * leadsPerPage + 1
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1767,
                                            columnNumber: 53
                                        }, this),
                                        " to ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: Math.min(currentPage * leadsPerPage, totalLeadsCount)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1767,
                                            columnNumber: 134
                                        }, this),
                                        " of ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-gray-800",
                                            children: totalLeadsCount
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1767,
                                            columnNumber: 232
                                        }, this),
                                        " Leads"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1766,
                                    columnNumber: 41
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentPage((prev)=>Math.max(prev - 1, 1)),
                                            disabled: currentPage === 1,
                                            className: `w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${currentPage === 1 ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-500 shadow-sm'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-angle-small-left text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1780,
                                                columnNumber: 49
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1771,
                                            columnNumber: 45
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-1",
                                            children: [
                                                ...Array(Math.ceil(totalLeadsCount / leadsPerPage))
                                            ].map((_, idx)=>{
                                                const pgNum = idx + 1;
                                                // Show only few pages if there are many
                                                if (pgNum === 1 || pgNum === Math.ceil(totalLeadsCount / leadsPerPage) || pgNum >= currentPage - 1 && pgNum <= currentPage + 1) {
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setCurrentPage(pgNum),
                                                        className: `w-10 h-10 rounded-xl text-[11px] font-bold transition-all ${currentPage === pgNum ? 'bg-[#4b33e8] text-white shadow-lg shadow-indigo-100' : 'bg-white border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-500'}`,
                                                        children: pgNum
                                                    }, pgNum, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1793,
                                                        columnNumber: 61
                                                    }, this);
                                                } else if (pgNum === currentPage - 2 && pgNum > 1 || pgNum === currentPage + 2 && pgNum < Math.ceil(totalLeadsCount / leadsPerPage)) {
                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-300 px-1",
                                                        children: "..."
                                                    }, pgNum, false, {
                                                        fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                        lineNumber: 1809,
                                                        columnNumber: 64
                                                    }, this);
                                                }
                                                return null;
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1783,
                                            columnNumber: 45
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setCurrentPage((prev)=>Math.min(prev + 1, Math.ceil(totalLeadsCount / leadsPerPage))),
                                            disabled: currentPage === Math.ceil(totalLeadsCount / leadsPerPage),
                                            className: `w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${currentPage === Math.ceil(totalLeadsCount / leadsPerPage) ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-500 hover:text-indigo-500 shadow-sm'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-angle-small-right text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign/[id].tsx",
                                                lineNumber: 1824,
                                                columnNumber: 49
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                                            lineNumber: 1815,
                                            columnNumber: 45
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                                    lineNumber: 1770,
                                    columnNumber: 41
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign/[id].tsx",
                            lineNumber: 1765,
                            columnNumber: 37
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 1500,
                    columnNumber: 29
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    show: showImportModal,
                    onClose: ()=>setShowImportModal(false),
                    onSuccess: ()=>{
                        fetchLeads(1);
                        fetchCampaignData();
                    },
                    preselectedOrgId: campaign?.organization_id || "",
                    preselectedCampaignId: id
                }, void 0, false, {
                    fileName: "[project]/pages/portal/campaign/[id].tsx",
                    lineNumber: 1832,
                    columnNumber: 29
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/campaign/[id].tsx",
            lineNumber: 923,
            columnNumber: 13
        }, this)
    }, void 0, false);
}
_s(CampaignDetails, "WzypAIQLXU9oqQFkEkGC+lV//vQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useCallSessionRedirect$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useCallSessionRedirect"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"]
    ];
});
_c = CampaignDetails;
var _c;
__turbopack_context__.k.register(_c, "CampaignDetails");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=pages_portal_campaign_%5Bid%5D_tsx_a83e75d8._.js.map