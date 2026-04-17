module.exports = [
"[project]/components/dashboard/TopStats.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>TopStats
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
;
;
;
function TopStats({ stats, chartData, loading = false }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const timer = setTimeout(()=>setMounted(true), 150);
        return ()=>clearTimeout(timer);
    }, []);
    const cards = [
        {
            label: "TOTAL TALKTIME",
            value: (()=>{
                const totalSecs = stats.totalTalktime || 0;
                const h = Math.floor(totalSecs / 3600);
                const m = Math.floor(totalSecs % 3600 / 60);
                return h > 0 ? `${h}h ${m}m` : `${m}m ${totalSecs % 60}s`;
            })(),
            trend: "12%",
            color: "#6366F1",
            trendColor: "#6366F1"
        },
        {
            label: "TOTAL DIALS",
            value: (stats.totalDials || 0).toLocaleString(),
            trend: "8%",
            color: "#F59E0B",
            trendColor: "#F59E0B"
        },
        {
            label: "DEALS CLOSED",
            value: (stats.totalConverted || 0).toLocaleString(),
            trend: "4%",
            color: "#10B981",
            trendColor: "#10B981"
        },
        {
            label: "CONVERSION RATE",
            value: `${stats.conversionRate}%`,
            trend: "2%",
            color: "#EC4899",
            trendColor: "#EC4899"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4",
        children: cards.map((card, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative bg-white rounded-[20px] p-5 flex flex-col justify-start",
                style: {
                    overflow: 'hidden'
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "absolute left-0 top-[30%] bottom-[30%] w-[3px] rounded-r-full",
                        style: {
                            backgroundColor: card.color
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/dashboard/TopStats.tsx",
                        lineNumber: 78,
                        columnNumber: 11
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "animate-pulse w-full",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "h-2 bg-gray-100 rounded w-1/3"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/TopStats.tsx",
                                        lineNumber: 86,
                                        columnNumber: 21
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "h-1 w-3 bg-gray-100 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/TopStats.tsx",
                                        lineNumber: 87,
                                        columnNumber: 21
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/TopStats.tsx",
                                lineNumber: 85,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "h-7 bg-gray-200 rounded w-3/4 mb-3"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/TopStats.tsx",
                                lineNumber: 89,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "h-4 bg-gray-50 rounded w-1/4"
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/TopStats.tsx",
                                lineNumber: 90,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/dashboard/TopStats.tsx",
                        lineNumber: 84,
                        columnNumber: 14
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-start mb-2.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[9px] font-bold text-gray-400 tracking-[0.05em] uppercase",
                                        children: card.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/TopStats.tsx",
                                        lineNumber: 96,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "text-gray-300 hover:text-gray-500 cursor-pointer transition-colors p-1 -mt-1 -mr-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex gap-[1.5px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-[2px] h-[2px] rounded-full bg-current"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/TopStats.tsx",
                                                    lineNumber: 101,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-[2px] h-[2px] rounded-full bg-current"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/TopStats.tsx",
                                                    lineNumber: 102,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-[2px] h-[2px] rounded-full bg-current"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/dashboard/TopStats.tsx",
                                                    lineNumber: 103,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/dashboard/TopStats.tsx",
                                            lineNumber: 100,
                                            columnNumber: 20
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/TopStats.tsx",
                                        lineNumber: 99,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/TopStats.tsx",
                                lineNumber: 95,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mb-3.5",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold text-[#1F2937] font-poppins tracking-tight",
                                    children: card.value
                                }, void 0, false, {
                                    fileName: "[project]/components/dashboard/TopStats.tsx",
                                    lineNumber: 110,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/dashboard/TopStats.tsx",
                                lineNumber: 109,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-4.5 h-4.5 rounded-md flex items-center justify-center transition-transform group-hover:scale-110",
                                        style: {
                                            backgroundColor: `${card.color}15`,
                                            color: card.color
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-arrow-trend-up flex text-[8px]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/dashboard/TopStats.tsx",
                                            lineNumber: 121,
                                            columnNumber: 20
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/TopStats.tsx",
                                        lineNumber: 117,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-bold text-gray-600",
                                        children: card.trend
                                    }, void 0, false, {
                                        fileName: "[project]/components/dashboard/TopStats.tsx",
                                        lineNumber: 123,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/dashboard/TopStats.tsx",
                                lineNumber: 116,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                ]
            }, i, true, {
                fileName: "[project]/components/dashboard/TopStats.tsx",
                lineNumber: 72,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/components/dashboard/TopStats.tsx",
        lineNumber: 70,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/dashboard/TopStats.tsx [ssr] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/dashboard/TopStats.tsx [ssr] (ecmascript)"));
}),
];

//# sourceMappingURL=components_dashboard_TopStats_tsx_b3ebdeb0._.js.map