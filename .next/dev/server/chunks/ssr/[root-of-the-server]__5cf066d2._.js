module.exports = [
"[project]/lib/dateUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shared date range utilities for dashboard APIs
 * All calculations are standardized to Asia/Kolkata (IST)
 */ __turbopack_context__.s([
    "calculateMonthsToTarget",
    ()=>calculateMonthsToTarget,
    "calculateNewExpiryDate",
    ()=>calculateNewExpiryDate,
    "formatDate",
    ()=>formatDate,
    "getISTDateRange",
    ()=>getISTDateRange
]);
function getISTDateRange(filter) {
    const now = new Date();
    // Get date string in YYYY-MM-DD for IST
    const istDateString = now.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata"
    });
    // Midnight IST in ISO format
    const todayStart = new Date(`${istDateString}T00:00:00+05:30`).toISOString();
    // End of day IST in ISO format
    const todayEnd = new Date(`${istDateString}T23:59:59+05:30`).toISOString();
    let start = todayStart;
    let end = todayEnd;
    switch(filter){
        case "yesterday":
            {
                const yesterday = new Date(`${istDateString}T00:00:00+05:30`);
                yesterday.setDate(yesterday.getDate() - 1);
                const yStr = yesterday.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata"
                });
                start = new Date(`${yStr}T00:00:00+05:30`).toISOString();
                end = new Date(`${yStr}T23:59:59+05:30`).toISOString();
                break;
            }
        case "this_week":
            {
                const d = new Date(`${istDateString}T00:00:00+05:30`);
                const day = d.getDay();
                const diff = day === 0 ? -6 : 1 - day; // Monday
                d.setDate(d.getDate() + diff);
                const monStr = d.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata"
                });
                start = new Date(`${monStr}T00:00:00+05:30`).toISOString();
                break;
            }
        case "last_7_days":
            {
                const d = new Date(now);
                d.setDate(d.getDate() - 7);
                start = d.toISOString();
                break;
            }
        case "this_month":
            {
                const parts = istDateString.split("-");
                start = new Date(`${parts[0]}-${parts[1]}-01T00:00:00+05:30`).toISOString();
                break;
            }
        case "last_month":
            {
                const parts = istDateString.split("-");
                let year = parseInt(parts[0]);
                let month = parseInt(parts[1]) - 1;
                if (month === 0) {
                    month = 12;
                    year--;
                }
                const prevMonthStr = month.toString().padStart(2, '0');
                start = new Date(`${year}-${prevMonthStr}-01T00:00:00+05:30`).toISOString();
                const lastDay = new Date(year, month, 0).getDate();
                end = new Date(`${year}-${prevMonthStr}-${lastDay}T23:59:59+05:30`).toISOString();
                break;
            }
        case "this_year":
            const yStr = istDateString.split("-")[0];
            start = new Date(`${yStr}-01-01T00:00:00+05:30`).toISOString();
            break;
        case "multi_year":
            const yearInt = parseInt(istDateString.split("-")[0]);
            start = new Date(`${yearInt - 3}-01-01T00:00:00+05:30`).toISOString();
            break;
        case "all_time":
            start = "2020-01-01T00:00:00.000Z";
            break;
    }
    return {
        start,
        end
    };
}
function formatDate(date) {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
function calculateNewExpiryDate(currentExpiry, monthsToAdd) {
    const baseDate = currentExpiry ? new Date(currentExpiry) : new Date();
    if (isNaN(baseDate.getTime())) return new Date().toISOString().split('T')[0];
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);
    return newDate.toISOString().split('T')[0];
}
function calculateMonthsToTarget(year, month) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const targetYear = typeof year === 'string' ? parseInt(year) : year;
    const targetMonth = typeof month === 'string' ? parseInt(month) : month;
    if (isNaN(targetYear) || isNaN(targetMonth)) return 0;
    // Note: targetMonth expected as 1-12 from UI select, convert to 0-11
    return (targetYear - currentYear) * 12 + (targetMonth - 1 - currentMonth);
}
}),
"[project]/components/shared/MemberPerformanceTable.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
const MemberPerformanceTable = ({ members, memberStats, loading, onRefresh, title = "Member Performance Breakdown", lastUpdated })=>{
    const formatTime = (date)=>{
        if (!date) return 'N/A';
        return new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-[#263238] text-lg",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                lineNumber: 29,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-400 mt-1 flex items-center gap-2",
                                children: [
                                    "Granular metrics for individual agent activity (Sync enabled)",
                                    lastUpdated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "w-1 h-1 rounded-full bg-gray-300"
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 34,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-indigo-500 uppercase tracking-tight",
                                                children: [
                                                    "Last updated: ",
                                                    lastUpdated.toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        second: '2-digit'
                                                    })
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 35,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                lineNumber: 30,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                        lineNumber: 28,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: onRefresh,
                                disabled: loading,
                                className: "group flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all border border-indigo-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: `fi flex fi-rr-refresh ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 48,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: "Refresh"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 49,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                lineNumber: 43,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 text-[10px] font-bold uppercase tracking-tight",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 53,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "ONLINE"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 52,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 text-gray-400 rounded-xl border border-gray-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "w-2 h-2 rounded-full bg-gray-400"
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 57,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "IDLE"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 56,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                lineNumber: 51,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                        lineNumber: 42,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                lineNumber: 27,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                    className: "w-full text-left border-collapse min-w-[1000px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                className: "bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest sticky top-0 z-10 bg-gray-50/50 backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 font-bold",
                                        children: "Agent"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 68,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 69,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center bg-indigo-50/30 text-indigo-600",
                                        children: "Total Dials"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 70,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Talk Time"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 71,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Connected"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 72,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Avg Talk"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 73,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Streak/Gap"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 74,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center text-rose-600",
                                        children: "Utilization"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 75,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 font-bold text-right",
                                        children: "Last Call"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 76,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                lineNumber: 67,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                            lineNumber: 66,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-gray-50",
                            children: members.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                    colSpan: 9,
                                    className: "px-6 py-12 text-center text-gray-400 text-sm",
                                    children: "No members found"
                                }, void 0, false, {
                                    fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                    lineNumber: 82,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                lineNumber: 81,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)) : members.map((member)=>{
                                const mId = member.user_id;
                                const mStats = memberStats[mId] || {
                                    totalCalls: 0,
                                    connected: 0,
                                    connectedRate: "0.0",
                                    avgDuration: '0m 0s',
                                    totalTalkTime: '0h 0m 0s',
                                    streakGap: '0/0s',
                                    utilization: '0.0%',
                                    utilizationRaw: 0,
                                    lastActive: null,
                                    idleTime: 'N/A',
                                    status: 'Idle',
                                    onCall: false
                                };
                                const isOnline = mStats.status === 'Online';
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-gray-50/50 transition-colors group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full bg-gray-50 border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center text-gray-400 font-bold text-xs ring-2 ring-white group-hover:ring-indigo-50 transition-all",
                                                        children: member.profile_pic_url || member.profilePic ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                            src: member.profile_pic_url || member.profilePic,
                                                            alt: "",
                                                            className: "w-full h-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                            lineNumber: 109,
                                                            columnNumber: 53
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi flex fi-rr-user text-lg"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                            lineNumber: 111,
                                                            columnNumber: 53
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 107,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-bold text-gray-800 leading-none",
                                                                children: member.user_name || member.name || 'Unknown'
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                                lineNumber: 115,
                                                                columnNumber: 49
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-400 mt-1 font-medium",
                                                                children: [
                                                                    "ID: ",
                                                                    member.employee_id || '--'
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                                lineNumber: 116,
                                                                columnNumber: 49
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 106,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 105,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center",
                                            children: mStats.onCall ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border ${mStats.isPersonal ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: `fi flex ${mStats.isPersonal ? 'fi-rr-book-user text-amber-500' : 'fi-rr-headset text-indigo-500'} text-[10px] animate-pulse`
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 47
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    mStats.isPersonal ? 'Personal' : 'On Call'
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 123,
                                                columnNumber: 43
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: `w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 129,
                                                        columnNumber: 47
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    isOnline ? 'Active' : `Idle ${mStats.idleTime !== 'N/A' ? mStats.idleTime : ''}`
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 128,
                                                columnNumber: 43
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 121,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "inline-flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-black text-indigo-600",
                                                        children: mStats.totalCalls
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[9px] text-gray-400 font-bold uppercase tracking-tighter",
                                                        children: "attempts"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 140,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 136,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 135,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center text-xs text-gray-600 font-extrabold",
                                            children: mStats.totalTalkTime
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 144,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-black text-gray-800",
                                                    children: mStats.connected
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[9px] text-emerald-500 font-bold",
                                                    children: [
                                                        mStats.connectedRate,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                    lineNumber: 150,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 148,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center text-xs text-gray-500 font-bold",
                                            children: mStats.avgDuration
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 153,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center text-xs text-amber-600 font-black",
                                            children: mStats.streakGap
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 157,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-black text-rose-600",
                                                        children: mStats.utilization
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "h-full bg-rose-500",
                                                            style: {
                                                                width: `${Math.min(100, parseFloat(mStats.utilization))}%`
                                                            }
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                            lineNumber: 167,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 166,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 162,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 161,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 text-right",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-black text-gray-800",
                                                    children: formatTime(mStats.lastActive)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[9px] text-gray-400 font-bold uppercase tracking-tighter",
                                                    children: mStats.lastActive ? new Date(mStats.lastActive).toLocaleDateString([], {
                                                        day: '2-digit',
                                                        month: 'short'
                                                    }) : 'Never'
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 175,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, member.user_id, true, {
                                    fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                    lineNumber: 104,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0));
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                            lineNumber: 79,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                    lineNumber: 65,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                lineNumber: 64,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
        lineNumber: 26,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = MemberPerformanceTable;
}),
"[project]/lib/performanceUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shared Performance Aggregation Logic
 * Ensures 100% data parity between Dashboard and Team Details
 */ __turbopack_context__.s([
    "aggregatePerformance",
    ()=>aggregatePerformance,
    "formatDuration",
    ()=>formatDuration
]);
function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor(seconds % 3600 / 60);
    const secs = Math.floor(seconds % 60);
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}
function aggregatePerformance(agents, historyData, logData, syncMeta = [], sessions = [], customers = [] // Optional: For legacy disposition calculation
) {
    const now = new Date();
    const statsMap = {};
    const performanceMembers = [];
    // 1. EXACT Same Deduplication Key Logic
    const uniqueEntries = [];
    const seenKeys = new Set();
    historyData.forEach((item)=>{
        // Standardized formatting for key generation to avoid browser-locale mismatches
        const d = new Date(item.timestamp);
        const timeStr = d.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        const dateStr = d.toLocaleDateString();
        const key = `${item.number}-${item.employee_id}-${dateStr}-${timeStr}-${item.duration}`;
        if (!seenKeys.has(key)) {
            uniqueEntries.push(item);
            seenKeys.add(key);
        }
    });
    // 2. Map unique entries to agents using robust casing
    const logsByAgent = {};
    const employeeIdToUserId = {};
    agents.forEach((m)=>{
        logsByAgent[m.user_id] = [];
        if (m.employee_id) {
            employeeIdToUserId[m.employee_id.toLowerCase().trim()] = m.user_id;
        }
    });
    uniqueEntries.forEach((l)=>{
        const empId = l.employee_id?.toLowerCase().trim();
        if (empId && employeeIdToUserId[empId]) {
            const uId = employeeIdToUserId[empId];
            logsByAgent[uId].push(l);
        }
    });
    // 3. Process Member Stats One by One
    agents.forEach((member)=>{
        const uId = member.user_id;
        const empId = member.employee_id;
        const userLogs = logsByAgent[uId] || [];
        const agentPortalLogs = logData.filter((l)=>l.agent_id === uId);
        const totalCalls = userLogs.length;
        // Connected logic standardized: Outgoing/Incoming with duration > 0
        const connectedCount = userLogs.filter((l)=>{
            const type = (l.call_type || '').toLowerCase();
            const duration = Number(l.duration) || 0;
            return (type.includes('outgoing') || type.includes('incoming')) && duration > 0;
        }).length;
        const totalDurationSec = userLogs.reduce((acc, l)=>acc + (Number(l.duration) || 0), 0);
        const avgTalkSec = connectedCount ? Math.floor(totalDurationSec / connectedCount) : 0;
        let lastActive = null;
        let idleTimeStr = "N/A";
        if (userLogs.length > 0) {
            const sortedHistory = [
                ...userLogs
            ].sort((x, y)=>new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime());
            lastActive = sortedHistory[0].timestamp;
            const diffMin = Math.floor((now.getTime() - new Date(lastActive).getTime()) / 60000);
            if (diffMin < 1) idleTimeStr = "0m";
            else if (diffMin < 60) idleTimeStr = `${diffMin}m`;
            else idleTimeStr = `${Math.floor(diffMin / 60)}h ${diffMin % 60}m`;
        }
        // Streak/Gap Logic
        const sortedUnique = [
            ...userLogs
        ].sort((x, y)=>new Date(x.timestamp).getTime() - new Date(y.timestamp).getTime());
        const lastSuccessIdx = sortedUnique.map((h)=>Number(h.duration) > 0).lastIndexOf(true);
        const currentStreak = lastSuccessIdx === -1 ? sortedUnique : sortedUnique.slice(lastSuccessIdx + 1);
        let streakCount = currentStreak.length;
        let avgGapStr = '0s';
        if (streakCount > 0) {
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
        // Live Status Logic
        const syncData = syncMeta.find((s)=>s.employee_id === empId);
        const sessionData = sessions.find((s)=>s.user_id === uId);
        const isActuallyOnline = lastActive && now.getTime() - new Date(lastActive).getTime() < 30000;
        const onCall = !!syncData?.on_call;
        const isPersonal = !!syncData?.is_personal;
        // Utilization Calculation Standardized
        const talkTimeMins = totalDurationSec / 60;
        const utilRaw = (talkTimeMins * 1.67 + totalCalls) / 3;
        statsMap[uId] = {
            totalCalls,
            connected: connectedCount,
            connectedRate: totalCalls ? (connectedCount / totalCalls * 100).toFixed(1) : "0.0",
            avgDuration: `${Math.floor(avgTalkSec / 60)}m ${avgTalkSec % 60}s`,
            totalTalkTime: formatDuration(totalDurationSec),
            totalDurationSec,
            streakGap: `${streakCount}/${avgGapStr}`,
            utilization: utilRaw.toFixed(1) + '%',
            utilizationRaw: utilRaw,
            lastActive,
            idleTime: idleTimeStr,
            status: onCall ? isPersonal ? 'Personal Call' : 'On Call' : isActuallyOnline ? 'Online' : 'Idle',
            onCall,
            isPersonal,
            lastOnline: member.last_online || syncData?.last_seen || sessionData?.last_accessed_at || null,
            followUps: agentPortalLogs.filter((l)=>l.disposition === 'Follow Up').length
        };
        performanceMembers.push({
            user_id: uId,
            user_name: member.user_name,
            employee_id: empId,
            profile_pic_url: member.profile_pic_url
        });
    });
    return {
        statsMap,
        performanceMembers
    };
}
}),
"[project]/pages/portal/team/[id].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>TeamDetails
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/PieChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/polar/Pie.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Cell.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/AreaChart.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Area.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Legend.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dateUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$MemberPerformanceTable$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/MemberPerformanceTable.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performanceUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/performanceUtils.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
function TeamDetails() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { id } = router.query;
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    // RAW Data States
    const [team, setTeam] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [members, setMembers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawLogs, setRawLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawCustomers, setRawCustomers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawSyncMeta, setRawSyncMeta] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawCallLogs, setRawCallLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [rawSessions, setRawSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [dateFilter, setDateFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("today");
    // REPLACING LOCAL STATES WITH SHARED UTILITY OUTPUT
    const [memberStatsMap, setMemberStatsMap] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const COLORS = [
        '#4b33e8',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#6366f1'
    ];
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const getDateRange = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((filter)=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getISTDateRange"])(filter);
    }, []);
    const fetchTeamData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (!id || Array.isArray(id)) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const { data: teamData, error: teamError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('teams').select(`id, name, is_active, members, leader_id, organization:organizations(company_name), leader:user_profiles!leader_id(user_name)`).eq('id', id).maybeSingle();
            if (teamError) throw new Error(`Failed to fetch team details: ${teamError.message}`);
            if (!teamData) {
                setError("Team not found or access denied.");
                setLoading(false);
                return;
            }
            setTeam(teamData);
            const memberIds = Array.isArray(teamData.members) ? teamData.members : [];
            if (memberIds.length === 0) {
                setMembers([]);
                setRawLogs([]);
                setLoading(false);
                return;
            }
            const { data: membersData, error: membersError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, user_name, employee_id, profile_pic_url, status, last_online').in('user_id', memberIds).eq('status', 'active');
            if (membersError) throw new Error(`Members fetch failed: ${membersError.message}`);
            const validMembers = (membersData || []).sort((a, b)=>(a.user_name || '').localeCompare(b.user_name || ''));
            setMembers(validMembers);
            const employeeIds = validMembers.map((m)=>m.employee_id).filter((id)=>!!id);
            const { start, end } = getDateRange(dateFilter);
            const [customersRes, historyRes, syncRes, callLogsRes, sessionRes] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('assigned_to, next_called_at, created_at, customer_details, disposition').in('assigned_to', memberIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_history').select('employee_id, duration, call_type, timestamp, device_id, number, name').in('employee_id', employeeIds).gte('timestamp', start).lte('timestamp', end).limit(50000),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('employee_id, on_call, is_personal, last_seen').in('employee_id', employeeIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('agent_id, duration, is_connected, created_at, disposition').in('agent_id', memberIds).gte('created_at', start).lte('created_at', end).limit(50000),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_sessions').select('user_id, last_accessed_at').in('user_id', memberIds).order('last_accessed_at', {
                    ascending: false
                })
            ]);
            if (historyRes.error) throw new Error(`History fetch failed: ${historyRes.error.message}`);
            // Process sessions
            const latestSessions = [];
            const seenUsers = new Set();
            (sessionRes.data || []).forEach((s)=>{
                if (!seenUsers.has(s.user_id)) {
                    latestSessions.push(s);
                    seenUsers.add(s.user_id);
                }
            });
            // USE SHARED UTILITY FOR AGGREGATION
            const { statsMap } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performanceUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["aggregatePerformance"])(validMembers, historyRes.data || [], callLogsRes.data || [], syncRes.data || [], latestSessions, customersRes.data || []);
            setMemberStatsMap(statsMap);
            setRawLogs(historyRes.data || []); // Still used for charts below
            setRawCustomers(customersRes.data || []); // Still used for charts below
            setRawCallLogs(callLogsRes.data || []);
            setRawSyncMeta(syncRes.data || []);
            setRawSessions(latestSessions);
        } catch (err) {
            console.error("Fatal Error in fetchTeamData:", err);
            setError(err.message || "Failed to load team analytics.");
        } finally{
            setLoading(false);
        }
    }, [
        id,
        dateFilter,
        getDateRange
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (router.isReady && id && mounted && user) fetchTeamData();
    }, [
        router.isReady,
        id,
        mounted,
        user,
        fetchTeamData
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (router.isReady && id && mounted && user) {
            const interval = setInterval(()=>fetchTeamData(), 30000);
            return ()=>clearInterval(interval);
        }
    }, [
        router.isReady,
        id,
        mounted,
        user,
        fetchTeamData
    ]);
    // Derived Computations for Charts (Maintained for UI continuity)
    const chartsData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!members.length) return {
            outcome: [],
            hourly: [],
            disposition: []
        };
        const outcomeCounts = {};
        rawLogs.forEach((l)=>{
            const type = (l.call_type || 'Unknown').toLowerCase();
            let status = 'Unknown';
            if (type.includes('outgoing')) status = 'Outgoing';
            else if (type.includes('incoming')) status = 'Incoming';
            else if (type.includes('missed')) status = 'Missed';
            else if (type.includes('reject')) status = 'Rejected';
            outcomeCounts[status] = (outcomeCounts[status] || 0) + 1;
        });
        const hourLabels = [];
        for(let i = 8; i <= 20; i += 2)hourLabels.push(`${i > 12 ? i - 12 : i}${i >= 12 ? 'pm' : 'am'} - ${i + 2 > 12 ? i + 2 - 12 : i + 2}${i + 2 >= 12 ? 'pm' : 'am'}`);
        const hourlyMap = Object.fromEntries(hourLabels.map((l)=>[
                l,
                0
            ]));
        rawLogs.forEach((l)=>{
            const h = new Date(l.timestamp).getHours();
            for(let i = 8; i <= 20; i += 2){
                if (h >= i && h < i + 2) {
                    hourlyMap[hourLabels[(i - 8) / 2]]++;
                    break;
                }
            }
        });
        const dispCounts = {};
        rawCustomers.forEach((c)=>{
            const d = c.disposition || 'Fresh';
            dispCounts[d] = (dispCounts[d] || 0) + 1;
        });
        return {
            outcome: Object.entries(outcomeCounts).map(([name, value])=>({
                    name,
                    value
                })),
            hourly: hourLabels.map((name)=>({
                    name,
                    count: hourlyMap[name]
                })),
            disposition: Object.entries(dispCounts).map(([name, value])=>({
                    name,
                    value
                }))
        };
    }, [
        members,
        rawLogs,
        rawCustomers
    ]);
    if (loading && !team) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex flex-col items-center justify-center bg-gray-50/50",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "w-12 h-12 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 166,
                    columnNumber: 102
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "mt-4 text-gray-500 font-medium",
                    children: "Fetching team intelligence..."
                }, void 0, false, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 166,
                    columnNumber: 208
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/team/[id].tsx",
            lineNumber: 166,
            columnNumber: 16
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/portal/team/[id].tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
    if (error) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "min-h-[80vh] flex flex-col items-center justify-center p-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                        className: "fi fi-rr-exclamation text-3xl text-rose-500"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/team/[id].tsx",
                        lineNumber: 170,
                        columnNumber: 181
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 170,
                    columnNumber: 92
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-2xl font-bold text-gray-900 mb-2",
                    children: "Something went wrong"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 170,
                    columnNumber: 250
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-gray-500 text-center max-w-md mb-8",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 170,
                    columnNumber: 329
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    onClick: ()=>router.push('/portal/dashboard'),
                    className: "px-8 py-3 bg-[#4b33e8] text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98] transition-all",
                    children: "Go back to Dashboard"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 170,
                    columnNumber: 395
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/pages/portal/team/[id].tsx",
            lineNumber: 170,
            columnNumber: 16
        }, this)
    }, void 0, false, {
        fileName: "[project]/pages/portal/team/[id].tsx",
        lineNumber: 170,
        columnNumber: 5
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: [
                        team?.name || 'Team Details',
                        " | CRM Portal"
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/team/[id].tsx",
                    lineNumber: 175,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/team/[id].tsx",
                lineNumber: 175,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-4 sm:px-6 py-8 max-w-[1500px] animate-in fade-in duration-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#4b33e8] to-[#6366f1] text-white flex items-center justify-center shadow-xl shadow-indigo-100/50",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-users-alt text-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 179,
                                            columnNumber: 176
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 179,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                        className: "text-3xl font-black text-gray-900 tracking-tight",
                                                        children: team?.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 64
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100",
                                                        children: "Live Analytics"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 146
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 180,
                                                columnNumber: 18
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-sm font-medium text-gray-400",
                                                children: [
                                                    "Organization: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-600 font-bold",
                                                        children: team?.organization?.company_name || 'Personal'
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 383
                                                    }, this),
                                                    " • Leader: ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-gray-600 font-bold text-indigo-600",
                                                        children: [
                                                            "@",
                                                            team?.leader?.user_name || 'N/A'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 491
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 180,
                                                columnNumber: 320
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 180,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/team/[id].tsx",
                                lineNumber: 178,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex bg-white/80 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm self-start",
                                children: [
                                    'today',
                                    'yesterday',
                                    'this_week',
                                    'this_month',
                                    'all_time'
                                ].map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setDateFilter(opt),
                                        className: `px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${dateFilter === opt ? 'bg-[#4b33e8] text-white shadow-lg' : 'text-gray-400 hover:text-[#4b33e8] hover:bg-gray-50'}`,
                                        children: opt.replace('_', ' ')
                                    }, opt, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 184,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/team/[id].tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/team/[id].tsx",
                        lineNumber: 177,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm group hover:border-indigo-100 transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-3.5 bg-indigo-50 rounded-2xl text-indigo-600",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-phone-call text-xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 191,
                                                    columnNumber: 255
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 191,
                                                columnNumber: 191
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-black text-indigo-400 uppercase tracking-widest",
                                                children: "Total Volume"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 191,
                                                columnNumber: 308
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 191,
                                        columnNumber: 135
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-4xl font-black text-gray-900 mb-1 tracking-tight",
                                        children: Object.values(memberStatsMap).reduce((acc, s)=>acc + s.totalCalls, 0).toLocaleString()
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 191,
                                        columnNumber: 416
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 font-medium",
                                        children: "Outbound Dials Recorded"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 191,
                                        columnNumber: 581
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/team/[id].tsx",
                                lineNumber: 191,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm group hover:border-emerald-100 transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-3.5 bg-emerald-50 rounded-2xl text-emerald-600",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-headset text-xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 192,
                                                    columnNumber: 258
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 192,
                                                columnNumber: 192
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-black text-emerald-400 uppercase tracking-widest",
                                                children: "Efficiency"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 192,
                                                columnNumber: 308
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 192,
                                        columnNumber: 136
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-4xl font-black text-gray-900 mb-1 tracking-tight",
                                        children: [
                                            Object.values(memberStatsMap).length > 0 ? (Object.values(memberStatsMap).reduce((acc, s)=>acc + s.connected, 0) / Object.values(memberStatsMap).reduce((acc, s)=>acc + Math.max(1, s.totalCalls), 0) * 100).toFixed(1) : '0.0',
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 192,
                                        columnNumber: 415
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 font-medium",
                                        children: "Overall Connection Rate"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 192,
                                        columnNumber: 720
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/team/[id].tsx",
                                lineNumber: 192,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm group hover:border-amber-100 transition-all",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-3.5 bg-amber-50 rounded-2xl text-amber-600",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-clock text-xl"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                    lineNumber: 193,
                                                    columnNumber: 252
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 193,
                                                columnNumber: 190
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-black text-amber-400 uppercase tracking-widest",
                                                children: "Talk Time"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 193,
                                                columnNumber: 300
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 193,
                                        columnNumber: 134
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-4xl font-black text-gray-900 mb-1 tracking-tight",
                                        children: [
                                            Math.floor(Object.values(memberStatsMap).reduce((acc, s)=>acc + s.totalDurationSec, 0) / 3600),
                                            "h ",
                                            Math.floor(Object.values(memberStatsMap).reduce((acc, s)=>acc + s.totalDurationSec, 0) % 3600 / 60),
                                            "m"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 193,
                                        columnNumber: 404
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400 font-medium",
                                        children: "Cumulative Active Minutes"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 193,
                                        columnNumber: 685
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/team/[id].tsx",
                                lineNumber: 193,
                                columnNumber: 12
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/team/[id].tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-[450px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "font-black text-gray-900 mb-8 uppercase tracking-widest text-xs border-b border-gray-50 pb-4",
                                        children: "Hourly Call Traffic"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 197,
                                        columnNumber: 100
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "h-[320px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                            width: "100%",
                                            height: "100%",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$AreaChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["AreaChart"], {
                                                data: chartsData.hourly,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("defs", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("linearGradient", {
                                                            id: "colorCount",
                                                            x1: "0",
                                                            y1: "0",
                                                            x2: "0",
                                                            y2: "1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("stop", {
                                                                    offset: "5%",
                                                                    stopColor: "#4b33e8",
                                                                    stopOpacity: 0.1
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 197,
                                                                    columnNumber: 410
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("stop", {
                                                                    offset: "95%",
                                                                    stopColor: "#4b33e8",
                                                                    stopOpacity: 0
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/team/[id].tsx",
                                                                    lineNumber: 197,
                                                                    columnNumber: 467
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                                            lineNumber: 197,
                                                            columnNumber: 350
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 344
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                        strokeDasharray: "3 3",
                                                        vertical: false,
                                                        stroke: "#F1F1F1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 547
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["XAxis"], {
                                                        dataKey: "name",
                                                        axisLine: false,
                                                        tickLine: false,
                                                        tick: {
                                                            fill: '#9CA3AF',
                                                            fontSize: 10,
                                                            fontWeight: 700
                                                        },
                                                        dy: 10
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 620
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["YAxis"], {
                                                        axisLine: false,
                                                        tickLine: false,
                                                        tick: {
                                                            fill: '#9CA3AF',
                                                            fontSize: 10,
                                                            fontWeight: 700
                                                        },
                                                        dx: -10
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 742
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                        contentStyle: {
                                                            borderRadius: '16px',
                                                            border: 'none',
                                                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 850
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Area$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Area"], {
                                                        type: "monotone",
                                                        dataKey: "count",
                                                        stroke: "#4b33e8",
                                                        strokeWidth: 4,
                                                        fillOpacity: 1,
                                                        fill: "url(#colorCount)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 197,
                                                        columnNumber: 962
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 197,
                                                columnNumber: 308
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 197,
                                            columnNumber: 260
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 197,
                                        columnNumber: 233
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/team/[id].tsx",
                                lineNumber: 197,
                                columnNumber: 12
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm h-[450px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "font-black text-gray-900 mb-8 uppercase tracking-widest text-xs border-b border-gray-50 pb-4",
                                        children: "Outcome Distribution"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 198,
                                        columnNumber: 100
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "h-[320px]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                            width: "100%",
                                            height: "100%",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$PieChart$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["PieChart"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$polar$2f$Pie$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Pie"], {
                                                        data: chartsData.outcome,
                                                        cx: "50%",
                                                        cy: "50%",
                                                        innerRadius: 80,
                                                        outerRadius: 110,
                                                        paddingAngle: 8,
                                                        dataKey: "value",
                                                        stroke: "none",
                                                        children: chartsData.outcome.map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Cell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Cell"], {
                                                                fill: COLORS[i % COLORS.length]
                                                            }, i, false, {
                                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                                lineNumber: 198,
                                                                columnNumber: 484
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 198,
                                                        columnNumber: 319
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Tooltip"], {}, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 198,
                                                        columnNumber: 541
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Legend$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["Legend"], {
                                                        verticalAlign: "bottom",
                                                        height: 36
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                                        lineNumber: 198,
                                                        columnNumber: 552
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/team/[id].tsx",
                                                lineNumber: 198,
                                                columnNumber: 309
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/team/[id].tsx",
                                            lineNumber: 198,
                                            columnNumber: 261
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/team/[id].tsx",
                                        lineNumber: 198,
                                        columnNumber: 234
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/team/[id].tsx",
                                lineNumber: 198,
                                columnNumber: 12
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/team/[id].tsx",
                        lineNumber: 196,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$MemberPerformanceTable$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        members: members,
                        memberStats: memberStatsMap,
                        loading: loading,
                        onRefresh: fetchTeamData,
                        lastUpdated: new Date()
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/team/[id].tsx",
                        lineNumber: 201,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/team/[id].tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/portal/team/[id].tsx",
        lineNumber: 174,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__5cf066d2._.js.map