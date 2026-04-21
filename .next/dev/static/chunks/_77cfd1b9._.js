(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/shared/MemberPerformanceTable.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
;
const MemberPerformanceTable = ({ members, memberStats, loading, onRefresh, title = "Member Performance Breakdown", lastUpdated })=>{
    const formatTime = (date)=>{
        if (!date) return 'N/A';
        return new Date(date).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-left h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-6 py-4 border-b border-gray-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-[#263238] text-lg",
                                children: title
                            }, void 0, false, {
                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                lineNumber: 29,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-400 mt-1 flex items-center gap-2",
                                children: [
                                    "Granular metrics for individual agent activity (Sync enabled)",
                                    lastUpdated && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-1 h-1 rounded-full bg-gray-300"
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 34,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: onRefresh,
                                disabled: loading,
                                className: "group flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all border border-indigo-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: `fi flex fi-rr-refresh ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 48,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 text-[10px] font-bold uppercase tracking-tight",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 53,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Online"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 52,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-600 text-white rounded-xl border border-slate-700 shadow-sm",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-2 h-2 rounded-full bg-slate-300"
                                            }, void 0, false, {
                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                lineNumber: 57,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Idle"
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-x-auto flex-1 scrollbar-thin scrollbar-thumb-gray-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full text-left border-collapse min-w-[1000px]",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "bg-gray-50/50 text-[10px] text-gray-400 uppercase tracking-widest sticky top-0 z-10 bg-gray-50/50 backdrop-blur-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-6 py-4 font-bold",
                                        children: "Agent"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 68,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 69,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center bg-indigo-50/30 text-indigo-600",
                                        children: "Total Dials"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 70,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Talk Time"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 71,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Connected"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 72,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Avg Talk"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 73,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center",
                                        children: "Streak/Gap"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 74,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "px-2 py-4 font-bold text-center text-rose-600",
                                        children: "Utilization"
                                    }, void 0, false, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 75,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            className: "divide-y divide-gray-50",
                            children: members.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
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
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "hover:bg-gray-50/50 transition-colors group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full bg-gray-50 border border-gray-100 shadow-sm overflow-hidden flex items-center justify-center text-gray-400 font-bold text-xs ring-2 ring-white group-hover:ring-indigo-50 transition-all",
                                                        children: member.profile_pic_url || member.profilePic ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: member.profile_pic_url || member.profilePic,
                                                            alt: "",
                                                            className: "w-full h-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                            lineNumber: 109,
                                                            columnNumber: 53
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-bold text-gray-800 leading-none",
                                                                children: member.user_name || member.name || 'Unknown'
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                                lineNumber: 115,
                                                                columnNumber: 49
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center",
                                            children: mStats.onCall ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border ${mStats.isPersonal ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-600 text-white border-slate-700 shadow-sm'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "inline-flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-black text-indigo-600",
                                                        children: mStats.totalCalls
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 137,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center text-xs text-gray-600 font-extrabold",
                                            children: mStats.totalTalkTime
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 144,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-black text-gray-800",
                                                    children: mStats.connected
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center text-xs text-gray-500 font-bold",
                                            children: mStats.avgDuration
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 153,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center text-xs text-amber-600 font-black",
                                            children: mStats.streakGap
                                        }, void 0, false, {
                                            fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                            lineNumber: 157,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-2 py-4 text-center",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-col items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-sm font-black text-rose-600",
                                                        children: mStats.utilization
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                        lineNumber: 163,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-1 bg-gray-100 rounded-full mt-1 overflow-hidden",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-6 py-4 text-right",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-black text-gray-800",
                                                    children: formatTime(mStats.lastActive)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
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
_c = MemberPerformanceTable;
const __TURBOPACK__default__export__ = MemberPerformanceTable;
var _c;
__turbopack_context__.k.register(_c, "MemberPerformanceTable");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/dateUtils.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/AgentPerformanceTab.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AgentPerformanceTab
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/chart/BarChart.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/Bar.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/XAxis.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/YAxis.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/cartesian/CartesianGrid.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/Tooltip.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/ResponsiveContainer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$LabelList$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/recharts/es6/component/LabelList.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAgentPerformance.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$MemberPerformanceTable$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/shared/MemberPerformanceTable.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dateUtils.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
function AgentPerformanceTab({ selectedOrgId, selectedUserId, dateFilter: propDateFilter = "today", loading = false, restrictedUserIds = null, onTotalsChange }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const todayStr = new Date().toLocaleDateString('en-CA');
    const [startDate, setStartDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(todayStr);
    const [endDate, setEndDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(todayStr);
    const [isFiltered, setIsFiltered] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [metric, setMetric] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('dials');
    const [lastUpdated, setLastUpdated] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const dateFilter = propDateFilter;
    // Real-time status states
    const [rawSyncMeta, setRawSyncMeta] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rawSessions, setRawSessions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rawProfiles, setRawProfiles] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const formatDuration = (seconds)=>{
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor(seconds % 3600 / 60);
        const secs = seconds % 60;
        if (hours > 0) return `${hours}h ${mins}m`;
        if (mins > 0) return `${mins}m ${secs}s`;
        return `${secs}s`;
    };
    const { agentData: hookAgentData, fetchAgentPerformance, loading: hookLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAgentPerformance"])();
    const [rpcData, setRpcData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rpcLoading, setRpcLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchRpcPerformance = async (start, end)=>{
        try {
            setRpcLoading(true);
            let agentQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, user_name, employee_id, organization_id, profile_pic_url');
            if (selectedOrgId && selectedOrgId !== "all") agentQuery = agentQuery.eq('organization_id', selectedOrgId);
            if (restrictedUserIds && restrictedUserIds.length > 0) agentQuery = agentQuery.in('user_id', restrictedUserIds);
            else if (selectedUserId && selectedUserId !== "all") agentQuery = agentQuery.eq('user_id', selectedUserId);
            const { data: agents, error: agentError } = await agentQuery.eq('status', 'active');
            if (agentError) throw agentError;
            if (!agents || agents.length === 0) {
                setRpcData([]);
                return;
            }
            const agentIds = agents.map((a)=>a.user_id);
            const employeeIds = agents.map((a)=>a.employee_id?.trim()).filter(Boolean);
            // BATCH FETCHING to avoid 50k limit truncation
            const BATCH_SIZE = 20;
            let allHistory = [];
            let allLogs = [];
            for(let i = 0; i < employeeIds.length; i += BATCH_SIZE){
                const batchEmpIds = employeeIds.slice(i, i + BATCH_SIZE);
                const batchAgentIds = agentIds.slice(i, i + BATCH_SIZE);
                const [historyRes, logRes] = await Promise.all([
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_history').select('employee_id, number, timestamp, duration, call_type').in('employee_id', batchEmpIds).gte('timestamp', start).lte('timestamp', end).limit(40000),
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('agent_id, is_connected, duration, disposition, created_at').in('agent_id', batchAgentIds).gte('created_at', start).lte('created_at', end).limit(20000)
                ]);
                if (historyRes.data) allHistory = [
                    ...allHistory,
                    ...historyRes.data
                ];
                if (logRes.data) allLogs = [
                    ...allLogs,
                    ...logRes.data
                ];
            }
            const historyData = allHistory;
            const logData = allLogs;
            // EXACT same deduplication logic as Team Page to ensure 1:1 parity
            const uniqueEntries = [];
            const seenKeys = new Set();
            historyData.forEach((item)=>{
                const timeStr = new Date(item.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                const dateStr = new Date(item.timestamp).toLocaleDateString();
                const key = `${item.number}-${item.employee_id}-${dateStr}-${timeStr}-${item.duration}`;
                if (!seenKeys.has(key)) {
                    uniqueEntries.push(item);
                    seenKeys.add(key);
                }
            });
            // Map unique entries to agents using robust casing
            const logsByAgent = {};
            const employeeIdToUserId = {};
            agents.forEach((m)=>{
                logsByAgent[m.user_id] = [];
                if (m.employee_id) employeeIdToUserId[m.employee_id.toLowerCase().trim()] = m.user_id;
            });
            uniqueEntries.forEach((l)=>{
                const empId = l.employee_id?.toLowerCase().trim();
                if (empId && employeeIdToUserId[empId]) {
                    const uId = employeeIdToUserId[empId];
                    logsByAgent[uId].push(l);
                }
            });
            const processed = agents.map((a)=>{
                const uId = a.user_id;
                const userLogs = logsByAgent[uId] || [];
                const agentPortalLogs = logData.filter((l)=>l.agent_id === uId);
                const totalCalls = userLogs.length;
                const connectedCount = userLogs.filter((l)=>{
                    const type = (l.call_type || '').toLowerCase();
                    const duration = Number(l.duration) || 0;
                    return (type.includes('outgoing') || type.includes('incoming')) && duration > 0;
                }).length;
                const totalDuration = userLogs.reduce((acc, l)=>acc + (Number(l.duration) || 0), 0);
                const avgTalkSec = connectedCount ? Math.floor(totalDuration / connectedCount) : 0;
                let lastCallAt = null;
                if (userLogs.length > 0) {
                    const sortedHistory = [
                        ...userLogs
                    ].sort((x, y)=>new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime());
                    lastCallAt = sortedHistory[0].timestamp;
                }
                // Streak/Gap Logic (Consecutive Fails since last success)
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
                return {
                    user_id_val: uId,
                    employee_id_val: a.employee_id,
                    agent_name: a.user_name,
                    total_dials: totalCalls,
                    connected_calls: connectedCount,
                    duration_raw: totalDuration,
                    follow_ups: agentPortalLogs.filter((l)=>l.disposition === 'Follow Up').length,
                    last_call_at: lastCallAt,
                    streak_gap: `${streakCount}/${avgGapStr}`,
                    avg_talk: `${Math.floor(avgTalkSec / 60)}m ${avgTalkSec % 60}s`,
                    profile_pic_url: a.profile_pic_url
                };
            });
            // Final Sort: Highest Dials first (Descending)
            const sortedProcessed = [
                ...processed
            ].sort((x, y)=>{
                if (y.total_dials !== x.total_dials) return y.total_dials - x.total_dials;
                return y.duration_raw - x.duration_raw;
            });
            setRpcData(sortedProcessed);
            setLastUpdated(new Date());
            // Propagate totals to parent for dashboard tiles parity
            if (onTotalsChange) {
                const totalDials = sortedProcessed.reduce((acc, curr)=>acc + (curr.total_dials || 0), 0);
                const totalDuration = sortedProcessed.reduce((acc, curr)=>acc + (curr.duration_raw || 0), 0);
                onTotalsChange({
                    totalDials,
                    totalDuration
                });
            }
        } catch (err) {
            console.error("[AgentPerformanceTab] Manual Fetch Error:", err);
        } finally{
            setRpcLoading(false);
        }
    };
    // Primary Data Fetch & Refresh Effect
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentPerformanceTab.useEffect": ()=>{
            let interval;
            if (isFiltered && startDate && endDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                fetchRpcPerformance(start.toISOString(), end.toISOString());
            } else {
                const { start, end } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getISTDateRange"])(dateFilter);
                fetchRpcPerformance(start, end);
                interval = setInterval({
                    "AgentPerformanceTab.useEffect": ()=>{
                        const { start: freshStart, end: freshEnd } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getISTDateRange"])(dateFilter);
                        fetchRpcPerformance(freshStart, freshEnd);
                    }
                }["AgentPerformanceTab.useEffect"], 30000);
            }
            return ({
                "AgentPerformanceTab.useEffect": ()=>{
                    if (interval) clearInterval(interval);
                }
            })["AgentPerformanceTab.useEffect"];
        }
    }["AgentPerformanceTab.useEffect"], [
        selectedOrgId,
        dateFilter,
        selectedUserId,
        restrictedUserIds,
        isFiltered,
        startDate,
        endDate
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentPerformanceTab.useEffect": ()=>{
            setIsFiltered(false);
        }
    }["AgentPerformanceTab.useEffect"], [
        dateFilter
    ]);
    // Real-time Status Sync
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentPerformanceTab.useEffect": ()=>{
            if (rpcData.length > 0) {
                const userIds = rpcData.map({
                    "AgentPerformanceTab.useEffect.userIds": (i)=>i.user_id_val
                }["AgentPerformanceTab.useEffect.userIds"]).filter(Boolean);
                const employeeIds = rpcData.map({
                    "AgentPerformanceTab.useEffect.employeeIds": (i)=>i.employee_id_val
                }["AgentPerformanceTab.useEffect.employeeIds"]).filter(Boolean);
                const fetchStatus = {
                    "AgentPerformanceTab.useEffect.fetchStatus": async ()=>{
                        const [syncRes, sessionRes, profileRes] = await Promise.all([
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('employee_id, on_call, is_personal, last_seen').in('employee_id', employeeIds),
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_sessions').select('user_id, last_accessed_at').in('user_id', userIds).order('last_accessed_at', {
                                ascending: false
                            }),
                            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, last_online').in('user_id', userIds)
                        ]);
                        if (syncRes.data) setRawSyncMeta(syncRes.data);
                        if (profileRes.data) setRawProfiles(profileRes.data);
                        if (sessionRes.data) {
                            const latest = [];
                            const seen = new Set();
                            sessionRes.data.forEach({
                                "AgentPerformanceTab.useEffect.fetchStatus": (s)=>{
                                    if (!seen.has(s.user_id)) {
                                        latest.push(s);
                                        seen.add(s.user_id);
                                    }
                                }
                            }["AgentPerformanceTab.useEffect.fetchStatus"]);
                            setRawSessions(latest);
                        }
                    }
                }["AgentPerformanceTab.useEffect.fetchStatus"];
                fetchStatus();
            }
        }
    }["AgentPerformanceTab.useEffect"], [
        rpcData
    ]);
    // Derived Mappings for Table & Charts
    const memberStatsMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AgentPerformanceTab.useMemo[memberStatsMap]": ()=>{
            const map = {};
            const now = new Date();
            rpcData.forEach({
                "AgentPerformanceTab.useMemo[memberStatsMap]": (item)=>{
                    const uId = item.user_id_val;
                    const empId = item.employee_id_val;
                    const syncData = rawSyncMeta.find({
                        "AgentPerformanceTab.useMemo[memberStatsMap].syncData": (s)=>s.employee_id === empId
                    }["AgentPerformanceTab.useMemo[memberStatsMap].syncData"]);
                    const sessionData = rawSessions.find({
                        "AgentPerformanceTab.useMemo[memberStatsMap].sessionData": (s)=>s.user_id === uId
                    }["AgentPerformanceTab.useMemo[memberStatsMap].sessionData"]);
                    const profileData = rawProfiles.find({
                        "AgentPerformanceTab.useMemo[memberStatsMap].profileData": (p)=>p.user_id === uId
                    }["AgentPerformanceTab.useMemo[memberStatsMap].profileData"]);
                    // Robust Last Active: Max of (Call History, Portal Activity, Device Sync)
                    const callLastActive = item.last_call_at ? new Date(item.last_call_at).getTime() : 0;
                    const portalLastActive = profileData?.last_online ? new Date(profileData.last_online).getTime() : 0;
                    const deviceLastActive = syncData?.last_seen ? new Date(syncData.last_seen).getTime() : 0;
                    const sessionLastActive = sessionData?.last_accessed_at ? new Date(sessionData.last_accessed_at).getTime() : 0;
                    const maxLastActiveTs = Math.max(callLastActive, portalLastActive, deviceLastActive, sessionLastActive);
                    const lastActive = maxLastActiveTs > 0 ? new Date(maxLastActiveTs).toISOString() : null;
                    const isActuallyOnline = lastActive && now.getTime() - new Date(lastActive).getTime() < 60000; // 1m threshold
                    let idleTimeStr = "N/A";
                    if (lastActive) {
                        const diffSec = Math.floor((now.getTime() - new Date(lastActive).getTime()) / 1000);
                        if (diffSec < 60) idleTimeStr = `${diffSec}s`;
                        else if (diffSec < 3600) idleTimeStr = `${Math.floor(diffSec / 60)}m`;
                        else {
                            const h = Math.floor(diffSec / 3600);
                            const m = Math.floor(diffSec % 3600 / 60);
                            idleTimeStr = `${h}h ${m}m`;
                        }
                    }
                    const totalCalls = item.total_dials;
                    const totalDurationSec = item.duration_raw;
                    const utilRaw = (totalDurationSec / 60 * 1.67 + totalCalls) / 3;
                    map[uId] = {
                        totalCalls,
                        connected: item.connected_calls,
                        connectedRate: totalCalls ? (item.connected_calls / totalCalls * 100).toFixed(1) : "0.0",
                        avgDuration: item.avg_talk,
                        totalTalkTime: formatDuration(item.duration_raw),
                        streakGap: item.streak_gap,
                        utilization: utilRaw.toFixed(1) + '%',
                        utilizationRaw: utilRaw,
                        lastActive,
                        idleTime: idleTimeStr,
                        status: syncData?.on_call ? syncData.is_personal ? 'Personal Call' : 'On Call' : isActuallyOnline ? 'Online' : 'Idle',
                        onCall: !!syncData?.on_call,
                        isPersonal: !!syncData?.is_personal,
                        lastOnline: profileData?.last_online || syncData?.last_seen || sessionData?.last_accessed_at || null
                    };
                }
            }["AgentPerformanceTab.useMemo[memberStatsMap]"]);
            return map;
        }
    }["AgentPerformanceTab.useMemo[memberStatsMap]"], [
        rpcData,
        rawSyncMeta,
        rawSessions,
        rawProfiles
    ]);
    const performanceMembers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AgentPerformanceTab.useMemo[performanceMembers]": ()=>{
            return rpcData.map({
                "AgentPerformanceTab.useMemo[performanceMembers]": (item)=>({
                        user_id: item.user_id_val,
                        user_name: item.agent_name,
                        employee_id: item.employee_id_val,
                        profile_pic_url: item.profile_pic_url
                    })
            }["AgentPerformanceTab.useMemo[performanceMembers]"]);
        }
    }["AgentPerformanceTab.useMemo[performanceMembers]"], [
        rpcData
    ]);
    const displayData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AgentPerformanceTab.useMemo[displayData]": ()=>{
            return rpcData.map({
                "AgentPerformanceTab.useMemo[displayData]": (item)=>({
                        id: item.user_id_val,
                        name: item.agent_name,
                        count: item.total_dials,
                        duration: item.duration_raw
                    })
            }["AgentPerformanceTab.useMemo[displayData]"]);
        }
    }["AgentPerformanceTab.useMemo[displayData]"], [
        rpcData
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AgentPerformanceTab.useEffect": ()=>{
            const timer = setTimeout({
                "AgentPerformanceTab.useEffect.timer": ()=>setMounted(true)
            }["AgentPerformanceTab.useEffect.timer"], 150);
            return ({
                "AgentPerformanceTab.useEffect": ()=>clearTimeout(timer)
            })["AgentPerformanceTab.useEffect"];
        }
    }["AgentPerformanceTab.useEffect"], []);
    const isLoading = loading || hookLoading || rpcLoading;
    const totalDialsAll = displayData.reduce((acc, curr)=>acc + (curr.count || 0), 0);
    const handleDownloadExcel = ()=>{
        if (rpcData.length === 0) return;
        const BOM = "\uFEFF";
        const headers = [
            "Agent Name",
            "Employee ID",
            "Total Dials",
            "Connected",
            "Talk Time",
            "Follow Ups",
            "Utilization",
            "Last Active"
        ];
        const rows = rpcData.map((a)=>{
            const stats = memberStatsMap[a.user_id_val] || {};
            return [
                a.agent_name,
                a.employee_id_val,
                a.total_dials,
                a.connected_calls,
                a.avg_talk,
                a.follow_ups,
                stats.utilization || '0%',
                a.last_call_at ? new Date(a.last_call_at).toLocaleString() : 'Never'
            ];
        });
        const csv = [
            headers.join(","),
            ...rows.map((r)=>r.map((c)=>`"${c}"`).join(","))
        ].join("\n");
        const blob = new Blob([
            BOM + csv
        ], {
            type: "text/csv;charset=utf-8;"
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Performance_${new Date().toLocaleDateString()}.csv`;
        link.click();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 flex-1 sm:flex-none",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: startDate,
                                onChange: (e)=>setStartDate(e.target.value),
                                className: "px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-bold text-gray-500 cursor-pointer focus:outline-none focus:border-[#4b33e8]"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 389,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 font-bold",
                                children: "-"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 390,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: endDate,
                                onChange: (e)=>setEndDate(e.target.value),
                                className: "px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-bold text-gray-500 cursor-pointer focus:outline-none focus:border-[#4b33e8]"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setIsFiltered(true),
                        disabled: isLoading,
                        className: "px-5 py-2.5 bg-[#4b33e8] hover:bg-[#3b25b8] text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-filter flex text-xs"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 394,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Apply Filter"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 394,
                                columnNumber: 59
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 393,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 387,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-8 bg-white rounded-[24px] p-8 flex flex-col relative h-[550px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-bold text-[#263238] text-xl",
                                                children: "Agent Productivity Leaderboard"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 402,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold",
                                                children: "Dials & Talktime per agent"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 403,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex bg-gray-100/80 p-1 rounded-xl border border-gray-200/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setMetric('dials'),
                                                className: `px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${metric === 'dials' ? 'bg-white shadow-sm text-[#4b33e8]' : 'text-gray-400'}`,
                                                children: "Dials"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 406,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setMetric('talktime'),
                                                className: `px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${metric === 'talktime' ? 'bg-white shadow-sm text-[#10b981]' : 'text-gray-400'}`,
                                                children: "Talktime"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 407,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 405,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-indigo-100 no-print-scroll",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        height: `${Math.max(300, displayData.length * 40)}px`,
                                        width: '100%',
                                        position: 'relative'
                                    },
                                    children: mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$ResponsiveContainer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["ResponsiveContainer"], {
                                        width: "100%",
                                        height: "100%",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$chart$2f$BarChart$2e$js__$5b$client$5d$__$28$ecmascript$29$__["BarChart"], {
                                            layout: "vertical",
                                            data: displayData,
                                            margin: {
                                                top: 0,
                                                right: 40,
                                                left: 10,
                                                bottom: 0
                                            },
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$CartesianGrid$2e$js__$5b$client$5d$__$28$ecmascript$29$__["CartesianGrid"], {
                                                    strokeDasharray: "3 3",
                                                    vertical: true,
                                                    horizontal: false,
                                                    stroke: "#f1f1f1"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 415,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                    type: "number",
                                                    hide: true
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 416,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$YAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["YAxis"], {
                                                    dataKey: "name",
                                                    type: "category",
                                                    axisLine: false,
                                                    tickLine: false,
                                                    tick: {
                                                        fill: "#263238",
                                                        fontSize: 11,
                                                        fontWeight: 700
                                                    },
                                                    width: 100
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 417,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$Tooltip$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Tooltip"], {
                                                    cursor: {
                                                        fill: "#f9fafb",
                                                        radius: 8
                                                    },
                                                    content: ({ active, payload })=>{
                                                        if (active && payload?.[0]) {
                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "bg-[#111827] p-3 rounded-xl shadow-xl",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "text-white font-bold text-xs",
                                                                        children: payload[0].payload.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                        lineNumber: 420,
                                                                        columnNumber: 89
                                                                    }, void 0),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "mt-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[#4b33e8] text-[10px] font-bold",
                                                                                children: [
                                                                                    "Dials: ",
                                                                                    payload[0].payload.count
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                                lineNumber: 420,
                                                                                columnNumber: 184
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[#10b981] text-[10px] font-bold",
                                                                                children: [
                                                                                    "Talktime: ",
                                                                                    formatDuration(payload[0].payload.duration)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                                lineNumber: 420,
                                                                                columnNumber: 273
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                        lineNumber: 420,
                                                                        columnNumber: 162
                                                                    }, void 0)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 420,
                                                                columnNumber: 34
                                                            }, void 0);
                                                        }
                                                        return null;
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 418,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$Bar$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Bar"], {
                                                    dataKey: metric === 'dials' ? 'count' : 'duration',
                                                    fill: metric === 'dials' ? '#4b33e8' : '#10b981',
                                                    radius: [
                                                        0,
                                                        20,
                                                        20,
                                                        0
                                                    ],
                                                    barSize: 22,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$component$2f$LabelList$2e$js__$5b$client$5d$__$28$ecmascript$29$__["LabelList"], {
                                                        dataKey: metric === 'dials' ? 'count' : 'duration',
                                                        position: "right",
                                                        content: (p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                                x: p.x + p.width + 5,
                                                                y: p.y + 13,
                                                                fill: metric === 'dials' ? '#4b33e8' : '#10b981',
                                                                fontSize: 10,
                                                                fontWeight: "bold",
                                                                children: metric === 'dials' ? p.value : formatDuration(p.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 425,
                                                                columnNumber: 124
                                                            }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 425,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 424,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                            lineNumber: 414,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 413,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                    lineNumber: 411,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 410,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 399,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-4 bg-white rounded-[24px] p-8 flex flex-col relative h-[550px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-bold text-[#263238] mb-6",
                                children: "Activity Contribution"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 435,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-100",
                                children: rpcData.slice(0, 5).map((agent, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#4b33e8] font-bold text-xs border border-gray-100 group-hover:bg-[#4b33e8] group-hover:text-white transition-all",
                                                        children: agent.agent_name.charAt(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 440,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-bold text-[#263238]",
                                                                children: agent.agent_name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 441,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-400 font-medium",
                                                                children: [
                                                                    "Rank #",
                                                                    i + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 441,
                                                                columnNumber: 94
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 441,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 439,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-[#263238]",
                                                        children: [
                                                            agent.total_dials.toLocaleString(),
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-gray-400 ml-1",
                                                                children: "dials"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 444,
                                                                columnNumber: 104
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 444,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[9px] text-[#4b33e8] font-bold uppercase",
                                                        children: [
                                                            ((agent.total_dials || 0) / (totalDialsAll || 1) * 100).toFixed(1),
                                                            "% share"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 445,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 443,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 438,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 436,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/portal/team"),
                                className: "mt-8 w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-[#4b33e8] hover:text-white transition-all",
                                children: "View All Teams"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 450,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 434,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 398,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mt-8",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$shared$2f$MemberPerformanceTable$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    members: performanceMembers,
                    memberStats: memberStatsMap,
                    loading: isLoading,
                    onRefresh: ()=>{
                        const { start, end } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getISTDateRange"])(dateFilter);
                        fetchRpcPerformance(start, end);
                    },
                    lastUpdated: lastUpdated
                }, void 0, false, {
                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                    lineNumber: 455,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 454,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
        lineNumber: 386,
        columnNumber: 5
    }, this);
}
_s(AgentPerformanceTab, "AsYYhdZ3kDsQCU3r2XpuC0n1oak=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAgentPerformance"]
    ];
});
_c = AgentPerformanceTab;
var _c;
__turbopack_context__.k.register(_c, "AgentPerformanceTab");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/dashboard/AgentPerformanceTab.tsx [client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/dashboard/AgentPerformanceTab.tsx [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_77cfd1b9._.js.map