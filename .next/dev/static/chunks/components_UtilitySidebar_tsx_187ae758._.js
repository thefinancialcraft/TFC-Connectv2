(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/UtilitySidebar.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UtilitySidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-dom/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
;
;
;
;
;
;
// Google Calendar API Helper (Server-side handled)
const fetchGoogleHolidays = async (year, month)=>{
    try {
        const token = localStorage.getItem('google_provider_token');
        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        const response = await fetch(`/api/google/fetch-holidays?year=${year}&month=${month}`, {
            headers
        });
        const data = await response.json();
        if (data.success) {
            const mapped = {};
            data.holidays.forEach((h)=>{
                // Handle multi-day events
                const start = new Date(h.start);
                const end = new Date(h.end);
                // For all-day events, the end date is exclusive. 
                // We'll iterate through each day the event encompasses.
                let current = new Date(start);
                while(current < end){
                    const dateStr = current.toISOString().split('T')[0];
                    if (!mapped[dateStr]) mapped[dateStr] = [];
                    mapped[dateStr].push(h);
                    // Increment one day
                    current.setDate(current.getDate() + 1);
                    // Break if it's a one-day event that somehow has a duration but doesn't cross midnight
                    if (h.allDay && current >= end) break;
                    if (!h.allDay) break; // If not all-day, we typically just show on start date for simplicity in this UI
                }
                // If it's not all-day and while loop skipped or only one day, ensure it's mapped to start date
                const startDateStr = h.start.split('T')[0];
                if (!mapped[startDateStr]) {
                    mapped[startDateStr] = [
                        h
                    ];
                } else if (!mapped[startDateStr].find((item)=>item.id === h.id)) {
                    mapped[startDateStr].push(h);
                }
            });
            return mapped;
        }
        return {};
    } catch (e) {
        console.error("Google Calendar Sync Error", e);
        return {};
    }
};
// Helper for Age Calculation
const calculateAge = (dob)=>{
    if (!dob) return null;
    const birth = new Date(dob);
    const now = new Date();
    let y = now.getFullYear() - birth.getFullYear();
    let m = now.getMonth() - birth.getMonth();
    let d = now.getDate() - birth.getDate();
    if (d < 0) {
        m--;
        d += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (m < 0) {
        y--;
        m += 12;
    }
    return {
        y,
        m,
        d
    };
};
const calculateBMI = (h, w)=>{
    if (!h || !w) return null;
    const height = Number(h) / 100; // cm to m
    const weight = Number(w);
    const bmi = weight / (height * height);
    if (!isFinite(bmi) || isNegative(bmi) || isNaN(bmi)) return null;
    return bmi.toFixed(1);
};
function isNegative(num) {
    return num < 0;
}
const formatTime = (seconds)=>{
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};
const CustomDatePicker = ({ date, setDate, label, placeholder = "DD/MM/YYYY" })=>{
    _s();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pickerDate, setPickerDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [coords, setCoords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        top: 0,
        left: 0
    });
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomDatePicker.useEffect": ()=>{
            setMounted(true);
        }
    }["CustomDatePicker.useEffect"], []);
    const getDaysInMonth = (year, month)=>new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month)=>new Date(year, month, 1).getDay();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomDatePicker.useEffect": ()=>{
            if (isOpen && date) {
                setPickerDate(new Date(date));
            }
        }
    }["CustomDatePicker.useEffect"], [
        isOpen
    ]);
    // Handle scroll to update position if needed, or close on scroll? 
    // For simplicity, we just calculate on open. 
    // And add a click-outside listener via a fixed overlay.
    const togglePicker = ()=>{
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            // Adjust if potential overflow bottom of screen, but simplifying for now
            setCoords({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
        setIsOpen(!isOpen);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1.5 relative w-full",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/UtilitySidebar.tsx",
                lineNumber: 130,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: triggerRef,
                onClick: togglePicker,
                className: `w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-[#263238] cursor-pointer flex items-center justify-between transition-all hover:bg-white hover:border-indigo-100 ${isOpen ? 'ring-2 ring-indigo-100 bg-white' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: date ? (()=>{
                            const [y, m, d] = date.split('-');
                            return `${d}/${m}/${y}`;
                        })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-400",
                            children: placeholder
                        }, void 0, false, {
                            fileName: "[project]/components/UtilitySidebar.tsx",
                            lineNumber: 142,
                            columnNumber: 28
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 138,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fi flex fi-rr-calendar text-gray-400"
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 144,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/UtilitySidebar.tsx",
                lineNumber: 133,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-[9998]",
                        onClick: ()=>setIsOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 151,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            top: coords.top,
                            left: coords.left
                        },
                        className: "fixed bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] p-3 animate-in fade-in zoom-in-95 duration-200 w-[220px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: pickerDate.getFullYear(),
                                        onChange: (e)=>{
                                            const newDate = new Date(pickerDate);
                                            newDate.setFullYear(Number(e.target.value));
                                            setPickerDate(newDate);
                                        },
                                        className: "flex-1 bg-gray-50 border-none rounded-lg text-xs font-bold text-[#263238] py-1.5 px-2 focus:ring-0 cursor-pointer",
                                        children: Array.from({
                                            length: 100
                                        }, (_, i)=>new Date().getFullYear() - i).map((year)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: year,
                                                children: year
                                            }, year, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 169,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 159,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: pickerDate.getMonth(),
                                        onChange: (e)=>{
                                            const newDate = new Date(pickerDate);
                                            newDate.setMonth(Number(e.target.value));
                                            setPickerDate(newDate);
                                        },
                                        className: "flex-[1.5] bg-gray-50 border-none rounded-lg text-xs font-bold text-[#263238] py-1.5 px-2 focus:ring-0 cursor-pointer",
                                        children: Array.from({
                                            length: 12
                                        }, (_, i)=>i).map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: m,
                                                children: new Date(2000, m, 1).toLocaleString('default', {
                                                    month: 'long'
                                                })
                                            }, m, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 182,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 172,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/UtilitySidebar.tsx",
                                lineNumber: 158,
                                columnNumber: 26
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-7 gap-1 text-center mb-1",
                                children: [
                                    'S',
                                    'M',
                                    'T',
                                    'W',
                                    'T',
                                    'F',
                                    'S'
                                ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[9px] font-bold text-gray-300",
                                        children: d
                                    }, d, false, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 190,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/components/UtilitySidebar.tsx",
                                lineNumber: 188,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-7 gap-1",
                                children: [
                                    Array.from({
                                        length: getFirstDayOfMonth(pickerDate.getFullYear(), pickerDate.getMonth())
                                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, `empty-${i}`, false, {
                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                            lineNumber: 195,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))),
                                    Array.from({
                                        length: getDaysInMonth(pickerDate.getFullYear(), pickerDate.getMonth())
                                    }).map((_, i)=>{
                                        const day = i + 1;
                                        const dateStr = `${pickerDate.getFullYear()}-${String(pickerDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isSelected = date === dateStr;
                                        const isToday = new Date().toDateString() === new Date(pickerDate.getFullYear(), pickerDate.getMonth(), day).toDateString();
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>{
                                                setDate(dateStr);
                                                setIsOpen(false);
                                            },
                                            className: `aspect-square flex items-center justify-center text-[10px] rounded-md cursor-pointer transition-all font-medium ${isSelected ? 'bg-[#4b33e8] text-white shadow-md' : isToday ? 'bg-indigo-50 text-[#4b33e8] font-bold' : 'hover:bg-gray-50 text-gray-600'}`,
                                            children: day
                                        }, day, false, {
                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                            lineNumber: 204,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0));
                                    })
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/UtilitySidebar.tsx",
                                lineNumber: 193,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 153,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/components/UtilitySidebar.tsx",
        lineNumber: 129,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CustomDatePicker, "8OZfB44EpWro5Jc9ZUf+uXPPXh8=");
