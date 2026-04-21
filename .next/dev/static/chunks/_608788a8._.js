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
                                            "ONLINE"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/shared/MemberPerformanceTable.tsx",
                                        lineNumber: 52,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 text-gray-400 rounded-xl border border-gray-100",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                                                className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border ${mStats.isPersonal ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`,
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
                                                className: `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase border ${isOnline ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
"[project]/lib/performanceUtils.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performanceUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/performanceUtils.ts [client] (ecmascript)");
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
function AgentPerformanceTab({ selectedOrgId, selectedUserId, dateFilter: propDateFilter = "today", loading = false, restrictedUserIds = null }) {
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
    const { agentData: hookAgentData, fetchAgentPerformance, loading: hookLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useAgentPerformance"])();
    const [memberStatsMap, setMemberStatsMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [performanceMembers, setPerformanceMembers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rpcLoading, setRpcLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const fetchRpcPerformance = async (start, end)=>{
        try {
            setRpcLoading(true);
            let agentQuery = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('user_id, user_name, employee_id, organization_id, profile_pic_url, last_online');
            if (selectedOrgId && selectedOrgId !== "all") agentQuery = agentQuery.eq('organization_id', selectedOrgId);
            if (restrictedUserIds && restrictedUserIds.length > 0) agentQuery = agentQuery.in('user_id', restrictedUserIds);
            else if (selectedUserId && selectedUserId !== "all") agentQuery = agentQuery.eq('user_id', selectedUserId);
            const { data: agents, error: agentError } = await agentQuery.eq('status', 'active');
            if (agentError) throw agentError;
            if (!agents || agents.length === 0) {
                setMemberStatsMap({});
                setPerformanceMembers([]);
                return;
            }
            const agentIds = agents.map((a)=>a.user_id);
            const employeeIds = agents.map((a)=>a.employee_id?.trim()).filter(Boolean);
            const [historyRes, logRes, syncRes, sessionRes] = await Promise.all([
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_history').select('employee_id, number, timestamp, duration, call_type').in('employee_id', employeeIds).gte('timestamp', start).lte('timestamp', end).limit(50000),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('agent_id, is_connected, duration, disposition, created_at').in('agent_id', agentIds).gte('created_at', start).lte('created_at', end).limit(50000),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('employee_id, on_call, is_personal, last_seen').in('employee_id', employeeIds),
                __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_sessions').select('user_id, last_accessed_at').in('user_id', agentIds).order('last_accessed_at', {
                    ascending: false
                })
            ]);
            const historyData = historyRes.data || [];
            const logData = logRes.data || [];
            const syncMeta = syncRes.data || [];
            const sessionData = sessionRes.data || [];
            // Extract unique sessions per user
            const latestSessions = [];
            const seenUsers = new Set();
            sessionData.forEach((s)=>{
                if (!seenUsers.has(s.user_id)) {
                    latestSessions.push(s);
                    seenUsers.add(s.user_id);
                }
            });
            // CALL SHARED UTILITY
            const { statsMap, performanceMembers: members } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performanceUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["aggregatePerformance"])(agents, historyData, logData, syncMeta, latestSessions);
            setMemberStatsMap(statsMap);
            setPerformanceMembers(members);
            setLastUpdated(new Date());
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
    const displayData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "AgentPerformanceTab.useMemo[displayData]": ()=>{
            return performanceMembers.map({
                "AgentPerformanceTab.useMemo[displayData]": (m)=>{
                    const stats = memberStatsMap[m.user_id];
                    return {
                        id: m.user_id,
                        name: m.user_name,
                        count: stats?.totalCalls || 0,
                        duration: stats?.totalDurationSec || 0
                    };
                }
            }["AgentPerformanceTab.useMemo[displayData]"]).sort({
                "AgentPerformanceTab.useMemo[displayData]": (a, b)=>b.count - a.count
            }["AgentPerformanceTab.useMemo[displayData]"]);
        }
    }["AgentPerformanceTab.useMemo[displayData]"], [
        performanceMembers,
        memberStatsMap
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
        if (performanceMembers.length === 0) return;
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
        const rows = performanceMembers.map((m)=>{
            const stats = memberStatsMap[m.user_id];
            return [
                m.user_name,
                m.employee_id,
                stats?.totalCalls || 0,
                stats?.connected || 0,
                stats?.avgDuration || '0m 0s',
                stats?.followUps || 0,
                stats?.utilization || '0%',
                stats?.lastActive ? new Date(stats.lastActive).toLocaleString() : 'Never'
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
                                lineNumber: 184,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 font-bold",
                                children: "-"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "date",
                                value: endDate,
                                onChange: (e)=>setEndDate(e.target.value),
                                className: "px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs sm:text-sm font-bold text-gray-500 cursor-pointer focus:outline-none focus:border-[#4b33e8]"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 183,
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
                                lineNumber: 189,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Apply Filter"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 189,
                                columnNumber: 59
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 188,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 182,
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
                                                lineNumber: 197,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold",
                                                children: "Dials & Talktime per agent"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 198,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 196,
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
                                                lineNumber: 201,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setMetric('talktime'),
                                                className: `px-4 py-1.5 rounded-lg text-[10px] uppercase font-bold transition-all ${metric === 'talktime' ? 'bg-white shadow-sm text-[#10b981]' : 'text-gray-400'}`,
                                                children: "Talktime"
                                            }, void 0, false, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 202,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 200,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 195,
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
                                                    lineNumber: 210,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$recharts$2f$es6$2f$cartesian$2f$XAxis$2e$js__$5b$client$5d$__$28$ecmascript$29$__["XAxis"], {
                                                    type: "number",
                                                    hide: true
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 211,
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
                                                    lineNumber: 212,
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
                                                                        lineNumber: 215,
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
                                                                                lineNumber: 215,
                                                                                columnNumber: 184
                                                                            }, void 0),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[#10b981] text-[10px] font-bold",
                                                                                children: [
                                                                                    "Talktime: ",
                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performanceUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatDuration"])(payload[0].payload.duration)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                                lineNumber: 215,
                                                                                columnNumber: 273
                                                                            }, void 0)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                        lineNumber: 215,
                                                                        columnNumber: 162
                                                                    }, void 0)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 215,
                                                                columnNumber: 34
                                                            }, void 0);
                                                        }
                                                        return null;
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 213,
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
                                                                children: metric === 'dials' ? p.value : (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$performanceUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["formatDuration"])(p.value)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 220,
                                                                columnNumber: 124
                                                            }, void 0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 220,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                            lineNumber: 209,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 208,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                    lineNumber: 206,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 205,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 194,
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
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-100",
                                children: displayData.slice(0, 5).map((agent, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#4b33e8] font-bold text-xs border border-gray-100 group-hover:bg-[#4b33e8] group-hover:text-white transition-all",
                                                        children: agent.name.charAt(0)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 235,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-bold text-[#263238]",
                                                                children: agent.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 236,
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
                                                                lineNumber: 236,
                                                                columnNumber: 88
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 234,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-bold text-[#263238]",
                                                        children: [
                                                            agent.count.toLocaleString(),
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-gray-400 ml-1",
                                                                children: "dials"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                                lineNumber: 239,
                                                                columnNumber: 98
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 239,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-[9px] text-[#4b33e8] font-bold uppercase",
                                                        children: [
                                                            ((agent.count || 0) / (totalDialsAll || 1) * 100).toFixed(1),
                                                            "% share"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                        lineNumber: 240,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                                lineNumber: 238,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, i, true, {
                                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                        lineNumber: 233,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 231,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>router.push("/portal/team"),
                                className: "mt-8 w-full py-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-gray-600 hover:bg-[#4b33e8] hover:text-white transition-all",
                                children: "View All Teams"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                                lineNumber: 245,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 193,
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
                    lineNumber: 250,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
                lineNumber: 249,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/dashboard/AgentPerformanceTab.tsx",
        lineNumber: 181,
        columnNumber: 5
    }, this);
}
_s(AgentPerformanceTab, "7ZepWZOQ0quE9iYq0FaU4YyQxuI=", false, function() {
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

//# sourceMappingURL=_608788a8._.js.map