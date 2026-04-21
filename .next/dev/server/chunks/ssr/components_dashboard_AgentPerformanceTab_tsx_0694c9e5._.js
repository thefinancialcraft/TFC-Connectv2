module.exports = [
"[project]/components/dashboard/AgentPerformanceTab.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>AgentPerformanceTab
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$LabelList$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/LabelList.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAgentPerformance.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
function AgentPerformanceTab({ selectedOrgId, selectedUserId, dateFilter: propDateFilter = "today", loading = false, restrictedUserIds = null }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Date states for local filtration
    const todayStr = new Date().toLocaleDateString('en-CA');
    const [startDate, setStartDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(todayStr);
    const [endDate, setEndDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(todayStr);
    const [isFiltered, setIsFiltered] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const dateFilter = propDateFilter;
    // Helper to format duration (Must be defined before use)
    const formatDuration = (seconds)=>{
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor(seconds % 3600 / 60);
        const secs = seconds % 60;
        if (hours > 0) return `${hours}h ${mins}m`;
        if (mins > 0) return `${mins}m ${secs}s`;
        return `${secs}s`;
    };
    const { agentData: hookAgentData, fetchAgentPerformance, loading: hookLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAgentPerformance"])();
    const [rpcData, setRpcData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rpcLoading, setRpcLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const fetchRpcPerformance = async (start, end)=>{
        try {
            setRpcLoading(true);
            // 1. Fetch Agents List
            let agentQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, user_name, employee_id, organization_id');
            if (selectedOrgId && selectedOrgId !== "all") {
                agentQuery = agentQuery.eq('organization_id', selectedOrgId);
            }
            if (restrictedUserIds && restrictedUserIds.length > 0) {
                agentQuery = agentQuery.in('user_id', restrictedUserIds);
            } else if (selectedUserId && selectedUserId !== "all") {
                agentQuery = agentQuery.eq('user_id', selectedUserId);
            }
            const { data: agents, error: agentError } = await agentQuery;
            if (agentError) throw agentError;
            if (!agents || agents.length === 0) {
                setRpcData([]);
                return;
            }
            const agentIds = agents.map((a)=>a.user_id);
            const employeeIds = agents.map((a)=>a.employee_id).filter(Boolean);
            // 2. Fetch Call Logs (for connected/talktime/followups)
            let logQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('agent_id, is_connected, duration, disposition').gte('created_at', start).lte('created_at', end);
            if (selectedOrgId && selectedOrgId !== "all") {
                logQuery = logQuery.eq('organization_id', selectedOrgId);
            }
            logQuery = logQuery.in('agent_id', agentIds);
            const { data: logs } = await logQuery;
            // 3. Fetch Call History (for unique dials)
            let historyQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_history').select('employee_id, number, timestamp, duration').gte('timestamp', start).lte('timestamp', end).in('employee_id', employeeIds);
            const { data: history } = await historyQuery;
            // 4. Manual Aggregation in Frontend
            const processed = agents.map((a)=>{
                const agentLogs = logs?.filter((l)=>l.agent_id === a.user_id) || [];
                const agentHistory = history?.filter((h)=>h.employee_id === a.employee_id) || [];
                // Calculate Unique Dials (Phone + Timestamp + Duration)
                const uniqueSet = new Set();
                let lastCallAt = null;
                const sortedHistory = [
                    ...agentHistory
                ].sort((a, b)=>new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
                agentHistory.forEach((h)=>{
                    const key = `${h.number}_${h.timestamp}_${h.duration}`;
                    uniqueSet.add(key);
                    if (!lastCallAt || new Date(h.timestamp) > new Date(lastCallAt)) {
                        lastCallAt = h.timestamp;
                    }
                });
                // Streak/Gap Calculation
                const lastSuccessIdx = sortedHistory.map((h)=>Number(h.duration) > 0).lastIndexOf(true);
                const currentStreak = lastSuccessIdx === -1 ? sortedHistory : sortedHistory.slice(lastSuccessIdx + 1);
                let streakCount = 0;
                let avgGapStr = '0s';
                if (currentStreak.length > 0) {
                    streakCount = currentStreak.length;
                    let totalGap = 0;
                    let gapCounts = 0;
                    for(let i = 1; i < currentStreak.length; i++){
                        const gap = (new Date(currentStreak[i].timestamp).getTime() - new Date(currentStreak[i - 1].timestamp).getTime()) / 1000;
                        if (gap > 0) {
                            totalGap += gap;
                            gapCounts++;
                        }
                    }
                    const avgGapSec = gapCounts > 0 ? Math.round(totalGap / gapCounts) : 0;
                    const mins = Math.floor(avgGapSec / 60);
                    const secs = avgGapSec % 60;
                    avgGapStr = (mins > 0 ? `${mins}m ` : '') + `${secs}s`;
                }
                const totalDuration = agentLogs.reduce((acc, l)=>acc + (l.duration || 0), 0);
                const connectedCalls = agentLogs.filter((l)=>l.is_connected === 'yes').length;
                const avgTalkSec = connectedCalls ? Math.floor(totalDuration / connectedCalls) : 0;
                return {
                    user_id_val: a.user_id,
                    employee_id_val: a.employee_id,
                    agent_name: a.user_name,
                    total_dials: uniqueSet.size,
                    connected_calls: connectedCalls,
                    duration_raw: totalDuration,
                    follow_ups: agentLogs.filter((l)=>l.disposition === 'Follow Up').length,
                    last_call_at: lastCallAt,
                    streak_gap: `${streakCount}/${avgGapStr}`,
                    avg_talk: `${Math.floor(avgTalkSec / 60)}m ${avgTalkSec % 60}s`
                };
            });
            // Sort by total dials
            setRpcData(processed.sort((a, b)=>b.total_dials - a.total_dials));
        } catch (err) {
            console.error("[AgentPerformanceTab] Manual Fetch Error:", err);
        } finally{
            setRpcLoading(false);
        }
    };
    const handleApplyFilter = ()=>{
        if (startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            setIsFiltered(true);
            fetchRpcPerformance(start.toISOString(), end.toISOString());
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setIsFiltered(false);
    }, [
        dateFilter
    ]);
    const isLoading = loading || hookLoading || rpcLoading;
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [metric, setMetric] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('dials');
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const timer = setTimeout(()=>setMounted(true), 150);
        return ()=>clearTimeout(timer);
    }, []);
    const [rawSyncMeta, setRawSyncMeta] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawSessions, setRawSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawProfiles, setRawProfiles] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [historyCounts, setHistoryCounts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    // 1. Fetch real-time status whenever rpcData changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (rpcData.length > 0) {
            const userIds = rpcData.map((i)=>i.user_id_val).filter(Boolean);
            const employeeIds = rpcData.map((i)=>i.employee_id_val).filter(Boolean);
            const fetchStatus = async ()=>{
                // Fetch Real-time Statuses
                const [syncRes, sessionRes, profileRes] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('employee_id, on_call, is_personal, last_seen').in('employee_id', employeeIds),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_sessions').select('user_id, last_accessed_at').in('user_id', userIds).order('last_accessed_at', {
                        ascending: false
                    }),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, last_online').in('user_id', userIds)
                ]);
                if (syncRes.data) setRawSyncMeta(syncRes.data);
                if (profileRes.data) setRawProfiles(profileRes.data);
                if (sessionRes.data) {
                    const latest = [];
                    const seen = new Set();
                    sessionRes.data.forEach((s)=>{
                        if (!seen.has(s.user_id)) {
                            latest.push(s);
                            seen.add(s.user_id);
                        }
                    });
                    setRawSessions(latest);
                }
            };
            fetchStatus();
        }
    }, [
        rpcData
    ]);
    // Transform performance data with real-time status logic
    const displayData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        try {
            if (!rpcData || !Array.isArray(rpcData)) return [];
            const now = new Date();
            const results = rpcData.map((item, i)=>{
                if (!item) return null;
                const uId = item.user_id_val;
                const empId = item.employee_id_val;
                const syncData = rawSyncMeta.find((s)=>s.employee_id === empId);
                const sessionData = rawSessions.find((s)=>s.user_id === uId);
                const profileData = rawProfiles.find((p)=>p.user_id === uId);
                const lastCallAt = item.last_call_at;
                const isActuallyOnline = lastCallAt && now.getTime() - new Date(lastCallAt).getTime() < 30000;
                // Relative Idle Time logic
                let idleTimeStr = "N/A";
                if (lastCallAt) {
                    const diffSec = Math.floor((now.getTime() - new Date(lastCallAt).getTime()) / 1000);
                    if (diffSec < 60) idleTimeStr = `${diffSec}s`;
                    else if (diffSec < 3600) idleTimeStr = `${Math.floor(diffSec / 60)}m`;
                    else {
                        const h = Math.floor(diffSec / 3600);
                        const m = Math.floor(diffSec % 3600 / 60);
                        idleTimeStr = `${h}h ${m}m`;
                    }
                }
                const onCall = !!syncData?.on_call;
                const isPersonal = !!syncData?.is_personal;
                const lastOnline = profileData?.last_online || syncData?.last_seen || sessionData?.last_accessed_at || null;
                // Custom Utilization Calculation
                const totalDials = Number(item.total_dials || 0);
                const talkTimeMins = Number(item.duration_raw || 0) / 60;
                const utilNum = (talkTimeMins * 1.67 + totalDials) / 3;
                return {
                    id: uId,
                    name: item.agent_name || "Unknown Agent",
                    employee_id: empId,
                    count: totalDials,
                    connected_count: item.connected_calls,
                    duration: item.duration_raw,
                    utilization_str: utilNum.toFixed(1) + "%",
                    utilization_num: utilNum,
                    avg_talk: item.avg_talk,
                    streak_gap: item.streak_gap,
                    status_fmt: onCall ? isPersonal ? 'Personal Call' : 'On Call' : isActuallyOnline ? 'Online' : 'Idle',
                    onCall,
                    isPersonal,
                    isActuallyOnline,
                    last_online: lastOnline,
                    login_status_fmt: lastOnline && now.getTime() - new Date(lastOnline).getTime() < 30000 ? 'ONLINE' : 'OFFLINE',
                    follow_ups: Number(item.follow_ups || 0),
                    last_active: lastCallAt,
                    idle_time: idleTimeStr
                };
            });
            return results.filter((i)=>i !== null);
        } catch (err) {
            console.error("[AgentPerformanceTab] useMemo Error:", err);
            return [];
        }
    }, [
        rpcData,
        rawSyncMeta,
        rawSessions,
        rawProfiles
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        console.log("[AgentPerformanceTab] Data Update:", {
            rpcLength: rpcData.length,
            displayLength: displayData.length
        });
    }, [
        rpcData,
        displayData
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!isFiltered) {
            let start = new Date();
            let end = new Date();
            if (dateFilter === "today") {
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
            } else if (dateFilter === "yesterday") {
                start.setDate(start.getDate() - 1);
                start.setHours(0, 0, 0, 0);
                end.setDate(end.getDate() - 1);
                end.setHours(23, 59, 59, 999);
            } else {
                start.setHours(start.getHours() - 24);
            }
            fetchRpcPerformance(start.toISOString(), end.toISOString());
        }
    }, [
        dateFilter,
        isFiltered,
        selectedOrgId,
        selectedUserId,
        restrictedUserIds
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>{
            if (isFiltered && startDate && endDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                fetchRpcPerformance(start.toISOString(), end.toISOString());
            } else {
                let start = new Date();
                let end = new Date();
                if (dateFilter === "today") {
                    start.setHours(0, 0, 0, 0);
                    end.setHours(23, 59, 59, 999);
                }
                fetchRpcPerformance(start.toISOString(), end.toISOString());
            }
        }, 30000);
        return ()=>clearInterval(interval);
    }, [
        dateFilter,
        isFiltered,
        startDate,
        endDate,
        selectedOrgId,
        selectedUserId
    ]);
    const totalDials = displayData.reduce((acc, curr)=>acc + (curr?.count || 0), 0);
    const handlePrint = ()=>{
        window.print();
    };
    const handleDownloadExcel = ()=>{
        if (!displayData || displayData.length === 0) return;
        const BOM = "\uFEFF";
        const headers = [
            "Agent Name",
            "Employee ID",
            "Status",
            "Total Dials",
            "Connected Calls",
            "Talk Time (Total)",
            "Follow Ups",
            "Utilization",
            "Last Active"
        ];
        const rows = displayData.map((agent)=>{
            if (!agent) return [];
            return [
                agent.name,
                agent.employee_id || "N/A",
                agent.status_fmt,
                agent.count,
                agent.connected_count,
                formatDuration(agent.duration || 0),
                agent.follow_ups || 0,
                agent.utilization_str,
                agent.last_active ? new Date(agent.last_active).toLocaleString() : "Never"
            ];
        });
        const csvContent = [
            headers.join(","),
            ...rows.map((row)=>row.map((cell)=>`"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
        ].join("\r\n");
        const blob = new Blob([
            BOM + csvContent
        ], {
            type: "text/csv;charset=utf-8;"
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Agent_Performance_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("style", {
                children: `
        @media print {
          body * { visibility: hidden; }
          #agent-leaderboard-print-area, #agent-leaderboard-print-area * { visibility: visible; }
          #agent-leaderboard-print-area { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; }
          .no-print { display: none !important; }
        }
      `
            }, void 0, false, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 420,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 flex-1 sm:flex-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: startDate,
                                onChange: (e)=>setStartDate(e.target.value),
                                className: "flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-bold text-gray-500 focus:outline-none focus:border-[#4b33e8] transition-all cursor-pointer min-w-0"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 431,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 font-bold",
                                children: "-"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 437,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: endDate,
                                onChange: (e)=>setEndDate(e.target.value),
                                className: "flex-1 sm:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-bold text-gray-500 focus:outline-none focus:border-[#4b33e8] transition-all cursor-pointer min-w-0"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 438,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: handleApplyFilter,
                        disabled: isLoading || !startDate || !endDate,
                        className: "w-full sm:w-auto px-5 py-2.5 bg-[#4b33e8] hover:bg-[#3b25b8] disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2",
                        children: isLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                            lineNumber: 451,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-filter flex text-xs"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                    lineNumber: 454,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    children: "Apply Filter"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                    lineNumber: 455,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 445,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 429,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        id: "agent-leaderboard-print-area",
                        className: "lg:col-span-8 bg-white rounded-[24px] p-8 flex flex-col relative h-[550px]",
                        children: [
                            isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-[24px] no-print",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-8 w-8 border-b-2 border-[#4b33e8]"
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                    lineNumber: 463,
                                    columnNumber: 133
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 463,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-[#263238] text-xl",
                                                children: "Agent Productivity Leaderboard"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 466,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold",
                                                children: "Dials & Talktime per agent"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 467,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 465,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between sm:justify-end gap-3 no-print",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setMetric('dials'),
                                                        className: `px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${metric === 'dials' ? 'bg-white shadow-sm text-[#4b33e8]' : 'text-gray-400 hover:text-gray-600'}`,
                                                        children: "Dials"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 471,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setMetric('talktime'),
                                                        className: `px-4 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-all ${metric === 'talktime' ? 'bg-white shadow-sm text-[#10b981]' : 'text-gray-400 hover:text-gray-600'}`,
                                                        children: "Talktime"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 479,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 470,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handlePrint,
                                                className: "w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-[#4b33e8] transition-colors",
                                                title: "Print Leaderboard",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-print text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 493,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 488,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 469,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 464,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-100 scrollbar-track-transparent no-print-scroll",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: `${Math.max(400, displayData.length * 40)}px`,
                                        width: '100%',
                                        position: 'relative'
                                    },
                                    children: mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                        width: "100%",
                                        height: "100%",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["BarChart"], {
                                            layout: "vertical",
                                            data: displayData,
                                            margin: {
                                                top: 0,
                                                right: 40,
                                                left: 20,
                                                bottom: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                    strokeDasharray: "3 3",
                                                    vertical: true,
                                                    horizontal: false,
                                                    stroke: "#F1F1F1"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 502,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                                    type: "number",
                                                    hide: true,
                                                    xAxisId: "cnt"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 503,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                                    type: "number",
                                                    hide: true,
                                                    xAxisId: "dur"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 503,
                                                    columnNumber: 61
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Legend"], {
                                                    verticalAlign: "top",
                                                    align: "right",
                                                    iconType: "circle",
                                                    wrapperStyle: {
                                                        paddingBottom: '20px',
                                                        fontSize: '10px',
                                                        fontWeight: 'bold'
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 504,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                                    dataKey: "name",
                                                    type: "category",
                                                    axisLine: false,
                                                    tickLine: false,
                                                    interval: 0,
                                                    tick: {
                                                        fill: "#263238",
                                                        fontSize: 11,
                                                        fontWeight: 700,
                                                        textAnchor: "end"
                                                    },
                                                    width: 110,
                                                    dx: -8
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 505,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                    cursor: {
                                                        fill: "#F9FAFB",
                                                        radius: 8
                                                    },
                                                    content: ({ active, payload })=>{
                                                        if (active && payload && payload.length) {
                                                            const data = payload[0].payload;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "bg-[#111827] p-3 rounded-xl border-none shadow-xl",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-white font-bold text-xs mb-1",
                                                                        children: data.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                        lineNumber: 509,
                                                                        columnNumber: 97
                                                                    }, void 0),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex flex-col gap-0.5",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "text-[#4b33e8] text-[10px] font-bold",
                                                                                children: [
                                                                                    "Dials: ",
                                                                                    data.count
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                                lineNumber: 509,
                                                                                columnNumber: 200
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "text-green-400 text-[10px] font-bold",
                                                                                children: [
                                                                                    "Talktime: ",
                                                                                    formatDuration(data.duration)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                                lineNumber: 509,
                                                                                columnNumber: 275
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                        lineNumber: 509,
                                                                        columnNumber: 161
                                                                    }, void 0)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 509,
                                                                columnNumber: 30
                                                            }, void 0);
                                                        }
                                                        return null;
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 506,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Bar"], {
                                                    dataKey: metric === 'dials' ? 'count' : 'duration',
                                                    xAxisId: metric === 'dials' ? 'cnt' : 'dur',
                                                    name: metric === 'dials' ? 'Dials' : 'Talktime',
                                                    fill: metric === 'dials' ? '#4b33e8' : '#10b981',
                                                    radius: [
                                                        0,
                                                        20,
                                                        20,
                                                        0
                                                    ],
                                                    barSize: 26,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$LabelList$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["LabelList"], {
                                                        dataKey: metric === 'dials' ? 'count' : 'duration',
                                                        position: "right",
                                                        content: (props)=>{
                                                            const { x, y, width, value } = props;
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("text", {
                                                                x: x + width + 5,
                                                                y: y + 13,
                                                                fill: metric === 'dials' ? '#4b33e8' : '#10b981',
                                                                fontSize: 10,
                                                                fontWeight: "bold",
                                                                children: metric === 'dials' ? value : formatDuration(value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 516,
                                                                columnNumber: 30
                                                            }, void 0);
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 514,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                            lineNumber: 501,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 500,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                    lineNumber: 498,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 497,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 462,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-4 bg-white rounded-[24px] p-8 flex flex-col relative h-[550px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-[#263238] mb-6",
                                children: "Activity Contribution"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 527,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-6 flex-1 overflow-y-auto max-h-[450px] pr-2",
                                children: displayData.map((agent, i)=>{
                                    if (!agent) return null;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#4b33e8] font-bold text-xs border border-gray-100 group-hover:bg-[#4b33e8] group-hover:text-white transition-all",
                                                        children: (agent.name || "U").charAt(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 534,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-bold text-[#263238]",
                                                                children: agent.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 535,
                                                                columnNumber: 26
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-400 font-medium",
                                                                children: [
                                                                    "Rank #",
                                                                    i + 1,
                                                                    " in team"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 535,
                                                                columnNumber: 90
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 535,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 533,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-[#263238]",
                                                        children: [
                                                            (agent.count || 0).toLocaleString(),
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-gray-400 font-medium ml-1",
                                                                children: "dials"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 538,
                                                                columnNumber: 107
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 538,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-[11px] font-bold text-[#4b33e8]",
                                                        children: formatDuration(agent.duration || 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 539,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-[9px] text-green-500 font-bold uppercase tracking-tighter",
                                                        children: [
                                                            ((agent.count || 0) / (totalDials || 1) * 100).toFixed(1),
                                                            "% share"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 540,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 537,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 532,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 528,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/team"),
                                className: "mt-8 w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-[#4b33e8] hover:text-white hover:border-[#4b33e8] transition-all",
                                children: "View All Team Insights"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 546,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 526,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 461,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-[24px] overflow-hidden text-left shadow-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "px-6 lg:px-8 py-6 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "font-bold text-[#263238] text-xl",
                                        children: "Member Performance Breakdown"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 553,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 mt-1",
                                        children: "Granular metrics for individual agent activity (Sync enabled)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 554,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 552,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 sm:flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    let start = new Date();
                                                    let end = new Date();
                                                    if (dateFilter === "today") {
                                                        start.setHours(0, 0, 0, 0);
                                                        end.setHours(23, 59, 59, 999);
                                                    }
                                                    fetchRpcPerformance(start.toISOString(), end.toISOString());
                                                },
                                                disabled: isLoading,
                                                className: "group flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all border border-indigo-100",
                                                title: "Refresh Data",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: `fi flex fi-rr-refresh ${isLoading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 572,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "Refresh"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 573,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 558,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: handleDownloadExcel,
                                                disabled: isLoading || displayData.length === 0,
                                                className: "group flex items-center justify-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all border border-emerald-100",
                                                title: "Download Excel Report",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-download text-emerald-500 group-hover:translate-y-0.5 transition-transform"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 581,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        children: "Excel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 582,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 575,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 557,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-center gap-3 text-[10px] font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 587,
                                                        columnNumber: 25
                                                    }, this),
                                                    "ONLINE"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 586,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-500 rounded-xl border border-gray-100",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "w-2 h-2 rounded-full bg-gray-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 25
                                                    }, this),
                                                    "IDLE"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 590,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 585,
                                        columnNumber: 19
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 556,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 551,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "hidden lg:block overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                            className: "w-full text-left border-collapse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        className: "bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest border-b border-gray-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 font-bold",
                                                children: "Agent"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 603,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-3 font-bold text-center",
                                                children: "Last Active"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 604,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-3 font-bold text-center",
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 605,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-3 font-bold text-center text-indigo-500/80",
                                                children: "Follow Ups"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 606,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-3 font-bold text-center",
                                                children: "Talk Time"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 607,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-3 font-bold text-center",
                                                children: "Connected"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 608,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-3 font-bold text-center",
                                                children: "Avg Talk"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 609,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-3 font-bold text-center",
                                                children: "Streak/Gap"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 610,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-2 py-3 font-bold text-center text-rose-600",
                                                children: "Utilization"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 611,
                                                columnNumber: 27
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 font-bold text-right",
                                                children: "Last Call"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 612,
                                                columnNumber: 27
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 602,
                                        columnNumber: 23
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                    lineNumber: 601,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                    className: "divide-y divide-gray-50",
                                    children: displayData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            colSpan: 10,
                                            className: "px-8 py-12 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi fi-rr-search text-3xl text-gray-200"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 618,
                                                        columnNumber: 133
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-gray-400",
                                                        children: "No agent activity found for this period"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 618,
                                                        columnNumber: 191
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 618,
                                                columnNumber: 83
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                            lineNumber: 618,
                                            columnNumber: 31
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 618,
                                        columnNumber: 27
                                    }, this) : displayData.map((agent, i)=>{
                                        if (!agent) return null;
                                        const isOnline = agent.login_status_fmt === 'ONLINE';
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                            className: "hover:bg-gray-50/50 transition-colors group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 shadow-sm overflow-hidden flex items-center justify-center text-[#4b33e8] font-bold group-hover:bg-[#4b33e8] group-hover:text-white transition-all",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-sm",
                                                                    children: agent.name.charAt(0)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                    lineNumber: 627,
                                                                    columnNumber: 47
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 626,
                                                                columnNumber: 43
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-sm font-bold text-[#263238]",
                                                                        children: agent.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                        lineNumber: 630,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-[10px] text-gray-400 font-medium",
                                                                        children: [
                                                                            "ID: ",
                                                                            agent.employee_id || "N/A"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                        lineNumber: 631,
                                                                        columnNumber: 47
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 629,
                                                                columnNumber: 43
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 625,
                                                        columnNumber: 39
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 624,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-4 text-center",
                                                    children: agent.last_active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "px-2.5 py-1 bg-gray-50 text-gray-600 text-[10px] font-bold rounded-lg border border-gray-100",
                                                        children: agent.idle_time
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 637,
                                                        columnNumber: 43
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] text-gray-300 font-bold",
                                                        children: "N/A"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 641,
                                                        columnNumber: 43
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 635,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-4 text-center",
                                                    children: agent.onCall ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: `inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border animate-pulse ${agent.isPersonal ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "w-1.5 h-1.5 rounded-full bg-current"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 647,
                                                                columnNumber: 47
                                                            }, this),
                                                            agent.isPersonal ? 'Personal Call' : 'On Call'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 646,
                                                        columnNumber: 43
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: `inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border ${agent.isActuallyOnline ? 'bg-green-50 text-green-700 border-green-100' : 'bg-gray-50 text-gray-500 border-gray-200'}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: `w-1.5 h-1.5 rounded-full ${agent.isActuallyOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 652,
                                                                columnNumber: 47
                                                            }, this),
                                                            agent.isActuallyOnline ? 'Online' : 'Idle'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 651,
                                                        columnNumber: 43
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 644,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-4 text-center text-sm font-bold text-indigo-600/80",
                                                    children: agent.follow_ups
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 657,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-4 text-center text-sm font-bold text-[#263238]",
                                                    children: formatDuration(agent.count > 0 ? agent.duration : 0)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 658,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-4 text-center",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-bold text-[#263238]",
                                                            children: agent.connected_count
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                            lineNumber: 660,
                                                            columnNumber: 39
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-400 font-bold",
                                                            children: [
                                                                agent.count > 0 ? (agent.connected_count / agent.count * 100).toFixed(1) : '0.0',
                                                                "%"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                            lineNumber: 661,
                                                            columnNumber: 39
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 659,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-4 text-center text-[11px] font-bold text-gray-700",
                                                    children: agent.avg_talk
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 663,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-4 text-center text-[10px] font-bold text-orange-600 bg-orange-50/30 rounded-lg",
                                                    children: agent.streak_gap
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 664,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-2 py-4 text-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center gap-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-bold text-rose-600",
                                                                children: agent.utilization_str
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 667,
                                                                columnNumber: 43
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "w-12 h-1 bg-gray-100 rounded-full overflow-hidden",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "h-full bg-rose-500",
                                                                    style: {
                                                                        width: `${Math.min(100, agent.utilization_num)}%`
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                    lineNumber: 669,
                                                                    columnNumber: 47
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 668,
                                                                columnNumber: 43
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 666,
                                                        columnNumber: 39
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 665,
                                                    columnNumber: 35
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 text-right",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-bold text-[#263238]",
                                                            children: agent.last_active ? new Date(agent.last_active).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            }) : 'Never'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                            lineNumber: 674,
                                                            columnNumber: 39
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[10px] text-gray-400 font-medium",
                                                            children: agent.last_active ? new Date(agent.last_active).toLocaleDateString() : 'N/A'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                            lineNumber: 675,
                                                            columnNumber: 39
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 673,
                                                    columnNumber: 35
                                                }, this)
                                            ]
                                        }, agent.id || i, true, {
                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                            lineNumber: 623,
                                            columnNumber: 31
                                        }, this);
                                    })
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                    lineNumber: 616,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                            lineNumber: 600,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 599,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "lg:hidden divide-y divide-gray-50",
                        children: displayData.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-8 py-12 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-search text-3xl text-gray-200"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 688,
                                        columnNumber: 109
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-sm font-bold text-gray-400",
                                        children: "No agent activity found"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 688,
                                        columnNumber: 167
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 688,
                                columnNumber: 59
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                            lineNumber: 688,
                            columnNumber: 19
                        }, this) : displayData.map((agent, i)=>{
                            if (!agent) return null;
                            const isOnline = agent.login_status_fmt === 'ONLINE';
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "p-6 bg-white space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-xl bg-[#4b33e8] text-white flex items-center justify-center font-bold text-sm",
                                                        children: agent.name.charAt(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 696,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "font-bold text-[#263238] leading-none mb-1",
                                                                children: agent.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 700,
                                                                columnNumber: 39
                                                            }, this),
                                                            agent.last_online ? (()=>{
                                                                const diff = Date.now() - new Date(agent.last_online).getTime();
                                                                const diffMins = diff / 60000;
                                                                let dotColor = "bg-gray-400";
                                                                let textColor = "text-gray-500";
                                                                let statusText = "OFFLINE";
                                                                if (diffMins <= 1) {
                                                                    dotColor = "bg-emerald-500 animate-pulse";
                                                                    textColor = "text-emerald-700";
                                                                    statusText = "ONLINE";
                                                                } else if (diffMins <= 3) {
                                                                    dotColor = "bg-orange-500";
                                                                    textColor = "text-orange-700";
                                                                    statusText = "AWAY";
                                                                }
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[8px] font-black border uppercase tracking-widest ${textColor} border-current`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: `w-1 h-1 rounded-full ${dotColor}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                            lineNumber: 720,
                                                                            columnNumber: 51
                                                                        }, this),
                                                                        statusText
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                    lineNumber: 719,
                                                                    columnNumber: 47
                                                                }, this);
                                                            })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[8px] font-black border uppercase tracking-widest text-gray-400 border-gray-100`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "w-1 h-1 rounded-full bg-gray-400"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                        lineNumber: 726,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    "OFFLINE"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 725,
                                                                columnNumber: 43
                                                            }, this),
                                                            agent.onCall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: `inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[8px] font-black border animate-pulse uppercase tracking-widest ml-1 ${agent.isPersonal ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: `fi ${agent.isPersonal ? 'fi-rr-book-user' : 'fi-rr-phone-call'} flex text-[7px]`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                        lineNumber: 732,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    agent.isPersonal ? 'PERSONAL' : 'ON CALL'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 731,
                                                                columnNumber: 43
                                                            }, this),
                                                            !agent.onCall && !agent.isActuallyOnline && agent.status_fmt !== '--' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[9px] font-bold text-gray-400 ml-2",
                                                                children: agent.status_fmt
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 737,
                                                                columnNumber: 43
                                                            }, this),
                                                            !agent.onCall && agent.isActuallyOnline && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[8px] font-black border border-emerald-100 bg-emerald-50 text-emerald-700 uppercase tracking-widest ml-1",
                                                                children: "ACTIVE"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 742,
                                                                columnNumber: 43
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 699,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 695,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-[10px] font-bold text-gray-400 uppercase tracking-tighter",
                                                        children: "Last Call"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 749,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-[11px] font-bold text-[#263238]",
                                                        children: agent.last_active ? new Date(agent.last_active).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        }) : 'Never'
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 750,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 748,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 694,
                                        columnNumber: 27
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-3 pt-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "bg-gray-50 p-3 rounded-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1",
                                                        children: "Total Dials"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 756,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-black text-[#4b33e8]",
                                                        children: [
                                                            agent.count,
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] font-medium text-indigo-400 ml-1",
                                                                children: "Calls"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 757,
                                                                columnNumber: 98
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 757,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 755,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "bg-gray-50 p-3 rounded-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1",
                                                        children: "Talk Time"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 760,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-black text-[#263238]",
                                                        children: formatDuration(agent.duration || 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 761,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 759,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "bg-gray-50 p-3 rounded-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1",
                                                        children: "Utilization"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 764,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-black text-rose-600",
                                                                children: agent.utilization_str
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 766,
                                                                columnNumber: 39
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 h-1 bg-gray-200 rounded-full overflow-hidden",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "h-full bg-rose-500 rounded-full",
                                                                    style: {
                                                                        width: `${Math.min(100, agent.utilization_num)}%`
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                    lineNumber: 768,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 767,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 765,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 763,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "bg-gray-50 p-3 rounded-xl",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1",
                                                        children: "Follow Ups"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 773,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-black text-indigo-600",
                                                        children: agent.follow_ups || 0
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 774,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 772,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 754,
                                        columnNumber: 27
                                    }, this)
                                ]
                            }, agent.id || i, true, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 693,
                                columnNumber: 23
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 686,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 550,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
        lineNumber: 419,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/dashboard/AgentPerformanceTab.tsx [ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/dashboard/AgentPerformanceTab.tsx [ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=components_dashboard_AgentPerformanceTab_tsx_0694c9e5._.js.map