_c = CustomDatePicker;
const CustomTimePicker = ({ time, setTime, label })=>{
    _s1();
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [coords, setCoords] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        top: 0,
        left: 0
    });
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomTimePicker.useEffect": ()=>{
            setMounted(true);
        }
    }["CustomTimePicker.useEffect"], []);
    const togglePicker = ()=>{
        if (!isOpen && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
        setIsOpen(!isOpen);
    };
    const currentH = time ? time.split(':')[0] : '12';
    const currentM = time ? time.split(':')[1] : '00';
    const updateH = (h)=>setTime(`${h}:${currentM}`);
    const updateM = (m)=>setTime(`${currentH}:${m}`);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-1.5 relative w-full",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/UtilitySidebar.tsx",
                lineNumber: 255,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: triggerRef,
                onClick: togglePicker,
                className: `w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-[#263238] cursor-pointer flex items-center justify-between transition-all hover:bg-white hover:border-indigo-100 ${isOpen ? 'ring-2 ring-indigo-100 bg-white' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: time || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-400",
                            children: "Select Time"
                        }, void 0, false, {
                            fileName: "[project]/components/UtilitySidebar.tsx",
                            lineNumber: 261,
                            columnNumber: 32
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 261,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "fi flex fi-rr-clock text-gray-400"
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 262,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/UtilitySidebar.tsx",
                lineNumber: 256,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            isOpen && mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-[9998]",
                        onClick: ()=>setIsOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 267,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            top: coords.top,
                            left: coords.left
                        },
                        className: "fixed bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] p-4 animate-in fade-in zoom-in-95 duration-200 w-[200px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[8px] font-black text-gray-300 uppercase mb-2 text-center",
                                                children: "Hrs"
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 275,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-40 overflow-y-auto custom-scrollbar space-y-1",
                                                children: Array.from({
                                                    length: 24
                                                }, (_, i)=>String(i).padStart(2, '0')).map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>updateH(h),
                                                        className: `text-center py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-all ${currentH === h ? 'bg-[#4b33e8] text-white shadow-md' : 'hover:bg-gray-50 text-gray-500'}`,
                                                        children: h
                                                    }, h, false, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 278,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 276,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 274,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-[8px] font-black text-gray-300 uppercase mb-2 text-center",
                                                children: "Min"
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 290,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-40 overflow-y-auto custom-scrollbar space-y-1",
                                                children: Array.from({
                                                    length: 60
                                                }, (_, i)=>String(i).padStart(2, '0')).map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>updateM(m),
                                                        className: `text-center py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-all ${currentM === m ? 'bg-[#4b33e8] text-white shadow-md' : 'hover:bg-gray-50 text-gray-500'}`,
                                                        children: m
                                                    }, m, false, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 293,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 291,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 289,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/UtilitySidebar.tsx",
                                lineNumber: 272,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setIsOpen(false),
                                className: "w-full mt-4 bg-gray-900 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest",
                                children: "Done"
                            }, void 0, false, {
                                fileName: "[project]/components/UtilitySidebar.tsx",
                                lineNumber: 304,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 268,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true), document.body)
        ]
    }, void 0, true, {
        fileName: "[project]/components/UtilitySidebar.tsx",
        lineNumber: 254,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(CustomTimePicker, "O/cQKHjfqXv4PrlXmElN71DBuHw=");
_c1 = CustomTimePicker;
function UtilitySidebar() {
    _s2();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            setMounted(true);
        }
    }["UtilitySidebar.useEffect"], []);
    const [activeApp, setActiveApp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('notes');
    // --- APP STATES ---
    const [notesList, setNotesList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeNoteId, setActiveNoteId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [noteCreationType, setNoteCreationType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('text');
    // --- AUDIO RECORDING & PLAYBACK ---
    const [isRecording, setIsRecording] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [recordDuration, setRecordDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [audioProgress, setAudioProgress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [audioDuration, setAudioDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioChunksRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])([]);
    const recordingIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const playbackIntervalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const audioNodeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [todoProjects, setTodoProjects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeProjectId, setActiveProjectId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [newTask, setNewTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [calcDisplay, setCalcDisplay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('0');
    const [calcPrev, setCalcPrev] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [calcOp, setCalcOp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [calcHistory, setCalcHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [dob, setDob] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [ageResult, setAgeResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [activeAgeTab, setActiveAgeTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('single');
    const [familyCards, setFamilyCards] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [activeCardId, setActiveCardId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [bmiHeight, setBmiHeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [bmiWeight, setBmiWeight] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [nextMemberId, setNextMemberId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [calDate, setCalDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [calEvents, setCalEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [newEventTitle, setNewEventTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedDay, setSelectedDay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(new Date().getDate());
    const [isSyncing, setIsSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [refreshKey, setRefreshKey] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [googleHolidays, setGoogleHolidays] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    // --- ALARM STATES ---
    const [alarms, setAlarms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [alarmTime, setAlarmTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [alarmMessage, setAlarmMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [activeToast, setActiveToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isInitialLoad, setIsInitialLoad] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // --- AI CHAT & COPILOT STATES ---
    const [chatMessages, setChatMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [userInput, setUserInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isAiLoading, setIsAiLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [aiConfig, setAiConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        instructions: '',
        knowledgeBase: ''
    });
    const [showAiSettings, setShowAiSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const chatEndRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const scrollToBottom = ()=>{
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            scrollToBottom();
        }
    }["UtilitySidebar.useEffect"], [
        chatMessages
    ]);
    // --- DRAG STATE ---
    const [posY, setPosY] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(50); // percentage from top
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const dragStarted = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const startY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const startPosY = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(50);
    // --- DRAWER RESIZE STATE ---
    const [drawerWidth, setDrawerWidth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(320);
    const [isResizing, setIsResizing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const resizeStartX = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const resizeStartWidth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(320);
    // Load states from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            // ... Notes loading logic ...
            const savedNotes = localStorage.getItem('tfc_util_notes_v2');
            const lastActiveNoteId = localStorage.getItem('tfc_util_active_note');
            if (savedNotes) {
                const parsed = JSON.parse(savedNotes);
                const migrated = parsed.map({
                    "UtilitySidebar.useEffect.migrated": (n)=>({
                            ...n,
                            type: n.type || 'text'
                        })
                }["UtilitySidebar.useEffect.migrated"]);
                setNotesList(migrated);
                if (lastActiveNoteId) setActiveNoteId(Number(lastActiveNoteId));
                else if (parsed.length > 0) setActiveNoteId(parsed[0].id);
            } else {
                const firstNote = {
                    id: Date.now(),
                    title: 'Draft Note',
                    content: '',
                    type: 'text'
                };
                setNotesList([
                    firstNote
                ]);
                setActiveNoteId(firstNote.id);
            }
            // --- Multi-Todo Loading ---
            const savedProjects = localStorage.getItem('tfc_util_todo_v2');
            const lastActiveProjId = localStorage.getItem('tfc_util_active_todo');
            const oldTasks = localStorage.getItem('tfc_util_tasks');
            if (savedProjects) {
                const parsed = JSON.parse(savedProjects);
                setTodoProjects(parsed);
                if (lastActiveProjId) setActiveProjectId(Number(lastActiveProjId));
                else if (parsed.length > 0) setActiveProjectId(parsed[0].id);
            } else if (oldTasks) {
                // Migrate old single list to new multi-list format
                const firstProj = {
                    id: Date.now(),
                    title: 'General Tasks',
                    tasks: JSON.parse(oldTasks)
                };
                setTodoProjects([
                    firstProj
                ]);
                setActiveProjectId(firstProj.id);
            } else {
                // Default first project
                const firstProj = {
                    id: Date.now(),
                    title: 'General Tasks',
                    tasks: []
                };
                setTodoProjects([
                    firstProj
                ]);
                setActiveProjectId(firstProj.id);
            }
            const savedEvents = localStorage.getItem('tfc_util_events');
            if (savedEvents) setCalEvents(JSON.parse(savedEvents));
            const savedCards = localStorage.getItem('tfc_util_family_cards');
            const oldFamily = localStorage.getItem('tfc_util_family_members');
            const savedAgeTab = localStorage.getItem('tfc_util_age_tab');
            if (savedCards) {
                const parsed = JSON.parse(savedCards);
                setFamilyCards(parsed);
                // find max id for members across all cards to prevent collisions
                let maxId = 0;
                parsed.forEach({
                    "UtilitySidebar.useEffect": (c)=>{
                        c.members.forEach({
                            "UtilitySidebar.useEffect": (m)=>{
                                maxId = Math.max(maxId, m.id);
                            }
                        }["UtilitySidebar.useEffect"]);
                    }
                }["UtilitySidebar.useEffect"]);
                setNextMemberId(maxId + 1);
            } else if (oldFamily) {
                // Migrate old single family to cards
                const parsed = JSON.parse(oldFamily);
                const firstCard = {
                    id: Date.now(),
                    name: 'My Family',
                    members: parsed
                };
                setFamilyCards([
                    firstCard
                ]);
                const maxId = parsed.reduce({
                    "UtilitySidebar.useEffect.maxId": (max, m)=>Math.max(max, m.id)
                }["UtilitySidebar.useEffect.maxId"], 0);
                setNextMemberId(maxId + 1);
            }
            if (savedAgeTab) setActiveAgeTab(savedAgeTab);
        }
    }["UtilitySidebar.useEffect"], []);
    // --- SUPABASE SYNC LOGIC ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            const fetchRemoteData = {
                "UtilitySidebar.useEffect.fetchRemoteData": async ()=>{
                    const currentId = user?.uid || user?.id;
                    if (!currentId) {
                        setIsInitialLoad(false);
                        return;
                    }
                    try {
                        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('utility_data').select('*').eq('user_id', currentId).single();
                        if (data) {
                            if (data.notes) setNotesList(data.notes);
                            if (data.todos) setTodoProjects(data.todos);
                            if (data.calendar) setCalEvents(data.calendar);
                            if (data.family) setFamilyCards(data.family);
                            if (data.alarms) setAlarms(data.alarms);
                            if (data.ai_config) setAiConfig(data.ai_config);
                            if (data.ai_chat_history) setChatMessages(data.ai_chat_history);
                        }
                    } catch (e) {
                        console.error("Supabase load error", e);
                    } finally{
                        setIsInitialLoad(false);
                    }
                }
            }["UtilitySidebar.useEffect.fetchRemoteData"];
            if (mounted && user) {
                fetchRemoteData();
            } else if (mounted && !user) {
                setIsInitialLoad(false);
            }
        }
    }["UtilitySidebar.useEffect"], [
        user,
        mounted
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            const syncToRemote = {
                "UtilitySidebar.useEffect.syncToRemote": async ()=>{
                    const currentId = user?.uid || user?.id;
                    if (isInitialLoad || !currentId) return;
                    try {
                        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('utility_data').upsert({
                            user_id: currentId,
                            notes: notesList,
                            todos: todoProjects,
                            calendar: calEvents,
                            family: familyCards,
                            alarms: alarms,
                            ai_config: aiConfig,
                            ai_chat_history: chatMessages,
                            updated_at: new Date().toISOString()
                        });
                    } catch (e) {
                        console.error("Supabase sync error", e);
                    }
                }
            }["UtilitySidebar.useEffect.syncToRemote"];
            const timer = setTimeout(syncToRemote, 2000); // 2s debounce to avoid over-calling
            return ({
                "UtilitySidebar.useEffect": ()=>clearTimeout(timer)
            })["UtilitySidebar.useEffect"];
        }
    }["UtilitySidebar.useEffect"], [
        notesList,
        todoProjects,
        calEvents,
        familyCards,
        alarms,
        user,
        isInitialLoad
    ]);
    // Save states
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            if (notesList.length > 0) localStorage.setItem('tfc_util_notes_v2', JSON.stringify(notesList));
        }
    }["UtilitySidebar.useEffect"], [
        notesList
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            if (activeNoteId) localStorage.setItem('tfc_util_active_note', String(activeNoteId));
        }
    }["UtilitySidebar.useEffect"], [
        activeNoteId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            if (todoProjects.length > 0) localStorage.setItem('tfc_util_todo_v2', JSON.stringify(todoProjects));
        }
    }["UtilitySidebar.useEffect"], [
        todoProjects
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            if (activeProjectId) localStorage.setItem('tfc_util_active_todo', String(activeProjectId));
        }
    }["UtilitySidebar.useEffect"], [
        activeProjectId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            localStorage.setItem('tfc_util_events', JSON.stringify(calEvents));
        }
    }["UtilitySidebar.useEffect"], [
        calEvents
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            localStorage.setItem('tfc_util_family_cards', JSON.stringify(familyCards));
        }
    }["UtilitySidebar.useEffect"], [
        familyCards
    ]);
    // --- ALARM PERSISTENCE ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            const savedAlarms = localStorage.getItem('tfc_util_alarms');
            if (savedAlarms) setAlarms(JSON.parse(savedAlarms));
        }
    }["UtilitySidebar.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            localStorage.setItem('tfc_util_alarms', JSON.stringify(alarms));
        }
    }["UtilitySidebar.useEffect"], [
        alarms
    ]);
    // --- ALARM TRIGGER LOGIC ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            const interval = setInterval({
                "UtilitySidebar.useEffect.interval": ()=>{
                    const now = new Date();
                    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                    alarms.forEach({
                        "UtilitySidebar.useEffect.interval": (alarm)=>{
                            if (alarm.enabled && alarm.time === currentTime) {
                                // Trigger
                                setActiveToast({
                                    message: alarm.message || 'Alarm Ringing!',
                                    type: 'alarm'
                                });
                                if (audioRef.current) {
                                    audioRef.current.play().catch({
                                        "UtilitySidebar.useEffect.interval": (e)=>console.log("Audio play failed", e)
                                    }["UtilitySidebar.useEffect.interval"]);
                                }
                                // Disable it so it doesn't trigger again in the same minute
                                setAlarms({
                                    "UtilitySidebar.useEffect.interval": (prev)=>prev.map({
                                            "UtilitySidebar.useEffect.interval": (a)=>a.id === alarm.id ? {
                                                    ...a,
                                                    enabled: false
                                                } : a
                                        }["UtilitySidebar.useEffect.interval"])
                                }["UtilitySidebar.useEffect.interval"]);
                            }
                        }
                    }["UtilitySidebar.useEffect.interval"]);
                }
            }["UtilitySidebar.useEffect.interval"], 1000);
            return ({
                "UtilitySidebar.useEffect": ()=>clearInterval(interval)
            })["UtilitySidebar.useEffect"];
        }
    }["UtilitySidebar.useEffect"], [
        alarms
    ]);
    const addAlarm = ()=>{
        if (!alarmTime) {
            alert("Please select a time first!");
            return;
        }
        const newAlarm = {
            id: Date.now(),
            time: alarmTime,
            message: alarmMessage,
            enabled: true
        };
        setAlarms((prev)=>[
                ...prev,
                newAlarm
            ]);
        setAlarmTime('');
        setAlarmMessage('');
    };
    const deleteAlarm = (id)=>{
        setAlarms(alarms.filter((a)=>a.id !== id));
    };
    const toggleAlarm = (id)=>{
        setAlarms(alarms.map((a)=>a.id === id ? {
                ...a,
                enabled: !a.enabled
            } : a));
    };
    const stopAlarm = ()=>{
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setActiveToast(null);
    };
    // --- AI HANDLERS ---
    const getAiContext = async ()=>{
        const currentId = user?.uid || user?.id;
        if (!currentId) return "No user logged in.";
        try {
            // Fetch Recent Call Logs
            const { data: callLogs } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('*').eq('user_id', currentId).order('created_at', {
                ascending: false
            }).limit(10);
            // Fetch Customer Context
            const { data: customers } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*').limit(5);
            // Fetch Followups / Outcomes
            const { data: outcomes } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('user_outcomes').select('*').eq('user_id', currentId).limit(5);
            return JSON.stringify({
                currentUser: {
                    name: user?.displayName,
                    role: user?.designation,
                    level: user?.user_level
                },
                recentCallLogs: callLogs,
                sampleCustomers: customers,
                userFollowups: outcomes,
                currentDrafts: notesList.slice(0, 3).map((n)=>({
                        title: n.title,
                        content: n.content
                    })),
                activeTasks: todoProjects.map((p)=>({
                        project: p.title,
                        tasks: p.tasks.filter((t)=>!t.completed).map((t)=>t.text)
                    })),
                customInstructions: aiConfig.instructions,
                knowledgeBase: aiConfig.knowledgeBase,
                current_time: new Date().toLocaleString()
            });
        } catch (e) {
            console.error("Context fetch error", e);
            return "Error fetching context.";
        }
    };
    const handleSendMessage = async ()=>{
        if (!userInput.trim() || isAiLoading) return;
        const userMsg = {
            role: 'user',
            content: userInput
        };
        setChatMessages((prev)=>[
                ...prev,
                userMsg
            ]);
        setUserInput('');
        setIsAiLoading(true);
        try {
            const contextContent = await getAiContext();
            const response = await fetch('/api/ai/copilot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        ...chatMessages,
                        userMsg
                    ],
                    context: contextContent
                })
            });
            const data = await response.json();
            if (data.reply) {
                setChatMessages((prev)=>[
                        ...prev,
                        {
                            role: 'assistant',
                            content: data.reply
                        }
                    ]);
            } else {
                setChatMessages((prev)=>[
                        ...prev,
                        {
                            role: 'assistant',
                            content: "I'm sorry, I couldn't process that. Please try again."
                        }
                    ]);
            }
        } catch (e) {
            console.error("AI Chat error", e);
            setChatMessages((prev)=>[
                    ...prev,
                    {
                        role: 'assistant',
                        content: "Connection error. Please check if the AI service is active."
                    }
                ]);
        } finally{
            setIsAiLoading(false);
        }
    };
    const clearChat = ()=>{
        if (confirm("Clear chat history?")) setChatMessages([]);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            // Cleaning up active Age Tab storage as it's no longer used
            localStorage.removeItem('tfc_util_age_tab');
        }
    }["UtilitySidebar.useEffect"], []);
    // --- NOTES HANDLERS ---
    const addNote = ()=>{
        const newNote = {
            id: Date.now(),
            title: `${noteCreationType === 'audio' ? 'Voice memo' : 'Draft Note'} ${notesList.length + 1}`,
            content: '',
            type: noteCreationType
        };
        setNotesList([
            ...notesList,
            newNote
        ]);
        setActiveNoteId(newNote.id);
    };
    const deleteNote = (id, e)=>{
        e.stopPropagation();
        const newList = notesList.filter((n)=>n.id !== id);
        setNotesList(newList);
        if (activeNoteId === id) {
            setActiveNoteId(newList.length > 0 ? newList[0].id : null);
        }
    };
    const updateNoteContent = (content)=>{
        setNotesList(notesList.map((n)=>n.id === activeNoteId ? {
                ...n,
                content
            } : n));
    };
    const updateNoteTitle = (title)=>{
        setNotesList(notesList.map((n)=>n.id === activeNoteId ? {
                ...n,
                title
            } : n));
    };
    // --- AUDIO HANDLING ---
    const startRecording = async ()=>{
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];
            mediaRecorderRef.current.ondataavailable = (e)=>{
                if (e.data.size > 0) audioChunksRef.current.push(e.data);
            };
            mediaRecorderRef.current.onstop = async ()=>{
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: 'audio/webm'
                });
                await uploadAudioToSupabase(audioBlob);
            };
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordDuration(0);
            recordingIntervalRef.current = setInterval(()=>{
                setRecordDuration((prev)=>prev + 1);
            }, 1000);
        } catch (err) {
            console.error("Microphone access error:", err);
            alert("Could not access microphone.");
        }
    };
    const stopRecording = ()=>{
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach((track)=>track.stop());
            setIsRecording(false);
            if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
        }
    };
    const uploadAudioToSupabase = async (blob)=>{
        if (!user || !activeNoteId) return;
        try {
            const fileName = `memos/${user.uid}/${activeNoteId}_${Date.now()}.webm`;
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('voice-memos').upload(fileName, blob);
            if (error) throw error;
            const { data: { publicUrl } } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('voice-memos').getPublicUrl(fileName);
            setNotesList((prev)=>prev.map((n)=>n.id === activeNoteId ? {
                        ...n,
                        audioUrl: publicUrl
                    } : n));
        } catch (err) {
            console.error("Upload failed", err);
        }
    };
    const togglePlayback = (url)=>{
        if (!audioNodeRef.current || audioNodeRef.current.src !== url) {
            if (audioNodeRef.current) audioNodeRef.current.pause();
            audioNodeRef.current = new Audio(url);
            audioNodeRef.current.onloadedmetadata = ()=>{
                setAudioDuration(audioNodeRef.current?.duration || 0);
            };
            audioNodeRef.current.onended = ()=>{
                setIsPlaying(false);
                setAudioProgress(0);
                if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
            };
        }
        if (isPlaying) {
            audioNodeRef.current.pause();
            setIsPlaying(false);
            if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
        } else {
            audioNodeRef.current.play();
            setIsPlaying(true);
            playbackIntervalRef.current = setInterval(()=>{
                if (audioNodeRef.current) {
                    setAudioProgress(audioNodeRef.current.currentTime);
                }
            }, 100);
        }
    };
    const seekAudio = (time)=>{
        if (audioNodeRef.current) {
            audioNodeRef.current.currentTime = time;
            setAudioProgress(time);
        }
    };
    // --- TODO/PROJECT HANDLERS ---
    const addTodoProject = ()=>{
        const newProj = {
            id: Date.now(),
            title: `List ${todoProjects.length + 1}`,
            tasks: []
        };
        setTodoProjects([
            ...todoProjects,
            newProj
        ]);
        setActiveProjectId(newProj.id);
    };
    const deleteTodoProject = (id, e)=>{
        e.stopPropagation();
        const newList = todoProjects.filter((p)=>p.id !== id);
        setTodoProjects(newList);
        if (activeProjectId === id) {
            setActiveProjectId(newList.length > 0 ? newList[0].id : null);
        }
    };
    const updateProjectTitle = (title)=>{
        setTodoProjects(todoProjects.map((p)=>p.id === activeProjectId ? {
                ...p,
                title
            } : p));
    };
    const addTask = ()=>{
        if (!newTask.trim() || !activeProjectId) return;
        setTodoProjects(todoProjects.map((p)=>p.id === activeProjectId ? {
                ...p,
                tasks: [
                    ...p.tasks,
                    {
                        id: Date.now(),
                        text: newTask,
                        completed: false
                    }
                ]
            } : p));
        setNewTask('');
    };
    const toggleTask = (taskId)=>{
        setTodoProjects(todoProjects.map((p)=>p.id === activeProjectId ? {
                ...p,
                tasks: p.tasks.map((t)=>t.id === taskId ? {
                        ...t,
                        completed: !t.completed
                    } : t)
            } : p));
    };
    const deleteTask = (taskId)=>{
        setTodoProjects(todoProjects.map((p)=>p.id === activeProjectId ? {
                ...p,
                tasks: p.tasks.filter((t)=>t.id !== taskId)
            } : p));
    };
    // --- CALCULATOR HANDLERS ---
    const handleCalcInput = (val)=>{
        if ([
            '+',
            '-',
            '*',
            '/'
        ].includes(val)) {
            setCalcPrev(calcDisplay);
            setCalcOp(val);
            setCalcDisplay('0');
            return;
        }
        if (val === '=' || val === 'Enter') {
            if (!calcPrev || !calcOp) return;
            const prev = parseFloat(calcPrev);
            const curr = parseFloat(calcDisplay);
            let res = 0;
            if (calcOp === '+') res = prev + curr;
            if (calcOp === '-') res = prev - curr;
            if (calcOp === '*') res = prev * curr;
            if (calcOp === '/') res = prev / curr;
            // Round to avoid float errors
            const finalRes = String(Math.round(res * 100000000) / 100000000);
            // Add to history
            const historyEntry = `${prev} ${calcOp} ${curr} = ${finalRes}`;
            setCalcHistory((h)=>[
                    historyEntry,
                    ...h
                ].slice(0, 20)); // Keep last 20
            setCalcDisplay(finalRes);
            setCalcPrev(null);
            setCalcOp(null);
            return;
        }
        if (val === 'C' || val === 'Escape' || val === 'Delete') {
            setCalcDisplay('0');
            setCalcPrev(null);
            setCalcOp(null);
            return;
        }
        if (val === 'Backspace') {
            setCalcDisplay((prev)=>prev.length > 1 ? prev.slice(0, -1) : '0');
            return;
        }
        // Prevent multiple decimals
        if (val === '.' && calcDisplay.includes('.')) return;
        setCalcDisplay((prev)=>prev === '0' && val !== '.' ? val : prev + val);
    };
    // Keyboard support for calculator
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            if (!isOpen || activeApp !== 'calculator') return;
            const handleKeyDown = {
                "UtilitySidebar.useEffect.handleKeyDown": (e)=>{
                    const key = e.key;
                    // Numbers and Dot
                    if (/^[0-9.]$/.test(key)) {
                        e.preventDefault();
                        handleCalcInput(key);
                    } else if ([
                        '+',
                        '-',
                        '*',
                        '/'
                    ].includes(key)) {
                        e.preventDefault();
                        handleCalcInput(key);
                    } else if (key === 'Enter' || key === '=') {
                        e.preventDefault();
                        handleCalcInput('=');
                    } else if (key === 'Escape' || key === 'Delete') {
                        e.preventDefault();
                        handleCalcInput('C');
                    } else if (key === 'Backspace') {
                        e.preventDefault();
                        handleCalcInput('Backspace');
                    }
                }
            }["UtilitySidebar.useEffect.handleKeyDown"];
            window.addEventListener('keydown', handleKeyDown);
            return ({
                "UtilitySidebar.useEffect": ()=>window.removeEventListener('keydown', handleKeyDown)
            })["UtilitySidebar.useEffect"];
        }
    }["UtilitySidebar.useEffect"], [
        isOpen,
        activeApp,
        calcDisplay,
        calcPrev,
        calcOp
    ]); // Dependencies for closure freshness
    // --- CALENDAR HANDLERS ---
    const changeMonth = (offset)=>{
        const next = new Date(calDate.getFullYear(), calDate.getMonth() + offset, 1);
        setCalDate(next);
        // Reset selected day if needed or keep it
        setSelectedDay(null);
    };
    // Automatically sync holidays when month/year changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            const sync = {
                "UtilitySidebar.useEffect.sync": async ()=>{
                    setIsSyncing(true);
                    const holidays = await fetchGoogleHolidays(calDate.getFullYear(), calDate.getMonth());
                    setGoogleHolidays(holidays);
                    setIsSyncing(false);
                }
            }["UtilitySidebar.useEffect.sync"];
            sync();
        }
    }["UtilitySidebar.useEffect"], [
        calDate.getFullYear(),
        calDate.getMonth(),
        refreshKey
    ]);
    const currentMonthFestivals = googleHolidays;
    const handleSync = ()=>{
        setRefreshKey((prev)=>prev + 1);
    };
    const getDaysInMonth = (year, month)=>new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month)=>new Date(year, month, 1).getDay();
    const addEvent = ()=>{
        if (!newEventTitle.trim() || !selectedDay) return;
        const dateStr = `${calDate.getFullYear()}-${String(calDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
        setCalEvents([
            ...calEvents,
            {
                id: Date.now(),
                date: dateStr,
                title: newEventTitle
            }
        ]);
        setNewEventTitle('');
    };
    const deleteEvent = (id)=>{
        setCalEvents(calEvents.filter((e)=>e.id !== id));
    };
    // --- AGE CALC HANDLER ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            setAgeResult(calculateAge(dob));
        }
    }["UtilitySidebar.useEffect"], [
        dob
    ]);
    const addFamilyCard = ()=>{
        const newCard = {
            id: Date.now(),
            name: `Family ${familyCards.length + 1}`,
            members: []
        };
        setFamilyCards([
            ...familyCards,
            newCard
        ]);
        setActiveCardId(newCard.id);
    };
    const deleteFamilyCard = (id, e)=>{
        e.stopPropagation();
        const newCards = familyCards.filter((c)=>c.id !== id);
        setFamilyCards(newCards);
        if (activeCardId === id) setActiveCardId(null);
    };
    const updateCardName = (name)=>{
        setFamilyCards(familyCards.map((c)=>c.id === activeCardId ? {
                ...c,
                name
            } : c));
    };
    const addFamilyMember = (type)=>{
        if (!activeCardId) return;
        setFamilyCards(familyCards.map((c)=>c.id === activeCardId ? {
                ...c,
                members: [
                    ...c.members,
                    {
                        id: nextMemberId,
                        type,
                        dob: ''
                    }
                ]
            } : c));
        setNextMemberId((prev)=>prev + 1);
    };
    const updateMemberDob = (memberId, dob)=>{
        if (!activeCardId) return;
        setFamilyCards(familyCards.map((c)=>c.id === activeCardId ? {
                ...c,
                members: c.members.map((m)=>m.id === memberId ? {
                        ...m,
                        dob
                    } : m)
            } : c));
    };
    const updateMemberMetrics = (memberId, field, value)=>{
        if (!activeCardId) return;
        setFamilyCards(familyCards.map((c)=>c.id === activeCardId ? {
                ...c,
                members: c.members.map((m)=>m.id === memberId ? {
                        ...m,
                        [field]: value
                    } : m)
            } : c));
    };
    const deleteFamilyMember = (memberId)=>{
        if (!activeCardId) return;
        setFamilyCards(familyCards.map((c)=>c.id === activeCardId ? {
                ...c,
                members: c.members.filter((m)=>m.id !== memberId)
            } : c));
    };
    const apps = [
        {
            id: 'notes',
            icon: 'flex fi-rr-note',
            label: 'Notes'
        },
        {
            id: 'todo',
            icon: 'flex fi-rr-list-check',
            label: 'Tasks'
        },
        {
            id: 'calendar',
            icon: 'flex fi-rr-calendar',
            label: 'Calendar'
        },
        {
            id: 'calculator',
            icon: 'flex fi-rr-calculator',
            label: 'Calc'
        },
        {
            id: 'age',
            icon: 'flex fi-rr-user-time',
            label: 'Age'
        },
        {
            id: 'bmi',
            icon: 'flex fi-rr-ruler-combined',
            label: 'BMI'
        },
        {
            id: 'alarm',
            icon: 'flex fi-rr-bell',
            label: 'Alarm'
        },
        {
            id: 'ai',
            icon: 'flex fi-rr-brain',
            label: 'AI Bot'
        }
    ].filter((app)=>app.id !== 'ai');
    // --- DRAGGING LOGIC ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            const handleMove = {
                "UtilitySidebar.useEffect.handleMove": (e)=>{
                    if (!dragStarted.current) return;
                    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
                    // Minimal threshold to consider it a drag
                    if (Math.abs(clientY - startY.current) > 5) {
                        setIsDragging(true);
                    }
                    if (dragStarted.current) {
                        const deltaY = (clientY - startY.current) / window.innerHeight * 100;
                        let newPos = startPosY.current + deltaY;
                        newPos = Math.max(5, Math.min(95, newPos));
                        setPosY(newPos);
                    }
                }
            }["UtilitySidebar.useEffect.handleMove"];
            const handleUp = {
                "UtilitySidebar.useEffect.handleUp": ()=>{
                    if (dragStarted.current) {
                        dragStarted.current = false;
                        // Keep isDragging true for a moment to prevent onClick from firing immediately
                        setTimeout({
                            "UtilitySidebar.useEffect.handleUp": ()=>setIsDragging(false)
                        }["UtilitySidebar.useEffect.handleUp"], 100);
                    }
                }
            }["UtilitySidebar.useEffect.handleUp"];
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchmove', handleMove, {
                passive: false
            });
            window.addEventListener('touchend', handleUp);
            return ({
                "UtilitySidebar.useEffect": ()=>{
                    window.removeEventListener('mousemove', handleMove);
                    window.removeEventListener('mouseup', handleUp);
                    window.removeEventListener('touchmove', handleMove);
                    window.removeEventListener('touchend', handleUp);
                }
            })["UtilitySidebar.useEffect"];
        }
    }["UtilitySidebar.useEffect"], []);
    // --- RESIZE LOGIC ---
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            const handleResizeMove = {
                "UtilitySidebar.useEffect.handleResizeMove": (e)=>{
                    if (!isResizing) return;
                    const deltaX = resizeStartX.current - e.clientX;
                    let newWidth = resizeStartWidth.current + deltaX;
                    // Min 250px, Max 80% of window width
                    newWidth = Math.max(250, Math.min(window.innerWidth * 0.8, newWidth));
                    setDrawerWidth(newWidth);
                }
            }["UtilitySidebar.useEffect.handleResizeMove"];
            const handleResizeUp = {
                "UtilitySidebar.useEffect.handleResizeUp": ()=>{
                    setIsResizing(false);
                    document.body.style.cursor = '';
                }
            }["UtilitySidebar.useEffect.handleResizeUp"];
            if (isResizing) {
                window.addEventListener('mousemove', handleResizeMove);
                window.addEventListener('mouseup', handleResizeUp);
                document.body.style.cursor = 'ew-resize';
                document.body.style.userSelect = 'none';
            }
            return ({
                "UtilitySidebar.useEffect": ()=>{
                    window.removeEventListener('mousemove', handleResizeMove);
                    window.removeEventListener('mouseup', handleResizeUp);
                }
            })["UtilitySidebar.useEffect"];
        }
    }["UtilitySidebar.useEffect"], [
        isResizing
    ]);
    const onResizeStart = (e)=>{
        e.preventDefault();
        setIsResizing(true);
        resizeStartX.current = e.clientX;
        resizeStartWidth.current = drawerWidth;
    };
    // Lock body scroll and selection during drag
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UtilitySidebar.useEffect": ()=>{
            if (isDragging) {
                document.body.style.overflow = 'hidden';
                document.body.style.userSelect = 'none';
                document.body.style.touchAction = 'none';
            } else {
                document.body.style.overflow = '';
                document.body.style.userSelect = '';
                document.body.style.touchAction = '';
            }
        }
    }["UtilitySidebar.useEffect"], [
        isDragging
    ]);
    const onDragStart = (e)=>{
        // Only left click or touch
        if ('button' in e && e.button !== 0) return;
        dragStarted.current = true;
        startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
        startPosY.current = posY;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onMouseDown: onDragStart,
                onTouchStart: onDragStart,
                onClick: (e)=>{
                    if (isDragging) {
                        e.preventDefault();
                        e.stopPropagation();
                        return;
                    }
                    setIsOpen(true);
                },
                style: {
                    top: `${posY}%`,
                    transform: isOpen ? 'translateY(-50%) translateX(100%)' : 'translateY(-50%)',
                    transition: isDragging ? 'none' : 'all 0.3s'
                },
                className: "jsx-243e87611042249b" + " " + `fixed right-0 z-[100] bg-[#4b33e8] text-xs hover:text-lg  border border-indigo-700 text-white w-4 h-12 hover:w-6 hover:h-14 rounded-l-xl transition-all duration-300 flex flex-col items-center justify-center hover:opacity-90 active:scale-95 ${isOpen ? 'translate-x-full' : ''}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                    className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-angle-small-left  font-bold"
                }, void 0, false, {
                    fileName: "[project]/components/UtilitySidebar.tsx",
                    lineNumber: 1188,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/UtilitySidebar.tsx",
                lineNumber: 1174,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-243e87611042249b" + " " + `fixed inset-0 z-[1000] transition-all duration-500 pointer-events-none ${isOpen ? 'visible' : 'invisible'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>setIsOpen(false),
                        className: "jsx-243e87611042249b" + " " + `absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-500 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 1194,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: `${drawerWidth}px`
                        },
                        className: "jsx-243e87611042249b" + " " + `absolute right-0 top-0 h-full bg-white shadow-xl transition-transform duration-400 pointer-events-auto border-l border-gray-100 flex ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${isResizing ? 'transition-none' : ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onMouseDown: onResizeStart,
                                className: "jsx-243e87611042249b" + " " + "absolute left-0 top-0 w-1.5 h-full cursor-ew-resize hover:bg-indigo-400/30 transition-colors z-[1010]"
                            }, void 0, false, {
                                fileName: "[project]/components/UtilitySidebar.tsx",
                                lineNumber: 1205,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-243e87611042249b" + " " + "w-[60px] shrink-0 bg-[#4b33e8] border-r border-indigo-700 flex flex-col items-center py-4 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "mb-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setIsOpen(false),
                                            className: "jsx-243e87611042249b" + " " + "w-8 p-2 h-8 rounded-lg text-white/60 hover:text-white transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-cross-small text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1217,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                            lineNumber: 1213,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 1212,
                                        columnNumber: 25
                                    }, this),
                                    apps.map((app)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveApp(app.id),
                                            title: app.label,
                                            className: "jsx-243e87611042249b" + " " + `w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeApp === app.id ? 'bg-white text-[#4b33e8] shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/10'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "jsx-243e87611042249b" + " " + `fi flex ${app.icon} text-base flex`
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1228,
                                                columnNumber: 33
                                            }, this)
                                        }, app.id, false, {
                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                            lineNumber: 1222,
                                            columnNumber: 29
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/UtilitySidebar.tsx",
                                lineNumber: 1211,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "jsx-243e87611042249b" + " " + "flex-1 flex flex-col h-full bg-white relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "px-5 py-4 border-b border-gray-50 flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                style: {
                                                    fontFamily: "'Poppins', sans-serif"
                                                },
                                                className: "jsx-243e87611042249b" + " " + "text-sm font-bold text-slate-700 tracking-tight uppercase",
                                                children: activeApp === 'age' ? 'Age Calc' : activeApp === 'todo' ? 'Tasks' : activeApp
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1237,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-[#4b33e8] bg-indigo-50 px-2 py-0.5 rounded-full uppercase",
                                                children: "Utility"
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1240,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 1236,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "flex-1 overflow-y-auto p-4 scroll-smooth custom-scrollbar",
                                        children: [
                                            activeApp === 'notes' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "h-full flex flex-col",
                                                children: !activeNoteId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex bg-slate-100 p-0.5 rounded-lg",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setNoteCreationType('text'),
                                                                            className: "jsx-243e87611042249b" + " " + `px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${noteCreationType === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`,
                                                                            children: "Text"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1253,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setNoteCreationType('audio'),
                                                                            className: "jsx-243e87611042249b" + " " + `px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${noteCreationType === 'audio' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`,
                                                                            children: "Audio"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1259,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1252,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: addNote,
                                                                    className: "jsx-243e87611042249b" + " " + `w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:shadow-md active:scale-95 ${noteCreationType === 'audio' ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-plus text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1270,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1266,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1251,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                            children: [
                                                                notesList.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "py-10 text-center border-2 border-dashed border-gray-50 rounded-xl",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                        className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-300 uppercase",
                                                                        children: "No notes found"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1276,
                                                                        columnNumber: 57
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1275,
                                                                    columnNumber: 53
                                                                }, this),
                                                                notesList.map((note)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        onClick: ()=>setActiveNoteId(note.id),
                                                                        className: "jsx-243e87611042249b" + " " + "group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all bg-white",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-3 flex-1 min-w-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${note.type === 'audio' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`,
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-243e87611042249b" + " " + `fi flex ${note.type === 'audio' ? 'fi-rr-microphone' : 'fi-rr-document'} text-xs`
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1287,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1286,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-[#263238] truncate",
                                                                                                children: note.title
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1290,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] text-gray-400 truncate mt-0.5",
                                                                                                children: note.content || (note.type === 'audio' ? 'Voice recording...' : 'No content yet...')
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1291,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1289,
                                                                                        columnNumber: 61
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1285,
                                                                                columnNumber: 57
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: (e)=>deleteNote(note.id, e),
                                                                                className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-trash text-[10px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1298,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1294,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        ]
                                                                    }, note.id, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1280,
                                                                        columnNumber: 53
                                                                    }, this))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1273,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 1250,
                                                    columnNumber: 41
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "h-full flex flex-col gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveNoteId(null),
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-angle-small-left"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1311,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1307,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: notesList.find((n)=>n.id === activeNoteId)?.title || '',
                                                                    onChange: (e)=>updateNoteTitle(e.target.value),
                                                                    placeholder: "Untitled Note",
                                                                    className: "jsx-243e87611042249b" + " " + "flex-1 bg-transparent border-none text-xs font-bold text-[#263238] focus:ring-0 p-0 outline-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1313,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1306,
                                                            columnNumber: 45
                                                        }, this),
                                                        notesList.find((n)=>n.id === activeNoteId)?.type === 'audio' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex-1 flex flex-col items-center justify-center bg-rose-50/30 rounded-2xl border border-rose-100/50 p-6 space-y-5",
                                                            children: [
                                                                notesList.find((n)=>n.id === activeNoteId)?.audioUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "w-full space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex items-center justify-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>togglePlayback(notesList.find((n)=>n.id === activeNoteId).audioUrl),
                                                                                className: "jsx-243e87611042249b" + " " + "w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all active:scale-95",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-243e87611042249b" + " " + `fi flex ${isPlaying ? 'fi-rr-pause' : 'fi-rr-play'} text-xl ${!isPlaying ? 'ml-1' : ''}`
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1330,
                                                                                    columnNumber: 69
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1326,
                                                                                columnNumber: 65
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1325,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "range",
                                                                                    min: "0",
                                                                                    max: audioDuration || 0,
                                                                                    step: "0.1",
                                                                                    value: audioProgress || 0,
                                                                                    onChange: (e)=>seekAudio(Number(e.target.value)),
                                                                                    className: "jsx-243e87611042249b" + " " + "w-full h-1 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1334,
                                                                                    columnNumber: 65
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "flex justify-between text-[8px] font-bold text-rose-400 uppercase tracking-widest",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-243e87611042249b",
                                                                                            children: formatTime(audioProgress)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1344,
                                                                                            columnNumber: 69
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-243e87611042249b",
                                                                                            children: formatTime(audioDuration)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1345,
                                                                                            columnNumber: 69
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1343,
                                                                                    columnNumber: 65
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1333,
                                                                            columnNumber: 61
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1324,
                                                                    columnNumber: 57
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col items-center space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + `w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 animate-pulse text-white' : 'bg-rose-100 text-rose-500'}`,
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-microphone text-2xl"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1352,
                                                                                columnNumber: 65
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1351,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-center",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-rose-600",
                                                                                    children: isRecording ? 'Recording...' : 'Ready to Record'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1355,
                                                                                    columnNumber: 65
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] text-rose-400 uppercase tracking-widest mt-1",
                                                                                    children: isRecording ? formatTime(recordDuration) : 'Tap to start voice memo'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1358,
                                                                                    columnNumber: 65
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1354,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: isRecording ? stopRecording : startRecording,
                                                                            className: "jsx-243e87611042249b" + " " + `px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${isRecording ? 'bg-slate-900 text-white' : 'bg-rose-500 text-white shadow-lg  hover:bg-rose-600'}`,
                                                                            children: isRecording ? 'Stop & Save' : 'Start Recording'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1362,
                                                                            columnNumber: 61
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1350,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                    value: notesList.find((n)=>n.id === activeNoteId)?.content || '',
                                                                    onChange: (e)=>updateNoteContent(e.target.value),
                                                                    placeholder: "Add transcript or notes here...",
                                                                    className: "jsx-243e87611042249b" + " " + "w-full bg-white/50 border border-rose-100 rounded-xl p-3 text-xs font-medium text-rose-700 focus:ring-rose-200 outline-none resize-none h-32"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1371,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1322,
                                                            columnNumber: 49
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                            autoFocus: true,
                                                            value: notesList.find((n)=>n.id === activeNoteId)?.content || '',
                                                            onChange: (e)=>updateNoteContent(e.target.value),
                                                            style: {
                                                                fontFamily: "'Roboto', sans-serif"
                                                            },
                                                            placeholder: "Write your note here...",
                                                            className: "jsx-243e87611042249b" + " " + "flex-1 w-full border-none focus:ring-0 outline-none text-sm text-[#263238] p-0 rounded-none leading-relaxed resize-none bg-transparent"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1379,
                                                            columnNumber: 49
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 1305,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1248,
                                                columnNumber: 33
                                            }, this),
                                            activeApp === 'todo' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "h-full flex flex-col",
                                                children: !activeProjectId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold  text-gray-400 uppercase tracking-widest",
                                                                    children: "Task Lists"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1399,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: addTodoProject,
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all  ",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-plus text-[10px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1404,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1400,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1398,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                            children: todoProjects.map((proj)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    onClick: ()=>setActiveProjectId(proj.id),
                                                                    className: "jsx-243e87611042249b" + " " + "group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all   bg-white",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-[#263238] truncate",
                                                                                    children: proj.title
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1415,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[9px] text-gray-400 mt-0.5",
                                                                                    children: [
                                                                                        proj.tasks.filter((t)=>!t.completed).length,
                                                                                        " items pending"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1416,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1414,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-indigo-400 bg-indigo-50 px-2 py-0.5 rounded-full",
                                                                                    children: [
                                                                                        Math.round(proj.tasks.filter((t)=>t.completed).length / (proj.tasks.length || 1) * 100),
                                                                                        "%"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1421,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>deleteTodoProject(proj.id, e),
                                                                                    className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-trash text-[10px]"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1428,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1424,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1420,
                                                                            columnNumber: 57
                                                                        }, this)
                                                                    ]
                                                                }, proj.id, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1409,
                                                                    columnNumber: 53
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1407,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 1397,
                                                    columnNumber: 41
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "space-y-4 h-full flex flex-col",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 border-b border-gray-50 pb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveProjectId(null),
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-243e87611042249b" + " " + "fi flex  fi-rr-angle-small-left text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1443,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1439,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: todoProjects.find((p)=>p.id === activeProjectId)?.title || '',
                                                                    onChange: (e)=>updateProjectTitle(e.target.value),
                                                                    placeholder: "List Name",
                                                                    className: "jsx-243e87611042249b" + " " + "flex-1 bg-transparent border-none text-xs font-bold text-[#263238] focus:ring-0 p-0 outline-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1445,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1438,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex gap-2 border-b border-gray-100 pb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: newTask,
                                                                    onChange: (e)=>setNewTask(e.target.value),
                                                                    onKeyPress: (e)=>e.key === 'Enter' && addTask(),
                                                                    placeholder: "Add task...",
                                                                    className: "jsx-243e87611042249b" + " " + "flex-1 bg-transparent border-none text-sm focus:ring-0 outline-none text-[#263238] p-0"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1456,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: addTask,
                                                                    className: "jsx-243e87611042249b" + " " + "text-[#4b33e8] hover:scale-110 transition-transform",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-plus-small text-xl flex"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1464,
                                                                        columnNumber: 139
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1464,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1455,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-1 flex-1 overflow-y-auto custom-scrollbar",
                                                            children: todoProjects.find((p)=>p.id === activeProjectId)?.tasks.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-all",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: t.completed,
                                                                            onChange: ()=>toggleTask(t.id),
                                                                            className: "jsx-243e87611042249b" + " " + "w-3.5 h-3.5 rounded border-gray-300 text-[#4b33e8] focus:ring-0 cursor-pointer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1471,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + `flex-1 text-xs truncate ${t.completed ? 'text-gray-300 line-through' : 'text-[#263238]'}`,
                                                                            children: t.text
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1477,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>deleteTask(t.id),
                                                                            className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-cross-small text-base"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1478,
                                                                                columnNumber: 177
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1478,
                                                                            columnNumber: 57
                                                                        }, this)
                                                                    ]
                                                                }, t.id, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1470,
                                                                    columnNumber: 53
                                                                }, this))
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1468,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 1436,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1395,
                                                columnNumber: 33
                                            }, this),
                                            activeApp === 'calendar' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "h-full flex flex-col gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex items-center justify-between px-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>changeMonth(-1),
                                                                className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "jsx-243e87611042249b" + " " + "fi flex  fi-rr-angle-small-left text-lg"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1495,
                                                                    columnNumber: 45
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1491,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-[#263238] uppercase tracking-wider",
                                                                children: calDate.toLocaleString('default', {
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1497,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>changeMonth(1),
                                                                className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                    className: "jsx-243e87611042249b" + " " + "fi flex  fi-rr-angle-small-right text-lg"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1504,
                                                                    columnNumber: 45
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1500,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 1490,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-300 uppercase",
                                                        children: [
                                                            'S',
                                                            'M',
                                                            'T',
                                                            'W',
                                                            'T',
                                                            'F',
                                                            'S'
                                                        ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b",
                                                                children: d
                                                            }, d, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1509,
                                                                columnNumber: 81
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 1508,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "grid grid-cols-7 gap-1",
                                                        children: [
                                                            Array.from({
                                                                length: getFirstDayOfMonth(calDate.getFullYear(), calDate.getMonth())
                                                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "aspect-square"
                                                                }, `empty-${i}`, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1514,
                                                                    columnNumber: 45
                                                                }, this)),
                                                            Array.from({
                                                                length: getDaysInMonth(calDate.getFullYear(), calDate.getMonth())
                                                            }).map((_, i)=>{
                                                                const day = i + 1;
                                                                const dateStr = `${calDate.getFullYear()}-${String(calDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                                const isSelected = selectedDay === day;
                                                                const isToday = day === new Date().getDate() && calDate.getMonth() === new Date().getMonth() && calDate.getFullYear() === new Date().getFullYear();
                                                                const hasLocalEvents = calEvents.some((e)=>e.date === dateStr);
                                                                const dayFestivals = currentMonthFestivals[dateStr] || [];
                                                                const hasGoogleFestivals = dayFestivals.some((f)=>f.isFestival);
                                                                const hasPersonalEvents = dayFestivals.some((f)=>f.isPersonal);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    onClick: ()=>setSelectedDay(day),
                                                                    className: "jsx-243e87611042249b" + " " + `relative aspect-square flex flex-col items-center justify-center text-[10px] rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 text-[#4b33e8] border border-indigo-200' : isToday ? 'bg-[#4b33e8] text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + "font-bold",
                                                                            children: day
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1532,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        hasGoogleFestivals && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1533,
                                                                            columnNumber: 76
                                                                        }, this),
                                                                        hasPersonalEvents && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "absolute top-1 left-1 w-1 h-1 rounded-full bg-emerald-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1534,
                                                                            columnNumber: 75
                                                                        }, this),
                                                                        hasLocalEvents && !isToday && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "absolute bottom-1 w-1 h-1 rounded-full bg-indigo-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1535,
                                                                            columnNumber: 84
                                                                        }, this)
                                                                    ]
                                                                }, day, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1527,
                                                                    columnNumber: 49
                                                                }, this);
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 1512,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "mt-2 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex gap-2 bg-gray-50 p-2 rounded-xl",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "text",
                                                                        value: newEventTitle,
                                                                        onChange: (e)=>setNewEventTitle(e.target.value),
                                                                        onKeyPress: (e)=>e.key === 'Enter' && addEvent(),
                                                                        placeholder: `Event for day ${selectedDay || '...'}`,
                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 bg-transparent border-none text-xs focus:ring-0 outline-none text-[#263238] p-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1544,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: addEvent,
                                                                        className: "jsx-243e87611042249b" + " " + "text-[#4b33e8] w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-all",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-plus-small text-xl flex"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1552,
                                                                            columnNumber: 181
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1552,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1543,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1",
                                                                children: [
                                                                    !user?.googleCalendarConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        onClick: ()=>router.push('/settings'),
                                                                        className: "jsx-243e87611042249b" + " " + "bg-indigo-50 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-all group border border-indigo-100 mb-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "w-5 h-5 bg-white rounded-full flex items-center justify-center text-indigo-600  ",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-brands-google text-[10px] flex"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1564,
                                                                                            columnNumber: 61
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1563,
                                                                                        columnNumber: 57
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold text-indigo-700",
                                                                                        children: "Connect Google Calendar"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1566,
                                                                                        columnNumber: 57
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1562,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-angle-small-right text-indigo-400 group-hover:text-indigo-600 flex"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1568,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1558,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mt-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold  text-gray-400 uppercase tracking-widest",
                                                                                children: "Google Calendar Holidays"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1573,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: handleSync,
                                                                                disabled: isSyncing,
                                                                                className: "jsx-243e87611042249b" + " " + `text-[8px] font-bold flex items-center gap-1 transition-all ${isSyncing ? 'text-indigo-400' : 'text-green-500 hover:text-green-600'}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                        className: "jsx-243e87611042249b" + " " + `flex fi flex fi-rr-refresh text-[10px] ${isSyncing ? 'animate-spin' : ''}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1579,
                                                                                        columnNumber: 53
                                                                                    }, this),
                                                                                    isSyncing ? 'Syncing...' : 'Live Sync'
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1574,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1572,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    (()=>{
                                                                        const userEvents = calEvents.filter((e)=>{
                                                                            const [y, m] = e.date.split('-');
                                                                            return Number(y) === calDate.getFullYear() && Number(m) === calDate.getMonth() + 1;
                                                                        });
                                                                        // Explode holidays into a flat list for the current month
                                                                        const googleEventsList = [];
                                                                        Object.entries(googleHolidays).forEach(([date, list])=>{
                                                                            list.forEach((h)=>{
                                                                                googleEventsList.push({
                                                                                    ...h,
                                                                                    date,
                                                                                    title: h.summary,
                                                                                    isGoogle: true
                                                                                });
                                                                            });
                                                                        });
                                                                        const combined = [
                                                                            ...googleEventsList,
                                                                            ...userEvents
                                                                        ].sort((a, b)=>a.date.localeCompare(b.date));
                                                                        if (combined.length === 0) {
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] text-gray-300 italic py-2",
                                                                                children: "No events or festivals"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1610,
                                                                                columnNumber: 60
                                                                            }, this);
                                                                        }
                                                                        return combined.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "group flex flex-col p-2 rounded-lg border border-gray-50 hover:bg-gray-50 transition-all cursor-default",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center justify-between",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-243e87611042249b" + " " + `text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md ${item.isFestival ? 'bg-amber-400' : item.isPersonal ? 'bg-emerald-400' : 'bg-indigo-400'}`,
                                                                                                        children: item.date.split('-')[2]
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                        lineNumber: 1617,
                                                                                                        columnNumber: 65
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-243e87611042249b" + " " + `text-xs font-medium truncate max-w-[160px] ${item.isFestival ? 'text-amber-600' : item.isPersonal ? 'text-emerald-600' : 'text-[#263238]'}`,
                                                                                                        children: [
                                                                                                            item.title,
                                                                                                            item.isFestival && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "jsx-243e87611042249b" + " " + "ml-1 text-[8px] opacity-70",
                                                                                                                children: "(Holidays)"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                                lineNumber: 1622,
                                                                                                                columnNumber: 89
                                                                                                            }, this),
                                                                                                            item.isPersonal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                                className: "jsx-243e87611042249b" + " " + "ml-1 text-[8px] opacity-70",
                                                                                                                children: "(Google Event)"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                                lineNumber: 1623,
                                                                                                                columnNumber: 89
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                        lineNumber: 1620,
                                                                                                        columnNumber: 65
                                                                                                    }, this)
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1616,
                                                                                                columnNumber: 61
                                                                                            }, this),
                                                                                            !item.isGoogle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: ()=>deleteEvent(item.id),
                                                                                                className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                    className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-cross-small text-base"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                    lineNumber: 1628,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1627,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1615,
                                                                                        columnNumber: 57
                                                                                    }, this),
                                                                                    item.isGoogle && (item.description || item.location) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "mt-1 pl-7 space-y-0.5",
                                                                                        children: [
                                                                                            item.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] text-gray-400 flex items-center gap-1",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                        className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-marker"
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                        lineNumber: 1634,
                                                                                                        columnNumber: 147
                                                                                                    }, this),
                                                                                                    " ",
                                                                                                    item.location
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1634,
                                                                                                columnNumber: 83
                                                                                            }, this),
                                                                                            item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] text-gray-400 italic line-clamp-2 leading-tight",
                                                                                                children: item.description
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1635,
                                                                                                columnNumber: 86
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1633,
                                                                                        columnNumber: 61
                                                                                    }, this)
                                                                                ]
                                                                            }, item.id, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1614,
                                                                                columnNumber: 53
                                                                            }, this));
                                                                    })()
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1555,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 1542,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1489,
                                                columnNumber: 33
                                            }, this),
                                            activeApp === 'calculator' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "space-y-3 h-full flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-4 text-right mb-2 relative shrink-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] text-gray-400 font-mono h-4",
                                                                children: [
                                                                    calcPrev,
                                                                    " ",
                                                                    calcOp
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1651,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "text-2xl text-[#263238] font-mono font-bold truncate",
                                                                children: calcDisplay
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1652,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 1650,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "grid grid-cols-4 gap-1.5 shrink-0",
                                                        children: [
                                                            '7',
                                                            '8',
                                                            '9',
                                                            '/',
                                                            '4',
                                                            '5',
                                                            '6',
                                                            '*',
                                                            '1',
                                                            '2',
                                                            '3',
                                                            '-',
                                                            'C',
                                                            '0',
                                                            '=',
                                                            '+'
                                                        ].map((btn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleCalcInput(btn),
                                                                className: "jsx-243e87611042249b" + " " + `h-11 rounded-lg flex items-center justify-center font-bold text-sm transition-all ${btn === '=' ? 'bg-[#4b33e8] text-white  ' : [
                                                                    '/',
                                                                    '*',
                                                                    '-',
                                                                    '+',
                                                                    'C'
                                                                ].includes(btn) ? 'bg-indigo-50 text-[#4b33e8] hover:bg-indigo-100' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`,
                                                                children: btn
                                                            }, btn, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1658,
                                                                columnNumber: 45
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 1656,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex-1 overflow-hidden flex flex-col mt-2 pt-2 border-t border-gray-50",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2 shrink-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-400 uppercase tracking-widest",
                                                                        children: "History"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1674,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    calcHistory.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setCalcHistory([]),
                                                                        className: "jsx-243e87611042249b" + " " + "text-[10px] text-red-400 hover:text-red-500 font-medium",
                                                                        children: "Clear"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1676,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1673,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1",
                                                                children: calcHistory.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] text-gray-300 text-center py-2 italic",
                                                                    children: "No recent calculations"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1681,
                                                                    columnNumber: 49
                                                                }, this) : calcHistory.map((entry, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "text-[11px] font-mono text-right text-gray-500 py-1 border-b border-gray-50 last:border-0 hover:text-[#263238] transition-colors",
                                                                        children: entry
                                                                    }, i, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1684,
                                                                        columnNumber: 53
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 1679,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 1672,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1648,
                                                columnNumber: 33
                                            }, this),
                                            activeApp === 'age' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "space-y-4",
                                                children: !activeCardId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col h-full space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "sticky top-0 bg-white z-20 space-y-4 -mt-5 -mx-5 px-5 pt-5 pb-4 border-b border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomDatePicker, {
                                                                    date: dob,
                                                                    setDate: setDob,
                                                                    label: "Date of Birth"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1702,
                                                                    columnNumber: 49
                                                                }, this),
                                                                ageResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "grid grid-cols-3 gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl py-3 text-center border border-gray-100",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-lg font-bold text-[#4b33e8]",
                                                                                    children: ageResult.y
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1707,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[8px] font-bold text-gray-400 uppercase",
                                                                                    children: "Years"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1708,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1706,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl py-3 text-center border border-gray-100",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-lg font-bold text-[#4b33e8]",
                                                                                    children: ageResult.m
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1711,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[8px] font-bold text-gray-400 uppercase",
                                                                                    children: "Months"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1712,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1710,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl py-3 text-center border border-gray-100",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-lg font-bold text-[#4b33e8]",
                                                                                    children: ageResult.d
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1715,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[8px] font-bold text-gray-400 uppercase",
                                                                                    children: "Days"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1716,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1714,
                                                                            columnNumber: 57
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1705,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1701,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex flex-col flex-1 min-h-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold  text-gray-400 uppercase tracking-widest",
                                                                            children: "My Families"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1725,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: addFamilyCard,
                                                                            className: "jsx-243e87611042249b" + " " + "w-6 h-6 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all  ",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-plus text-[10px]"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1730,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1726,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1724,
                                                                    columnNumber: 50
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1",
                                                                    children: [
                                                                        familyCards.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "py-6 text-center border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/50",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold text-gray-300 uppercase",
                                                                                children: "Create family card"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1737,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1736,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        familyCards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                onClick: ()=>setActiveCardId(card.id),
                                                                                className: "jsx-243e87611042249b" + " " + "group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all   bg-white",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-[#263238] truncate",
                                                                                                children: card.name
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1747,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] text-gray-400 mt-0.5",
                                                                                                children: [
                                                                                                    card.members.length,
                                                                                                    " member",
                                                                                                    card.members.length !== 1 ? 's' : ''
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1748,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1746,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-angle-small-right text-gray-300 group-hover:text-indigo-400 transition-colors"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1753,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                                onClick: (e)=>deleteFamilyCard(card.id, e),
                                                                                                className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                    className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-trash text-[10px]"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                    lineNumber: 1758,
                                                                                                    columnNumber: 69
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1754,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1752,
                                                                                        columnNumber: 61
                                                                                    }, this)
                                                                                ]
                                                                            }, card.id, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1741,
                                                                                columnNumber: 57
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1734,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1723,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 1699,
                                                    columnNumber: 41
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col h-full animate-in slide-in-from-right-4 duration-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 mb-3 pb-2 border-b border-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveCardId(null),
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-243e87611042249b" + " " + "fi flex  fi-rr-angle-small-left text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1774,
                                                                        columnNumber: 61
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1770,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: familyCards.find((c)=>c.id === activeCardId)?.name || '',
                                                                    onChange: (e)=>updateCardName(e.target.value),
                                                                    placeholder: "Family Name",
                                                                    className: "jsx-243e87611042249b" + " " + "flex-1 bg-transparent border-none text-xs font-bold text-[#263238] focus:ring-0 p-0 outline-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1776,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1769,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 mb-4 bg-indigo-50 p-2 rounded-xl text-center justify-center border border-indigo-100",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "text-center px-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + "block text-xl font-bold text-[#4b33e8]",
                                                                            children: familyCards.find((c)=>c.id === activeCardId)?.members.filter((m)=>m.type === 'Adult').length || 0
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1788,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-[8px] font-bold  text-indigo-300 uppercase",
                                                                            children: "Adults"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1791,
                                                                            columnNumber: 61
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1787,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "h-6 w-[1px] bg-indigo-200"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1793,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "text-center px-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + "block text-xl font-bold text-[#4b33e8]",
                                                                            children: familyCards.find((c)=>c.id === activeCardId)?.members.filter((m)=>m.type === 'Child').length || 0
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1795,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-[8px] font-bold  text-indigo-300 uppercase",
                                                                            children: "Children"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1798,
                                                                            columnNumber: 61
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1794,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1786,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-3 flex-1 overflow-y-auto custom-scrollbar mb-4",
                                                            children: [
                                                                familyCards.find((c)=>c.id === activeCardId)?.members.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "border-2 border-dashed border-gray-100 rounded-xl p-6 text-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-users text-2xl text-gray-200 mb-2 flex justify-center"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1806,
                                                                            columnNumber: 65
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-[10px] text-gray-400 font-bold",
                                                                            children: "Add family members"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1807,
                                                                            columnNumber: 65
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1805,
                                                                    columnNumber: 61
                                                                }, this),
                                                                familyCards.find((c)=>c.id === activeCardId)?.members.map((member, index)=>{
                                                                    const age = calculateAge(member.dob);
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-3 border border-gray-100 animate-in slide-in-from-right-2 duration-300",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + `text-[10px] font-bold  uppercase tracking-widest px-2 py-0.5 rounded-md ${member.type === 'Adult' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`,
                                                                                        children: member.type
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1815,
                                                                                        columnNumber: 73
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>deleteFamilyMember(member.id),
                                                                                        className: "jsx-243e87611042249b" + " " + "text-gray-300 hover:text-red-500 transition-colors",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-trash text-xs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1819,
                                                                                            columnNumber: 77
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1818,
                                                                                        columnNumber: 73
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1814,
                                                                                columnNumber: 69
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-end gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomDatePicker, {
                                                                                            date: member.dob,
                                                                                            setDate: (d)=>updateMemberDob(member.id, d),
                                                                                            placeholder: "Birth Date"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1824,
                                                                                            columnNumber: 77
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1823,
                                                                                        columnNumber: 73
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "text-right w-16 mb-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-243e87611042249b" + " " + "block text-lg font-bold text-[#263238] leading-none",
                                                                                                children: age ? age.y : '--'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1831,
                                                                                                columnNumber: 77
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-[8px] font-bold text-gray-400 uppercase",
                                                                                                children: "Years"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1834,
                                                                                                columnNumber: 77
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1830,
                                                                                        columnNumber: 73
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1822,
                                                                                columnNumber: 69
                                                                            }, this)
                                                                        ]
                                                                    }, member.id, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1813,
                                                                        columnNumber: 65
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1803,
                                                            columnNumber: 53
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "grid grid-cols-2 gap-2 mt-auto",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addFamilyMember('Adult'),
                                                                    className: "jsx-243e87611042249b" + " " + "py-2.5 rounded-xl bg-[#4b33e8] text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2   shadow-indigo-100 active:scale-95",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-user-add text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1848,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        " Add Adult"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1844,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addFamilyMember('Child'),
                                                                    className: "jsx-243e87611042249b" + " " + "py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-child text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1854,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        " Add Child"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1850,
                                                                    columnNumber: 57
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1843,
                                                            columnNumber: 53
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 1767,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1696,
                                                columnNumber: 33
                                            }, this),
                                            activeApp === 'bmi' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "flex flex-col h-full",
                                                children: !activeCardId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col h-full space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "sticky top-0 bg-white z-20 space-y-4 -mt-5 -mx-5 px-5 pt-5 pb-4 border-b border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex-1 space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1",
                                                                                    children: "Height (cm)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1871,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    value: bmiHeight,
                                                                                    onChange: (e)=>setBmiHeight(e.target.value),
                                                                                    placeholder: "0",
                                                                                    className: "jsx-243e87611042249b" + " " + "w-full bg-gray-50 border-gray-100 rounded-xl px-3 py-2.5 text-sm font-bold text-[#263238] focus:ring-indigo-100 focus:border-indigo-100 transition-all placeholder:text-gray-300"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1872,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1870,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex-1 space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1",
                                                                                    children: "Weight (kg)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1881,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                    type: "number",
                                                                                    value: bmiWeight,
                                                                                    onChange: (e)=>setBmiWeight(e.target.value),
                                                                                    placeholder: "0",
                                                                                    className: "jsx-243e87611042249b" + " " + "w-full bg-gray-50 border-gray-100 rounded-xl px-3 py-2.5 text-sm font-bold text-[#263238] focus:ring-indigo-100 focus:border-indigo-100 transition-all placeholder:text-gray-300"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1882,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1880,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1869,
                                                                    columnNumber: 49
                                                                }, this),
                                                                calculateBMI(bmiHeight, bmiWeight) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-3 text-center border border-gray-100 flex items-center justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-left",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[8px] font-bold text-gray-400 uppercase",
                                                                                    children: "Your BMI"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1895,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-2xl font-bold  text-[#4b33e8]",
                                                                                    children: calculateBMI(bmiHeight, bmiWeight)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1896,
                                                                                    columnNumber: 61
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1894,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + `px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${Number(calculateBMI(bmiHeight, bmiWeight)) < 18.5 ? 'bg-amber-100 text-amber-600' : Number(calculateBMI(bmiHeight, bmiWeight)) < 25 ? 'bg-emerald-100 text-emerald-600' : Number(calculateBMI(bmiHeight, bmiWeight)) < 30 ? 'bg-orange-100 text-orange-600' : 'bg-red-100 text-red-600'}`,
                                                                            children: Number(calculateBMI(bmiHeight, bmiWeight)) < 18.5 ? 'Underweight' : Number(calculateBMI(bmiHeight, bmiWeight)) < 25 ? 'Normal' : Number(calculateBMI(bmiHeight, bmiWeight)) < 30 ? 'Overweight' : 'Obese'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1898,
                                                                            columnNumber: 57
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1893,
                                                                    columnNumber: 53
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1868,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex flex-col flex-1 min-h-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold  text-gray-400 uppercase tracking-widest",
                                                                            children: "My Families"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1915,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                            onClick: addFamilyCard,
                                                                            className: "jsx-243e87611042249b" + " " + "w-6 h-6 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all  ",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-plus text-[10px]"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1920,
                                                                                columnNumber: 57
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1916,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1914,
                                                                    columnNumber: 50
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1",
                                                                    children: [
                                                                        familyCards.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "py-6 text-center border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/50",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold text-gray-300 uppercase",
                                                                                children: "Create family card"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1927,
                                                                                columnNumber: 61
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1926,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        familyCards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                onClick: ()=>setActiveCardId(card.id),
                                                                                className: "jsx-243e87611042249b" + " " + "group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all   bg-white",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-[#263238] truncate",
                                                                                                children: card.name
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1937,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] text-gray-400 mt-0.5",
                                                                                                children: [
                                                                                                    card.members.length,
                                                                                                    " member",
                                                                                                    card.members.length !== 1 ? 's' : ''
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1938,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1936,
                                                                                        columnNumber: 61
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-angle-small-right text-gray-300 group-hover:text-indigo-400 transition-colors"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1943,
                                                                                            columnNumber: 65
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1942,
                                                                                        columnNumber: 61
                                                                                    }, this)
                                                                                ]
                                                                            }, card.id, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1931,
                                                                                columnNumber: 57
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1924,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1913,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 1866,
                                                    columnNumber: 41
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col h-full animate-in slide-in-from-right-4 duration-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 mb-3 pb-2 border-b border-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveCardId(null),
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                        className: "jsx-243e87611042249b" + " " + "fi flex  fi-rr-angle-small-left text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1958,
                                                                        columnNumber: 53
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1954,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    value: familyCards.find((c)=>c.id === activeCardId)?.name || '',
                                                                    onChange: (e)=>updateCardName(e.target.value),
                                                                    placeholder: "Family Name",
                                                                    className: "jsx-243e87611042249b" + " " + "flex-1 bg-transparent border-none text-xs font-bold text-[#263238] focus:ring-0 p-0 outline-none"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1960,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1953,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-3 flex-1 overflow-y-auto custom-scrollbar mb-4",
                                                            children: [
                                                                familyCards.find((c)=>c.id === activeCardId)?.members.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "border-2 border-dashed border-gray-100 rounded-xl p-6 text-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-users text-2xl text-gray-200 mb-2 flex justify-center"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1973,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-[10px] text-gray-400 font-bold",
                                                                            children: "Add family members"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1974,
                                                                            columnNumber: 57
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1972,
                                                                    columnNumber: 53
                                                                }, this),
                                                                familyCards.find((c)=>c.id === activeCardId)?.members.map((member, index)=>{
                                                                    const bmi = calculateBMI(member.height || '', member.weight || '');
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-3 border border-gray-100 animate-in slide-in-from-right-2 duration-300",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + `text-[10px] font-bold  uppercase tracking-widest px-2 py-0.5 rounded-md ${member.type === 'Adult' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`,
                                                                                        children: member.type
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1982,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>deleteFamilyMember(member.id),
                                                                                        className: "jsx-243e87611042249b" + " " + "text-gray-300 hover:text-red-500 transition-colors",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-trash text-xs"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1986,
                                                                                            columnNumber: 69
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1985,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1981,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-end gap-3 mb-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 space-y-1",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "number",
                                                                                            placeholder: "Height (cm)",
                                                                                            value: member.height || '',
                                                                                            onChange: (e)=>updateMemberMetrics(member.id, 'height', e.target.value),
                                                                                            className: "jsx-243e87611042249b" + " " + "w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-[#263238] placeholder:text-gray-300 focus:border-indigo-300 focus:ring-0"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1991,
                                                                                            columnNumber: 69
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1990,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 space-y-1",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                            type: "number",
                                                                                            placeholder: "Weight (kg)",
                                                                                            value: member.weight || '',
                                                                                            onChange: (e)=>updateMemberMetrics(member.id, 'weight', e.target.value),
                                                                                            className: "jsx-243e87611042249b" + " " + "w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-[#263238] placeholder:text-gray-300 focus:border-indigo-300 focus:ring-0"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 2000,
                                                                                            columnNumber: 69
                                                                                        }, this)
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1999,
                                                                                        columnNumber: 65
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1989,
                                                                                columnNumber: 61
                                                                            }, this),
                                                                            bmi && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between pt-2 border-t border-gray-200/50",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold text-gray-400 uppercase",
                                                                                        children: "BMI Result"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 2011,
                                                                                        columnNumber: 69
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-243e87611042249b" + " " + `text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${Number(bmi) < 18.5 ? 'bg-amber-50 text-amber-600' : Number(bmi) < 25 ? 'bg-emerald-50 text-emerald-600' : Number(bmi) < 30 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`,
                                                                                                children: Number(bmi) < 18.5 ? 'Underweight' : Number(bmi) < 25 ? 'Normal' : Number(bmi) < 30 ? 'Overweight' : 'Obese'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 2013,
                                                                                                columnNumber: 73
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-sm font-bold  text-[#263238]",
                                                                                                children: bmi
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 2021,
                                                                                                columnNumber: 73
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 2012,
                                                                                        columnNumber: 69
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2010,
                                                                                columnNumber: 65
                                                                            }, this)
                                                                        ]
                                                                    }, member.id, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1980,
                                                                        columnNumber: 57
                                                                    }, this);
                                                                })
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 1970,
                                                            columnNumber: 45
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "grid grid-cols-2 gap-2 mt-auto",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addFamilyMember('Adult'),
                                                                    className: "jsx-243e87611042249b" + " " + "py-2.5 rounded-xl bg-[#4b33e8] text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2   shadow-indigo-100 active:scale-95",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-user-add text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2036,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        " Add Adult"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 2032,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addFamilyMember('Child'),
                                                                    className: "jsx-243e87611042249b" + " " + "py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-child text-sm"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2042,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        " Add Child"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 2038,
                                                                    columnNumber: 49
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 2031,
                                                            columnNumber: 45
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 1951,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 1864,
                                                columnNumber: 33
                                            }, this),
                                            activeApp === 'alarm' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "flex flex-col h-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "space-y-4 mb-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-400 uppercase tracking-widest",
                                                                    children: "New Reminder"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 2055,
                                                                    columnNumber: 45
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2054,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "space-y-1",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CustomTimePicker, {
                                                                            time: alarmTime,
                                                                            setTime: setAlarmTime,
                                                                            label: "Time"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2059,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2058,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "space-y-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold text-gray-400 uppercase ml-1",
                                                                                children: "Message (Optional)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2066,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "text",
                                                                                value: alarmMessage,
                                                                                onChange: (e)=>setAlarmMessage(e.target.value),
                                                                                placeholder: "Wake up, meeting...",
                                                                                className: "jsx-243e87611042249b" + " " + "w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold text-[#263238] placeholder:text-gray-300 focus:ring-indigo-100 focus:border-indigo-300"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2067,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2065,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: addAlarm,
                                                                        className: "jsx-243e87611042249b" + " " + "w-full bg-[#4b33e8] text-white py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm active:scale-95",
                                                                        children: "Set Alarm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2075,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2057,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 2053,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-h-0 flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3",
                                                                children: "Active Alarms"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2085,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "space-y-2 overflow-y-auto custom-scrollbar pr-1",
                                                                children: [
                                                                    alarms.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "py-8 text-center border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/50",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex fi fi-rr-bell-slash text-2xl text-gray-200 mb-2 justify-center"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2089,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold text-gray-300 uppercase",
                                                                                children: "No alarms set"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2090,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2088,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    alarms.sort((a, b)=>a.time.localeCompare(b.time)).map((alarm)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "group bg-white border border-gray-100 p-3 rounded-xl flex items-center justify-between hover:border-indigo-100 transition-all shadow-sm",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "flex items-center gap-3",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-243e87611042249b" + " " + `w-8 h-8 rounded-lg flex items-center justify-center ${alarm.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-300'}`,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-243e87611042249b" + " " + `flex fi fi-rr-bell ${alarm.enabled ? 'animate-bounce' : ''}`
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 2097,
                                                                                                columnNumber: 61
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 2096,
                                                                                            columnNumber: 57
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-243e87611042249b",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                    className: "jsx-243e87611042249b" + " " + `text-sm font-black ${alarm.enabled ? 'text-[#263238]' : 'text-gray-400'}`,
                                                                                                    children: alarm.time
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                    lineNumber: 2100,
                                                                                                    columnNumber: 61
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                                    className: "jsx-243e87611042249b" + " " + "text-[9px] text-gray-400 font-bold uppercase truncate max-w-[100px]",
                                                                                                    children: alarm.message || 'Reminder'
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                    lineNumber: 2101,
                                                                                                    columnNumber: 61
                                                                                                }, this)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 2099,
                                                                                            columnNumber: 57
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 2095,
                                                                                    columnNumber: 53
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>toggleAlarm(alarm.id),
                                                                                            className: "jsx-243e87611042249b" + " " + `w-8 h-5 rounded-full transition-all relative ${alarm.enabled ? 'bg-green-500' : 'bg-gray-200'}`,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-243e87611042249b" + " " + `absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${alarm.enabled ? 'left-4' : 'left-1'}`
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 2109,
                                                                                                columnNumber: 61
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 2105,
                                                                                            columnNumber: 57
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>deleteAlarm(alarm.id),
                                                                                            className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-243e87611042249b" + " " + "flex fi fi-rr-trash text-xs"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 2115,
                                                                                                columnNumber: 61
                                                                                            }, this)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 2111,
                                                                                            columnNumber: 57
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 2104,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            ]
                                                                        }, alarm.id, true, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2094,
                                                                            columnNumber: 49
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2086,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 2084,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 2052,
                                                columnNumber: 33
                                            }, this),
                                            activeApp === 'ai' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "flex flex-col h-full relative slide-in-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-5 px-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-brain text-[14px] animate-pulse"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2132,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2131,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-slate-700 uppercase tracking-wide",
                                                                                children: "Sales Co-Pilot"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2135,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-1.5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + "w-1.5 h-1.5 rounded-full bg-emerald-400"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 2137,
                                                                                        columnNumber: 53
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + "text-[8px] font-bold text-slate-400 uppercase tracking-widest",
                                                                                        children: "Live Co-Pilot"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 2138,
                                                                                        columnNumber: 53
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2136,
                                                                                columnNumber: 49
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2134,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2130,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: clearChat,
                                                                        title: "Clear History",
                                                                        className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-400 hover:bg-rose-50/50 transition-all active:scale-95",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-trash text-[13px]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2148,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2143,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowAiSettings(true),
                                                                        title: "AI Settings",
                                                                        className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all active:scale-95",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-settings text-[14px]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2155,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2150,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2142,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 2129,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-h-0 overflow-y-auto custom-scrollbar px-0.5 space-y-4 pb-3 overflow-x-hidden",
                                                        children: [
                                                            chatMessages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "py-10 text-center space-y-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto border border-slate-100/50",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-comment-active text-2xl"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2165,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2164,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "px-6",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[12px] font-bold text-slate-600 mb-1.5",
                                                                                children: "Ready to assist your sales journey"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2168,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-medium text-slate-400 uppercase tracking-tighter leading-relaxed",
                                                                                children: "Ask about call history, scripts, or plan details."
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2169,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2167,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "flex flex-wrap gap-2 justify-center px-4",
                                                                        children: [
                                                                            "Closing Tips",
                                                                            "Follow-up Script",
                                                                            "Talktime Analysis",
                                                                            "Pitch Ideas"
                                                                        ].map((tip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>{
                                                                                    setUserInput(tip);
                                                                                    handleSendMessage();
                                                                                },
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-slate-500 bg-slate-50 hover:bg-white hover:border-slate-200 px-3 py-2 rounded-lg border border-transparent transition-all active:scale-95",
                                                                                children: tip
                                                                            }, tip, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2173,
                                                                                columnNumber: 57
                                                                            }, this))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2171,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2163,
                                                                columnNumber: 45
                                                            }, this),
                                                            chatMessages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + `flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + `max-w-[88%] rounded-xl px-4 py-2.5 text-[12px] leading-relaxed transition-all break-words whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-500 text-white rounded-tr-none shadow-sm font-medium' : 'bg-slate-50 border border-slate-100 text-slate-600 rounded-tl-none font-medium'}`,
                                                                        children: msg.content
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2187,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                }, idx, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 2186,
                                                                    columnNumber: 45
                                                                }, this)),
                                                            isAiLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex justify-start",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "bg-slate-50 border border-slate-100 rounded-xl rounded-tl-none px-3.5 py-2.5 flex gap-1.5 items-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2200,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2201,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-300"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2202,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 2199,
                                                                    columnNumber: 49
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2198,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                ref: chatEndRef,
                                                                className: "jsx-243e87611042249b"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2206,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 2161,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "pt-4 border-t border-slate-100 mt-auto bg-white/60 backdrop-blur-sm px-0.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "relative flex items-end gap-2 bg-slate-50/80 rounded-xl border border-slate-100 transition-all p-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                        value: userInput,
                                                                        onChange: (e)=>setUserInput(e.target.value),
                                                                        onKeyDown: (e)=>{
                                                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                                                e.preventDefault();
                                                                                handleSendMessage();
                                                                            }
                                                                        },
                                                                        placeholder: "Type a message...",
                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 bg-transparent border-none rounded-lg px-2.5 py-2 text-[12px] font-medium text-slate-600 focus:ring-0 focus:outline-none outline-none resize-none min-h-[42px] max-h-[120px] placeholder:text-slate-300"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2212,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: handleSendMessage,
                                                                        disabled: isAiLoading || !userInput.trim(),
                                                                        className: "jsx-243e87611042249b" + " " + `w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 mb-1 mr-1 ${userInput.trim() ? 'bg-indigo-500 text-white shadow-md shadow-indigo-100' : 'bg-slate-100 text-slate-300'}`,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-paper-plane text-[12px]"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2231,
                                                                            columnNumber: 49
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2224,
                                                                        columnNumber: 45
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2211,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] text-center text-slate-300 font-bold uppercase tracking-[0.2em] py-3",
                                                                children: "Intelligent Sales Shield"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2234,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 2210,
                                                        columnNumber: 37
                                                    }, this),
                                                    showAiSettings && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "absolute inset-0 bg-white/98 z-[100] flex flex-col p-5 animate-in fade-in duration-300",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-6",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                                    className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-shield-check text-indigo-400 text-sm"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 2243,
                                                                                    columnNumber: 57
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2242,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[12px] font-bold text-slate-700 uppercase tracking-widest",
                                                                                children: "Core Configuration"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2245,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2241,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowAiSettings(false),
                                                                        className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-cross-small text-slate-400 text-lg"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2248,
                                                                            columnNumber: 53
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2247,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2240,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1",
                                                                                children: "Behavior Instructions"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2254,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                value: aiConfig.instructions,
                                                                                onChange: (e)=>setAiConfig({
                                                                                        ...aiConfig,
                                                                                        instructions: e.target.value
                                                                                    }),
                                                                                placeholder: "Ex: Act as a high-ticket sales coach...",
                                                                                className: "jsx-243e87611042249b" + " " + "w-full bg-slate-50/50 border border-slate-100 rounded-lg p-3.5 text-[12px] font-medium text-slate-600 min-h-[120px] focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-200"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2255,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2253,
                                                                        columnNumber: 49
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1",
                                                                                children: "Contextual Knowledge"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2264,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                                value: aiConfig.knowledgeBase,
                                                                                onChange: (e)=>setAiConfig({
                                                                                        ...aiConfig,
                                                                                        knowledgeBase: e.target.value
                                                                                    }),
                                                                                placeholder: "Paste your PDF text or plan manuals here...",
                                                                                className: "jsx-243e87611042249b" + " " + "w-full bg-slate-50/50 border border-slate-100 rounded-lg p-3.5 text-[12px] font-medium text-slate-600 min-h-[120px] focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-200"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2265,
                                                                                columnNumber: 53
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 2263,
                                                                        columnNumber: 49
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2252,
                                                                columnNumber: 45
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>setShowAiSettings(false),
                                                                className: "jsx-243e87611042249b" + " " + "w-full bg-slate-800 text-white py-3 rounded-xl text-[12px] font-bold uppercase tracking-widest mt-6 hover:bg-slate-900 transition-all active:scale-95",
                                                                children: "Apply Intelligence"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2274,
                                                                columnNumber: 45
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 2239,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 2127,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 1244,
                                        columnNumber: 25
                                    }, this),
                                    activeToast && typeof document !== 'undefined' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$dom$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "fixed top-8 right-8 z-[99999] animate-in fade-in slide-in-from-top-8 duration-500 pointer-events-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "jsx-243e87611042249b" + " " + "bg-[#001a3d] rounded-full pl-3 pr-4 py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 min-w-[300px] border border-white/5 backdrop-blur-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "w-10 h-10 rounded-full bg-[#1e40af] flex items-center justify-center text-white shrink-0 shadow-inner",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "jsx-243e87611042249b" + " " + "flex fi fi-rr-bell text-lg animate-pulse"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 2293,
                                                        columnNumber: 42
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 2292,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0 pr-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                            className: "jsx-243e87611042249b" + " " + "text-white text-[11px] font-black leading-tight tracking-wide",
                                                            children: "Rynxly Alarm Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 2298,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "jsx-243e87611042249b" + " " + "text-white/70 text-[10px] font-medium truncate",
                                                            children: activeToast.message || 'Time to wake up!'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 2299,
                                                            columnNumber: 42
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 2297,
                                                    columnNumber: 38
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: stopAlarm,
                                                    className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90 shrink-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                        className: "jsx-243e87611042249b" + " " + "flex fi fi-rr-cross text-[10px]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                        lineNumber: 2307,
                                                        columnNumber: 42
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                    lineNumber: 2303,
                                                    columnNumber: 38
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                            lineNumber: 2290,
                                            columnNumber: 34
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 2289,
                                        columnNumber: 30
                                    }, this), document.body),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("audio", {
                                        ref: audioRef,
                                        src: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
                                        loop: true,
                                        className: "jsx-243e87611042249b"
                                    }, void 0, false, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 2315,
                                        columnNumber: 26
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "px-5 py-3 border-t border-gray-50 flex items-center justify-between text-[8px] font-bold text-gray-300 uppercase tracking-widest",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "jsx-243e87611042249b",
                                                children: "Rynxly Tools Suits"
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 2323,
                                                columnNumber: 30
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "w-1 h-1 rounded-full bg-green-400"
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 2324,
                                                columnNumber: 30
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 2322,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/UtilitySidebar.tsx",
                                lineNumber: 1234,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 1200,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/UtilitySidebar.tsx",
                lineNumber: 1192,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                id: "243e87611042249b",
                children: ".custom-scrollbar.jsx-243e87611042249b::-webkit-scrollbar{width:4px}.custom-scrollbar.jsx-243e87611042249b::-webkit-scrollbar-track{background:0 0}.custom-scrollbar.jsx-243e87611042249b::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:10px}.custom-scrollbar.jsx-243e87611042249b.jsx-243e87611042249b::-webkit-scrollbar-thumb:hover{background:#cbd5e1}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes slideRight{0%{opacity:0;transform:translate(20px)}to{opacity:1;transform:translate(0)}}.animate-in.jsx-243e87611042249b{animation:.3s ease-out fadeIn}.slide-in-right.jsx-243e87611042249b{animation:.4s cubic-bezier(.16,1,.3,1) slideRight}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true);
}
_s2(UtilitySidebar, "eOAJcv10P86ttpfTSPDv/fKXX8E=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
_c2 = UtilitySidebar;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "CustomDatePicker");
__turbopack_context__.k.register(_c1, "CustomTimePicker");
__turbopack_context__.k.register(_c2, "UtilitySidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=components_UtilitySidebar_tsx_187ae758._.js.map