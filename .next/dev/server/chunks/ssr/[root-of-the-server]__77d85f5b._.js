module.exports = [
"[project]/components/CampaignCard.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
;
;
const CampaignCard = ({ campaign, onEdit, onDelete, isEditVisible = true, isDeleteVisible = true })=>{
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const handleCardClick = ()=>{
        router.push(`/campaign/${campaign.id}`);
    };
    const getStatusColor = (status)=>{
        switch(status){
            case 'active':
                return 'bg-green-100 text-green-700 border-green-200';
            case 'inactive':
                return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'completed':
            case 'finished':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };
    const getStatusDotColor = (status)=>{
        switch(status){
            case 'active':
                return 'bg-green-500';
            case 'inactive':
                return 'bg-orange-500';
            case 'completed':
            case 'finished':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        onClick: handleCardClick,
        className: "group relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden cursor-pointer",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            }, void 0, false, {
                fileName: "[project]/components/CampaignCard.tsx",
                lineNumber: 73,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "relative z-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mb-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between mb-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-bold text-gray-800 truncate pr-2 flex-1",
                                        title: campaign.name || 'Untitled Campaign',
                                        style: {
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: campaign.name || 'Untitled Campaign'
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 78,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: `flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(campaign.status)}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: `w-1.5 h-1.5 rounded-full ${getStatusDotColor(campaign.status)}`
                                            }, void 0, false, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 88,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "capitalize",
                                                children: campaign.status || 'Unknown'
                                            }, void 0, false, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 89,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 85,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 77,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-400 line-clamp-2 min-h-[2.5em]",
                                style: {
                                    fontFamily: "'Roboto', sans-serif"
                                },
                                children: campaign.description || 'No description provided for this campaign.'
                            }, void 0, false, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 92,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 mb-4 bg-blue-50/50 p-2 rounded-lg border border-blue-100 group-hover:bg-blue-50 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center text-white shrink-0 shadow-sm",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-building text-[10px]"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CampaignCard.tsx",
                                            lineNumber: 102,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 101,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-[10px] uppercase font-black text-blue-400 tracking-widest leading-none mb-0.5",
                                                children: "Assigned Asset"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 105,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-xs font-bold text-blue-900 truncate",
                                                children: [
                                                    campaign.organizations?.company_name || 'Individual Managed',
                                                    campaign.organizations?.org_code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "ml-1 text-[10px] text-blue-400 font-mono",
                                                        children: [
                                                            "#",
                                                            campaign.organizations.org_code
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/CampaignCard.tsx",
                                                        lineNumber: 108,
                                                        columnNumber: 70
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 106,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 104,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 100,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CampaignCard.tsx",
                        lineNumber: 76,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-2 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mb-1 text-blue-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex  fi-rr-clock text-base"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CampaignCard.tsx",
                                            lineNumber: 118,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 117,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-bold text-gray-700",
                                        children: campaign.pending_calls ?? 0
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 120,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-500 uppercase tracking-wide",
                                        children: "Fresh"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 121,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 116,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mb-1 text-purple-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex  fi-rr-calendar-clock text-base"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CampaignCard.tsx",
                                            lineNumber: 125,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 124,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-bold text-gray-700",
                                        children: campaign.upcoming_followups ?? 0
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 127,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-500 uppercase tracking-wide",
                                        children: "Upcoming"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 128,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 123,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mb-1 text-red-600",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex  fi-rr-time-watch-calendar text-base"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CampaignCard.tsx",
                                            lineNumber: 132,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 131,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-lg font-bold text-gray-700",
                                        children: campaign.overdue_followups ?? 0
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 134,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-500 uppercase tracking-wide",
                                        children: "Overdue"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 135,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 130,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CampaignCard.tsx",
                        lineNumber: 115,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 gap-2 mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-2 h-[35px] rounded-xl bg-gray-50/80 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                title: "Talktime",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-microphone-alt text-blue-500 text-[10px]"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 142,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-gray-700",
                                        children: campaign.talktime ?? '0h 0m'
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 143,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 141,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-center gap-2 h-[35px] rounded-xl bg-gray-50/80 group-hover:bg-purple-50/50 transition-colors border border-gray-100",
                                title: "Total Dials",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-phone-call text-purple-500 text-[10px]"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 146,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-gray-700",
                                        children: campaign.total_dials ?? 0
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 147,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 145,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CampaignCard.tsx",
                        lineNumber: 140,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between pt-4 border-t border-gray-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-xs text-gray-400 group-hover:text-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-users-alt text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 154,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-gray-600 group-hover:text-purple-600 transition-colors",
                                                children: [
                                                    Array.isArray(campaign.users) ? campaign.users.length : 0,
                                                    " Members"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 155,
                                                columnNumber: 29
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 153,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    (campaign.created_by || campaign.employee_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-xs mt-1 text-gray-400 group-hover:text-purple-500 transition-colors flex items-center gap-1.5 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-user text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 161,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "font-medium text-gray-600 group-hover:text-purple-600 transition-colors",
                                                children: [
                                                    campaign.created_by || 'Unknown',
                                                    " ",
                                                    campaign.employee_id ? `(#${campaign.employee_id})` : ''
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/CampaignCard.tsx",
                                                lineNumber: 162,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 160,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 152,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        className: "w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all focus:outline-none",
                                        title: "Call",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex  fi-rr-phone text-base"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CampaignCard.tsx",
                                            lineNumber: 174,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 170,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isEditVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        className: "w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all focus:outline-none",
                                        title: "Edit",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onEdit?.(campaign);
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex  fi-rr-edit text-base"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CampaignCard.tsx",
                                            lineNumber: 186,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 178,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isDeleteVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        className: "w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all focus:outline-none",
                                        title: "Delete",
                                        onClick: (e)=>{
                                            e.stopPropagation();
                                            onDelete?.(campaign.id);
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex  fi-rr-trash text-base"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CampaignCard.tsx",
                                            lineNumber: 198,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/CampaignCard.tsx",
                                        lineNumber: 190,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CampaignCard.tsx",
                                lineNumber: 169,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CampaignCard.tsx",
                        lineNumber: 151,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex justify-end",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            className: "text-xs font-semibold text-gray-400 group-hover:text-purple-600 flex items-center gap-1 transition-colors cursor-pointer",
                            children: [
                                "View Details ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi flex  fi-rr-arrow-right text-xs group-hover:translate-x-1 transition-transform"
                                }, void 0, false, {
                                    fileName: "[project]/components/CampaignCard.tsx",
                                    lineNumber: 206,
                                    columnNumber: 38
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CampaignCard.tsx",
                            lineNumber: 205,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/CampaignCard.tsx",
                        lineNumber: 204,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/CampaignCard.tsx",
                lineNumber: 75,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/CampaignCard.tsx",
        lineNumber: 68,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = CampaignCard;
}),
"[project]/components/AddCampaignModal.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>AddCampaignModal
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function AddCampaignModal({ isOpen, onClose, onSuccess, users, loadingUsers, campaign }) {
    const { user: currentUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [campaignName, setCampaignName] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [campaignDescription, setCampaignDescription] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [selectedUsers, setSelectedUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [campaignId, setCampaignId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [campaignStatus, setCampaignStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("active");
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("info"); // info, org, team
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedOrgId, setSelectedOrgId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [loadingOrgs, setLoadingOrgs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Fetch organizations
    const fetchOrganizations = async ()=>{
        try {
            setLoadingOrgs(true);
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('organizations').select('id, company_name, org_code').eq('is_active', true);
            if (error) throw error;
            setOrganizations(data || []);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        } finally{
            setLoadingOrgs(false);
        }
    };
    // Initialize form when modal opens or campaign changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isOpen) {
            fetchOrganizations();
            if (campaign) {
                // Editing mode
                setCampaignId(campaign.id);
                setCampaignName(campaign.name || "");
                setCampaignDescription(campaign.description || "");
                setCampaignStatus(campaign.status || "active");
                setSelectedOrgId(campaign.organization_id || "");
                // Pre-select users if they exist in the 'users' column
                if (Array.isArray(campaign.users)) {
                    setSelectedUsers(campaign.users.map((u)=>u.user_id || u.id).filter(Boolean));
                } else {
                    setSelectedUsers([]);
                }
            } else {
                // Creation mode - Sequential ID generation
                const getNextId = async ()=>{
                    try {
                        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('id').order('id', {
                            ascending: false
                        }).limit(1);
                        if (error) throw error;
                        if (data && data.length > 0) {
                            const lastId = data[0].id;
                            const match = lastId.match(/CAM-(\d+)/i);
                            if (match) {
                                const nextNum = parseInt(match[1]) + 1;
                                setCampaignId(`CAM-${String(nextNum).padStart(4, '0')}`);
                            } else {
                                setCampaignId("CAM-0001");
                            }
                        } else {
                            setCampaignId("CAM-0001");
                        }
                    } catch (err) {
                        console.error("Error fetching last campaign ID:", err);
                        // Fallback to random if fetch fails, to not block the user
                        setCampaignId(`CAM-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`);
                    }
                };
                getNextId();
                setCampaignName("");
                setCampaignDescription("");
                setCampaignStatus("active");
                setSelectedUsers([]);
                // Auto-set organization for client users
                if (currentUser?.isClient && currentUser.organization_id) {
                    setSelectedOrgId(currentUser.organization_id || "");
                } else {
                    setSelectedOrgId("");
                }
            }
            setSearchTerm("");
            setActiveTab("info");
        }
    }, [
        isOpen,
        campaign
    ]);
    // Clear selected users that don't belong to the new organization
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (selectedOrgId && users.length > 0) {
            setSelectedUsers((prev)=>{
                // Find IDs of users that are selected but don't belong to the selected org
                const invalidIds = prev.filter((uid)=>{
                    const user = users.find((u)=>u.user_id === uid || u.id === uid);
                    // If user not found (maybe loading) or org doesn't match, it's invalid
                    // Note: If user data doesn't have organization_id yet (legacy), we might skip this check 
                    // or assume it's valid? adhering strictly: if org_id mismatches, remove.
                    return user && user.organization_id && user.organization_id !== selectedOrgId;
                });
                if (invalidIds.length > 0) {
                    return prev.filter((uid)=>!invalidIds.includes(uid));
                }
                return prev;
            });
        }
    }, [
        selectedOrgId,
        users
    ]);
    const filteredUsers = users.filter((user)=>{
        const matchesSearch = (user.user_name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        // Filter by organization if selected
        const matchesOrg = selectedOrgId && user.organization_id === selectedOrgId;
        return matchesSearch && matchesOrg;
    });
    const handleSaveCampaign = async ()=>{
        if (!campaignName.trim()) {
            alert("Please enter campaign name");
            setActiveTab("info");
            return;
        }
        if (!selectedOrgId) {
            alert("Please select an organization");
            setActiveTab("org");
            return;
        }
        setIsSubmitting(true);
        try {
            // Map selected IDs to detailed objects {id, name, email}
            const selectedUserObjects = selectedUsers.map((uid)=>{
                const found = users.find((u)=>u.user_id === uid || u.id === uid);
                return {
                    id: found?.id,
                    user_id: found?.user_id,
                    name: found?.user_name,
                    email: found?.email,
                    employee_id: found?.employee_id
                };
            }).filter((u)=>u.user_id); // Filter out any that might not have been found
            const campaignData = {
                id: campaignId,
                name: campaignName,
                description: campaignDescription,
                status: campaignStatus,
                users: selectedUserObjects,
                organization_id: selectedOrgId,
                [campaign ? 'updated_at' : 'created_at']: new Date().toISOString()
            };
            // If it's a new campaign, add creator info
            if (!campaign) {
                campaignData.created_by = currentUser?.displayName || currentUser?.email || "Unknown";
                campaignData.employee_id = currentUser?.employeeId || null;
            }
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").upsert([
                campaignData
            ]);
            if (error) {
                alert("Error saving campaign: " + error.message);
            } else {
                onSuccess();
                onClose();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                    event_type: 'WRITE',
                    description: campaign ? `Update Campaign: ${campaignName}` : `Create Campaign: ${campaignName}`,
                    metadata: {
                        campaign_id: campaignId,
                        campaign_name: campaignName,
                        organization_id: selectedOrgId,
                        user_count: selectedUsers.length
                    },
                    payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])(campaignData),
                    user_name: currentUser?.displayName || 'Admin',
                    organization_id: currentUser?.organization_id || undefined
                });
            }
        } catch (e) {
            console.error("Error saving campaign:", e);
            alert("Error saving campaign");
        } finally{
            setIsSubmitting(false);
        }
    };
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[120] backdrop-blur-sm bg-black/30 flex items-center justify-center p-4 text-xs font-sans",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "relative w-full max-w-4xl transform rounded-lg bg-white  flex flex-col border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200 h-[85vh]",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "font-bold text-gray-800",
                                        children: campaign ? 'Modify Campaign' : 'Initiate Campaign'
                                    }, void 0, false, {
                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                        lineNumber: 246,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded text-[10px] font-bold uppercase tracking-widest border border-indigo-100 mt-1 inline-block",
                                        children: campaign ? 'Configuration Update' : 'Strategic Onboarding Sequence'
                                    }, void 0, false, {
                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                        lineNumber: 249,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AddCampaignModal.tsx",
                                lineNumber: 245,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 244,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-400 hover:text-gray-600 p-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-cross-small text-xl leading-none"
                            }, void 0, false, {
                                fileName: "[project]/components/AddCampaignModal.tsx",
                                lineNumber: 258,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 254,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AddCampaignModal.tsx",
                    lineNumber: 243,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex border-b border-gray-100 bg-white shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab("info"),
                            className: `flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'info' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: `fi flex ${activeTab === 'info' ? 'fi-sr-info' : 'fi-rr-info'} text-sm`
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 268,
                                    columnNumber: 25
                                }, this),
                                "Basic Information",
                                activeTab === 'info' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 270,
                                    columnNumber: 50
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 264,
                            columnNumber: 21
                        }, this),
                        !currentUser?.isClient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab("org"),
                            className: `flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'org' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: `fi flex ${activeTab === 'org' ? 'fi-sr-building' : 'fi-rr-building'} text-sm`
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 277,
                                    columnNumber: 29
                                }, this),
                                "Organization",
                                activeTab === 'org' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 279,
                                    columnNumber: 53
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 273,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>setActiveTab("team"),
                            className: `flex-1 py-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === 'team' ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: `fi flex ${activeTab === 'team' ? 'fi-sr-users' : 'fi-rr-users'} text-sm`
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 286,
                                    columnNumber: 25
                                }, this),
                                "Team Personnel",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: `ml-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold ${selectedUsers.length > 0 ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`,
                                    children: selectedUsers.length
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 288,
                                    columnNumber: 26
                                }, this),
                                activeTab === 'team' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 291,
                                    columnNumber: 50
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 282,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AddCampaignModal.tsx",
                    lineNumber: 263,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex-1 overflow-y-auto custom-scrollbar",
                    children: [
                        activeTab === 'info' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "bg-white p-5 rounded-lg border border-gray-100  space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4",
                                                    children: "Protocol Metadata"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 304,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                            children: "Campaign ID"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 307,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: campaignId,
                                                                    readOnly: true,
                                                                    className: "w-full h-9 px-3 bg-gray-50 border border-gray-200 rounded text-[11px] font-mono font-bold text-gray-500 outline-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 309,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-lock absolute right-3 top-1/2 -translate-y-1/2 text-gray-300"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 315,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 308,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 306,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                            children: "Functional Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            onClick: ()=>setCampaignStatus((prev)=>prev === 'active' ? 'inactive' : 'active'),
                                                            className: `w-full h-9 rounded border cursor-pointer transition-all flex items-center justify-between px-3 ${campaignStatus === 'active' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: `w-2 h-2 rounded-full ${campaignStatus === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                                            lineNumber: 326,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: `text-[10px] font-bold uppercase tracking-widest ${campaignStatus === 'active' ? 'text-emerald-700' : 'text-rose-700'}`,
                                                                            children: campaignStatus
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                                            lineNumber: 327,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 325,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: `w-8 h-4 rounded-full relative transition-all ${campaignStatus === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: `absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${campaignStatus === 'active' ? 'right-0.5' : 'left-0.5'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                                                        lineNumber: 332,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 331,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 321,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                            lineNumber: 303,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                        lineNumber: 302,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "space-y-6",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "bg-white p-5 rounded-lg border border-gray-100  space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4",
                                                    children: "Identity Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 341,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                            children: "Campaign Name *"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 344,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            value: campaignName,
                                                            onChange: (e)=>setCampaignName(e.target.value),
                                                            placeholder: "e.g. Operation Q4 Growth",
                                                            className: "w-full h-9 px-3 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 345,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 343,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                            children: "Strategic Description"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 355,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                                                            value: campaignDescription,
                                                            onChange: (e)=>setCampaignDescription(e.target.value),
                                                            placeholder: "Mission parameters and objectives...",
                                                            rows: 4,
                                                            className: "w-full px-3 py-2 bg-white border border-gray-200 rounded text-[11px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all font-sans resize-none"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 356,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                            lineNumber: 340,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                        lineNumber: 339,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/AddCampaignModal.tsx",
                                lineNumber: 301,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 300,
                            columnNumber: 25
                        }, this),
                        activeTab === 'org' && !currentUser?.isClient && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6 space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                        children: "Select Organization Binding"
                                    }, void 0, false, {
                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                        lineNumber: 374,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 373,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                                    children: loadingOrgs ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "col-span-full py-20 flex flex-col items-center justify-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                lineNumber: 380,
                                                columnNumber: 41
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest",
                                                children: "Scanning Registry..."
                                            }, void 0, false, {
                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                lineNumber: 381,
                                                columnNumber: 41
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                        lineNumber: 379,
                                        columnNumber: 37
                                    }, this) : organizations.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "col-span-full py-10 bg-gray-50/50 rounded-lg border border-dashed border-gray-200 text-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] text-gray-400 font-bold uppercase tracking-widest",
                                            children: "No organizations found"
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                            lineNumber: 385,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                        lineNumber: 384,
                                        columnNumber: 37
                                    }, this) : organizations.filter((org)=>!currentUser?.isClient || org.id === currentUser.organization_id).map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            onClick: ()=>{
                                                if (!currentUser?.isClient) {
                                                    setSelectedOrgId(org.id);
                                                }
                                            },
                                            className: `relative p-4 rounded-lg border transition-all ${currentUser?.isClient ? 'cursor-default' : 'cursor-pointer'} ${selectedOrgId === org.id ? 'bg-indigo-50 border-indigo-500 ' : 'bg-white border-gray-100 hover:border-indigo-200'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between mb-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "w-8 h-8 rounded bg-white border border-gray-100 flex items-center justify-center text-gray-400",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-building text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                                lineNumber: 404,
                                                                columnNumber: 53
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 403,
                                                            columnNumber: 49
                                                        }, this),
                                                        selectedOrgId === org.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi fi-sr-check-circle text-indigo-600 text-sm"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 402,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                    className: "text-[11px] font-bold text-gray-800 truncate uppercase tracking-tight",
                                                    children: org.company_name
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 410,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[9px] font-mono text-gray-400 mt-0.5",
                                                    children: [
                                                        "#",
                                                        org.org_code || 'N/A'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 411,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, org.id, true, {
                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                            lineNumber: 391,
                                            columnNumber: 41
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 377,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 372,
                            columnNumber: 25
                        }, this),
                        activeTab === 'team' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "h-full flex flex-col md:flex-row animate-in fade-in slide-in-from-bottom-2 duration-300",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-full md:w-[320px] p-5 bg-white border-r border-gray-100 flex flex-col shrink-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 pl-0.5",
                                                    children: "Personnel Pool Search"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 425,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                            type: "text",
                                                            placeholder: "ID or Name...",
                                                            value: searchTerm,
                                                            onChange: (e)=>setSearchTerm(e.target.value),
                                                            className: "w-full h-8 pl-8 pr-3 bg-white border border-gray-200 rounded text-[10px] font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 427,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi fi-rr-search absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 434,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 426,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                            lineNumber: 424,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar",
                                            children: loadingUsers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "py-10 text-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                                        lineNumber: 441,
                                                        columnNumber: 45
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[9px] font-bold text-gray-400 uppercase tracking-widest",
                                                        children: "Loading..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/AddCampaignModal.tsx",
                                                        lineNumber: 442,
                                                        columnNumber: 45
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                lineNumber: 440,
                                                columnNumber: 41
                                            }, this) : filteredUsers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "py-10 text-center bg-gray-50/50 rounded-lg",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[9px] font-bold text-gray-400 uppercase tracking-widest",
                                                    children: "No agents found"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 446,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                lineNumber: 445,
                                                columnNumber: 41
                                            }, this) : filteredUsers.map((user)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    onClick: ()=>{
                                                        if (selectedUsers.includes(user.user_id)) {
                                                            setSelectedUsers(selectedUsers.filter((id)=>id !== user.user_id));
                                                        } else {
                                                            setSelectedUsers([
                                                                ...selectedUsers,
                                                                user.user_id
                                                            ]);
                                                        }
                                                    },
                                                    className: `flex items-center gap-3 p-2 rounded border transition-all cursor-pointer ${selectedUsers.includes(user.user_id) ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-50 hover:border-gray-200 hover:bg-gray-50'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: `w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${selectedUsers.includes(user.user_id) ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-gray-300'}`,
                                                            children: selectedUsers.includes(user.user_id) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-check text-[8px] text-white"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                                lineNumber: 464,
                                                                columnNumber: 94
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "w-7 h-7 rounded overflow-hidden shrink-0 border border-gray-100",
                                                            children: user.profile_pic_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                src: user.profile_pic_url,
                                                                className: "w-full h-full object-cover",
                                                                alt: ""
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                                lineNumber: 468,
                                                                columnNumber: 57
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "w-full h-full bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-400",
                                                                children: user.user_name?.charAt(0) || 'U'
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                                lineNumber: 470,
                                                                columnNumber: 57
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 466,
                                                            columnNumber: 49
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "text-[10px] font-bold text-gray-800 truncate uppercase mt-0.5",
                                                                    children: user.user_name || 'N/A'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 476,
                                                                    columnNumber: 53
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-[8px] font-mono text-gray-400",
                                                                    children: [
                                                                        "ID: ",
                                                                        user.employee_id || '--'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 477,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 475,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, user.id, true, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 450,
                                                    columnNumber: 45
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                            lineNumber: 438,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 423,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex-1 p-5 bg-gray-50/30 overflow-y-auto custom-scrollbar",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-0.5",
                                                children: "Assigned Sequence Personnel"
                                            }, void 0, false, {
                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                lineNumber: 488,
                                                columnNumber: 37
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                            lineNumber: 487,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
                                            children: selectedUsers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "col-span-full h-40 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg bg-white/50",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest",
                                                    children: "No members assigned"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 494,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                lineNumber: 493,
                                                columnNumber: 41
                                            }, this) : selectedUsers.map((uid)=>{
                                                const u = users.find((usr)=>usr.user_id === uid || usr.id === uid);
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3 bg-white border border-gray-100 p-2 rounded-lg  group",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "w-8 h-8 rounded border border-gray-100 shrink-0 bg-indigo-50 flex items-center justify-center text-indigo-400 font-bold text-[10px]",
                                                            children: u?.user_name?.charAt(0) || 'U'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 501,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "text-[10px] font-bold text-gray-800 truncate uppercase",
                                                                    children: u?.user_name || 'Anonymous'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 505,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-[8px] font-mono text-gray-400",
                                                                    children: [
                                                                        "EMP: ",
                                                                        u?.employee_id || '---'
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                                    lineNumber: 506,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 504,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setSelectedUsers((prev)=>prev.filter((id)=>id !== uid)),
                                                            className: "p-1 px-1.5 text-gray-300 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-cross-small text-lg leading-none"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/AddCampaignModal.tsx",
                                                                lineNumber: 512,
                                                                columnNumber: 57
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                                            lineNumber: 508,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, uid, true, {
                                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                                    lineNumber: 500,
                                                    columnNumber: 49
                                                }, this);
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/AddCampaignModal.tsx",
                                            lineNumber: 491,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AddCampaignModal.tsx",
                                    lineNumber: 486,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 421,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AddCampaignModal.tsx",
                    lineNumber: 296,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white shrink-0 rounded-b-lg",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-4 py-1.5 border border-gray-200 text-gray-600 rounded hover:bg-gray-50 font-semibold transition-all",
                            children: "Abort Sequence"
                        }, void 0, false, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 526,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: handleSaveCampaign,
                            disabled: isSubmitting,
                            className: "px-6 py-1.5 bg-[#4b33e8] text-white rounded font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all   disabled:opacity-50 flex items-center gap-2",
                            children: isSubmitting ? "Processing..." : campaign ? 'Commit Changes' : 'Execute Creation'
                        }, void 0, false, {
                            fileName: "[project]/components/AddCampaignModal.tsx",
                            lineNumber: 532,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AddCampaignModal.tsx",
                    lineNumber: 525,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/AddCampaignModal.tsx",
            lineNumber: 240,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/AddCampaignModal.tsx",
        lineNumber: 238,
        columnNumber: 9
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/portal/campaign.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Campaign
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CampaignCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CampaignCard.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCampaignModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AddCampaignModal.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCampaignModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCampaignModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
// Helper functions for performance calculation
const parseTalktime = (talktime)=>{
    if (!talktime) return 0;
    let minutes = 0;
    const hoursMatch = talktime.match(/(\d+)h/i);
    const minsMatch = talktime.match(/(\d+)m/i);
    if (hoursMatch) minutes += parseInt(hoursMatch[1]) * 60;
    if (minsMatch) minutes += parseInt(minsMatch[1]);
    return minutes;
};
const calculatePerformance = (c)=>{
    const talktimeMins = parseTalktime(c.talktime || null);
    const dials = c.total_dials || 0;
    const userCount = Array.isArray(c.users) ? c.users.length : 0;
    if (userCount === 0) return 0;
    const talktimeTarget = 90 * userCount;
    const dialsTarget = 200 * userCount;
    const talktimeScore = Math.min(talktimeMins / talktimeTarget, 1);
    const dialsScore = Math.min(dials / dialsTarget, 1);
    return Math.round((talktimeScore + dialsScore) * 50);
};
function Campaign() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [activeNav] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("campaign");
    const [campaigns, setCampaigns] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loadingCampaigns, setLoadingCampaigns] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [showAddCampaignModal, setShowAddCampaignModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editingCampaign, setEditingCampaign] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    // Campaign creation state moved to AddCampaignModal component
    const [users, setUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loadingUsers, setLoadingUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const permissionFlags = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!mounted || !user) return {
            isCreateCampaginButtonVisible: false,
            isCampaginEditButtonVisible: false,
            isCampaginDeleteButtonVisible: false
        };
        // Level 1: Client Agent
        if (user.isClient && (user.designation === 'agent' || !user.designation)) {
            return {
                isCreateCampaginButtonVisible: false,
                isCampaginEditButtonVisible: false,
                isCampaginDeleteButtonVisible: false
            };
        }
        // Level 2: Team Leader
        if (user.isClient && user.designation === 'team_leader') {
            return {
                isCreateCampaginButtonVisible: false,
                isCampaginEditButtonVisible: false,
                isCampaginDeleteButtonVisible: false
            };
        }
        // Level 3: Client Admin (CEO/Developer/Manager)
        if (user.isClient && [
            'ceo',
            'developer',
            'manager'
        ].includes(user.designation?.toLowerCase() || '')) {
            return {
                isCreateCampaginButtonVisible: true,
                isCampaginEditButtonVisible: true,
                isCampaginDeleteButtonVisible: true
            };
        }
        // Level 4: Internal Staff (Global Admin)
        // !isClient implies internal staff
        return {
            isCreateCampaginButtonVisible: true,
            isCampaginEditButtonVisible: true,
            isCampaginDeleteButtonVisible: true
        };
    }, [
        user,
        mounted
    ]);
    const fetchCampaigns = async ()=>{
        if (!user) return; // Wait for user
        try {
            setLoadingCampaigns(true);
            // 1. Base Query
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("*, organizations(id, company_name, org_code)").order("created_at", {
                ascending: false
            });
            const normalizedDesignation = (user.designation || "").toLowerCase().trim();
            console.log("🔍 [Campaign] Fetching for user:", {
                uid: user.uid,
                email: user.email,
                isClient: user.isClient,
                designation: user.designation,
                normalizedDesignation,
                organization_id: user.organization_id
            });
            // Level 4: Internal Staff (Global Admin) - No filters
            if (!user.isClient) {
            // No filters applied
            } else {
                // 1. Mandatory Organization Filter
                if (user.organization_id) {
                    console.log("🏢 [Campaign] Filtering by Organization:", user.organization_id);
                    query = query.eq('organization_id', user.organization_id);
                } else {
                    // Fail-secure: No organization, no campaigns
                    console.warn("⚠️ [Campaign] CRITICAL: No organization_id found for user. Access blocked.");
                    query = query.eq('id', '00000000-0000-0000-0000-000000000000');
                }
                // 2. Assignment Filters based on Level
                if (normalizedDesignation === 'team_leader' || normalizedDesignation === 'teamleader' || normalizedDesignation.includes('tl')) {
                    // Level 2: Team Leader (Self + Team)
                    let teamMemberIds = [
                        user.uid
                    ];
                    const { data: teamData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('teams').select('members').eq('leader_id', user.uid).eq('is_active', true);
                    if (teamData) {
                        teamData.forEach((team)=>{
                            if (Array.isArray(team.members)) {
                                team.members.forEach((member)=>{
                                    if (typeof member === 'string') teamMemberIds.push(member);
                                });
                            }
                        });
                    }
                    teamMemberIds = [
                        ...new Set(teamMemberIds)
                    ];
                    if (teamMemberIds.length > 0) {
                        const orFilter = teamMemberIds.map((id)=>`users.cs.[{"user_id":"${id}"}]`).join(',');
                        console.log("👥 [Campaign] Level 2: TL Filter Applied. Searching for members:", teamMemberIds);
                        console.log("🔗 [Campaign] Generated OR Filter:", orFilter);
                        query = query.or(orFilter);
                    } else {
                        console.warn("👥 [Campaign] TL has no active team members. Searching only for self.");
                        query = query.filter('users', 'cs', `[{"user_id":"${user.uid}"}]`);
                    }
                } else if ([
                    'ceo',
                    'developer',
                    'manager'
                ].includes(normalizedDesignation)) {
                // Level 3: Client Admin (Sees all in organization - no extra filter)
                } else {
                    // Level 1: Client Agent (Strictest)
                    console.log("👤 [Campaign] Level 1: Agent Filter. Status: active, UserID:", user.uid);
                    query = query.eq('status', 'active');
                    if (user.uid) {
                        const agentFilter = `[{"user_id":"${user.uid}"}]`;
                        console.log("🔍 [Campaign] Agent JSON Filter Value:", agentFilter);
                        query = query.filter('users', 'cs', agentFilter);
                    }
                }
            }
            const { data: campaignData, error: campaignError } = await query;
            if (campaignError) {
                console.error("❌ [Campaign] Supabase Query Error:", campaignError);
                throw campaignError;
            }
            let finalBaseCampaigns = campaignData || [];
            console.log(`✅ [Campaign] Query returned ${finalBaseCampaigns.length} campaigns.`);
            if (finalBaseCampaigns.length === 0 && user.organization_id) {
                console.info("🔍 [Campaign] Starting Diagnostics & Fallback...");
                // Diagnostic Fetch: See ALL campaigns in org
                const { data: allOrgCamps } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('*, organizations(id, company_name, org_code)').eq('organization_id', user.organization_id);
                if (allOrgCamps && allOrgCamps.length > 0) {
                    // 🕵️ Manual Match as Fallback
                    const manualMatches = allOrgCamps.filter((camp)=>{
                        const userList = Array.isArray(camp.users) ? camp.users : [];
                        return userList.some((u)=>(u.user_id || u.id) === user.uid);
                    });
                    if (manualMatches.length > 0) {
                        console.log(`💡 [Campaign] Fallback: Found ${manualMatches.length} campaigns via Local Matching.`);
                        finalBaseCampaigns = manualMatches;
                    } else {
                        console.warn("🕵️ Diagnostic: Found 0 local matches in", allOrgCamps.length, "org campaigns.");
                    }
                }
            }
            const baseCampaigns = finalBaseCampaigns;
            // 2. Fetch all campaign stats via high-performance RPC
            const { data: statsData, error: statsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].rpc('get_campaign_stats');
            if (statsError) {
                console.error("Error fetching campaign stats:", statsError);
                setCampaigns(baseCampaigns);
                return;
            }
            // 3. Map stats back to campaigns
            const enrichedCampaigns = baseCampaigns.map((camp)=>{
                const stats = statsData?.find((s)=>s.campaign_id === camp.id);
                const totalSeconds = stats?.total_duration || 0;
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor(totalSeconds % 3600 / 60);
                const talktimeFormatted = `${hours}h ${minutes}m`;
                return {
                    ...camp,
                    pending_calls: stats?.fresh_count || 0,
                    upcoming_followups: stats?.upcoming_count || 0,
                    overdue_followups: stats?.overdue_count || 0,
                    total_dials: stats?.total_dials || 0,
                    talktime: talktimeFormatted
                };
            });
            setCampaigns(enrichedCampaigns);
        } catch (e) {
            console.error("Error fetching campaigns:", e);
            setCampaigns([]);
        } finally{
            setLoadingCampaigns(false);
        }
    };
    const fetchUsers = async ()=>{
        try {
            setLoadingUsers(true);
            console.log("👥 [Campaign] Fetching all user profiles...");
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, user_id, email, user_name, profile_pic_url, employee_id, organization_id").order("created_at", {
                ascending: false
            });
            if (error) {
                console.error("❌ [Campaign] Error fetching users:", error);
                setUsers([]);
                return;
            }
            if (data) {
                console.log(`✅ [Campaign] Fetched ${data.length} user profiles.`);
                const mapped = data.map((u)=>({
                        ...u,
                        user_name: u.user_name || u.name || null,
                        profile_pic_url: u.profile_pic_url || u.profile_image || null
                    }));
                setUsers(mapped);
            }
        } catch (e) {
            console.error("❌ [Campaign] Exception in fetchUsers:", e);
            setUsers([]);
        } finally{
            setLoadingUsers(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && user) {
            fetchCampaigns();
        }
        const handleFocus = ()=>{
            if (mounted && user) fetchCampaigns();
        };
        window.addEventListener("focus", handleFocus);
        return ()=>window.removeEventListener("focus", handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        router,
        user,
        mounted
    ]);
    const handleCampaignSaved = ()=>{
        alert(editingCampaign ? "Campaign updated successfully!" : "Campaign created successfully!");
        setEditingCampaign(null);
        fetchCampaigns();
    };
    const handleEditCampaign = (campaign)=>{
        setEditingCampaign(campaign);
        setShowAddCampaignModal(true);
        fetchUsers();
    };
    const handleDeleteCampaign = async (id)=>{
        if (confirm("Are you sure you want to delete this campaign? This action cannot be undone.")) {
            try {
                const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").delete().eq("id", id);
                if (error) {
                    alert("Error deleting campaign: " + error.message);
                } else {
                    alert("Campaign deleted successfully!");
                    fetchCampaigns();
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                        event_type: 'WRITE',
                        description: `Delete Campaign: ${id}`,
                        metadata: {
                            campaign_id: id
                        },
                        user_name: user?.displayName || 'Admin',
                        organization_id: user?.organization_id || undefined
                    });
                }
            } catch (e) {
                console.error("Error deleting campaign:", e);
                alert("Error deleting campaign");
            }
        }
    };
    const filtered = campaigns.filter((c)=>searchQuery === "" || c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.status && c.status.toLowerCase().includes(searchQuery.toLowerCase()));
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                        children: "Campaigns"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign.tsx",
                                        lineNumber: 354,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-sm sm:text-base",
                                        style: {
                                            color: "#787E9D",
                                            fontFamily: "'Roboto', sans-serif"
                                        },
                                        children: "Create, schedule and monitor marketing campaigns"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign.tsx",
                                        lineNumber: 355,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign.tsx",
                                lineNumber: 353,
                                columnNumber: 10
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign.tsx",
                            lineNumber: 352,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                backgroundColor: "radial-gradient(circle at top right, rgba(75, 51, 232, 0.12), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 363,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-8 -top-8 w-32 h-32 rounded-full bg-purple-200/20 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 364,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-briefcase text-5xl",
                                                style: {
                                                    color: "#4b33e8",
                                                    opacity: 0.15
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign.tsx",
                                                lineNumber: 366,
                                                columnNumber: 12
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 365,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm font-medium",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Total Campaigns"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 370,
                                                        columnNumber: 13
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 369,
                                                    columnNumber: 12
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
                                                            children: campaigns.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                            lineNumber: 373,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm mt-1",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "All campaigns"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                            lineNumber: 374,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 372,
                                                    columnNumber: 12
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 368,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign.tsx",
                                    lineNumber: 362,
                                    columnNumber: 10
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top right, rgba(16, 185, 129, 0.12), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 380,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-8 -top-8 w-32 h-32 rounded-full bg-green-200/20 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 381,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-play text-5xl",
                                                style: {
                                                    color: "#10b981",
                                                    opacity: 0.15
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign.tsx",
                                                lineNumber: 383,
                                                columnNumber: 12
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 382,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm font-medium",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Active"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 387,
                                                        columnNumber: 13
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 386,
                                                    columnNumber: 12
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
                                                            children: campaigns.filter((c)=>c.status === 'active').length
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                            lineNumber: 390,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm mt-1",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Running campaigns"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                            lineNumber: 391,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 389,
                                                    columnNumber: 12
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 385,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign.tsx",
                                    lineNumber: 379,
                                    columnNumber: 10
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl p-4 sm:p-5 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38",
                                    style: {
                                        backgroundColor: "white"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "radial-gradient(circle at top right, rgba(249, 115, 22, 0.12), transparent 60%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 397,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-8 -top-8 w-32 h-32 rounded-full bg-orange-200/20 blur-2xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 398,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -right-2 -bottom-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-pause text-5xl",
                                                style: {
                                                    color: "#f97316",
                                                    opacity: 0.15
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/campaign.tsx",
                                                lineNumber: 400,
                                                columnNumber: 12
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 399,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-auto",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-xs sm:text-sm font-medium",
                                                        style: {
                                                            color: "#787E9D",
                                                            fontFamily: "'Roboto', sans-serif"
                                                        },
                                                        children: "Inactive"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 404,
                                                        columnNumber: 13
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 403,
                                                    columnNumber: 12
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
                                                            children: campaigns.filter((c)=>c.status === 'inactive').length
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                            lineNumber: 407,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs sm:text-sm mt-1",
                                                            style: {
                                                                color: "#787E9D",
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            children: "Inactive campaigns"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                            lineNumber: 408,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 406,
                                                    columnNumber: 12
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 402,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign.tsx",
                                    lineNumber: 396,
                                    columnNumber: 10
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative overflow-hidden rounded-2xl pt-4 sm:pt-5 px-4 sm:px-5 pb-0 transition-all duration-200 flex flex-col hover:shadow-lg hover:scale-105 h-30 sm:h-38",
                                    style: {
                                        backgroundColor: "#4b33e8",
                                        color: 'white'
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0",
                                            style: {
                                                background: "linear-gradient(135deg, #4b33e8 0%, #6366f1 100%)"
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 414,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute -bottom-12 -right-12 w-40 h-40 rounded-full bg-white/10 blur-3xl"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 415,
                                            columnNumber: 11
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative flex flex-col h-full z-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start justify-between mb-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/80",
                                                                    style: {
                                                                        fontFamily: "'Poppins', sans-serif"
                                                                    },
                                                                    children: "Live Performance"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                                    lineNumber: 420,
                                                                    columnNumber: 14
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-1.5 mt-1 bg-white/10 px-2 py-0.5 rounded-full w-fit",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "w-1 h-1 rounded-full bg-green-400 animate-pulse"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                                            lineNumber: 422,
                                                                            columnNumber: 15
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[8px] font-black uppercase tracking-tighter",
                                                                            children: "Real-time"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                                            lineNumber: 423,
                                                                            columnNumber: 15
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                                    lineNumber: 421,
                                                                    columnNumber: 14
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                            lineNumber: 419,
                                                            columnNumber: 13
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "text-right flex flex-col items-end",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] text-white/60 leading-none uppercase font-bold tracking-wider mb-0.5",
                                                                    children: "Avg Yield"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                                    lineNumber: 427,
                                                                    columnNumber: 14
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-2xl font-black leading-none",
                                                                    children: [
                                                                        campaigns.filter((c)=>c.status === 'active').length > 0 ? Math.round(campaigns.filter((c)=>c.status === 'active').reduce((acc, c)=>acc + calculatePerformance(c), 0) / campaigns.filter((c)=>c.status === 'active').length) : 0,
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                                    lineNumber: 428,
                                                                    columnNumber: 14
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                            lineNumber: 426,
                                                            columnNumber: 13
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 418,
                                                    columnNumber: 12
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex-1 flex items-end gap-2 min-h-0",
                                                    children: campaigns.filter((c)=>c.status === 'active').length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col items-center justify-center w-full h-full opacity-40",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-chart-line-up text-xl mb-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign.tsx",
                                                                lineNumber: 439,
                                                                columnNumber: 15
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[8px] uppercase font-bold",
                                                                children: "No Active Data"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/campaign.tsx",
                                                                lineNumber: 440,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 438,
                                                        columnNumber: 14
                                                    }, this) : campaigns.filter((c)=>c.status === 'active').map((c, i)=>{
                                                        const perf = calculatePerformance(c);
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 flex flex-col items-center group/bar relative h-full justify-end",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[8px] font-black text-white/90 mb-1 opacity-60 group-hover/bar:opacity-100 transition-opacity",
                                                                    children: [
                                                                        perf,
                                                                        "%"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                                    lineNumber: 448,
                                                                    columnNumber: 17
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "w-full bg-white/30 rounded-t-[4px] transition-all duration-500 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.6)] cursor-help relative",
                                                                    style: {
                                                                        height: `${Math.max(perf, 5)}%`
                                                                    },
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#4b33e8] px-2 py-1 rounded-md text-[8px] font-black opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20 pointer-events-none border border-purple-100 uppercase tracking-tighter",
                                                                        children: [
                                                                            c.name || 'CAM',
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "absolute top-full left-1/2 -translate-x-1/2 border-x-4 border-x-transparent border-t-4 border-t-white"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/campaign.tsx",
                                                                                lineNumber: 459,
                                                                                columnNumber: 19
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                                        lineNumber: 457,
                                                                        columnNumber: 18
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                                    lineNumber: 452,
                                                                    columnNumber: 17
                                                                }, this)
                                                            ]
                                                        }, c.id, true, {
                                                            fileName: "[project]/pages/portal/campaign.tsx",
                                                            lineNumber: 446,
                                                            columnNumber: 16
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 436,
                                                    columnNumber: 12
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 417,
                                            columnNumber: 11
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/campaign.tsx",
                                    lineNumber: 413,
                                    columnNumber: 10
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/campaign.tsx",
                            lineNumber: 361,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mt-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col lg:flex-row lg:items-center gap-3 w-full lg:w-auto",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-full lg:w-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative w-full min-w-[180px] sm:min-w-[220px]",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                    placeholder: "Search campaigns...",
                                                    className: "pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm focus:outline-none w-full sm:w-64 placeholder:text-gray-400",
                                                    type: "text",
                                                    value: searchQuery,
                                                    onChange: (e)=>setSearchQuery(e.target.value),
                                                    style: {
                                                        fontFamily: "'Roboto', sans-serif"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 477,
                                                    columnNumber: 13
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs sm:text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/campaign.tsx",
                                                    lineNumber: 485,
                                                    columnNumber: 13
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/campaign.tsx",
                                            lineNumber: 476,
                                            columnNumber: 12
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/campaign.tsx",
                                        lineNumber: 475,
                                        columnNumber: 11
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap lg:flex-nowrap items-center gap-2 sm:gap-3 justify-start lg:justify-end w-full lg:w-auto",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                className: "inline-flex items-center justify-center gap-2 px-3 h-[42px] w-[42px] sm:w-auto rounded-xl border border-gray-300 bg-white text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors",
                                                style: {
                                                    fontFamily: "'Poppins', sans-serif"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-filter text-xs sm:text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 494,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "hidden xs:inline",
                                                        children: "Filters"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 495,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign.tsx",
                                                lineNumber: 489,
                                                columnNumber: 12
                                            }, this),
                                            permissionFlags.isCreateCampaginButtonVisible && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setShowAddCampaignModal(true);
                                                    fetchUsers();
                                                },
                                                className: "px-6 h-[42px] text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 hover:opacity-90",
                                                style: {
                                                    fontFamily: "'Poppins', sans-serif",
                                                    backgroundColor: "#4b33e8"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-plus text-base"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 506,
                                                        columnNumber: 14
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "hidden sm:inline",
                                                        children: "Add Campaign"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/campaign.tsx",
                                                        lineNumber: 507,
                                                        columnNumber: 14
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/campaign.tsx",
                                                lineNumber: 498,
                                                columnNumber: 13
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/campaign.tsx",
                                        lineNumber: 488,
                                        columnNumber: 11
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/campaign.tsx",
                                lineNumber: 474,
                                columnNumber: 10
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign.tsx",
                            lineNumber: 473,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                            children: loadingCampaigns ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "col-span-full text-center py-8",
                                children: "Loading campaigns..."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign.tsx",
                                lineNumber: 516,
                                columnNumber: 11
                            }, this) : filtered.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "col-span-full text-center py-8 text-gray-500",
                                children: "No campaigns found."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/campaign.tsx",
                                lineNumber: 518,
                                columnNumber: 11
                            }, this) : filtered.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CampaignCard$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    campaign: c,
                                    onEdit: handleEditCampaign,
                                    onDelete: handleDeleteCampaign,
                                    isEditVisible: permissionFlags.isCampaginEditButtonVisible,
                                    isDeleteVisible: permissionFlags.isCampaginDeleteButtonVisible
                                }, c.id, false, {
                                    fileName: "[project]/pages/portal/campaign.tsx",
                                    lineNumber: 521,
                                    columnNumber: 12
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/campaign.tsx",
                            lineNumber: 514,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/campaign.tsx",
                    lineNumber: 351,
                    columnNumber: 8
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/campaign.tsx",
                lineNumber: 350,
                columnNumber: 5
            }, this),
            showAddCampaignModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AddCampaignModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: showAddCampaignModal,
                onClose: ()=>{
                    setShowAddCampaignModal(false);
                    setEditingCampaign(null);
                },
                onSuccess: handleCampaignSaved,
                users: users,
                loadingUsers: loadingUsers,
                campaign: editingCampaign
            }, void 0, false, {
                fileName: "[project]/pages/portal/campaign.tsx",
                lineNumber: 535,
                columnNumber: 6
            }, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__77d85f5b._.js.map