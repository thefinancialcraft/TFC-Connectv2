module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/react [external] (react, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react", () => require("react"));

module.exports = mod;
}),
"[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("styled-jsx/style.js", () => require("styled-jsx/style.js"));

module.exports = mod;
}),
"[project]/components/Dialog.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Dialog
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
function Dialog({ isOpen, title, message, type = 'info', onConfirm, onCancel, onClose, confirmText = 'OK', cancelText = 'Cancel', showCancel = false }) {
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return ()=>{
            document.body.style.overflow = 'unset';
        };
    }, [
        isOpen
    ]);
    if (!isOpen) return null;
    const handleConfirm = ()=>{
        onConfirm?.();
        onClose();
    };
    const handleCancel = ()=>{
        onCancel?.();
        onClose();
    };
    const getTypeStyles = ()=>{
        switch(type){
            case 'success':
                return {
                    iconBg: '#10B981',
                    iconColor: '#FFFFFF',
                    borderColor: '#10B981',
                    icon: '✓'
                };
            case 'error':
                return {
                    iconBg: '#EF4444',
                    iconColor: '#FFFFFF',
                    borderColor: '#EF4444',
                    icon: '✕'
                };
            case 'warning':
                return {
                    iconBg: '#F59E0B',
                    iconColor: '#FFFFFF',
                    borderColor: '#F59E0B',
                    icon: '⚠'
                };
            default:
                return {
                    iconBg: '#4b33e8',
                    iconColor: '#FFFFFF',
                    borderColor: '#4b33e8',
                    icon: 'ℹ'
                };
        }
    };
    const typeStyles = getTypeStyles();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 9998,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease-out'
                },
                onClick: onClose,
                className: "jsx-f08951fac673695",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: {
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '24px',
                        maxWidth: '90%',
                        width: '420px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        zIndex: 9999,
                        animation: 'slideUp 0.3s ease-out',
                        position: 'relative'
                    },
                    onClick: (e)=>e.stopPropagation(),
                    className: "jsx-f08951fac673695",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '16px',
                                marginBottom: '20px'
                            },
                            className: "jsx-f08951fac673695",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: typeStyles.iconBg,
                                        color: typeStyles.iconColor,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        fontWeight: 'bold',
                                        flexShrink: 0
                                    },
                                    className: "jsx-f08951fac673695",
                                    children: typeStyles.icon
                                }, void 0, false, {
                                    fileName: "[project]/components/Dialog.tsx",
                                    lineNumber: 134,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        flex: 1,
                                        minWidth: 0
                                    },
                                    className: "jsx-f08951fac673695",
                                    children: [
                                        title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            style: {
                                                fontSize: '20px',
                                                fontWeight: '700',
                                                color: '#263238',
                                                fontFamily: "'Poppins', sans-serif",
                                                marginBottom: '8px',
                                                marginTop: 0
                                            },
                                            className: "jsx-f08951fac673695",
                                            children: title
                                        }, void 0, false, {
                                            fileName: "[project]/components/Dialog.tsx",
                                            lineNumber: 155,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            style: {
                                                fontSize: '14px',
                                                color: '#787E9D',
                                                fontFamily: "'Roboto', sans-serif",
                                                lineHeight: '1.6',
                                                margin: 0,
                                                wordBreak: 'break-word'
                                            },
                                            className: "jsx-f08951fac673695",
                                            children: message
                                        }, void 0, false, {
                                            fileName: "[project]/components/Dialog.tsx",
                                            lineNumber: 168,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Dialog.tsx",
                                    lineNumber: 153,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Dialog.tsx",
                            lineNumber: 125,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            style: {
                                display: 'flex',
                                gap: '12px',
                                justifyContent: 'flex-end',
                                marginTop: '24px'
                            },
                            className: "jsx-f08951fac673695",
                            children: [
                                showCancel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleCancel,
                                    style: {
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        border: '2px solid #DCDEE3',
                                        backgroundColor: '#FFFFFF',
                                        color: '#263238',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        fontFamily: "'Poppins', sans-serif",
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    },
                                    onMouseEnter: (e)=>{
                                        e.currentTarget.style.backgroundColor = '#F5F5F5';
                                        e.currentTarget.style.borderColor = '#787E9D';
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                                        e.currentTarget.style.borderColor = '#DCDEE3';
                                    },
                                    className: "jsx-f08951fac673695",
                                    children: cancelText
                                }, void 0, false, {
                                    fileName: "[project]/components/Dialog.tsx",
                                    lineNumber: 193,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleConfirm,
                                    style: {
                                        padding: '10px 20px',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: typeStyles.iconBg,
                                        color: '#FFFFFF',
                                        fontSize: '14px',
                                        fontWeight: '600',
                                        fontFamily: "'Poppins', sans-serif",
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    },
                                    onMouseEnter: (e)=>{
                                        e.currentTarget.style.opacity = '0.9';
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.opacity = '1';
                                    },
                                    className: "jsx-f08951fac673695",
                                    children: confirmText
                                }, void 0, false, {
                                    fileName: "[project]/components/Dialog.tsx",
                                    lineNumber: 219,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Dialog.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Dialog.tsx",
                    lineNumber: 110,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Dialog.tsx",
                lineNumber: 93,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "f08951fac673695",
                children: "@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes slideUp{0%{opacity:0;transform:translateY(20px)scale(.95)}to{opacity:1;transform:translateY(0)scale(1)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true);
}
}),
"[project]/lib/dialogService.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DialogProvider",
    ()=>DialogProvider,
    "dialogHelpers",
    ()=>dialogHelpers,
    "useDialog",
    ()=>useDialog
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Dialog$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Dialog.tsx [ssr] (ecmascript)");
;
;
;
const DialogContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(undefined);
function DialogProvider({ children }) {
    const [dialogState, setDialogState] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        isOpen: false,
        options: null
    });
    const showDialog = (options)=>{
        setDialogState({
            isOpen: true,
            options
        });
    };
    const hideDialog = ()=>{
        setDialogState({
            isOpen: false,
            options: null
        });
    };
    // Expose dialog functions globally for use outside React components
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DialogContext.Provider, {
        value: {
            showDialog,
            hideDialog
        },
        children: [
            children,
            dialogState.options && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Dialog$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                isOpen: dialogState.isOpen,
                ...dialogState.options,
                onClose: hideDialog
            }, void 0, false, {
                fileName: "[project]/lib/dialogService.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/lib/dialogService.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
}
function useDialog() {
    const context = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(DialogContext);
    if (context === undefined) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
}
const dialogHelpers = {
    success: (message, title)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    },
    error: (message, title)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    },
    info: (message, title)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    },
    warning: (message, title)=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }
};
}),
"[project]/lib/logger.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Global Logger System
 * Intercepts console logs and stores them in localStorage for debugging on mobile devices.
 */ __turbopack_context__.s([
    "globalLogger",
    ()=>globalLogger
]);
const LOG_STORAGE_KEY = 'tfc_console_logs';
const MAX_LOGS = 500; // Keep last 500 logs to prevent storage bloat
class Logger {
    initialized = false;
    originalConsole = {};
    init() {
        if (this.initialized || ("TURBOPACK compile-time value", "undefined") === 'undefined') return;
        //TURBOPACK unreachable
        ;
        const levels = undefined;
    }
    saveLog(level, args) {
        try {
            const message = args.map((arg)=>{
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg, null, 2);
                    } catch (e) {
                        return String(arg);
                    }
                }
                return String(arg);
            }).join(' ');
            const newEntry = {
                id: Math.random().toString(36).substr(2, 9),
                timestamp: new Date().toISOString(),
                level,
                message,
                category: window.location.pathname
            };
            const existingLogs = this.getLogs();
            const updatedLogs = [
                newEntry,
                ...existingLogs
            ].slice(0, MAX_LOGS);
            localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
            // Trigger a custom event so the UI can update in real-time if open
            window.dispatchEvent(new CustomEvent('tfc-new-log', {
                detail: newEntry
            }));
        } catch (e) {
            // Avoid infinite loop if saving fails
            this.originalConsole.error("Failed to save log to localStorage", e);
        }
    }
    getLogs() {
        if ("TURBOPACK compile-time truthy", 1) return [];
        //TURBOPACK unreachable
        ;
    }
    clearLogs() {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
}
const globalLogger = new Logger();
}),
"[project]/lib/networkInterceptors.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Global Network Interceptor
 * Halts all outgoing fetch requests when offline and resumes them automatically
 * once the connection is restored.
 */ __turbopack_context__.s([
    "initNetworkInterceptors",
    ()=>initNetworkInterceptors
]);
function initNetworkInterceptors() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    // Store the original fetch function
    const originalFetch = undefined;
}
}),
"[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("@supabase/supabase-js");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/lib/supabase.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "supabase",
    ()=>supabase,
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/@supabase/supabase-js [external] (@supabase/supabase-js, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://qcglmkmhqvmkugaqvqih.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTA5MTUsImV4cCI6MjA4MjA2NjkxNX0.XRbQNB4sbRgSppMH76ED7OruPYHJgI-xOMLQM7ZT6Lc");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__["createClient"])(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceRoleKey ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f40$supabase$2f$supabase$2d$js__$5b$external$5d$__$2840$supabase$2f$supabase$2d$js$2c$__esm_import$29$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
}) : null;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/lib/bridgeLogger.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Bridge Logger System
 * Manages logs for communication between Web and Native Flutter
 */ __turbopack_context__.s([
    "globalBridgeLogger",
    ()=>globalBridgeLogger
]);
const BRIDGE_LOG_STORAGE_KEY = 'flutter_bridge_logs';
const MAX_BRIDGE_LOGS = 200;
class BridgeLogger {
    addLog(direction, type, payload) {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
    getLogs() {
        if ("TURBOPACK compile-time truthy", 1) return [];
        //TURBOPACK unreachable
        ;
    }
    clearLogs() {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    }
}
const globalBridgeLogger = new BridgeLogger();
}),
"[project]/lib/flutterBridge.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

/**
 * Utility to communicate with Flutter InAppWebView bridge
 */ __turbopack_context__.s([
    "notifyFlutter",
    ()=>notifyFlutter,
    "notifyLoginToFlutter",
    ()=>notifyLoginToFlutter,
    "notifyLogoutToFlutter",
    ()=>notifyLogoutToFlutter,
    "requestDeviceInfoFromFlutter",
    ()=>requestDeviceInfoFromFlutter,
    "sendHeartbeat",
    ()=>sendHeartbeat,
    "syncUserInfoToFlutter",
    ()=>syncUserInfoToFlutter,
    "updateSyncMetaCallStatus",
    ()=>updateSyncMetaCallStatus,
    "updateSyncMetaCallingStatus",
    ()=>updateSyncMetaCallingStatus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/bridgeLogger.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
// Global receiver for Flutter messages to ensure they are logged and dispatched via events
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const notifyFlutter = (type, value)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return false;
};
const notifyLoginToFlutter = ()=>{
    console.log("🚀 [Bridge] Triggering Login Event");
    return notifyFlutter('login', true);
};
const notifyLogoutToFlutter = ()=>{
    console.log("🚀 [Bridge] Triggering Logout Event");
    return notifyFlutter('logout', true);
};
const syncUserInfoToFlutter = (user)=>{
    if (!user) return false;
    // Only proceed if bridge is actually active in the window
    const isBridgeActive = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && !!window.flutter_inappwebview?.callHandler;
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
    // Normalize user data for bridge
    const userInfoPayload = undefined;
};
const requestDeviceInfoFromFlutter = ()=>{
    console.log("🚀 [Bridge] Requesting Device Info");
    return notifyFlutter('request', 'device_info');
};
const updateSyncMetaCallStatus = async (employeeId, type, value)=>{
    if (!employeeId) return;
    // 0. Master Move: If we are on mobile (bridge active), DO NOT update type/value columns.
    // These columns are reserved for remote commands from Desktop to Mobile.
    // Mobile device should only be updated from here via calling_status or native sync.
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        // 1. Fetch current device status to check if it's online
        const { data: device, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('last_seen, status').eq('employee_id', employeeId).eq('is_primary', true).maybeSingle();
        if (fetchError || !device) {
            console.warn("⚠️ [Bridge] Cannot sync status: Primary device not found");
            return;
        }
        // 2. Check if device is actually online (15 second timeout like Header)
        if (device.last_seen) {
            const lastSeen = new Date(device.last_seen).getTime();
            const diffSeconds = (Date.now() - lastSeen) / 1000;
            if (diffSeconds >= 15) {
                console.warn(`⚠️ [Bridge] Device is OFFLINE (${Math.round(diffSeconds)}s ago). Skipping ${type} update.`);
                return;
            }
        } else {
            console.warn("⚠️ [Bridge] Device has never sent a heartbeat. Skipping update.");
            return;
        }
        console.log(`📡 [Bridge] Device is online. Syncing ${type} to DB...`);
        // 3. Perform the update
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
            type: type,
            value: value,
            updated_at: new Date().toISOString()
        }).eq('employee_id', employeeId).eq('is_primary', true).eq('status', 'connected');
        if (error) {
            console.error("❌ [Bridge] SyncMeta update error:", error);
        }
    } catch (err) {
        console.error("❌ [Bridge] SyncMeta connection error:", err);
    }
};
const updateSyncMetaCallingStatus = async (employeeId, callingStatus)=>{
    if (!employeeId) return;
    try {
        console.log(`📡 [Bridge] Syncing calling_status: ${callingStatus} to DB...`);
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
            calling_status: callingStatus,
            updated_at: new Date().toISOString()
        }).eq('employee_id', employeeId).eq('is_primary', true);
        if (error) {
            console.error("❌ [Bridge] SyncMeta calling_status update error:", error);
        }
    } catch (err) {
        console.error("❌ [Bridge] SyncMeta calling_status connection error:", err);
    }
};
const sendHeartbeat = async (employeeId)=>{
    if (!employeeId) return;
    // Retrieve android_id from localStorage (set by Header.tsx)
    const androidId = typeof localStorage !== 'undefined' ? localStorage.getItem('android_id') : null;
    if (!androidId) {
        console.log("⚠️ [Heartbeat] No android_id found, skipping precise heartbeat.");
        return;
    }
    const entryId = `${employeeId}_${androidId}`;
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
            last_seen: new Date().toISOString()
        }).eq('entry_id', entryId).eq('is_primary', true).eq('status', 'connected');
        if (error) console.error("❌ [Heartbeat] Update failed:", error);
    } catch (err) {
        console.error("❌ [Heartbeat] Error:", err);
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/OfflineOverlay.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
/**
 * Global Offline Overlay component
 * Shows a blurred background with an illustration when internet is lost.
 */ const OfflineOverlay = ()=>{
    const [isOffline, setIsOffline] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let intervalId;
        // Check initial state
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        isOffline
    ]);
    if (!isOffline) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            fontFamily: "'Poppins', sans-serif"
        },
        className: "jsx-a5e4536a5fc82684" + " " + "fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-md bg-black/60 transition-all duration-500 p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-a5e4536a5fc82684" + " " + "bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-8 w-full max-w-[400px] text-center shadow-2xl scale-in-center border border-white/20 mx-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-a5e4536a5fc82684" + " " + "mb-6 overflow-hidden rounded-xl md:rounded-2xl h-[160px] md:h-[200px] flex items-center justify-center bg-gray-50",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                            src: "/offline-illustration.png",
                            alt: "Internet Disconnected",
                            onError: (e)=>{
                                // Fallback if image fails
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.parentElement.innerHTML = '<i class="fi fi-rr-wifi-slash text-6xl text-gray-300"></i>';
                            },
                            className: "jsx-a5e4536a5fc82684" + " " + "w-full h-full object-cover animate-pulse"
                        }, void 0, false, {
                            fileName: "[project]/components/OfflineOverlay.tsx",
                            lineNumber: 77,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/OfflineOverlay.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "jsx-a5e4536a5fc82684" + " " + "text-xl md:text-2xl font-bold text-[#263238] mb-2",
                        children: "Oops! Connection Lost"
                    }, void 0, false, {
                        fileName: "[project]/components/OfflineOverlay.tsx",
                        lineNumber: 90,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "jsx-a5e4536a5fc82684" + " " + "text-[#787E9D] text-xs md:text-sm leading-relaxed mb-6",
                        children: "It looks like your internet connection is currently unstable or disconnected. Please check your router or network settings."
                    }, void 0, false, {
                        fileName: "[project]/components/OfflineOverlay.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "jsx-a5e4536a5fc82684" + " " + "flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-a5e4536a5fc82684" + " " + "w-2 h-2 rounded-full bg-red-500 animate-ping"
                            }, void 0, false, {
                                fileName: "[project]/components/OfflineOverlay.tsx",
                                lineNumber: 100,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "jsx-a5e4536a5fc82684" + " " + "text-[10px] md:text-xs font-semibold text-red-500 uppercase tracking-widest",
                                children: "Waiting for network..."
                            }, void 0, false, {
                                fileName: "[project]/components/OfflineOverlay.tsx",
                                lineNumber: 101,
                                columnNumber: 12
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OfflineOverlay.tsx",
                        lineNumber: 99,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/OfflineOverlay.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "a5e4536a5fc82684",
                children: ".scale-in-center.jsx-a5e4536a5fc82684{animation:.5s cubic-bezier(.25,.46,.45,.94) both scale-in-center}@keyframes scale-in-center{0%{opacity:1;transform:scale(0)}to{opacity:1;transform:scale(1)}}"
            }, void 0, false, void 0, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/OfflineOverlay.tsx",
        lineNumber: 71,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const __TURBOPACK__default__export__ = OfflineOverlay;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react/jsx-runtime [external] (react/jsx-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-runtime", () => require("react/jsx-runtime"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/pages-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/pages-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/pages-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/context/UserContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserContext",
    ()=>UserContext,
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
const UserContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])({
    user: null,
    mounted: false,
    loading: true,
    error: null,
    statusMessage: "",
    sessionExpired: false,
    refetchUser: async ()=>{}
});
const useUser = ()=>(0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(UserContext);
}),
"[project]/lib/monitoring.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Sentinel Monitoring - DISABLED
 * This file is kept as an empty shell to avoid breaking existing imports.
 */ __turbopack_context__.s([
    "estimateSize",
    ()=>estimateSize,
    "logSystemEvent",
    ()=>logSystemEvent
]);
const logSystemEvent = async (_log)=>{
    // Monitoring completely disabled by user request.
    return;
};
const estimateSize = (_obj)=>{
    return 0;
};
}),
"[project]/lib/authService.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "checkAuthAndFetchProfile",
    ()=>checkAuthAndFetchProfile,
    "handleLogout",
    ()=>handleLogout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
async function checkAuthAndFetchProfile() {
    try {
        const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
        const authUser = session?.user;
        if (sessionError || !authUser) {
            return {
                user: null,
                error: "No session found",
                shouldRedirect: true
            };
        }
        // Fetch profile from database
        const { data: profileData, error: profileError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("*").eq("user_id", authUser.id).maybeSingle();
        if (profileError) {
            console.error("Error fetching user profile:", profileError);
        }
        const userData = {
            uid: authUser.id,
            displayName: profileData?.user_name || null,
            email: authUser.email || "",
            phone: profileData?.contact_no || null,
            providers: [],
            providerType: null,
            createdAt: authUser.created_at,
            lastSignInAt: authUser.last_sign_in_at || null,
            employeeId: profileData?.employee_id || null,
            role: profileData?.role || null,
            approvalStatus: profileData?.approval_status || null,
            accountStatus: profileData?.status || null,
            status: profileData?.status || null,
            updatedAt: profileData?.updated_at || null,
            profilePicUrl: profileData?.profile_pic_url || profileData?.profile_image || null,
            googleCalendarConnected: profileData?.google_calendar_connected || false,
            googleCalendarSkipped: profileData?.google_calendar_skipped || false,
            isClient: profileData ? profileData.is_client ?? false : undefined,
            isCaller: profileData?.is_caller || false,
            designation: profileData?.designation || null,
            department: profileData?.department || null,
            activeCampaignId: profileData?.active_campaign_id || null,
            activeCustomerId: profileData?.active_customer_id || null,
            profile_complete: profileData?.profile_complete || false,
            statusReason: profileData?.status_reason || null,
            holdStartDate: profileData?.hold_start_date || null,
            holdEndDate: profileData?.hold_end_date || null,
            organization_id: profileData?.organization_id || null
        };
        return {
            user: userData,
            error: null,
            shouldRedirect: false
        };
    } catch (error) {
        console.error("Auth check error:", error);
        return {
            user: null,
            error: error.message || "An error occurred",
            shouldRedirect: true
        };
    }
}
async function handleLogout(router) {
    try {
        console.log("🚀 [Auth] Starting complete logout...");
        // 1. Notify Flutter bridge of logout if available
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // 2. Clear Supabase session on server and client
        const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        if (user) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'AUTH',
                description: `User Logout: ${user.email}`,
                user_id: user.id,
                metadata: {
                    email: user.email
                }
            });
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        console.log("👋 [Auth] Logout complete, redirecting to login...");
        router.replace("/login");
    } catch (err) {
        console.error("❌ [Auth] Logout failure:", err);
        router.replace("/login");
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/hooks/useAuthGuard.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useAuthGuard",
    ()=>useAuthGuard
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authService.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function useAuthGuard() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [statusMessage, setStatusMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("Checking session...");
    const [sessionExpired, setSessionExpired] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const loadingRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    const fetchAuth = async (force = false)=>{
        // Production Pattern: If we already have a user and aren't forcing a refresh, skip the loading screen and call.
        if (!force && user && !loadingRef.current) {
            console.log("🚀 [Auth] User already in memory. Skipping redundant fetch.");
            return;
        }
        if (loadingRef.current) return;
        loadingRef.current = true;
        if (!user) setLoading(true);
        try {
            const isLoginPage = router.pathname === "/login" || router.pathname === "/auth/login" || router.pathname === "/portal/login";
            const isPublicLandingPage = router.pathname === "/home" || router.pathname === "/signup" || router.pathname === "/signup-success" || router.pathname === "/contact" || router.pathname === "/features" || router.pathname === "/pricing" || router.pathname === "/faq";
            const isRootPath = router.pathname === "/";
            setStatusMessage("Verifying active session...");
            const { data: { session: authSession }, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const authUser = authSession?.user;
            if (authUser) {
                setSessionExpired(false);
                // --- ⚡ SESSION PROFILE CACHE (Ghostly Fetch Prevention) ---
                // Keeps the profile in memory for the duration of the tab so we don't hit the DB/API every reload.
                const sessionProfileStr = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                // Fetch/Refresh Profile from DB (Only happens on very first login or when tab is perfectly closed)
                setStatusMessage("Fetching user profile...");
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["checkAuthAndFetchProfile"])();
                if (result.user) {
                    if (!user) setStatusMessage("Finalizing setup...");
                    setUser(result.user);
                    // Store securely in Tab Memory
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    // Logged in: if on login/root, move to dashboard or last path
                    if ((isLoginPage || isRootPath) && !isPublicLandingPage) {
                        if (!user) setStatusMessage("Restoring your screen...");
                        const lastPath = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
                        router.push(lastPath || "/dashboard");
                    }
                } else if (result.shouldRedirect) {
                    setUser(null);
                    if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
                        setStatusMessage("Auth failed. Redirecting...");
                        router.push("/login");
                    }
                }
            } else {
                // Not logged in
                setUser(null);
                if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
                    // If we had a user before, but now we don't, it might be an expiration
                    if (user || ("TURBOPACK compile-time value", "undefined") !== 'undefined' && sessionStorage.getItem('active_user_profile')) {
                        setSessionExpired(true);
                    } else {
                        setStatusMessage("Access denied. Please login...");
                        router.push("/login");
                    }
                }
            }
        } catch (err) {
            console.error("Auth check failed:", err);
            // Clear cache on fatal auth errors
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            setError(err.message || "Authentication error");
        } finally{
            setLoading(false);
            loadingRef.current = false;
        }
    };
    // 1. Initial Auth Setup & Global Listener
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
        fetchAuth(); // Initial Check
        const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange((event, session)=>{
            console.log(`🔐 [Auth Event] ${event}`);
            if (event === 'SIGNED_IN') {
                setSessionExpired(false);
                fetchAuth(true); // Sync data only on explicit login
            } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED' && !session) {
                // Immediate check for session expiry UI
                const isManualLogout = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && localStorage.getItem('manual_logout_intended') === 'true';
                const hasSessionCache = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && !!sessionStorage.getItem('active_user_profile');
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                if (user || hasSessionCache) {
                    console.log("🚫 [Auth Guard] Detected expiry event. Showing UI.");
                    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                    ;
                    setSessionExpired(true);
                    setUser(null);
                } else {
                    setUser(null);
                    router.push("/login");
                }
            }
        });
        // ⚡ PROACTIVE LISTENERS
        // 1. Cross-tab logout detection
        const handleStorageChange = (e)=>{
            if (e.key && e.key.includes('auth-token') && !e.newValue && (user || sessionStorage.getItem('active_user_profile'))) {
                setSessionExpired(true);
                setUser(null);
            }
        };
        // 2. Immediate check on tab focus
        const handleVisibilityChange = ()=>{
            if (document.visibilityState === 'visible' && (user || sessionStorage.getItem('active_user_profile'))) {
                fetchAuth();
            }
        };
        // ⚡ LOCAL-LEVEL HEARTBEAT (Instant LocalStorage Monitor)
        // Every 2 seconds, we check if the Supabase token still exists. 
        // This catches manual deletions or system-level expiries immediately without server round-trips.
        const localHeartbeat = setInterval(()=>{
            if ("TURBOPACK compile-time truthy", 1) return;
            //TURBOPACK unreachable
            ;
            const hasToken = undefined;
            const hasProfile = undefined;
            const isManualLogout = undefined;
        }, 2000);
        return ()=>{
            subscription.unsubscribe();
            window.removeEventListener('storage', handleStorageChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(localHeartbeat);
        };
    }, [
        user,
        router.pathname,
        sessionExpired
    ]);
    // 2. Production Pattern: Pure Route Protection on every navigation
    // This runs when the URL changes but does NOT trigger a heavy fetchAuth unless necessary.
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!mounted || loading || sessionExpired) return;
        const isLoginPage = router.pathname === "/login" || router.pathname === "/portal/login";
        const isPublicLandingPage = [
            "/home",
            "/signup",
            "/signup-success",
            "/contact",
            "/features",
            "/pricing",
            "/faq"
        ].includes(router.pathname);
        const isRootPath = router.pathname === "/";
        if (!user) {
            // Not logged in and trying to access protected page
            if (!isLoginPage && !isPublicLandingPage && !isRootPath) {
                router.push("/login");
            }
        } else {
            // Logged in: Check status for specific redirects
            // If user is on a protected page, enforce status-based routing
            if (!isPublicLandingPage) {
                const status = user.status || user.accountStatus;
                const approvalStatus = user.approvalStatus;
                if (status === 'suspend' || approvalStatus === 'suspend') {
                    if (router.pathname !== '/portal/suspended') {
                        router.push("/portal/suspended");
                    }
                } else if (status === 'hold' || approvalStatus === 'hold') {
                    if (router.pathname !== '/portal/hold') {
                        router.push("/portal/hold");
                    }
                } else if (approvalStatus === 'pending') {
                    if (router.pathname !== '/portal/pending') {
                        router.push("/portal/pending");
                    }
                } else if (approvalStatus === 'rejected') {
                    if (router.pathname !== '/portal/rejected') {
                        router.push("/portal/rejected");
                    }
                } else {
                    // User is fully active/approved
                    // Logged in and trying to access login/root
                    if (isLoginPage || isRootPath) {
                        const lastPath = localStorage.getItem('last_visited_path');
                        router.push(lastPath || "/dashboard");
                    } else {
                        // Save the valid current path
                        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                        ;
                    }
                }
            }
        }
    }, [
        router.pathname,
        router.asPath,
        user?.uid,
        mounted,
        loading,
        sessionExpired
    ]);
    return {
        user,
        loading,
        error,
        mounted,
        statusMessage,
        refetchUser: fetchAuth,
        sessionExpired
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/UserProvider.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "UserProvider",
    ()=>UserProvider
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuthGuard.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function UserProvider({ children }) {
    const { user, loading, error, mounted, statusMessage, refetchUser, sessionExpired } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAuthGuard"])();
    const prevUserRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Bridge Sync Logic (Reliability Pinger for refresh/cold-start)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        let syncInterval;
        const executeSync = undefined;
        // Initial attempt after a small delay
        const timer = undefined;
    }, [
        user?.uid,
        mounted
    ]);
    // Global Bridge Message Listener for Device Info
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const handleMessage = undefined;
    }, []);
    // Native Presence Heartbeat (Portal-side)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!user || !mounted) return;
        const sendHeartbeat = async ()=>{
            try {
                const { supabase } = await __turbopack_context__.A("[project]/lib/supabase.ts [ssr] (ecmascript, async loader)");
                // We use RPC to update our presence in user_profiles
                const { error: hbError } = await supabase.rpc('update_user_presence', {
                    p_on_call: false,
                    p_is_personal: false
                });
                if (hbError) throw hbError;
                console.log("💓 [Presence] Portal heartbeat sent successfully.");
            } catch (err) {
                console.error("❌ [Presence] Portal heartbeat failed:", err);
            }
        };
        // Send immediately on mount/user change
        sendHeartbeat();
        // Repeat every 30 seconds to stay 'ONLINE'
        const interval = setInterval(sendHeartbeat, 30000);
        return ()=>clearInterval(interval);
    }, [
        user?.uid,
        mounted
    ]);
    const contextValue = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>({
            user,
            loading,
            error: error || null,
            mounted,
            statusMessage,
            sessionExpired,
            refetchUser
        }), [
        user,
        loading,
        error,
        mounted,
        statusMessage,
        refetchUser,
        sessionExpired
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["UserContext"].Provider, {
        value: contextValue,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/UserProvider.tsx",
        lineNumber: 134,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/AppLogo.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AppLogo
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function AppLogo({ size = 'default' }) {
    const isSmall = size === 'small';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-start justify-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-start gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: `inline-flex items-center justify-center rounded-full shrink-0 ${isSmall ? 'h-5 w-5' : 'h-[24px] w-[24px] md:h-[22px] md:w-[22px]'}`,
                        style: {
                            background: 'transparent'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: `fi flex mt-2 ml-2 fi-sr-tty-answer ${isSmall ? 'text-base' : 'text-xl md:text-lg'}`,
                            style: {
                                color: '#4b33e8',
                                lineHeight: 1
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/AppLogo.tsx",
                            lineNumber: 21,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AppLogo.tsx",
                        lineNumber: 15,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: `font-[700]  leading-none mt-1.5 ${isSmall ? 'text-xl md:text-xl' : 'text-[26px] md:text-2xl'}`,
                        style: {
                            color: '#4b33e8',
                            fontFamily: "'Roboto', sans-serif"
                        },
                        children: [
                            "Rynx",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    color: '#263238ff'
                                },
                                children: "ly"
                            }, void 0, false, {
                                fileName: "[project]/components/AppLogo.tsx",
                                lineNumber: 43,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                style: {
                                    color: 'rgb(38, 50, 56)',
                                    fontSize: '1.5em',
                                    lineHeight: '0'
                                },
                                children: "."
                            }, void 0, false, {
                                fileName: "[project]/components/AppLogo.tsx",
                                lineNumber: 44,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AppLogo.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppLogo.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            !isSmall && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                className: "text-[10px] font-medium tracking-wide italic mt-[2px] ml-1",
                style: {
                    color: '#787E9D',
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: '0.05em'
                },
                children: "track • call • close"
            }, void 0, false, {
                fileName: "[project]/components/AppLogo.tsx",
                lineNumber: 50,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AppLogo.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/lib/localStorageUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Utility functions for managing user data in localStorage
 */ __turbopack_context__.s([
    "clearStoredUserData",
    ()=>clearStoredUserData,
    "getAllStoredUsers",
    ()=>getAllStoredUsers,
    "getStoredUserData",
    ()=>getStoredUserData,
    "removeStoredUser",
    ()=>removeStoredUser,
    "storeUserData",
    ()=>storeUserData
]);
const STORAGE_KEY = 'tfc_user_data';
const STORAGE_KEY_ARRAY = 'tfc_user_data_array'; // For multiple users
function storeUserData(userData) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function getStoredUserData() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
function getAllStoredUsers() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
}
function removeStoredUser(userId) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function clearStoredUserData() {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
}),
"[project]/config/navigation.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NAV_ITEMS",
    ()=>NAV_ITEMS
]);
const NAV_ITEMS = [
    {
        name: "Dashboard",
        path: "/dashboard",
        icon: "fi-rr-home",
        adminOnly: false
    },
    {
        name: "Users",
        path: "/users",
        icon: "fi-rr-users",
        adminOnly: false
    },
    {
        name: "Customer",
        path: "/customer",
        icon: "fi-rr-users",
        adminOnly: false
    },
    {
        name: "Campaign",
        path: "/campaign",
        icon: "fi-rr-bullhorn",
        adminOnly: false
    },
    {
        name: "Activity",
        path: "/activity",
        icon: "fi-rr-time-past",
        adminOnly: false
    },
    {
        name: "Follow Up",
        path: "/followup",
        icon: "fi-rr-calendar-clock",
        adminOnly: false
    },
    {
        name: "Organization",
        path: "/organization",
        icon: "fi-rr-building",
        adminOnly: false
    },
    {
        name: "Team",
        path: "/team",
        icon: "fi-rr-users-alt",
        adminOnly: false
    },
    {
        name: "Call Sessions",
        path: "/call-sessions",
        icon: "fi-rr-headset",
        adminOnly: true
    }
];
}),
"[project]/components/Sidebar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppLogo.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/localStorageUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$config$2f$navigation$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/config/navigation.ts [ssr] (ecmascript)");
;
;
;
;
;
;
;
const Sidebar = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["memo"])(function Sidebar({ user, activeNav = "dashboard", onNavChange, userRole, isSuperAdmin, onLogout }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Initialize with cached user data for ghost loading immediately
    const [cachedUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return undefined;
        //TURBOPACK unreachable
        ;
        const cached = undefined;
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    // Memoize display user to prevent unnecessary recalculations
    const displayUser = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return mounted ? user || cachedUser : user;
    }, [
        mounted,
        user,
        cachedUser
    ]);
    // Memoize admin status
    const isAdmin = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return userRole === 'admin' || userRole === 'super_admin' || isSuperAdmin === true;
    }, [
        userRole,
        isSuperAdmin
    ]);
    // Stable logout handler
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (isLoggingOut || !onLogout) return;
        setIsLoggingOut(true);
        try {
            onLogout();
        } catch (err) {
            console.error("Logout exception:", err);
            setIsLoggingOut(false);
        }
    }, [
        isLoggingOut,
        onLogout
    ]);
    // Memoize derived UI values
    const initials = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!mounted) return "U";
        if (displayUser?.displayName) {
            return displayUser.displayName.trim().charAt(0).toUpperCase();
        }
        if (displayUser?.email) {
            return displayUser.email.slice(0, 2).toUpperCase();
        }
        return "U";
    }, [
        mounted,
        displayUser
    ]);
    const profilePicUrl = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        // Priority: 1. Props (user), 2. Cached (cachedUser)
        if (user?.profilePicUrl) return user.profilePicUrl;
        return mounted ? cachedUser?.profilePicUrl : null;
    }, [
        mounted,
        user?.profilePicUrl,
        cachedUser?.profilePicUrl
    ]);
    const formattedLastLogin = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const dateString = displayUser?.lastSignInAt;
        if (!dateString) return "Just now";
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    }, [
        displayUser?.lastSignInAt
    ]);
    // Memoize filtered navigation items
    const navItems = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        // Hydration Fix: Ensure strictly empty result on first render to match server HTML (skeletons)
        // We only enable the actual links after the component has mounted on the client.
        if (!mounted) return [];
        // We prioritize the live user object if it exists (from props/auth sync)
        // but fall back to the cachedUser (local storage) immediately to prevent flicker
        const currentUser = user || cachedUser;
        if (!currentUser) return [];
        const isInternalStaff = currentUser.isClient === false;
        const designation = currentUser.designation?.toLowerCase() || '';
        const isAdminState = isAdmin || isInternalStaff;
        const filtered = __TURBOPACK__imported__module__$5b$project$5d2f$config$2f$navigation$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["NAV_ITEMS"].filter((item)=>{
            // 0. Hard Rejection for Call Sessions if NOT global
            if (item.path === '/call-sessions' && isInternalStaff === false) return false;
            // Global User Check for Call Sessions
            if (item.path === '/call-sessions' && isInternalStaff) return true;
            // 1. Admin/Super Admin check
            if (item.adminOnly && !isAdminState) return false;
            // 2. Local Storage Cache: If we have cached tabs, use them for immediate rendering
            if (currentUser.allowed_tabs && currentUser.allowed_tabs.includes(item.path)) {
                return true;
            }
            // 3. Fallback/Fallback Logic (in case cache is empty or new permissions assigned)
            if (isInternalStaff) return true;
            const isClientAdmin = [
                'ceo',
                'developer'
            ].includes(designation);
            if (isClientAdmin) return true;
            const path = item.path;
            // Default to agent if designation is missing or specifically 'agent'
            const isAgent = designation === 'agent' || !designation;
            if (isAgent) {
                return [
                    '/dashboard',
                    '/campaign',
                    '/activity',
                    '/followup',
                    '/customer'
                ].includes(path);
            }
            const isManager = [
                'manager',
                'team_leader'
            ].includes(designation);
            if (isManager) {
                return [
                    '/dashboard',
                    '/campaign',
                    '/activity',
                    '/followup',
                    '/team',
                    '/customer'
                ].includes(path);
            }
            return false;
        });
        return filtered;
    }, [
        isAdmin,
        user,
        cachedUser,
        mounted
    ]);
    // Effect to sync calculated nav items back to cache
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && navItems.length > 0) {
            const { getStoredUserData, storeUserData } = __turbopack_context__.r("[project]/lib/localStorageUtils.ts [ssr] (ecmascript)");
            const currentData = getStoredUserData();
            if (currentData) {
                const newPaths = navItems.map((item)=>item.path);
                // Only update if changed to avoid loops
                if (JSON.stringify(currentData.allowed_tabs) !== JSON.stringify(newPaths)) {
                    storeUserData({
                        ...currentData,
                        allowed_tabs: newPaths
                    });
                }
            }
        }
    }, [
        navItems,
        mounted
    ]);
    const handleNavClick = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((path)=>{
        onNavChange?.(path);
    }, [
        onNavChange
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("aside", {
        className: "hidden lg:flex flex-col w-52 bg-white border-r fixed left-0 top-0 h-screen z-40",
        style: {
            borderColor: "#E0E0E0"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "h-[70px] border-b flex items-center justify-center",
                style: {
                    borderColor: "#E0E0E0"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/components/Sidebar.tsx",
                    lineNumber: 201,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                className: "flex-1 p-3 space-y-1 overflow-y-auto",
                suppressHydrationWarning: true,
                children: navItems.length > 0 ? navItems.map((item)=>{
                    const isOnPath = router.pathname.startsWith(item.path) || router.pathname.startsWith('/portal' + item.path);
                    const isExactDashboard = item.path === '/dashboard' && (router.pathname === '/dashboard' || router.pathname === '/portal/dashboard');
                    const isActive = item.path === '/dashboard' ? isExactDashboard : isOnPath || activeNav === item.path;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: item.path,
                        onClick: ()=>handleNavClick(item.path),
                        className: `flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 relative ${isActive ? "text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`,
                        style: {
                            backgroundColor: isActive ? "#4b33e8" : "transparent"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: `fi ${item.icon} flex text-sm`
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 226,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "font-medium px-1.5 text-sm",
                                style: {
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                children: item.name
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 227,
                                columnNumber: 17
                            }, this)
                        ]
                    }, item.path, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 213,
                        columnNumber: 15
                    }, this);
                }) : // Skeleton Links - Only shown if cache is completely empty
                [
                    1,
                    2,
                    3,
                    4,
                    5
                ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 px-3 py-2 rounded-lg animate-pulse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-5 h-5 rounded bg-gray-100"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 240,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "h-3 w-24 bg-gray-100 rounded"
                            }, void 0, false, {
                                fileName: "[project]/components/Sidebar.tsx",
                                lineNumber: 241,
                                columnNumber: 17
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/components/Sidebar.tsx",
                        lineNumber: 239,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 205,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-3 border-t space-y-2",
                style: {
                    borderColor: "#E0E0E0",
                    backgroundColor: "#FAFAFA"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300",
                    style: {
                        borderColor: "#E0E0E0"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-start gap-2.5 mb-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shrink-0  overflow-hidden",
                                    style: {
                                        background: profilePicUrl ? "transparent" : "#4b33e8"
                                    },
                                    children: mounted && profilePicUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                        src: profilePicUrl,
                                        alt: displayUser?.displayName || 'User',
                                        className: "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 261,
                                        columnNumber: 17
                                    }, this) : initials
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 254,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold truncate mb-0.5",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: mounted ? displayUser?.displayName || displayUser?.email?.split("@")[0] || "User" : "User"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xs truncate",
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: mounted ? displayUser?.email || "user@example.com" : "user@example.com"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 277,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 270,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 253,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5 mb-3 pt-2 border-t",
                            style: {
                                borderColor: "#E0E0E0"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Employee ID:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 288,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: mounted ? displayUser?.employeeId || "Not assigned" : "Not assigned"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 291,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 287,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between text-xs",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: "Last Login:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 299,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "font-medium",
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            children: formattedLastLogin
                                        }, void 0, false, {
                                            fileName: "[project]/components/Sidebar.tsx",
                                            lineNumber: 302,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 298,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 286,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>router.push('/settings'),
                                    className: "w-8 h-8 text-xs border rounded-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed",
                                    style: {
                                        borderColor: "#DCDEE3",
                                        backgroundColor: "#FFFFFF",
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    onMouseEnter: (e)=>{
                                        e.currentTarget.style.borderColor = "#4b33e8";
                                        e.currentTarget.style.backgroundColor = "#EEF2FF";
                                        e.currentTarget.style.color = "#4b33e8";
                                    },
                                    onMouseLeave: (e)=>{
                                        e.currentTarget.style.borderColor = "#DCDEE3";
                                        e.currentTarget.style.backgroundColor = "#FFFFFF";
                                        e.currentTarget.style.color = "#263238";
                                    },
                                    title: "Settings",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-settings text-sm"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 333,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 312,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleLogout,
                                    disabled: isLoggingOut,
                                    className: "flex-1 h-8 text-xs border rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed",
                                    style: {
                                        borderColor: "#DCDEE3",
                                        backgroundColor: "#FFFFFF",
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    onMouseEnter: (e)=>{
                                        if (!isLoggingOut) {
                                            e.currentTarget.style.borderColor = "#EF4444";
                                            e.currentTarget.style.backgroundColor = "#FEE2E2";
                                            e.currentTarget.style.color = "#EF4444";
                                        }
                                    },
                                    onMouseLeave: (e)=>{
                                        if (!isLoggingOut) {
                                            e.currentTarget.style.borderColor = "#DCDEE3";
                                            e.currentTarget.style.backgroundColor = "#FFFFFF";
                                            e.currentTarget.style.color = "#263238";
                                        }
                                    },
                                    children: isLoggingOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-4 h-4 border-2 border-t-transparent border-current rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Sidebar.tsx",
                                        lineNumber: 361,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex px-1 fi-rr-exit text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 364,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: "Logout"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Sidebar.tsx",
                                                lineNumber: 365,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true)
                                }, void 0, false, {
                                    fileName: "[project]/components/Sidebar.tsx",
                                    lineNumber: 335,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Sidebar.tsx",
                            lineNumber: 311,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Sidebar.tsx",
                    lineNumber: 249,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Sidebar.tsx",
                lineNumber: 248,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/Sidebar.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, this);
});
const __TURBOPACK__default__export__ = Sidebar;
}),
"[project]/lib/dialogUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Dialog utility functions to replace console messages with dialog boxes
 */ __turbopack_context__.s([
    "replaceConsoleWithDialog",
    ()=>replaceConsoleWithDialog,
    "showDialog",
    ()=>showDialog,
    "showError",
    ()=>showError,
    "showInfo",
    ()=>showInfo,
    "showSuccess",
    ()=>showSuccess,
    "showWarning",
    ()=>showWarning
]);
const showDialog = (message, type = 'info', title)=>{
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    else {
        // Fallback to console if dialog is not available
        console[type === 'error' ? 'error' : type === 'warning' ? 'warn' : 'log'](message);
    }
};
const showSuccess = (message, title)=>{
    showDialog(message, 'success', title);
};
const showError = (message, title)=>{
    showDialog(message, 'error', title);
};
const showInfo = (message, title)=>{
    showDialog(message, 'info', title);
};
const showWarning = (message, title)=>{
    showDialog(message, 'warning', title);
};
const replaceConsoleWithDialog = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
    const originalConsole = undefined;
// Optionally replace console.log (not recommended, too verbose)
// Uncomment if you want to replace console.log as well
/*
  console.log = (...args: any[]) => {
    originalConsole.log(...args);
    const message = args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
    ).join(' ');
    showInfo(message, 'Information');
  };
  */ };
}),
"[project]/components/Header.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.js [ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell-ring.js [ssr] (ecmascript) <export default as BellRing>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/info.js [ssr] (ecmascript) <export default as Info>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.js [ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/localStorageUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/flutterBridge.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dialogUtils.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
function HeaderComponent({ user, onLogout, hideSidebar = false }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [serverStatus, setServerStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('online');
    const [showFullStatus, setShowFullStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [deviceStatus, setDeviceStatus] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isBridgeActive, setIsBridgeActive] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isLoggingOut, setIsLoggingOut] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [localEntryId, setLocalEntryId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [tick, setTick] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const lastProcessedRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const lastSentCommandRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const isOnCallRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    // Notification States
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showNotifications, setShowNotifications] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [unreadCount, setUnreadCount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    // Initialize with cached data, then update with props if different (ghost update)
    const [cachedUser, setCachedUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return undefined; // SSR safety
        //TURBOPACK unreachable
        ;
        const cached = undefined;
    });
    // Use cached user for display (prevents "User / Not assigned" flicker)
    // Memoize displayUser to prevent recalculation on every render
    const displayUser = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return mounted ? user || cachedUser : user;
    }, [
        mounted,
        user,
        cachedUser
    ]);
    const initials = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!mounted) return "U"; // Return default during SSR to prevent hydration mismatch
        if (displayUser?.displayName) {
            return displayUser.displayName.trim().charAt(0).toUpperCase();
        }
        if (displayUser?.email) {
            return displayUser.email.slice(0, 2).toUpperCase();
        }
        return "U";
    }, [
        mounted,
        displayUser
    ]);
    // Only use profilePicUrl after mount to prevent hydration mismatch
    const profilePicUrl = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        // Priority: 1. Props (user), 2. Cached (cachedUser)
        // DEBUG LOG
        // if (user?.profilePicUrl) console.log('Header: Using Prop Pic', user.profilePicUrl);
        // else if (cachedUser?.profilePicUrl) console.log('Header: Using Cached Pic', cachedUser.profilePicUrl);
        // else console.log('Header: No Pic Found', { user: user, cached: cachedUser });
        if (user?.profilePicUrl) return user.profilePicUrl;
        return mounted ? cachedUser?.profilePicUrl : null;
    }, [
        mounted,
        user?.profilePicUrl,
        cachedUser?.profilePicUrl
    ]);
    // Set mounted and check for Flutter Bridge
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        else {
            // Fallback for non-bridge (desktop) - read from storage if exists
            const savedEntryId = localStorage.getItem('entry_id');
            if (savedEntryId) setLocalEntryId(savedEntryId);
        }
    }, [
        displayUser?.employeeId
    ]);
    // Fetch and Subscribe to Device Status
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!mounted || !displayUser?.employeeId) return;
        const fetchPrimaryStatus = async ()=>{
            // Fetch specifically by localEntryId if we have it, else fallback to primary discover
            const query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('id, entry_id, on_call, device_model, android_id, status, is_primary, last_seen');
            let finalResult;
            if (localEntryId) {
                finalResult = await query.eq('entry_id', localEntryId).maybeSingle();
            } else {
                finalResult = await query.eq('employee_id', displayUser.employeeId).eq('is_primary', true).maybeSingle();
            }
            const { data: device, error } = finalResult;
            if (error) {
                console.error("Error fetching primary device:", error);
                return;
            }
            if (device) {
                setDeviceStatus({
                    on_call: device.on_call || false,
                    device_model: device.device_model || 'Unknown Device',
                    android_id: device.android_id || 'N/A',
                    last_seen: device.last_seen
                });
                isOnCallRef.current = device.on_call || false;
            } else {
                setDeviceStatus(null);
                isOnCallRef.current = false;
            }
        };
        // Initial fetch
        fetchPrimaryStatus();
        // --- REFACTORED: NO REALTIME SUBSCRIPTION (Saves 100% Messaging Quota) ---
        // Instead, we use a 5s polling loop for absolute responsiveness (REST API - Free Quota)
        const interval = setInterval(fetchPrimaryStatus, 5000);
        return ()=>{
            clearInterval(interval);
        };
    }, [
        mounted,
        displayUser?.employeeId,
        isBridgeActive,
        localEntryId
    ]);
    // SENDER: Heartbeat Loop (Only if bridge is active)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const empId = displayUser?.employeeId;
        if (!isBridgeActive || !empId) return;
        // Send initial heartbeat
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sendHeartbeat"])(empId);
        // Set up interval for every 30 seconds (Increased from 10s to save 66% messaging quota)
        const interval = setInterval(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["sendHeartbeat"])(empId);
        }, 30000);
        return ()=>clearInterval(interval);
    }, [
        isBridgeActive,
        displayUser?.employeeId
    ]);
    // Ticker: Force re-render periodically to update "ago" time and offline status
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>{
            setTick((t)=>t + 1);
        }, 5000); // Check every 5 seconds
        return ()=>clearInterval(interval);
    }, []);
    // Logic: Check if device is actually online based on last_seen
    const deviceOnlineStatus = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if (!deviceStatus?.last_seen) return 'offline';
        const lastSeen = new Date(deviceStatus.last_seen).getTime();
        const now = Date.now();
        const diffSeconds = (now - lastSeen) / 1000;
        // Mark offline if no heartbeat for 20 seconds (Stable for 5s polling)
        return diffSeconds < 20 ? 'online' : 'offline';
    }, [
        deviceStatus?.last_seen,
        tick
    ]);
    // Ghost update: Only update if props actually changed
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (user) {
            setCachedUser((prev)=>{
                // ... (existing code)
                if (!prev) return user;
                const hasChanged = prev.displayName !== user.displayName || prev.employeeId !== user.employeeId || prev.email !== user.email || prev.profilePicUrl !== user.profilePicUrl || prev.uid !== user.uid;
                if (hasChanged) return user;
                return prev;
            });
        }
    }, [
        user?.displayName,
        user?.employeeId,
        user?.email,
        user?.profilePicUrl,
        user?.uid
    ]);
    // Real-time Notification Listener
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let currentUid = displayUser?.uid;
        // Fallback: If UID is still missing, try to get it from active auth session
        const syncNotificationChannel = async ()=>{
            if (!mounted) return;
            let activeUid = currentUid;
            if (!activeUid) {
                const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (session?.user?.id) {
                    activeUid = session.user.id;
                    console.log("🔑 [Header] Recovered UID from session:", activeUid);
                }
            }
            if (!activeUid) return;
            // 1. Initial Fetch
            const fetchNotifications = async ()=>{
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('notifications').select('*').eq('user_id', activeUid).order('created_at', {
                    ascending: false
                }).limit(20);
                if (!error && data) {
                    setNotifications(data);
                    setUnreadCount(data.filter((n)=>!n.is_seen).length);
                }
            };
            fetchNotifications();
            const channelName = `agent_notifications_${activeUid}`;
            console.log(`📡 [Header] Monitoring notifications: ${channelName}`);
            // 2. Real-time Subscription (Full Sync: Insert, Update, Delete)
            const channel = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].channel(channelName).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'notifications',
                filter: `user_id=eq.${activeUid}`
            }, (payload)=>{
                console.log(`🔔 [Header] Realtime Database ${payload.eventType}:`, payload);
                if (payload.eventType === 'INSERT') {
                    setNotifications((prev)=>[
                            payload.new,
                            ...prev
                        ].slice(0, 20));
                    setUnreadCount((c)=>c + 1);
                    if (payload.new.type === 'lead_access') {
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showWarning"])(payload.new.message, "Lead Access Alert");
                    }
                } else if (payload.eventType === 'UPDATE') {
                    setNotifications((prev)=>prev.map((n)=>n.id === payload.new.id ? payload.new : n));
                    if (payload.old && !payload.old.is_seen && payload.new.is_seen) {
                        setUnreadCount((c)=>Math.max(0, c - 1));
                    } else if (payload.old && payload.old.is_seen && !payload.new.is_seen) {
                        setUnreadCount((c)=>c + 1);
                    }
                } else if (payload.eventType === 'DELETE') {
                    setNotifications((prev)=>{
                        const deletedItem = prev.find((n)=>n.id === payload.old.id);
                        if (deletedItem && !deletedItem.is_seen) setUnreadCount((c)=>Math.max(0, c - 1));
                        return prev.filter((n)=>n.id !== payload.old.id);
                    });
                }
            }).subscribe();
            return channel;
        };
        const channelPromise = syncNotificationChannel();
        return ()=>{
            channelPromise.then((channel)=>{
                if (channel) __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
            });
        };
    }, [
        mounted,
        displayUser?.uid
    ]);
    const markAsSeen = async (id)=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) return;
            const idStr = id ? String(id) : null;
            // Optimistic UI update
            if (idStr && idStr.startsWith('temp_')) {
                setNotifications((prev)=>prev.map((n)=>String(n.id) === idStr ? {
                            ...n,
                            is_seen: true
                        } : n));
                setUnreadCount((c)=>Math.max(0, c - 1));
                return;
            }
            const response = await fetch('/api/notifications/mark-as-seen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    id: id,
                    markAll: !id
                })
            });
            const result = await response.json();
            if (result.success) {
                if (id) {
                    setNotifications((prev)=>prev.map((n)=>String(n.id) === idStr ? {
                                ...n,
                                is_seen: true
                            } : n));
                    setUnreadCount((c)=>Math.max(0, c - 1));
                } else {
                    setNotifications((prev)=>prev.map((n)=>({
                                ...n,
                                is_seen: true
                            })));
                    setUnreadCount(0);
                }
                console.log("✅ [Header] Mark as seen success via API");
            }
        } catch (err) {
            console.error("❌ [Header] Failed to mark as seen:", err);
        }
    };
    const deleteNotification = async (id)=>{
        const idStr = String(id);
        console.log(`🗑️ [Header] Deleting notification ${idStr} via API`);
        // 1. UI update (Optimistic)
        setNotifications((prev)=>{
            const item = prev.find((n)=>String(n.id) === idStr);
            if (item && !item.is_seen) setUnreadCount((c)=>Math.max(0, c - 1));
            return prev.filter((n)=>String(n.id) !== idStr);
        });
        // 2. DB update (API Call)
        if (!idStr.startsWith('temp_')) {
            try {
                const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (!session) return;
                const response = await fetch('/api/notifications/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session.access_token}`
                    },
                    body: JSON.stringify({
                        id: id
                    })
                });
                const result = await response.json();
                if (result.success) {
                    console.log(`✅ [Header] DB Delete Success. Rows affected: ${result.deletedCount}`);
                } else {
                    console.error("❌ [Header] API Delete Error:", result.error);
                }
            } catch (err) {
                console.error("❌ [Header] Fatal Delete Exception:", err);
            }
        }
    };
    // Stable logout handler
    const handleLogout = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (isLoggingOut || !onLogout) return;
        setIsLoggingOut(true);
        try {
            onLogout();
        } catch (err) {
            console.error("Logout exception:", err);
            setIsLoggingOut(false);
        }
    }, [
        isLoggingOut,
        onLogout
    ]);
    // Mobile header design
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                style: {
                    borderColor: "#E0E0E0",
                    backgroundColor: "rgba(255, 255, 255, 0.8)"
                },
                className: "jsx-85a9f6e6ef799593" + " " + "lg:hidden border-b fixed top-0 left-0 right-0 z-50 backdrop-blur-sm",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "jsx-85a9f6e6ef799593" + " " + "px-4 py-3 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>router.push("/settings"),
                            style: {
                                background: profilePicUrl ? "transparent" : "#4b33e8"
                            },
                            "aria-label": "Open Settings",
                            className: "jsx-85a9f6e6ef799593" + " " + "w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-base shrink-0 transition-colors cursor-pointer overflow-hidden",
                            children: mounted && profilePicUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                src: profilePicUrl,
                                alt: mounted ? displayUser?.displayName || 'User' : 'User',
                                className: "jsx-85a9f6e6ef799593" + " " + "w-full h-full object-cover"
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 472,
                                columnNumber: 15
                            }, this) : initials
                        }, void 0, false, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 463,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-85a9f6e6ef799593" + " " + "flex-1 flex flex-col items-center justify-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    style: {
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    className: "jsx-85a9f6e6ef799593" + " " + "text-base font-bold leading-tight",
                                    children: mounted ? displayUser?.displayName || displayUser?.email?.split("@")[0] || "User" : "User"
                                }, void 0, false, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 484,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    style: {
                                        color: "#787E9D",
                                        fontFamily: "'Roboto', sans-serif"
                                    },
                                    className: "jsx-85a9f6e6ef799593" + " " + "text-xs leading-tight",
                                    children: mounted ? displayUser?.email?.split("@")[0] || "User" : "User"
                                }, void 0, false, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 490,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 483,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-2 shrink-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "relative",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowNotifications(!showNotifications),
                                        className: "jsx-85a9f6e6ef799593" + " " + "p-2 rounded-xl bg-gray-50/80 hover:bg-gray-100 transition-all active:scale-95 text-gray-600 relative overflow-visible",
                                        children: unreadCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__["BellRing"], {
                                                    className: "w-5 h-5 text-indigo-600 animate-[bell_2s_infinite]"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 508,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white",
                                                    children: unreadCount
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 509,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                            className: "w-5 h-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 514,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Header.tsx",
                                        lineNumber: 502,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 501,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleLogout,
                                    disabled: isLoggingOut,
                                    "aria-label": "Logout",
                                    className: "jsx-85a9f6e6ef799593" + " " + "p-2 rounded-xl bg-red-50/50 hover:bg-red-100 transition-all text-[#EF4444] disabled:opacity-50",
                                    children: isLoggingOut ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a9f6e6ef799593" + " " + "w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Header.tsx",
                                        lineNumber: 526,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "jsx-85a9f6e6ef799593" + " " + "fi flex fi-rr-exit text-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Header.tsx",
                                        lineNumber: 528,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 519,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 499,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Header.tsx",
                    lineNumber: 461,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Header.tsx",
                lineNumber: 457,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                style: {
                    borderColor: "#E0E0E0",
                    left: hideSidebar ? "0" : "208px",
                    width: hideSidebar ? "100%" : "calc(100% - 208px)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)"
                },
                className: "jsx-85a9f6e6ef799593" + " " + "hidden lg:block border-b fixed top-0 z-50 backdrop-blur-sm h-[70px]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "jsx-85a9f6e6ef799593" + " " + "w-full h-full px-6 flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-2.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    style: {
                                        background: profilePicUrl ? "transparent" : "#4b33e8"
                                    },
                                    className: "jsx-85a9f6e6ef799593" + " " + "w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs shrink-0 overflow-hidden",
                                    children: mounted && profilePicUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                        src: profilePicUrl,
                                        alt: mounted ? displayUser?.displayName || 'User' : 'User',
                                        onError: (e)=>{
                                            console.error("Image Failed to Load", profilePicUrl);
                                            e.currentTarget.style.display = 'none'; // Hide broken image
                                        },
                                        className: "jsx-85a9f6e6ef799593" + " " + "w-full h-full object-cover"
                                    }, void 0, false, {
                                        fileName: "[project]/components/Header.tsx",
                                        lineNumber: 555,
                                        columnNumber: 17
                                    }, this) : initials
                                }, void 0, false, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 548,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#263238",
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            className: "jsx-85a9f6e6ef799593" + " " + "text-sm font-semibold truncate",
                                            children: mounted ? displayUser?.displayName || displayUser?.email?.split("@")[0] || "User" : "User"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 569,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            style: {
                                                color: "#787E9D",
                                                fontFamily: "'Roboto', sans-serif"
                                            },
                                            className: "jsx-85a9f6e6ef799593" + " " + "text-xs truncate",
                                            children: [
                                                "Employee ID: ",
                                                mounted ? displayUser?.employeeId || "Not assigned" : "Not assigned"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 575,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 568,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 547,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-3 lg:gap-3 shrink-0 ml-auto",
                            children: [
                                deviceStatus && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-3 px-3 py-1.5 bg-gray-50/50 rounded-xl border border-gray-200/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a9f6e6ef799593" + " " + `w-8 h-8 rounded-xl flex items-center justify-center ${deviceOnlineStatus === 'offline' ? 'bg-gray-100 text-gray-400' : deviceStatus.on_call ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "jsx-85a9f6e6ef799593" + " " + `fi flex ${deviceOnlineStatus === 'online' && deviceStatus.on_call ? 'fi-rr-phone-call animate-pulse' : 'fi-rr-smartphone'} text-sm`
                                            }, void 0, false, {
                                                fileName: "[project]/components/Header.tsx",
                                                lineNumber: 594,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 589,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a9f6e6ef799593" + " " + "flex flex-col",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1",
                                                    children: deviceStatus.device_model
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 601,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-1.5",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-85a9f6e6ef799593" + " " + `w-1 h-1 rounded-full ${deviceOnlineStatus === 'online' ? deviceStatus.on_call ? 'bg-amber-500' : 'bg-emerald-500' : 'bg-gray-400'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Header.tsx",
                                                            lineNumber: 605,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "jsx-85a9f6e6ef799593" + " " + "text-[11px] font-bold text-gray-700 leading-none",
                                                            children: deviceOnlineStatus === 'online' ? deviceStatus.on_call ? 'In Call' : 'Online' : 'Offline'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Header.tsx",
                                                            lineNumber: 610,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 604,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 600,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 588,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "relative",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowNotifications(!showNotifications),
                                        className: "jsx-85a9f6e6ef799593" + " " + "p-3 rounded-xl  bg-gray-50/50 rounded-xl border border-gray-200/50 hover:bg-gray-100 transition-all active:scale-95 text-gray-600 group relative",
                                        children: unreadCount > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2d$ring$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__BellRing$3e$__["BellRing"], {
                                                    className: "w-5 h-5 text-indigo-600 animate-[bell_2s_infinite]"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 631,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "absolute top-1 right-1 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-transform active:scale-110",
                                                    children: unreadCount > 20 ? '20+' : unreadCount
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 632,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                            className: "w-5 h-5 group-hover:rotate-12 transition-transform"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 637,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/Header.tsx",
                                        lineNumber: 625,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 624,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/Header.tsx",
                            lineNumber: 585,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/Header.tsx",
                    lineNumber: 545,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/Header.tsx",
                lineNumber: 536,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "85a9f6e6ef799593",
                children: "@keyframes bell{0%,to{transform:rotate(0)}10%,30%,50%,70%,90%{transform:rotate(-10deg)}20%,40%,60%,80%{transform:rotate(10deg)}}"
            }, void 0, false, void 0, this),
            showNotifications && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        onClick: ()=>setShowNotifications(false),
                        className: "jsx-85a9f6e6ef799593" + " " + "fixed inset-0 z-40 bg-black/5"
                    }, void 0, false, {
                        fileName: "[project]/components/Header.tsx",
                        lineNumber: 656,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            fontFamily: "'Poppins', sans-serif"
                        },
                        className: "jsx-85a9f6e6ef799593" + " " + "fixed top-20 right-4 lg:right-6 w-[calc(100vw-32px)] sm:w-80 md:w-96 z-50 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh] transition-all animate-in fade-in slide-in-from-top-4 duration-300",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-85a9f6e6ef799593" + " " + "px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a9f6e6ef799593",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "jsx-85a9f6e6ef799593" + " " + "text-base font-bold text-gray-900 leading-none",
                                                children: "Notifications"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Header.tsx",
                                                lineNumber: 668,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "jsx-85a9f6e6ef799593" + " " + "text-[11px] text-gray-500 mt-1",
                                                children: [
                                                    "You have ",
                                                    unreadCount,
                                                    " unread messages"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/Header.tsx",
                                                lineNumber: 669,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Header.tsx",
                                        lineNumber: 667,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-85a9f6e6ef799593" + " " + "flex items-center gap-2",
                                        children: [
                                            unreadCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>markAsSeen(),
                                                title: "Mark all as read",
                                                className: "jsx-85a9f6e6ef799593" + " " + "p-2 rounded-lg hover:bg-white hover:shadow-sm text-indigo-600 transition-all active:scale-95",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 678,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/Header.tsx",
                                                lineNumber: 673,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setShowNotifications(false),
                                                className: "jsx-85a9f6e6ef799593" + " " + "p-2 rounded-lg hover:bg-white hover:shadow-sm text-gray-400 hover:text-gray-600 transition-all active:scale-95",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 685,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/Header.tsx",
                                                lineNumber: 681,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/Header.tsx",
                                        lineNumber: 671,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 666,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-85a9f6e6ef799593" + " " + "flex-1 overflow-y-auto bg-white",
                                children: notifications.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "divide-y divide-gray-50",
                                    children: notifications.map((notif)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a9f6e6ef799593" + " " + `px-6 py-4 flex gap-4 transition-colors relative group ${notif.is_seen ? 'opacity-80' : 'bg-indigo-50/30'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + `w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${notif.type === 'lead_access' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`,
                                                    children: notif.type === 'lead_access' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Header.tsx",
                                                        lineNumber: 703,
                                                        columnNumber: 57
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$info$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Info$3e$__["Info"], {
                                                        className: "w-5 h-5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/Header.tsx",
                                                        lineNumber: 703,
                                                        columnNumber: 97
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 700,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "flex-1 min-w-0",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-85a9f6e6ef799593" + " " + "flex items-center justify-between gap-2 mb-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-85a9f6e6ef799593" + " " + "text-[10px] font-black uppercase tracking-wider text-gray-400",
                                                                    children: notif.type.replace('_', ' ')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/Header.tsx",
                                                                    lineNumber: 708,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "jsx-85a9f6e6ef799593" + " " + "text-[10px] text-gray-400",
                                                                    children: new Date(notif.created_at).toLocaleTimeString([], {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/Header.tsx",
                                                                    lineNumber: 711,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/Header.tsx",
                                                            lineNumber: 707,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "jsx-85a9f6e6ef799593" + " " + `text-sm leading-relaxed ${notif.is_seen ? 'text-gray-500' : 'text-gray-800 font-medium'}`,
                                                            children: notif.message
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Header.tsx",
                                                            lineNumber: 715,
                                                            columnNumber: 25
                                                        }, this),
                                                        notif.metadata?.employee_id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-85a9f6e6ef799593" + " " + "mt-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200",
                                                            children: [
                                                                "ID: ",
                                                                notif.metadata.employee_id
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/Header.tsx",
                                                            lineNumber: 719,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 706,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-85a9f6e6ef799593" + " " + "flex flex-col gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity",
                                                    children: [
                                                        !notif.is_seen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                markAsSeen(notif.id);
                                                            },
                                                            className: "jsx-85a9f6e6ef799593" + " " + "p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-indigo-600 hover:bg-slate-50",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Header.tsx",
                                                                lineNumber: 735,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Header.tsx",
                                                            lineNumber: 728,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: (e)=>{
                                                                e.stopPropagation();
                                                                deleteNotification(notif.id);
                                                            },
                                                            className: "jsx-85a9f6e6ef799593" + " " + "p-1.5 bg-white shadow-sm border border-gray-100 rounded-lg text-red-500 hover:bg-slate-50",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                className: "w-3 h-3"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/Header.tsx",
                                                                lineNumber: 745,
                                                                columnNumber: 27
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/Header.tsx",
                                                            lineNumber: 738,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/Header.tsx",
                                                    lineNumber: 726,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, notif.id, true, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 695,
                                            columnNumber: 21
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 693,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "jsx-85a9f6e6ef799593" + " " + "px-6 py-12 flex flex-col items-center justify-center text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-85a9f6e6ef799593" + " " + "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                                                className: "w-8 h-8 text-gray-300"
                                            }, void 0, false, {
                                                fileName: "[project]/components/Header.tsx",
                                                lineNumber: 754,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 753,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                            className: "jsx-85a9f6e6ef799593" + " " + "text-sm font-bold text-gray-900 mb-1 caps",
                                            children: "No Notifications Yet"
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 756,
                                            columnNumber: 20
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "jsx-85a9f6e6ef799593" + " " + "text-xs text-gray-500",
                                            children: "We'll notify you when something important happens."
                                        }, void 0, false, {
                                            fileName: "[project]/components/Header.tsx",
                                            lineNumber: 757,
                                            columnNumber: 20
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 752,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 691,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-85a9f6e6ef799593" + " " + "p-4 bg-gray-50/50 border-t border-gray-100",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowNotifications(false),
                                    className: "jsx-85a9f6e6ef799593" + " " + "w-full py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all active:scale-[0.98]",
                                    children: "Close Panel"
                                }, void 0, false, {
                                    fileName: "[project]/components/Header.tsx",
                                    lineNumber: 764,
                                    columnNumber: 16
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/Header.tsx",
                                lineNumber: 763,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/Header.tsx",
                        lineNumber: 661,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true);
}
const Header = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["memo"])(HeaderComponent);
const __TURBOPACK__default__export__ = Header;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/BottomNav.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
const BottomNav = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["memo"])(function BottomNav({ activeNav, userRole, isSuperAdmin, isClient, designation, employeeId }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [isVisible, setIsVisible] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [lastScrollY, setLastScrollY] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [scrollTimer, setScrollTimer] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [hideTimer, setHideTimer] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Directly use props - AppLayout guarantees them
    // We don't need local state for role since it's passed down
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    // Check if user is admin or super_admin
    const isAdmin = mounted && (userRole === "admin" || userRole === "super_admin" || isSuperAdmin === true);
    const allNavItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "fi-rr-home",
            path: "/dashboard",
            adminOnly: false
        },
        {
            id: "users",
            label: "Users",
            icon: "fi-rr-users",
            path: "/users",
            adminOnly: true
        },
        {
            id: "customer",
            label: "Customer",
            icon: "fi-rr-user-add",
            path: "/customer",
            adminOnly: false
        },
        {
            id: "campaign",
            label: "Campaign",
            icon: "fi-rr-bullhorn",
            path: "/campaign",
            adminOnly: false
        },
        {
            id: "activity",
            label: "Activity",
            icon: "fi-rr-time-past",
            path: "/activity",
            adminOnly: false
        },
        {
            id: "followup",
            label: "Follow Up",
            icon: "fi-rr-calendar-clock",
            path: "/followup",
            adminOnly: false
        },
        {
            id: "call-sessions",
            label: "Call Sessions",
            icon: "fi-rr-headset",
            path: "/call-sessions",
            adminOnly: true
        }
    ];
    // Filter nav items based on admin status and client designation
    const navItems = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        // Visibility logic for User and Org Pages (Strict: Hidden by default until mounted and verified)
        const allowedDesignations = [
            'manager',
            'team_leader',
            'ceo',
            'developer'
        ];
        const currentDesignation = designation?.toLowerCase() || '';
        const isUserPageVisible = mounted && (isClient === false || isClient === true && [
            'ceo',
            'developer'
        ].includes(currentDesignation));
        const isOrgVisible = mounted && (isClient === false || isClient === true && designation?.toLowerCase() === 'ceo');
        const isTeamPageVisible = mounted && (isClient === false || isClient === true && [
            'manager',
            'team_leader',
            'ceo',
            'developer'
        ].includes(currentDesignation));
        const isAdminState = mounted && isAdmin;
        const isSpecialUser = employeeId === 'NXUS-001';
        return allNavItems.filter((item)=>{
            // 0. Hard Rejection for Call Sessions if NOT global
            if (item.id === 'call-sessions' && isClient !== false) return false;
            // Special override for Call Sessions for Global Users
            if (item.id === 'call-sessions' && isClient === false) return true;
            // Admin check
            if (item.adminOnly && !isAdminState) return false;
            // User page visibility check
            if (item.id === 'users' && !isUserPageVisible) return false;
            // Org page visibility check
            if (item.id === 'organization' && !isOrgVisible) return false;
            // Team page visibility check
            if (item.id === 'team' && !isTeamPageVisible) return false;
            return true;
        });
    }, [
        mounted,
        isAdmin,
        isClient,
        designation,
        employeeId,
        allNavItems
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleScroll = ()=>{
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                // Scrolling down
                setIsVisible(false);
            } else {
                // Scrolling up
                setIsVisible(true);
            }
            setLastScrollY(currentScrollY);
            // Clear existing timers
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            if (hideTimer) {
                clearTimeout(hideTimer);
            }
            // Set timer to detect scroll stop (3 seconds)
            const newScrollTimer = setTimeout(()=>{
                // Show navbar after 3 seconds of no scrolling
                setIsVisible(true);
                // Hide navbar after 6 more seconds
                const newHideTimer = setTimeout(()=>{
                    setIsVisible(false);
                }, 6000);
                setHideTimer(newHideTimer);
            }, 3000);
            setScrollTimer(newScrollTimer);
        };
        window.addEventListener("scroll", handleScroll, {
            passive: true
        });
        return ()=>{
            window.removeEventListener("scroll", handleScroll);
            if (scrollTimer) clearTimeout(scrollTimer);
            if (hideTimer) clearTimeout(hideTimer);
        };
    }, [
        lastScrollY,
        scrollTimer,
        hideTimer
    ]);
    const handleNavClick = (path)=>{
        router.push(path);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: `lg:hidden fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-in-out ${isVisible ? "bottom-8" : "-bottom-24"}`,
        style: {
            width: "90%",
            maxWidth: "400px"
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "backdrop-blur-sm bg-white/80 shadow-2xl rounded-2xl",
            style: {
                border: "1.5px solid white"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "px-4 py-2.5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-around gap-2",
                    children: navItems.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>handleNavClick(item.path),
                            className: `flex items-center justify-center p-3 rounded-xl transition-all ${activeNav === item.id || router.pathname === item.path ? "scale-110" : "hover:bg-gray-100"}`,
                            style: {
                                fontFamily: "'Poppins', sans-serif"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: `fi flex ${item.icon} text-xl transition-colors ${activeNav === item.id || router.pathname === item.path || router.pathname === '/portal' + item.path ? "text-[#4b33e8]" : "text-gray-600"}`
                            }, void 0, false, {
                                fileName: "[project]/components/BottomNav.tsx",
                                lineNumber: 218,
                                columnNumber: 17
                            }, this)
                        }, item.id, false, {
                            fileName: "[project]/components/BottomNav.tsx",
                            lineNumber: 208,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/BottomNav.tsx",
                    lineNumber: 206,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/BottomNav.tsx",
                lineNumber: 205,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/BottomNav.tsx",
            lineNumber: 201,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/BottomNav.tsx",
        lineNumber: 194,
        columnNumber: 5
    }, this);
});
const __TURBOPACK__default__export__ = BottomNav;
}),
"[project]/components/UtilitySidebar.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>UtilitySidebar
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$dom__$5b$external$5d$__$28$react$2d$dom$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react-dom [external] (react-dom, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
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
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [pickerDate, setPickerDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date());
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [coords, setCoords] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        top: 0,
        left: 0
    });
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    const getDaysInMonth = (year, month)=>new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year, month)=>new Date(year, month, 1).getDay();
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isOpen && date) {
            setPickerDate(new Date(date));
        }
    }, [
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "space-y-1.5 relative w-full",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/UtilitySidebar.tsx",
                lineNumber: 130,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                ref: triggerRef,
                onClick: togglePicker,
                className: `w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-[#263238] cursor-pointer flex items-center justify-between transition-all hover:bg-white hover:border-indigo-100 ${isOpen ? 'ring-2 ring-indigo-100 bg-white' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        children: date ? (()=>{
                            const [y, m, d] = date.split('-');
                            return `${d}/${m}/${y}`;
                        })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
            isOpen && mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$dom__$5b$external$5d$__$28$react$2d$dom$2c$__cjs$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-[9998]",
                        onClick: ()=>setIsOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 151,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            top: coords.top,
                            left: coords.left
                        },
                        className: "fixed bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] p-3 animate-in fade-in zoom-in-95 duration-200 w-[220px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        value: pickerDate.getFullYear(),
                                        onChange: (e)=>{
                                            const newDate = new Date(pickerDate);
                                            newDate.setFullYear(Number(e.target.value));
                                            setPickerDate(newDate);
                                        },
                                        className: "flex-1 bg-gray-50 border-none rounded-lg text-xs font-bold text-[#263238] py-1.5 px-2 focus:ring-0 cursor-pointer",
                                        children: Array.from({
                                            length: 100
                                        }, (_, i)=>new Date().getFullYear() - i).map((year)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                        value: pickerDate.getMonth(),
                                        onChange: (e)=>{
                                            const newDate = new Date(pickerDate);
                                            newDate.setMonth(Number(e.target.value));
                                            setPickerDate(newDate);
                                        },
                                        className: "flex-[1.5] bg-gray-50 border-none rounded-lg text-xs font-bold text-[#263238] py-1.5 px-2 focus:ring-0 cursor-pointer",
                                        children: Array.from({
                                            length: 12
                                        }, (_, i)=>i).map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-7 gap-1 text-center mb-1",
                                children: [
                                    'S',
                                    'M',
                                    'T',
                                    'W',
                                    'T',
                                    'F',
                                    'S'
                                ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-7 gap-1",
                                children: [
                                    Array.from({
                                        length: getFirstDayOfMonth(pickerDate.getFullYear(), pickerDate.getMonth())
                                    }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {}, `empty-${i}`, false, {
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
                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
const CustomTimePicker = ({ time, setTime, label })=>{
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const triggerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [coords, setCoords] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        top: 0,
        left: 0
    });
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "space-y-1.5 relative w-full",
        children: [
            label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/components/UtilitySidebar.tsx",
                lineNumber: 255,
                columnNumber: 23
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                ref: triggerRef,
                onClick: togglePicker,
                className: `w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-[#263238] cursor-pointer flex items-center justify-between transition-all hover:bg-white hover:border-indigo-100 ${isOpen ? 'ring-2 ring-indigo-100 bg-white' : ''}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        children: time || /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
            isOpen && mounted && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$dom__$5b$external$5d$__$28$react$2d$dom$2c$__cjs$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-[9998]",
                        onClick: ()=>setIsOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 267,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            top: coords.top,
                            left: coords.left
                        },
                        className: "fixed bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] p-4 animate-in fade-in zoom-in-95 duration-200 w-[200px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-[8px] font-black text-gray-300 uppercase mb-2 text-center",
                                                children: "Hrs"
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 275,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "h-40 overflow-y-auto custom-scrollbar space-y-1",
                                                children: Array.from({
                                                    length: 24
                                                }, (_, i)=>String(i).padStart(2, '0')).map((h)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-[8px] font-black text-gray-300 uppercase mb-2 text-center",
                                                children: "Min"
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 290,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "h-40 overflow-y-auto custom-scrollbar space-y-1",
                                                children: Array.from({
                                                    length: 60
                                                }, (_, i)=>String(i).padStart(2, '0')).map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
function UtilitySidebar() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    const [activeApp, setActiveApp] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('notes');
    // --- APP STATES ---
    const [notesList, setNotesList] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [activeNoteId, setActiveNoteId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [noteCreationType, setNoteCreationType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('text');
    // --- AUDIO RECORDING & PLAYBACK ---
    const [isRecording, setIsRecording] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [recordDuration, setRecordDuration] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [isPlaying, setIsPlaying] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [audioProgress, setAudioProgress] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [audioDuration, setAudioDuration] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const mediaRecorderRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const audioChunksRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])([]);
    const recordingIntervalRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const playbackIntervalRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const audioNodeRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [todoProjects, setTodoProjects] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [activeProjectId, setActiveProjectId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [newTask, setNewTask] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [calcDisplay, setCalcDisplay] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('0');
    const [calcPrev, setCalcPrev] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [calcOp, setCalcOp] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [calcHistory, setCalcHistory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showHistory, setShowHistory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [dob, setDob] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [ageResult, setAgeResult] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [activeAgeTab, setActiveAgeTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('single');
    const [familyCards, setFamilyCards] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [activeCardId, setActiveCardId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [bmiHeight, setBmiHeight] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [bmiWeight, setBmiWeight] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [nextMemberId, setNextMemberId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(1);
    const [calDate, setCalDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date());
    const [calEvents, setCalEvents] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [newEventTitle, setNewEventTitle] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [selectedDay, setSelectedDay] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date().getDate());
    const [isSyncing, setIsSyncing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [refreshKey, setRefreshKey] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [googleHolidays, setGoogleHolidays] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    // --- ALARM STATES ---
    const [alarms, setAlarms] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [alarmTime, setAlarmTime] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [alarmMessage, setAlarmMessage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [activeToast, setActiveToast] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const audioRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [isInitialLoad, setIsInitialLoad] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    // --- AI CHAT & COPILOT STATES ---
    const [chatMessages, setChatMessages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [userInput, setUserInput] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [isAiLoading, setIsAiLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [aiConfig, setAiConfig] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        instructions: '',
        knowledgeBase: ''
    });
    const [showAiSettings, setShowAiSettings] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const chatEndRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const scrollToBottom = ()=>{
        chatEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        scrollToBottom();
    }, [
        chatMessages
    ]);
    // --- DRAG STATE ---
    const [posY, setPosY] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(50); // percentage from top
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const dragStarted = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(false);
    const startY = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0);
    const startPosY = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(50);
    // --- DRAWER RESIZE STATE ---
    const [drawerWidth, setDrawerWidth] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(320);
    const [isResizing, setIsResizing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const resizeStartX = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0);
    const resizeStartWidth = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(320);
    // Load states from localStorage
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // ... Notes loading logic ...
        const savedNotes = localStorage.getItem('tfc_util_notes_v2');
        const lastActiveNoteId = localStorage.getItem('tfc_util_active_note');
        if (savedNotes) {
            const parsed = JSON.parse(savedNotes);
            const migrated = parsed.map((n)=>({
                    ...n,
                    type: n.type || 'text'
                }));
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
            parsed.forEach((c)=>{
                c.members.forEach((m)=>{
                    maxId = Math.max(maxId, m.id);
                });
            });
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
            const maxId = parsed.reduce((max, m)=>Math.max(max, m.id), 0);
            setNextMemberId(maxId + 1);
        }
        if (savedAgeTab) setActiveAgeTab(savedAgeTab);
    }, []);
    // --- SUPABASE SYNC LOGIC ---
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchRemoteData = async ()=>{
            const currentId = user?.uid || user?.id;
            if (!currentId) {
                setIsInitialLoad(false);
                return;
            }
            try {
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('utility_data').select('*').eq('user_id', currentId).single();
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
        };
        if (mounted && user) {
            fetchRemoteData();
        } else if (mounted && !user) {
            setIsInitialLoad(false);
        }
    }, [
        user,
        mounted
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const syncToRemote = async ()=>{
            const currentId = user?.uid || user?.id;
            if (isInitialLoad || !currentId) return;
            try {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('utility_data').upsert({
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
        };
        const timer = setTimeout(syncToRemote, 2000); // 2s debounce to avoid over-calling
        return ()=>clearTimeout(timer);
    }, [
        notesList,
        todoProjects,
        calEvents,
        familyCards,
        alarms,
        user,
        isInitialLoad
    ]);
    // Save states
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (notesList.length > 0) localStorage.setItem('tfc_util_notes_v2', JSON.stringify(notesList));
    }, [
        notesList
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (activeNoteId) localStorage.setItem('tfc_util_active_note', String(activeNoteId));
    }, [
        activeNoteId
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (todoProjects.length > 0) localStorage.setItem('tfc_util_todo_v2', JSON.stringify(todoProjects));
    }, [
        todoProjects
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (activeProjectId) localStorage.setItem('tfc_util_active_todo', String(activeProjectId));
    }, [
        activeProjectId
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        localStorage.setItem('tfc_util_events', JSON.stringify(calEvents));
    }, [
        calEvents
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        localStorage.setItem('tfc_util_family_cards', JSON.stringify(familyCards));
    }, [
        familyCards
    ]);
    // --- ALARM PERSISTENCE ---
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const savedAlarms = localStorage.getItem('tfc_util_alarms');
        if (savedAlarms) setAlarms(JSON.parse(savedAlarms));
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        localStorage.setItem('tfc_util_alarms', JSON.stringify(alarms));
    }, [
        alarms
    ]);
    // --- ALARM TRIGGER LOGIC ---
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>{
            const now = new Date();
            const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            alarms.forEach((alarm)=>{
                if (alarm.enabled && alarm.time === currentTime) {
                    // Trigger
                    setActiveToast({
                        message: alarm.message || 'Alarm Ringing!',
                        type: 'alarm'
                    });
                    if (audioRef.current) {
                        audioRef.current.play().catch((e)=>console.log("Audio play failed", e));
                    }
                    // Disable it so it doesn't trigger again in the same minute
                    setAlarms((prev)=>prev.map((a)=>a.id === alarm.id ? {
                                ...a,
                                enabled: false
                            } : a));
                }
            });
        }, 1000);
        return ()=>clearInterval(interval);
    }, [
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
            const { data: callLogs } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_logs').select('*').eq('user_id', currentId).order('created_at', {
                ascending: false
            }).limit(10);
            // Fetch Customer Context
            const { data: customers } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('*').limit(5);
            // Fetch Followups / Outcomes
            const { data: outcomes } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_outcomes').select('*').eq('user_id', currentId).limit(5);
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Cleaning up active Age Tab storage as it's no longer used
        localStorage.removeItem('tfc_util_age_tab');
    }, []);
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
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('voice-memos').upload(fileName, blob);
            if (error) throw error;
            const { data: { publicUrl } } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('voice-memos').getPublicUrl(fileName);
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!isOpen || activeApp !== 'calculator') return;
        const handleKeyDown = (e)=>{
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
        };
        window.addEventListener('keydown', handleKeyDown);
        return ()=>window.removeEventListener('keydown', handleKeyDown);
    }, [
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const sync = async ()=>{
            setIsSyncing(true);
            const holidays = await fetchGoogleHolidays(calDate.getFullYear(), calDate.getMonth());
            setGoogleHolidays(holidays);
            setIsSyncing(false);
        };
        sync();
    }, [
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setAgeResult(calculateAge(dob));
    }, [
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
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleMove = (e)=>{
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
        };
        const handleUp = ()=>{
            if (dragStarted.current) {
                dragStarted.current = false;
                // Keep isDragging true for a moment to prevent onClick from firing immediately
                setTimeout(()=>setIsDragging(false), 100);
            }
        };
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchmove', handleMove, {
            passive: false
        });
        window.addEventListener('touchend', handleUp);
        return ()=>{
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };
    }, []);
    // --- RESIZE LOGIC ---
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleResizeMove = (e)=>{
            if (!isResizing) return;
            const deltaX = resizeStartX.current - e.clientX;
            let newWidth = resizeStartWidth.current + deltaX;
            // Min 250px, Max 80% of window width
            newWidth = Math.max(250, Math.min(window.innerWidth * 0.8, newWidth));
            setDrawerWidth(newWidth);
        };
        const handleResizeUp = ()=>{
            setIsResizing(false);
            document.body.style.cursor = '';
        };
        if (isResizing) {
            window.addEventListener('mousemove', handleResizeMove);
            window.addEventListener('mouseup', handleResizeUp);
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
        }
        return ()=>{
            window.removeEventListener('mousemove', handleResizeMove);
            window.removeEventListener('mouseup', handleResizeUp);
        };
    }, [
        isResizing
    ]);
    const onResizeStart = (e)=>{
        e.preventDefault();
        setIsResizing(true);
        resizeStartX.current = e.clientX;
        resizeStartWidth.current = drawerWidth;
    };
    // Lock body scroll and selection during drag
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isDragging) {
            document.body.style.overflow = 'hidden';
            document.body.style.userSelect = 'none';
            document.body.style.touchAction = 'none';
        } else {
            document.body.style.overflow = '';
            document.body.style.userSelect = '';
            document.body.style.touchAction = '';
        }
    }, [
        isDragging
    ]);
    const onDragStart = (e)=>{
        // Only left click or touch
        if ('button' in e && e.button !== 0) return;
        dragStarted.current = true;
        startY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
        startPosY.current = posY;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "jsx-243e87611042249b" + " " + `fixed inset-0 z-[1000] transition-all duration-500 pointer-events-none ${isOpen ? 'visible' : 'invisible'}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        onClick: ()=>setIsOpen(false),
                        className: "jsx-243e87611042249b" + " " + `absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-500 pointer-events-auto ${isOpen ? 'opacity-100' : 'opacity-0'}`
                    }, void 0, false, {
                        fileName: "[project]/components/UtilitySidebar.tsx",
                        lineNumber: 1194,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: {
                            width: `${drawerWidth}px`
                        },
                        className: "jsx-243e87611042249b" + " " + `absolute right-0 top-0 h-full bg-white shadow-xl transition-transform duration-400 pointer-events-auto border-l border-gray-100 flex ${isOpen ? 'translate-x-0' : 'translate-x-full'} ${isResizing ? 'transition-none' : ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                onMouseDown: onResizeStart,
                                className: "jsx-243e87611042249b" + " " + "absolute left-0 top-0 w-1.5 h-full cursor-ew-resize hover:bg-indigo-400/30 transition-colors z-[1010]"
                            }, void 0, false, {
                                fileName: "[project]/components/UtilitySidebar.tsx",
                                lineNumber: 1205,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-243e87611042249b" + " " + "w-[60px] shrink-0 bg-[#4b33e8] border-r border-indigo-700 flex flex-col items-center py-4 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "mb-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setIsOpen(false),
                                            className: "jsx-243e87611042249b" + " " + "w-8 p-2 h-8 rounded-lg text-white/60 hover:text-white transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                    apps.map((app)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setActiveApp(app.id),
                                            title: app.label,
                                            className: "jsx-243e87611042249b" + " " + `w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeApp === app.id ? 'bg-white text-[#4b33e8] shadow-lg' : 'text-white/50 hover:text-white hover:bg-white/10'}`,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "jsx-243e87611042249b" + " " + "flex-1 flex flex-col h-full bg-white relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "px-5 py-4 border-b border-gray-50 flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "flex-1 overflow-y-auto p-4 scroll-smooth custom-scrollbar",
                                        children: [
                                            activeApp === 'notes' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "h-full flex flex-col",
                                                children: !activeNoteId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex bg-slate-100 p-0.5 rounded-lg",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setNoteCreationType('text'),
                                                                            className: "jsx-243e87611042249b" + " " + `px-3 py-1 rounded-md text-[9px] font-bold uppercase transition-all ${noteCreationType === 'text' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`,
                                                                            children: "Text"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1253,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: addNote,
                                                                    className: "jsx-243e87611042249b" + " " + `w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:shadow-md active:scale-95 ${noteCreationType === 'audio' ? 'bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                            children: [
                                                                notesList.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "py-10 text-center border-2 border-dashed border-gray-50 rounded-xl",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                notesList.map((note)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        onClick: ()=>setActiveNoteId(note.id),
                                                                        className: "jsx-243e87611042249b" + " " + "group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all bg-white",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-3 flex-1 min-w-0",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + `w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${note.type === 'audio' ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`,
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-[#263238] truncate",
                                                                                                children: note.title
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1290,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: (e)=>deleteNote(note.id, e),
                                                                                className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "h-full flex flex-col gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveNoteId(null),
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                        notesList.find((n)=>n.id === activeNoteId)?.type === 'audio' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex-1 flex flex-col items-center justify-center bg-rose-50/30 rounded-2xl border border-rose-100/50 p-6 space-y-5",
                                                            children: [
                                                                notesList.find((n)=>n.id === activeNoteId)?.audioUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "w-full space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex items-center justify-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>togglePlayback(notesList.find((n)=>n.id === activeNoteId).audioUrl),
                                                                                className: "jsx-243e87611042249b" + " " + "w-14 h-14 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all active:scale-95",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "flex justify-between text-[8px] font-bold text-rose-400 uppercase tracking-widest",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "jsx-243e87611042249b",
                                                                                            children: formatTime(audioProgress)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                            lineNumber: 1344,
                                                                                            columnNumber: 69
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col items-center space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + `w-16 h-16 rounded-full flex items-center justify-center transition-all ${isRecording ? 'bg-rose-500 animate-pulse text-white' : 'bg-rose-100 text-rose-500'}`,
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-center",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-rose-600",
                                                                                    children: isRecording ? 'Recording...' : 'Ready to Record'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1355,
                                                                                    columnNumber: 65
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
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
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
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
                                            activeApp === 'todo' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "h-full flex flex-col",
                                                children: !activeProjectId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold  text-gray-400 uppercase tracking-widest",
                                                                    children: "Task Lists"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1399,
                                                                    columnNumber: 49
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: addTodoProject,
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all  ",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                            children: todoProjects.map((proj)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    onClick: ()=>setActiveProjectId(proj.id),
                                                                    className: "jsx-243e87611042249b" + " " + "group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all   bg-white",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-[#263238] truncate",
                                                                                    children: proj.title
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1415,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                    onClick: (e)=>deleteTodoProject(proj.id, e),
                                                                                    className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "space-y-4 h-full flex flex-col",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 border-b border-gray-50 pb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveProjectId(null),
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex gap-2 border-b border-gray-100 pb-3",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: addTask,
                                                                    className: "jsx-243e87611042249b" + " " + "text-[#4b33e8] hover:scale-110 transition-transform",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-1 flex-1 overflow-y-auto custom-scrollbar",
                                                            children: todoProjects.find((p)=>p.id === activeProjectId)?.tasks.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "group flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-all",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: t.completed,
                                                                            onChange: ()=>toggleTask(t.id),
                                                                            className: "jsx-243e87611042249b" + " " + "w-3.5 h-3.5 rounded border-gray-300 text-[#4b33e8] focus:ring-0 cursor-pointer"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1471,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + `flex-1 text-xs truncate ${t.completed ? 'text-gray-300 line-through' : 'text-[#263238]'}`,
                                                                            children: t.text
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1477,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>deleteTask(t.id),
                                                                            className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                            activeApp === 'calendar' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "h-full flex flex-col gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex items-center justify-between px-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>changeMonth(-1),
                                                                className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>changeMonth(1),
                                                                className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "grid grid-cols-7 gap-1 text-center text-[9px] font-bold text-gray-300 uppercase",
                                                        children: [
                                                            'S',
                                                            'M',
                                                            'T',
                                                            'W',
                                                            'T',
                                                            'F',
                                                            'S'
                                                        ].map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "grid grid-cols-7 gap-1",
                                                        children: [
                                                            Array.from({
                                                                length: getFirstDayOfMonth(calDate.getFullYear(), calDate.getMonth())
                                                            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    onClick: ()=>setSelectedDay(day),
                                                                    className: "jsx-243e87611042249b" + " " + `relative aspect-square flex flex-col items-center justify-center text-[10px] rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 text-[#4b33e8] border border-indigo-200' : isToday ? 'bg-[#4b33e8] text-white shadow-md' : 'hover:bg-gray-50 text-gray-600'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + "font-bold",
                                                                            children: day
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1532,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        hasGoogleFestivals && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "absolute top-1 right-1 w-1 h-1 rounded-full bg-amber-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1533,
                                                                            columnNumber: 76
                                                                        }, this),
                                                                        hasPersonalEvents && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "absolute top-1 left-1 w-1 h-1 rounded-full bg-emerald-400"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1534,
                                                                            columnNumber: 75
                                                                        }, this),
                                                                        hasLocalEvents && !isToday && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "mt-2 space-y-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex gap-2 bg-gray-50 p-2 rounded-xl",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: addEvent,
                                                                        className: "jsx-243e87611042249b" + " " + "text-[#4b33e8] w-6 h-6 flex items-center justify-center rounded-md hover:bg-white transition-all",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1",
                                                                children: [
                                                                    !user?.googleCalendarConnected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        onClick: ()=>router.push('/settings'),
                                                                        className: "jsx-243e87611042249b" + " " + "bg-indigo-50 rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-indigo-100 transition-all group border border-indigo-100 mb-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "w-5 h-5 bg-white rounded-full flex items-center justify-center text-indigo-600  ",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mt-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold  text-gray-400 uppercase tracking-widest",
                                                                                children: "Google Calendar Holidays"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1573,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: handleSync,
                                                                                disabled: isSyncing,
                                                                                className: "jsx-243e87611042249b" + " " + `text-[8px] font-bold flex items-center gap-1 transition-all ${isSyncing ? 'text-indigo-400' : 'text-green-500 hover:text-green-600'}`,
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] text-gray-300 italic py-2",
                                                                                children: "No events or festivals"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 1610,
                                                                                columnNumber: 60
                                                                            }, this);
                                                                        }
                                                                        return combined.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "group flex flex-col p-2 rounded-lg border border-gray-50 hover:bg-gray-50 transition-all cursor-default",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center justify-between",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-243e87611042249b" + " " + `text-[9px] font-bold text-white px-1.5 py-0.5 rounded-md ${item.isFestival ? 'bg-amber-400' : item.isPersonal ? 'bg-emerald-400' : 'bg-indigo-400'}`,
                                                                                                        children: item.date.split('-')[2]
                                                                                                    }, void 0, false, {
                                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                        lineNumber: 1617,
                                                                                                        columnNumber: 65
                                                                                                    }, this),
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                        className: "jsx-243e87611042249b" + " " + `text-xs font-medium truncate max-w-[160px] ${item.isFestival ? 'text-amber-600' : item.isPersonal ? 'text-emerald-600' : 'text-[#263238]'}`,
                                                                                                        children: [
                                                                                                            item.title,
                                                                                                            item.isFestival && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                                className: "jsx-243e87611042249b" + " " + "ml-1 text-[8px] opacity-70",
                                                                                                                children: "(Holidays)"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                                lineNumber: 1622,
                                                                                                                columnNumber: 89
                                                                                                            }, this),
                                                                                                            item.isPersonal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                                                                            !item.isGoogle && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                onClick: ()=>deleteEvent(item.id),
                                                                                                className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                                    item.isGoogle && (item.description || item.location) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "mt-1 pl-7 space-y-0.5",
                                                                                        children: [
                                                                                            item.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] text-gray-400 flex items-center gap-1",
                                                                                                children: [
                                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                                            item.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                            activeApp === 'calculator' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "space-y-3 h-full flex flex-col",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-4 text-right mb-2 relative shrink-0",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                        ].map((btn)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex-1 overflow-hidden flex flex-col mt-2 pt-2 border-t border-gray-50",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2 shrink-0",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-400 uppercase tracking-widest",
                                                                        children: "History"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                        lineNumber: 1674,
                                                                        columnNumber: 45
                                                                    }, this),
                                                                    calcHistory.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex-1 overflow-y-auto custom-scrollbar space-y-1 pr-1",
                                                                children: calcHistory.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] text-gray-300 text-center py-2 italic",
                                                                    children: "No recent calculations"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1681,
                                                                    columnNumber: 49
                                                                }, this) : calcHistory.map((entry, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                            activeApp === 'age' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "space-y-4",
                                                children: !activeCardId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col h-full space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "sticky top-0 bg-white z-20 space-y-4 -mt-5 -mx-5 px-5 pt-5 pb-4 border-b border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CustomDatePicker, {
                                                                    date: dob,
                                                                    setDate: setDob,
                                                                    label: "Date of Birth"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1702,
                                                                    columnNumber: 49
                                                                }, this),
                                                                ageResult && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "grid grid-cols-3 gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl py-3 text-center border border-gray-100",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-lg font-bold text-[#4b33e8]",
                                                                                    children: ageResult.y
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1707,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl py-3 text-center border border-gray-100",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-lg font-bold text-[#4b33e8]",
                                                                                    children: ageResult.m
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1711,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl py-3 text-center border border-gray-100",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-lg font-bold text-[#4b33e8]",
                                                                                    children: ageResult.d
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1715,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex flex-col flex-1 min-h-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold  text-gray-400 uppercase tracking-widest",
                                                                            children: "My Families"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1725,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: addFamilyCard,
                                                                            className: "jsx-243e87611042249b" + " " + "w-6 h-6 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all  ",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1",
                                                                    children: [
                                                                        familyCards.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "py-6 text-center border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/50",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                        familyCards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                onClick: ()=>setActiveCardId(card.id),
                                                                                className: "jsx-243e87611042249b" + " " + "group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all   bg-white",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-[#263238] truncate",
                                                                                                children: card.name
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1747,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-angle-small-right text-gray-300 group-hover:text-indigo-400 transition-colors"
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1753,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                onClick: (e)=>deleteFamilyCard(card.id, e),
                                                                                                className: "jsx-243e87611042249b" + " " + "opacity-0 group-hover:opacity-100 w-6 h-6 rounded-md text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col h-full animate-in slide-in-from-right-4 duration-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 mb-3 pb-2 border-b border-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveCardId(null),
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 mb-4 bg-indigo-50 p-2 rounded-xl text-center justify-center border border-indigo-100",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "text-center px-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + "block text-xl font-bold text-[#4b33e8]",
                                                                            children: familyCards.find((c)=>c.id === activeCardId)?.members.filter((m)=>m.type === 'Adult').length || 0
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1788,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "h-6 w-[1px] bg-indigo-200"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                    lineNumber: 1793,
                                                                    columnNumber: 57
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "text-center px-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "jsx-243e87611042249b" + " " + "block text-xl font-bold text-[#4b33e8]",
                                                                            children: familyCards.find((c)=>c.id === activeCardId)?.members.filter((m)=>m.type === 'Child').length || 0
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1795,
                                                                            columnNumber: 61
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-3 flex-1 overflow-y-auto custom-scrollbar mb-4",
                                                            children: [
                                                                familyCards.find((c)=>c.id === activeCardId)?.members.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "border-2 border-dashed border-gray-100 rounded-xl p-6 text-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-users text-2xl text-gray-200 mb-2 flex justify-center"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1806,
                                                                            columnNumber: 65
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-3 border border-gray-100 animate-in slide-in-from-right-2 duration-300",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + `text-[10px] font-bold  uppercase tracking-widest px-2 py-0.5 rounded-md ${member.type === 'Adult' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`,
                                                                                        children: member.type
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1815,
                                                                                        columnNumber: 73
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>deleteFamilyMember(member.id),
                                                                                        className: "jsx-243e87611042249b" + " " + "text-gray-300 hover:text-red-500 transition-colors",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-end gap-3",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CustomDatePicker, {
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
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "text-right w-16 mb-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-243e87611042249b" + " " + "block text-lg font-bold text-[#263238] leading-none",
                                                                                                children: age ? age.y : '--'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1831,
                                                                                                columnNumber: 77
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "grid grid-cols-2 gap-2 mt-auto",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addFamilyMember('Adult'),
                                                                    className: "jsx-243e87611042249b" + " " + "py-2.5 rounded-xl bg-[#4b33e8] text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2   shadow-indigo-100 active:scale-95",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addFamilyMember('Child'),
                                                                    className: "jsx-243e87611042249b" + " " + "py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                            activeApp === 'bmi' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "flex flex-col h-full",
                                                children: !activeCardId ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col h-full space-y-6",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "sticky top-0 bg-white z-20 space-y-4 -mt-5 -mx-5 px-5 pt-5 pb-4 border-b border-gray-100 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex-1 space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1",
                                                                                    children: "Height (cm)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1871,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "flex-1 space-y-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1",
                                                                                    children: "Weight (kg)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1881,
                                                                                    columnNumber: 57
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                                calculateBMI(bmiHeight, bmiWeight) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-3 text-center border border-gray-100 flex items-center justify-between",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-left",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "text-[8px] font-bold text-gray-400 uppercase",
                                                                                    children: "Your BMI"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                    lineNumber: 1895,
                                                                                    columnNumber: 61
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex flex-col flex-1 min-h-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                            className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold  text-gray-400 uppercase tracking-widest",
                                                                            children: "My Families"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1915,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: addFamilyCard,
                                                                            className: "jsx-243e87611042249b" + " " + "w-6 h-6 rounded-lg bg-indigo-50 text-[#4b33e8] flex items-center justify-center hover:bg-[#4b33e8] hover:text-white transition-all  ",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1",
                                                                    children: [
                                                                        familyCards.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "py-6 text-center border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/50",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                        familyCards.map((card)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                onClick: ()=>setActiveCardId(card.id),
                                                                                className: "jsx-243e87611042249b" + " " + "group flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 cursor-pointer transition-all   bg-white",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "jsx-243e87611042249b" + " " + "text-xs font-bold text-[#263238] truncate",
                                                                                                children: card.name
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 1937,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex flex-col h-full animate-in slide-in-from-right-4 duration-300",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "flex items-center gap-2 mb-3 pb-2 border-b border-gray-50",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>setActiveCardId(null),
                                                                    className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-[#4b33e8] hover:bg-indigo-50 transition-all font-bold",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "space-y-3 flex-1 overflow-y-auto custom-scrollbar mb-4",
                                                            children: [
                                                                familyCards.find((c)=>c.id === activeCardId)?.members.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "border-2 border-dashed border-gray-100 rounded-xl p-6 text-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "jsx-243e87611042249b" + " " + "fi flex fi-rr-users text-2xl text-gray-200 mb-2 flex justify-center"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 1973,
                                                                            columnNumber: 57
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-3 border border-gray-100 animate-in slide-in-from-right-2 duration-300",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + `text-[10px] font-bold  uppercase tracking-widest px-2 py-0.5 rounded-md ${member.type === 'Adult' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'}`,
                                                                                        children: member.type
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 1982,
                                                                                        columnNumber: 65
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                        onClick: ()=>deleteFamilyMember(member.id),
                                                                                        className: "jsx-243e87611042249b" + " " + "text-gray-300 hover:text-red-500 transition-colors",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-end gap-3 mb-2",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 space-y-1",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex-1 space-y-1",
                                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                                            bmi && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between pt-2 border-t border-gray-200/50",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold text-gray-400 uppercase",
                                                                                        children: "BMI Result"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 2011,
                                                                                        columnNumber: 69
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "jsx-243e87611042249b" + " " + `text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${Number(bmi) < 18.5 ? 'bg-amber-50 text-amber-600' : Number(bmi) < 25 ? 'bg-emerald-50 text-emerald-600' : Number(bmi) < 30 ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'}`,
                                                                                                children: Number(bmi) < 18.5 ? 'Underweight' : Number(bmi) < 25 ? 'Normal' : Number(bmi) < 30 ? 'Overweight' : 'Obese'
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                lineNumber: 2013,
                                                                                                columnNumber: 73
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "jsx-243e87611042249b" + " " + "grid grid-cols-2 gap-2 mt-auto",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addFamilyMember('Adult'),
                                                                    className: "jsx-243e87611042249b" + " " + "py-2.5 rounded-xl bg-[#4b33e8] text-white text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2   shadow-indigo-100 active:scale-95",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>addFamilyMember('Child'),
                                                                    className: "jsx-243e87611042249b" + " " + "py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                            activeApp === 'alarm' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "flex flex-col h-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "space-y-4 mb-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "space-y-1",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(CustomTimePicker, {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "space-y-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[9px] font-bold text-gray-400 uppercase ml-1",
                                                                                children: "Message (Optional)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2066,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-h-0 flex flex-col",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3",
                                                                children: "Active Alarms"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                lineNumber: 2085,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "space-y-2 overflow-y-auto custom-scrollbar pr-1",
                                                                children: [
                                                                    alarms.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "py-8 text-center border-2 border-dashed border-gray-50 rounded-xl bg-gray-50/50",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex fi fi-rr-bell-slash text-2xl text-gray-200 mb-2 justify-center"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2089,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                    alarms.sort((a, b)=>a.time.localeCompare(b.time)).map((alarm)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "group bg-white border border-gray-100 p-3 rounded-xl flex items-center justify-between hover:border-indigo-100 transition-all shadow-sm",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "flex items-center gap-3",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-243e87611042249b" + " " + `w-8 h-8 rounded-lg flex items-center justify-center ${alarm.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-300'}`,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "jsx-243e87611042249b",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                    className: "jsx-243e87611042249b" + " " + `text-sm font-black ${alarm.enabled ? 'text-[#263238]' : 'text-gray-400'}`,
                                                                                                    children: alarm.time
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                                    lineNumber: 2100,
                                                                                                    columnNumber: 61
                                                                                                }, this),
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "jsx-243e87611042249b" + " " + "flex items-center gap-2",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>toggleAlarm(alarm.id),
                                                                                            className: "jsx-243e87611042249b" + " " + `w-8 h-5 rounded-full transition-all relative ${alarm.enabled ? 'bg-green-500' : 'bg-gray-200'}`,
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                            onClick: ()=>deleteAlarm(alarm.id),
                                                                                            className: "jsx-243e87611042249b" + " " + "w-7 h-7 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all",
                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                            activeApp === 'ai' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "jsx-243e87611042249b" + " " + "flex flex-col h-full relative slide-in-right",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-5 px-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-slate-700 uppercase tracking-wide",
                                                                                children: "Sales Co-Pilot"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2135,
                                                                                columnNumber: 49
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-1.5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        className: "jsx-243e87611042249b" + " " + "w-1.5 h-1.5 rounded-full bg-emerald-400"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                        lineNumber: 2137,
                                                                                        columnNumber: 53
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: clearChat,
                                                                        title: "Clear History",
                                                                        className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-rose-400 hover:bg-rose-50/50 transition-all active:scale-95",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowAiSettings(true),
                                                                        title: "AI Settings",
                                                                        className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all active:scale-95",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "flex-1 min-h-0 overflow-y-auto custom-scrollbar px-0.5 space-y-4 pb-3 overflow-x-hidden",
                                                        children: [
                                                            chatMessages.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "py-10 text-center space-y-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto border border-slate-100/50",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "px-6",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[12px] font-bold text-slate-600 mb-1.5",
                                                                                children: "Ready to assist your sales journey"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2168,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "flex flex-wrap gap-2 justify-center px-4",
                                                                        children: [
                                                                            "Closing Tips",
                                                                            "Follow-up Script",
                                                                            "Talktime Analysis",
                                                                            "Pitch Ideas"
                                                                        ].map((tip)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                                                            chatMessages.map((msg, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + `flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                            isAiLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex justify-start",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "jsx-243e87611042249b" + " " + "bg-slate-50 border border-slate-100 rounded-xl rounded-tl-none px-3.5 py-2.5 flex gap-1.5 items-center",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-75"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2200,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "jsx-243e87611042249b" + " " + "w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce delay-150"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                                            lineNumber: 2201,
                                                                            columnNumber: 53
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "pt-4 border-t border-slate-100 mt-auto bg-white/60 backdrop-blur-sm px-0.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "relative flex items-end gap-2 bg-slate-50/80 rounded-xl border border-slate-100 transition-all p-1.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: handleSendMessage,
                                                                        disabled: isAiLoading || !userInput.trim(),
                                                                        className: "jsx-243e87611042249b" + " " + `w-8 h-8 rounded-lg flex items-center justify-center transition-all shrink-0 mb-1 mr-1 ${userInput.trim() ? 'bg-indigo-500 text-white shadow-md shadow-indigo-100' : 'bg-slate-100 text-slate-300'}`,
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                    showAiSettings && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "jsx-243e87611042249b" + " " + "absolute inset-0 bg-white/98 z-[100] flex flex-col p-5 animate-in fade-in duration-300",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "flex items-center justify-between mb-6",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                        onClick: ()=>setShowAiSettings(false),
                                                                        className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-all",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "jsx-243e87611042249b" + " " + "space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1",
                                                                                children: "Behavior Instructions"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2254,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
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
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "jsx-243e87611042249b" + " " + "space-y-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                className: "jsx-243e87611042249b" + " " + "text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1",
                                                                                children: "Contextual Knowledge"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                                                lineNumber: 2264,
                                                                                columnNumber: 53
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                                    activeToast && typeof document !== 'undefined' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2d$dom__$5b$external$5d$__$28$react$2d$dom$2c$__cjs$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "fixed top-8 right-8 z-[99999] animate-in fade-in slide-in-from-top-8 duration-500 pointer-events-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "jsx-243e87611042249b" + " " + "bg-[#001a3d] rounded-full pl-3 pr-4 py-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.3)] flex items-center gap-4 min-w-[300px] border border-white/5 backdrop-blur-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "w-10 h-10 rounded-full bg-[#1e40af] flex items-center justify-center text-white shrink-0 shadow-inner",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "jsx-243e87611042249b" + " " + "flex-1 min-w-0 pr-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                            className: "jsx-243e87611042249b" + " " + "text-white text-[11px] font-black leading-tight tracking-wide",
                                                            children: "Rynxly Alarm Active"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/UtilitySidebar.tsx",
                                                            lineNumber: 2298,
                                                            columnNumber: 42
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: stopAlarm,
                                                    className: "jsx-243e87611042249b" + " " + "w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90 shrink-0",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("audio", {
                                        ref: audioRef,
                                        src: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
                                        loop: true,
                                        className: "jsx-243e87611042249b"
                                    }, void 0, false, {
                                        fileName: "[project]/components/UtilitySidebar.tsx",
                                        lineNumber: 2315,
                                        columnNumber: 26
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "jsx-243e87611042249b" + " " + "px-5 py-3 border-t border-gray-50 flex items-center justify-between text-[8px] font-bold text-gray-300 uppercase tracking-widest",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "jsx-243e87611042249b",
                                                children: "Rynxly Tools Suits"
                                            }, void 0, false, {
                                                fileName: "[project]/components/UtilitySidebar.tsx",
                                                lineNumber: 2323,
                                                columnNumber: 30
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "243e87611042249b",
                children: ".custom-scrollbar.jsx-243e87611042249b::-webkit-scrollbar{width:4px}.custom-scrollbar.jsx-243e87611042249b::-webkit-scrollbar-track{background:0 0}.custom-scrollbar.jsx-243e87611042249b::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:10px}.custom-scrollbar.jsx-243e87611042249b.jsx-243e87611042249b::-webkit-scrollbar-thumb:hover{background:#cbd5e1}@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes slideRight{0%{opacity:0;transform:translate(20px)}to{opacity:1;transform:translate(0)}}.animate-in.jsx-243e87611042249b{animation:.3s ease-out fadeIn}.slide-in-right.jsx-243e87611042249b{animation:.4s cubic-bezier(.16,1,.3,1) slideRight}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>AppLayout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Sidebar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Header.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNav$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/BottomNav.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authService.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UtilitySidebar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/UtilitySidebar.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppLogo.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UtilitySidebar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UtilitySidebar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
function AppLayout({ children, hideSidebar = false, hideHeader = false }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, loading: authLoading, error, mounted, statusMessage, sessionExpired } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const handleLogoutClick = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["handleLogout"])(router);
    }, [
        router
    ]);
    // 🛰️ Sentinel: Track Page Visits
    // NOTE: This must stay ABOVE any early returns to satisfy React Hook Rules
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && user && !router.pathname.includes('/login')) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'READ',
                description: `Page Visit: ${router.pathname}`,
                path: router.pathname,
                user_name: user.displayName || 'User',
                organization_id: user.organization_id || undefined
            });
        }
    }, [
        router.pathname,
        user?.uid,
        mounted
    ]);
    // Session Expired UI logic
    // NOTE: Conditional rendering happens AFTER all hooks are declared
    if (sessionExpired) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-h-screen items-center justify-center bg-[#f6f5ff] p-4 text-center",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white animate-in zoom-in duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                            xmlns: "http://www.w3.org/2000/svg",
                            width: "40",
                            height: "40",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("rect", {
                                    x: "3",
                                    y: "11",
                                    width: "18",
                                    height: "11",
                                    rx: "2",
                                    ry: "2"
                                }, void 0, false, {
                                    fileName: "[project]/components/AppLayout.tsx",
                                    lineNumber: 51,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                    d: "M7 11V7a5 5 0 0 1 10 0v4"
                                }, void 0, false, {
                                    fileName: "[project]/components/AppLayout.tsx",
                                    lineNumber: 52,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/AppLayout.tsx",
                            lineNumber: 50,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold text-[#263238] mb-2",
                        style: {
                            fontFamily: "'Poppins', sans-serif"
                        },
                        children: "Session Expired"
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 55,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-[#787E9D] mb-8",
                        children: "For your security, your session has timed out. Please refresh to re-authenticate and continue your work."
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 56,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            sessionStorage.clear();
                            localStorage.clear();
                            window.location.href = '/portal/login';
                        },
                        className: "w-full bg-[#4b33e8] hover:bg-[#3b27c2] text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-lg shadow-purple-200",
                        children: "Refresh & Login"
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 58,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 48,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/AppLayout.tsx",
            lineNumber: 47,
            columnNumber: 7
        }, this);
    }
    const isAuthPage = [
        '/portal/login',
        '/portal/signup',
        '/portal/signup-success'
    ].includes(router.pathname);
    // Loading state: Wait for mount, auth finish, and user availability
    if (!mounted || authLoading || !user && !isAuthPage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-h-screen items-center justify-center bg-[#f6f5ff]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "scale-125 mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/components/AppLayout.tsx",
                            lineNumber: 81,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 80,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-12 h-12 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/components/AppLayout.tsx",
                                lineNumber: 84,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-[#263238] font-bold text-lg animate-pulse",
                                style: {
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                children: statusMessage || "Retrieving logged details..."
                            }, void 0, false, {
                                fileName: "[project]/components/AppLayout.tsx",
                                lineNumber: 85,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-[#787E9D] text-sm font-medium",
                                children: "Please wait while we sync your session"
                            }, void 0, false, {
                                fileName: "[project]/components/AppLayout.tsx",
                                lineNumber: 88,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 83,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 79,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/AppLayout.tsx",
            lineNumber: 78,
            columnNumber: 7
        }, this);
    }
    // Error/Redirect state
    if (error) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center",
            style: {
                backgroundColor: "#f6f5f7"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-lg mb-4 text-red-500",
                        children: error
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 103,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-sm",
                        style: {
                            color: "#4b33e8"
                        },
                        children: "Redirecting to login..."
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 104,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 102,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/AppLayout.tsx",
            lineNumber: 98,
            columnNumber: 7
        }, this);
    }
    // Determine role props
    const userRole = user?.role || null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen w-full overflow-x-hidden",
        style: {
            backgroundColor: "#f6f5f7",
            maxWidth: "100vw"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("style", {
                children: `
        .recharts-wrapper:focus, .recharts-surface:focus { outline: none !important; }
        button:focus { outline: none !important; }
        .recharts-area-rectangle:focus, .recharts-bar-rectangle:focus, .recharts-pie-sector:focus { outline: none !important; }
      `
            }, void 0, false, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            !hideSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Sidebar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                user: user,
                userRole: userRole,
                onLogout: handleLogoutClick
            }, void 0, false, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 128,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: `flex-1 flex flex-col ${!hideSidebar ? 'lg:ml-52' : ''} w-full min-w-0 overflow-x-hidden`,
                children: [
                    !hideHeader && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Header$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        user: user,
                        onLogout: handleLogoutClick,
                        hideSidebar: hideSidebar
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 139,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                        className: `flex-1 overflow-y-auto overflow-x-hidden min-w-0 max-w-full ${!hideHeader ? 'pt-[60px] lg:pt-[70px]' : ''}`,
                        style: {
                            backgroundColor: "#f6f5f7"
                        },
                        children: children
                    }, void 0, false, {
                        fileName: "[project]/components/AppLayout.tsx",
                        lineNumber: 147,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 136,
                columnNumber: 7
            }, this),
            !hideSidebar && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$BottomNav$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                activeNav: router.pathname.replace('/portal', '').replace('/', '') || 'dashboard',
                userRole: userRole,
                isClient: user?.isClient,
                designation: user?.designation,
                employeeId: user?.employeeId
            }, void 0, false, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 157,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UtilitySidebar$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/components/AppLayout.tsx",
                lineNumber: 167,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AppLayout.tsx",
        lineNumber: 116,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/GlobalCallHandler.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>GlobalCallHandler
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/bridgeLogger.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function GlobalCallHandler() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const lastNavigatedCustomerId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const updateSessionInBackground = undefined;
        const notifyLeadOwner = undefined;
        const updateCallState = undefined;
        const handleBridgeMessage = undefined;
    }, [
        router,
        user
    ]);
    return null;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/CallReminderOverlay.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>CallReminderOverlay
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function CallReminderOverlay() {
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [upcomingCall, setUpcomingCall] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [interactedKeys, setInteractedKeys] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Set());
    const [conflictInfo, setConflictInfo] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [debugForce, setDebugForce] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [lastPlayedId, setLastPlayedId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isExiting, setIsExiting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Auto-dismiss timer ref
    const [storageLoaded, setStorageLoaded] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Auto-dismiss timer ref
    const dismissTimerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // active call flag state
    const [isCallingActive, setIsCallingActive] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    // Initial position to right side (below header)
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        x: 2000,
        y: 85
    }); // Start far right
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const dragRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Load interacted keys from localStorage on mount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        mounted
    ]);
    const saveInteractedKey = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((callId, timestamp)=>{
        const key = `${callId}_${timestamp}`;
        setInteractedKeys((prev)=>{
            const next = new Set(prev).add(key);
            try {
                const stored = localStorage.getItem('tfc_interacted_reminders');
                const parsed = stored ? JSON.parse(stored) : {};
                parsed[key] = Date.now();
                localStorage.setItem('tfc_interacted_reminders', JSON.stringify(parsed));
            } catch (e) {
                console.error("Error saving to localStorage", e);
            }
            return next;
        });
    }, []);
    // Check for debug force param on mount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    // Set real initial position on mount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        mounted
    ]);
    // Ref to ignore recently acted-upon calls immediately (prevents flicker return)
    const ignoreRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(new Set());
    const handleDismiss = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(()=>{
        if (!upcomingCall?.id) return;
        // Immediate ignore
        ignoreRef.current.add(upcomingCall.id);
        setIsExiting(true);
        saveInteractedKey(upcomingCall.id, upcomingCall.next_called_at);
        if (audioInstanceRef.current) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.currentTime = 0;
        }
        setTimeout(()=>{
            setUpcomingCall(null);
            setIsExiting(false);
        }, 700);
    }, [
        upcomingCall?.id,
        saveInteractedKey
    ]);
    // Display timer ref for 3-minute logic
    const displayStartedAtRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const skipReminder = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (call, reason)=>{
        saveInteractedKey(call.id, call.next_called_at);
        // Insert into notifications
        const userId = user?.uid || user?.user_id;
        if (!userId) return;
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('notifications').insert({
                user_id: userId,
                type: 'skipped_reminder',
                message: `Missed call reminder for ${call.customer_name} (${new Date(call.next_called_at).toLocaleTimeString()})`,
                created_at: new Date().toISOString(),
                is_seen: false,
                metadata: {
                    customer_id: call.id,
                    campaign_id: call.campaign_id,
                    reason: reason
                }
            });
        } catch (e) {
            console.error("Failed to insert notification", e);
        }
    }, [
        saveInteractedKey,
        user
    ]);
    const checkUpcomingCalls = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (!storageLoaded) return;
        const userId = user?.uid || user?.user_id;
        if (!userId) return;
        const now = new Date();
        const windowStart = new Date(now.getTime() - 60 * 60 * 1000); // Check past 1 hour for missed
        const windowEnd = new Date(now.getTime() + 2 * 60000); // Check 2 mins future
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select(`
                    id, 
                    customer_name, 
                    phone_no, 
                    next_called_at, 
                    campaign_id, 
                    disposition, 
                    sub_disposition, 
                    notes, 
                    outcome,
                    expiry_date
                `).or(`managed_by.eq.${userId},assigned_to.eq.${userId}`).eq('disposition', 'Call Back') // Changed ilike to eq for performance if schema matches
            .gte('next_called_at', windowStart.toISOString()).lte('next_called_at', windowEnd.toISOString()).order('next_called_at', {
                ascending: true
            }).limit(10); // Fetch more to analyze queue
            if (error) throw error;
            if (data && data.length > 0) {
                const nowMs = Date.now();
                let nextToDisplay = null;
                // Process Queue
                for (const call of data){
                    const callTime = new Date(call.next_called_at).getTime();
                    const compositeKey = `${call.id}_${call.next_called_at}`;
                    // 1. Skip if already handled OR in ignore ref
                    if (interactedKeys.has(compositeKey) || ignoreRef.current.has(call.id)) continue;
                    // 2. Check for Missed/Expired (Older than 2 mins ago)
                    // We allow a small buffer (e.g., if it was due 1 min ago, it's still "Active" and Urgent)
                    // But if it was due > 5 mins ago and we just opened the app, we probably want to skip it?
                    // User said: "check kro... agr time nikal chuka hai to unhe skip kro"
                    // Let's define "Expired" as > 1 minute past due AND not currently shown.
                    // Actually, let's stick to the prompt: "3 min badh check... if time passed, skip"
                    // Simple Rule:
                    // If (callTime < now - 30 seconds) -> Missed -> Skip
                    // This aggressively clears backlog so only future/current calls show up.
                    if (callTime < nowMs - 30 * 1000) {
                        // It's too old (Wait time over)
                        // Only skip if it's NOT the current one (prevent auto-closing active one instantly if simple lag)
                        if (upcomingCall?.id !== call.id) {
                            skipReminder(call, 'missed'); // Log as missed notification
                            continue; // Don't show in popup
                        }
                    }
                    // This is a valid candidate
                    if (!nextToDisplay) nextToDisplay = call;
                }
                if (!nextToDisplay) {
                    // No valid calls left
                    if (upcomingCall && !isExiting) {
                    // Keep current or let it expire naturally by 5 min timer
                    } else {
                        setUpcomingCall(null);
                    }
                    return;
                }
                // LOGIC: Should we switch?
                // Case A: No current call -> Show Next
                if (!upcomingCall) {
                    let campaignName = "Active Campaign"; // Fetch logic simplified for brevity or could fetch below
                    if (nextToDisplay.campaign_id) {
                        const { data: campData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('name').eq('id', nextToDisplay.campaign_id).maybeSingle();
                        if (campData?.name) campaignName = campData.name;
                    }
                    const enriched = {
                        ...nextToDisplay,
                        campaign_name: campaignName
                    };
                    setUpcomingCall(enriched);
                    displayStartedAtRef.current = Date.now();
                    return;
                }
                // Case B: Current call exists...
                if (upcomingCall.id === nextToDisplay.id) {
                    // Update current data if needed, or just do nothing
                    return;
                }
                // Case C: Current call is different from Next Candidate
                // This means Next Candidate is MORE URGENT or Current is finished/skipped
                // Check 3-Minute Rule
                if (displayStartedAtRef.current && nowMs - displayStartedAtRef.current > 3 * 60 * 1000) {
                    // 3 Minutes have passed!
                    // Is "nextToDisplay" urgent? (Due within next 2 mins)
                    const nextTime = new Date(nextToDisplay.next_called_at).getTime();
                    // We already filtered query by lte(now + 2 min), so it IS urgent.
                    // SWAP!
                    console.log("Create Swap: 3 mins passed, swapping for urgent call", nextToDisplay.customer_name);
                    // 1. Mark current as skipped/timeout
                    skipReminder(upcomingCall, 'timeout');
                    ignoreRef.current.add(upcomingCall.id); // Add current to ignore list so it doesn't bounce back
                    // 2. Exit current
                    setIsExiting(true);
                    // 3. Prep next
                    let campaignName = "Active Campaign";
                    if (nextToDisplay.campaign_id) {
                        const { data: campData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('campaigns').select('name').eq('id', nextToDisplay.campaign_id).maybeSingle();
                        if (campData?.name) campaignName = campData.name;
                    }
                    const enriched = {
                        ...nextToDisplay,
                        campaign_name: campaignName
                    };
                    setTimeout(()=>{
                        setUpcomingCall(enriched);
                        displayStartedAtRef.current = Date.now();
                        setIsExiting(false);
                    }, 700);
                } else {
                // Less than 3 minutes passed.
                // Keep current one.
                // The "nextToDisplay" will wait in queue until 3 mins pass OR user dismisses current.
                }
            } else {
                // No data found
                if (upcomingCall && !data?.find((c)=>c.id === upcomingCall.id)) {
                // Current call is no longer in valid list (e.g. date changed elsewhere), dismiss?
                // Or just let it stay until timeout. Let's let it stay.
                }
            }
        } catch (err) {
            console.error("[Reminder-Debug] Error:", err);
        }
    }, [
        user,
        interactedKeys,
        upcomingCall,
        isExiting,
        saveInteractedKey,
        storageLoaded,
        skipReminder
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!mounted || !storageLoaded) return;
        // Initial check and immediate check when call ends
        if (!isCallingActive) {
            checkUpcomingCalls();
        }
        const interval = setInterval(()=>{
            if (!isCallingActive) {
                checkUpcomingCalls();
            }
        }, 30000); // Increased to 30s to save egress/requests
        return ()=>clearInterval(interval);
    }, [
        mounted,
        checkUpcomingCalls,
        storageLoaded,
        isCallingActive
    ]);
    // Auto-dismiss after 5 minutes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (upcomingCall?.id) {
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
            dismissTimerRef.current = setTimeout(()=>{
                handleDismiss();
            }, 5 * 60 * 1000); // 5 minutes
        }
        return ()=>{
            if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
        };
    }, [
        upcomingCall?.id,
        handleDismiss
    ]);
    // Persistent Audio Management
    const audioInstanceRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const lastRungIdRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const playTimeoutRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    // Initialize audio once
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    // Master Audio Sync Logic
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!audioInstanceRef.current) return;
        // Clear any existing timeout on every effect run
        if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
        const activeId = upcomingCall?.id;
        // STOP condition: No call active or popup is sliding out
        if (!activeId || isExiting) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.currentTime = 0;
            audioInstanceRef.current.src = ""; // Clear source
            return;
        }
        // PLAY condition: New ID arrives
        if (activeId !== lastRungIdRef.current) {
            audioInstanceRef.current.src = `https://assets.mixkit.co/active_storage/sfx/1354/1354-preview.mp3?v=${activeId}`;
            audioInstanceRef.current.loop = true; // Re-enforce loop on new source
            // Fallback: Manually restart if loop fails
            audioInstanceRef.current.onended = ()=>{
                if (audioInstanceRef.current && upcomingCall?.id === activeId && !isExiting) {
                    audioInstanceRef.current.play().catch(()=>{});
                }
            };
            // Auto-trigger sound 1 second after popup shows
            playTimeoutRef.current = setTimeout(()=>{
                // Final safety check: Popup must still be visible and NOT exiting
                if (upcomingCall?.id === activeId && !isExiting && audioInstanceRef.current) {
                    audioInstanceRef.current.play().then(()=>{
                        lastRungIdRef.current = activeId;
                    }).catch((err)=>{
                        console.log("[Reminder-Audio] Playback attempt:", err.name);
                    });
                }
            }, 1000);
        }
        return ()=>{
            if (playTimeoutRef.current) clearTimeout(playTimeoutRef.current);
        };
    }, [
        upcomingCall?.id,
        isExiting
    ]);
    // Drag handlers
    const onMouseDown = (e)=>{
        if (e.target.closest('button')) return;
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y
        };
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const onMouseMove = (e)=>{
            if (!isDragging || !dragRef.current) return;
            const dx = e.clientX - dragRef.current.startX;
            const dy = e.clientY - dragRef.current.startY;
            setPosition({
                x: dragRef.current.initialX + dx,
                y: dragRef.current.initialY + dy
            });
        };
        const onMouseUp = ()=>{
            setIsDragging(false);
            dragRef.current = null;
        };
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
        return ()=>{
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [
        isDragging,
        position
    ]);
    const handleCallNow = ()=>{
        if (!upcomingCall) return;
        // Immediate ignore
        ignoreRef.current.add(upcomingCall.id);
        if (audioInstanceRef.current) {
            audioInstanceRef.current.pause();
            audioInstanceRef.current.currentTime = 0;
        }
        setUpcomingCall(null);
        // Just navigate to profile, do not auto-dial here.
        // User said: "call open krne pr call place nahi krni sirf profile show krna hai"
        router.push(`/campaign/${upcomingCall.campaign_id}/${upcomingCall.id}`);
    };
    const handleSnooze = async (minutes)=>{
        if (!upcomingCall) return;
        const newTimeDate = new Date(new Date().getTime() + minutes * 60000);
        const newTimeIso = newTimeDate.toISOString();
        try {
            const startOfMinute = new Date(newTimeDate);
            startOfMinute.setSeconds(0, 0);
            const endOfMinute = new Date(newTimeDate);
            endOfMinute.setSeconds(59, 999);
            const { data: conflicts } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').select('id, customer_name, next_called_at').or(`managed_by.eq.${user?.uid},assigned_to.eq.${user?.uid}`).eq('disposition', 'Call Back').gte('next_called_at', startOfMinute.toISOString()).lte('next_called_at', endOfMinute.toISOString()).neq('id', upcomingCall.id);
            if (conflicts && conflicts.length > 0) {
                setConflictInfo({
                    time: newTimeDate.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    customer: conflicts[0].customer_name,
                    minutes: minutes
                });
                return;
            }
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('customers').update({
                next_called_at: newTimeIso
            }).eq('id', upcomingCall.id);
            // Exit animation and Mark as seen
            setIsExiting(true);
            saveInteractedKey(upcomingCall.id, upcomingCall.next_called_at);
            setConflictInfo(null);
            if (audioInstanceRef.current) {
                audioInstanceRef.current.pause();
                audioInstanceRef.current.currentTime = 0;
            }
            setTimeout(()=>{
                setUpcomingCall(null);
                setIsExiting(false);
            }, 700);
        } catch (err) {
            console.error(err);
        }
    };
    // Mobile Swipe Logic
    const [swipeX, setSwipeX] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const swipeXRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0); // Ref to track latest value for event listeners
    const [isMobile, setIsMobile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    const onSwipeStart = (e)=>{
        // Only allow swipe on the thumb
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        dragRef.current = {
            startX: clientX,
            startY: 0,
            initialX: 0,
            initialY: 0
        };
        console.log('🎯 Swipe Start at X:', clientX);
    };
    const onSwipeMove = (e)=>{
        if (!isDragging || !dragRef.current) return;
        // Prevent default touch behavior (scrolling)
        if ('touches' in e) {
            e.preventDefault();
        }
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const diff = clientX - dragRef.current.startX;
        console.log('👆 Swipe Move - Current X:', clientX, 'Diff:', diff);
        // Limit swipe range
        if (diff > -140 && diff < 140) {
            setSwipeX(diff);
            swipeXRef.current = diff; // Update ref for listeners
        }
    };
    const onSwipeEnd = ()=>{
        setIsDragging(false);
        const currentX = swipeXRef.current; // Read from ref
        console.log('🏁 Swipe End at X:', currentX);
        if (currentX > 80) {
            // Right Swipe - Open Profile (Call)
            handleCallNow();
        } else if (currentX < -80) {
            // Left Swipe - Dismiss
            handleDismiss();
        }
        // Reset
        setSwipeX(0);
        swipeXRef.current = 0;
        dragRef.current = null;
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (isDragging && isMobile) {
            // Use passive: false to allow preventDefault in touchmove
            window.addEventListener('touchmove', onSwipeMove, {
                passive: false
            });
            window.addEventListener('touchend', onSwipeEnd);
            window.addEventListener('mousemove', onSwipeMove);
            window.addEventListener('mouseup', onSwipeEnd);
        }
        return ()=>{
            window.removeEventListener('touchmove', onSwipeMove);
            window.removeEventListener('touchend', onSwipeEnd);
            window.removeEventListener('mousemove', onSwipeMove);
            window.removeEventListener('mouseup', onSwipeEnd);
        };
    }, [
        isDragging,
        isMobile
    ]); // Removed swipeX from dependencies
    if (!upcomingCall && !debugForce) return null;
    // Use dummy data if debugForce is on but no real call exists
    const displayCall = upcomingCall || {
        id: "debug-id",
        customer_name: "John Doe (Debug)",
        campaign_name: "Sample Campaign",
        disposition: "Call Back",
        sub_disposition: "Interested",
        outcome: "Success",
        next_called_at: new Date().toISOString(),
        notes: "This is a debug overlay for visual testing.",
        campaigns: {
            name: "Sample Campaign"
        }
    };
    // We only use isCallingActive now (from localStorage), not route-based busy detection
    console.log('🔍 Call Status Debug:', {
        isCallingActive,
        displayCallId: displayCall.id,
        debugForce,
        routerPath: router.pathname,
        swipeXCurrent: swipeX
    });
    // --- MOBILE VIEW ---
    if (isMobile) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "fixed inset-0 z-[99999] bg-slate-900 text-white flex flex-col animate-in fade-in duration-300",
            children: [
                conflictInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "absolute inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-warning text-amber-500 text-3xl"
                            }, void 0, false, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 626,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 625,
                            columnNumber: 26
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                            className: "text-xl font-bold mb-2",
                            children: "Slot Conflict"
                        }, void 0, false, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 628,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-slate-400 mb-8",
                            children: [
                                "Already booked: ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-white font-bold",
                                    children: conflictInfo.customer
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 630,
                                    columnNumber: 45
                                }, this),
                                " at ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-white font-bold",
                                    children: conflictInfo.time
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 630,
                                    columnNumber: 118
                                }, this),
                                "."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 629,
                            columnNumber: 26
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>setConflictInfo(null),
                            className: "w-full py-4 rounded-2xl bg-white/10 text-white font-bold uppercase tracking-widest hover:bg-white/20",
                            children: "Try Another Time"
                        }, void 0, false, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 632,
                            columnNumber: 26
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CallReminderOverlay.tsx",
                    lineNumber: 624,
                    columnNumber: 22
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6 relative overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi flex fi-rr-calendar-clock text-xs text-slate-400"
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 643,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-[10px] font-bold text-slate-300 uppercase tracking-widest",
                                    children: [
                                        "Exp: ",
                                        displayCall.expiry_date ? new Date(displayCall.expiry_date).toLocaleDateString() : 'N/A'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 644,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 642,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "relative z-10 my-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-32 h-32 rounded-full border-4 border-slate-700 bg-slate-800 flex items-center justify-center shadow-2xl relative z-20",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-5xl font-bold text-white/90",
                                        children: displayCall.customer_name.charAt(0).toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 652,
                                        columnNumber: 30
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 651,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-full rounded-full border border-blue-500/30 animate-[ping_2s_infinite]"
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 657,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 left-0 w-full h-full rounded-full border border-blue-500/20 animate-[ping_2s_infinite_0.5s]"
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 658,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute -inset-4 rounded-full bg-blue-500/5 animate-pulse z-0"
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 659,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 650,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "z-10 w-full flex flex-col items-center gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold tracking-tight leading-tight px-4",
                                    children: displayCall.customer_name
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 664,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-[10px]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-hashtag"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CallReminderOverlay.tsx",
                                            lineNumber: 668,
                                            columnNumber: 30
                                        }, this),
                                        displayCall.campaign_name || 'Active Campaign'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 667,
                                    columnNumber: 26
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 663,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap justify-center gap-2 w-full px-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-1 bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase rounded border border-blue-500/20",
                                    children: displayCall.disposition
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 675,
                                    columnNumber: 25
                                }, this),
                                displayCall.sub_disposition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-1 bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase rounded border border-indigo-500/20",
                                    children: displayCall.sub_disposition
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 676,
                                    columnNumber: 57
                                }, this),
                                displayCall.outcome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase rounded border border-emerald-500/20",
                                    children: displayCall.outcome
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 677,
                                    columnNumber: 49
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 674,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-full max-w-sm space-y-3",
                            children: [
                                displayCall.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-800/50 p-3 rounded-xl border border-white/5 text-center",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-slate-300 text-sm font-medium italic line-clamp-3",
                                        children: [
                                            '"',
                                            displayCall.notes,
                                            '"'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 684,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 683,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-center gap-2 text-slate-400",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-clock text-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CallReminderOverlay.tsx",
                                            lineNumber: 691,
                                            columnNumber: 30
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-sm font-bold",
                                            children: new Date(displayCall.next_called_at).toLocaleString([], {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/CallReminderOverlay.tsx",
                                            lineNumber: 692,
                                            columnNumber: 30
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 690,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 681,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CallReminderOverlay.tsx",
                    lineNumber: 639,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-6 pb-24 space-y-10 z-20 bg-slate-900",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("style", {
                            dangerouslySetInnerHTML: {
                                __html: `
                        @keyframes ring {
                            0% { transform: rotate(0); }
                            5% { transform: rotate(15deg); }
                            10% { transform: rotate(-15deg); }
                            15% { transform: rotate(12deg); }
                            20% { transform: rotate(-12deg); }
                            25% { transform: rotate(0); }
                            100% { transform: rotate(0); }
                        }
                    `
                            }
                        }, void 0, false, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 702,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex justify-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-bold text-slate-500 uppercase tracking-widest self-center mr-2",
                                    children: "Snooze"
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 716,
                                    columnNumber: 26
                                }, this),
                                [
                                    5,
                                    10,
                                    15
                                ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSnooze(m),
                                        className: "px-4 py-2 rounded-full bg-slate-800 border border-slate-700 text-white text-xs font-bold hover:bg-slate-700 active:scale-95 transition-all",
                                        children: [
                                            "+",
                                            m,
                                            "m"
                                        ]
                                    }, m, true, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 718,
                                        columnNumber: 29
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 715,
                            columnNumber: 21
                        }, this),
                        isCallingActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: handleDismiss,
                            className: "w-full h-16 rounded-full bg-slate-800 border border-red-500/50 text-red-500 font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi flex fi-rr-cross-circle text-xl"
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 734,
                                    columnNumber: 29
                                }, this),
                                "Dismiss Reminder"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 730,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "relative w-full max-w-[340px] mx-auto h-16 rounded-full bg-slate-800/80 border border-slate-700/50 shadow-xl flex items-center justify-between px-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute inset-0 rounded-full overflow-hidden pointer-events-none",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `absolute left-6 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${swipeX < -40 ? 'opacity-100' : 'opacity-30'}`
                                        }, void 0, false, {
                                            fileName: "[project]/components/CallReminderOverlay.tsx",
                                            lineNumber: 743,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `absolute right-6 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${swipeX > 40 ? 'opacity-100' : 'opacity-30'}`
                                        }, void 0, false, {
                                            fileName: "[project]/components/CallReminderOverlay.tsx",
                                            lineNumber: 747,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 flex items-center justify-between px-14 opacity-40 text-[10px] font-bold uppercase tracking-widest",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: swipeX < 0 ? 'text-red-400' : 'text-slate-400',
                                                    children: "Dismiss"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                                    lineNumber: 753,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: swipeX > 0 ? 'text-emerald-400' : 'text-slate-400',
                                                    children: "Open"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                                    lineNumber: 754,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/CallReminderOverlay.tsx",
                                            lineNumber: 752,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 z-0 transition-opacity duration-300",
                                            style: {
                                                background: swipeX > 0 ? `linear-gradient(90deg, transparent 50%, rgba(16, 185, 129, ${Math.min(0.3, swipeX / 150)}) 100%)` : swipeX < 0 ? `linear-gradient(-90deg, transparent 50%, rgba(239, 68, 68, ${Math.min(0.3, Math.abs(swipeX) / 150)}) 100%)` : 'transparent'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/CallReminderOverlay.tsx",
                                            lineNumber: 758,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 741,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: `absolute top-1/2 -mt-10 w-20 h-20 left-1/2 -ml-10 rounded-full shadow-2xl flex items-center justify-center cursor-grab active:cursor-grabbing z-30 touch-none border-4 transition-[background-color,border-color,box-shadow] duration-300
                                    ${!isDragging ? 'transition-transform' : ''}
                                    ${swipeX > 30 ? 'bg-emerald-500 border-emerald-400 shadow-emerald-500/50' : swipeX < -30 ? 'bg-red-500 border-red-400 shadow-red-500/50' : 'bg-white border-slate-900/10'}`,
                                    style: {
                                        transform: `translateX(${swipeX}px)`
                                    },
                                    onMouseDown: onSwipeStart,
                                    onTouchStart: (e)=>{
                                        console.log('📱 Thumb Touch Start - swipeX:', swipeX);
                                        onSwipeStart(e);
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: `fi flex fi-sr-bell text-2xl transition-all origin-top 
                                    ${swipeX === 0 ? 'animate-[ring_2s_infinite]' : ''} 
                                    ${swipeX > 30 || swipeX < -30 ? 'text-white scale-110' : 'text-slate-900'}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 786,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 771,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 738,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/CallReminderOverlay.tsx",
                    lineNumber: 701,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/CallReminderOverlay.tsx",
            lineNumber: 621,
            columnNumber: 13
        }, this);
    }
    // --- DESKTOP VIEW (Original) ---
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: {
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '260px'
        },
        onMouseDown: onMouseDown,
        className: `fixed z-[99999] bg-[#1a1f24] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden select-none border border-white/10 transition-transform 
                animate-in fade-in slide-in-from-right-full duration-700 ease-out 
                ${isExiting ? 'animate-out fade-out slide-out-to-right-full duration-700 ease-in' : ''}
                ${isDragging ? 'scale-105 cursor-grabbing' : 'cursor-grab'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-4 pb-1 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: (e)=>{
                            e.stopPropagation();
                            handleDismiss();
                        },
                        className: "absolute top-2 right-2 w-6 h-6 rounded-md flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-colors z-[60]",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-cross-small text-[14px]"
                        }, void 0, false, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 817,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 810,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-11 h-11 rounded-xl border border-blue-500/20 bg-blue-500/10 flex items-center justify-center shadow-inner",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-sr-bell text-blue-400 text-xl animate-[ring_2s_infinite] origin-top"
                                        }, void 0, false, {
                                            fileName: "[project]/components/CallReminderOverlay.tsx",
                                            lineNumber: 822,
                                            columnNumber: 29
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 821,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("style", {
                                        dangerouslySetInnerHTML: {
                                            __html: `
                            @keyframes ring {
                                0% { transform: rotate(0); }
                                5% { transform: rotate(15deg); }
                                10% { transform: rotate(-15deg); }
                                15% { transform: rotate(12deg); }
                                20% { transform: rotate(-12deg); }
                                25% { transform: rotate(0); }
                                100% { transform: rotate(0); }
                            }
                        `
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 824,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 820,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-white font-bold text-[14px] truncate leading-tight",
                                        children: displayCall.customer_name
                                    }, void 0, false, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 837,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[#00c985] text-[9px] font-bold uppercase tracking-wider mt-0.5",
                                        children: [
                                            "CAMPAIGN : ",
                                            displayCall.campaign_name || 'ACTIVE CAMPAIGN'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 840,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 836,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 819,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CallReminderOverlay.tsx",
                lineNumber: 809,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "px-4 space-y-2.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white/5 rounded-lg p-2.5 border border-white/5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-[8px] font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-sm uppercase border border-blue-400/10",
                                    children: displayCall.disposition
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 851,
                                    columnNumber: 25
                                }, this),
                                displayCall.sub_disposition && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-[8px] font-bold text-indigo-400 bg-indigo-400/10 px-1.5 py-0.5 rounded-sm uppercase border border-indigo-400/10",
                                    children: displayCall.sub_disposition
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 852,
                                    columnNumber: 57
                                }, this),
                                displayCall.outcome && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-[8px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded-sm uppercase border border-emerald-400/10",
                                    children: displayCall.outcome
                                }, void 0, false, {
                                    fileName: "[project]/components/CallReminderOverlay.tsx",
                                    lineNumber: 853,
                                    columnNumber: 49
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 850,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 849,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "space-y-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-slate-400",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-clock text-[10px]"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 859,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-medium",
                                        children: new Date(displayCall.next_called_at).toLocaleString([], {
                                            dateStyle: 'short',
                                            timeStyle: 'short'
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 860,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 858,
                                columnNumber: 21
                            }, this),
                            displayCall.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-start gap-2 text-slate-500",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-document text-[10px] mt-0.5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 866,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] font-medium leading-tight italic truncate opacity-70",
                                        children: displayCall.notes
                                    }, void 0, false, {
                                        fileName: "[project]/components/CallReminderOverlay.tsx",
                                        lineNumber: 867,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 865,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 857,
                        columnNumber: 18
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CallReminderOverlay.tsx",
                lineNumber: 848,
                columnNumber: 13
            }, this),
            conflictInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-[#1a1f24]/98 z-50 flex flex-col items-center justify-center p-4 text-center animate-in fade-in zoom-in-95",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center mb-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-warning text-amber-500 text-lg"
                        }, void 0, false, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 879,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 878,
                        columnNumber: 22
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                        className: "text-white font-bold text-[12px] mb-1 uppercase tracking-wider",
                        children: "Conflict"
                    }, void 0, false, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 881,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-slate-400 text-[10px] leading-tight mb-4 px-1",
                        children: [
                            "Already have ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-white font-bold",
                                children: conflictInfo.customer
                            }, void 0, false, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 883,
                                columnNumber: 38
                            }, this),
                            " at ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                className: "text-white font-bold",
                                children: conflictInfo.time
                            }, void 0, false, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 883,
                                columnNumber: 111
                            }, this),
                            "."
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 882,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col w-full gap-1.5",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            onClick: ()=>setConflictInfo(null),
                            className: "h-9 rounded-lg bg-white/5 text-white font-bold text-[11px] uppercase border border-white/10 hover:bg-white/10 transition-all",
                            children: "Try Another Time"
                        }, void 0, false, {
                            fileName: "[project]/components/CallReminderOverlay.tsx",
                            lineNumber: 886,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 885,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CallReminderOverlay.tsx",
                lineNumber: 877,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-4 pt-3 space-y-2.5",
                children: [
                    isCallingActive ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: handleDismiss,
                        className: "w-full h-11 rounded-lg bg-slate-800 border border-red-500/50 text-red-500 font-bold text-[12px] uppercase tracking-wider transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-cross-circle text-xs"
                            }, void 0, false, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 899,
                                columnNumber: 25
                            }, this),
                            "Dismiss Reminder"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 895,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>{
                            setIsExiting(true);
                            saveInteractedKey(displayCall.id, displayCall.next_called_at);
                            if (audioInstanceRef.current) {
                                audioInstanceRef.current.pause();
                                audioInstanceRef.current.currentTime = 0;
                            }
                            setTimeout(()=>{
                                router.push(`/campaign/${displayCall.campaign_id}/${displayCall.id}`);
                            }, 600);
                        },
                        className: "w-full h-11 rounded-lg bg-[#00c985] hover:bg-[#00ad73] text-white font-bold text-[12px] uppercase tracking-wider transition-all active:scale-95 shadow-lg shadow-emerald-500/5 flex items-center justify-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-phone-call text-xs"
                            }, void 0, false, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 917,
                                columnNumber: 25
                            }, this),
                            "Call Now"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 903,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-3 gap-2",
                        children: [
                            5,
                            10,
                            15
                        ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>handleSnooze(m),
                                className: "h-9 rounded-full bg-slate-800/80 border border-slate-700/50 hover:bg-slate-700 text-white font-bold text-[10px] transition-all active:scale-95 shadow-lg shadow-black/20",
                                children: [
                                    "+",
                                    m,
                                    "M"
                                ]
                            }, m, true, {
                                fileName: "[project]/components/CallReminderOverlay.tsx",
                                lineNumber: 924,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/CallReminderOverlay.tsx",
                        lineNumber: 922,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/CallReminderOverlay.tsx",
                lineNumber: 893,
                columnNumber: 13
            }, this)
        ]
    }, displayCall.id, true, {
        fileName: "[project]/components/CallReminderOverlay.tsx",
        lineNumber: 799,
        columnNumber: 9
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/LogPip.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LogPip
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/bridgeLogger.ts [ssr] (ecmascript)");
;
;
;
;
function LogPip() {
    const [isOpen, setIsOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('system');
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [bridgeLogs, setBridgeLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [catFilter, setCatFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('all');
    const [position, setPosition] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        x: 20,
        y: 70
    });
    const [isDragging, setIsDragging] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const dragRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const savedState = localStorage.getItem('tfc_log_pip_open');
        if (savedState === 'true') setIsOpen(true);
        const savedPos = localStorage.getItem('tfc_log_pip_pos');
        if (savedPos) setPosition(JSON.parse(savedPos));
        const savedTab = localStorage.getItem('tfc_log_pip_tab');
        if (savedTab === 'bridge' || savedTab === 'system') setActiveTab(savedTab);
        setLogs(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalLogger"].getLogs().slice(0, 100));
        setBridgeLogs(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalBridgeLogger"].getLogs().slice(0, 100));
        const handleNewLog = ()=>{
            requestAnimationFrame(()=>{
                setLogs(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalLogger"].getLogs().slice(0, 100));
            });
        };
        const handleNewBridgeLog = ()=>{
            requestAnimationFrame(()=>{
                setBridgeLogs(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalBridgeLogger"].getLogs().slice(0, 100));
            });
        };
        const handleCleared = ()=>{
            requestAnimationFrame(()=>{
                setLogs([]);
            });
        };
        const handleBridgeCleared = ()=>{
            requestAnimationFrame(()=>{
                setBridgeLogs([]);
            });
        };
        const handleToggle = (e)=>{
            const newState = e.detail;
            setIsOpen(newState);
            localStorage.setItem('tfc_log_pip_open', String(newState));
        };
        window.addEventListener('tfc-new-log', handleNewLog);
        window.addEventListener('tfc-new-bridge-log', handleNewBridgeLog);
        window.addEventListener('tfc-logs-cleared', handleCleared);
        window.addEventListener('tfc-bridge-logs-cleared', handleBridgeCleared);
        window.addEventListener('tfc-toggle-log-pip', handleToggle);
        return ()=>{
            window.removeEventListener('tfc-new-log', handleNewLog);
            window.removeEventListener('tfc-new-bridge-log', handleNewBridgeLog);
            window.removeEventListener('tfc-logs-cleared', handleCleared);
            window.removeEventListener('tfc-bridge-logs-cleared', handleBridgeCleared);
            window.removeEventListener('tfc-toggle-log-pip', handleToggle);
        };
    }, []);
    // Save tab preference
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        localStorage.setItem('tfc_log_pip_tab', activeTab);
    }, [
        activeTab
    ]);
    // Get unique categories for system logs filtering
    const categories = Array.from(new Set(logs.map((l)=>l.category || 'Global')));
    const filteredLogs = logs.filter((l)=>catFilter === 'all' || (l.category || 'Global') === catFilter);
    const handleMouseDown = (e)=>{
        if (!containerRef.current) return;
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            startPosX: position.x,
            startPosY: position.y
        };
    };
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleMouseMove = (e)=>{
            if (!isDragging || !dragRef.current) return;
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;
            const newX = Math.max(0, Math.min(window.innerWidth - 320, dragRef.current.startPosX + deltaX));
            const newY = Math.max(0, Math.min(window.innerHeight - 400, dragRef.current.startPosY + deltaY));
            setPosition({
                x: newX,
                y: newY
            });
        };
        const handleMouseUp = ()=>{
            if (isDragging) localStorage.setItem('tfc_log_pip_pos', JSON.stringify(position));
            setIsDragging(false);
            dragRef.current = null;
        };
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return ()=>{
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [
        isDragging,
        position
    ]);
    if (!isOpen) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        ref: containerRef,
        style: {
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '320px',
            height: '400px',
            zIndex: 9999,
            cursor: isDragging ? 'grabbing' : 'auto'
        },
        className: "bg-[#0d1117] border border-gray-700 rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "bg-gray-800 border-b border-gray-700 flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-2 flex items-center justify-between cursor-grab active:cursor-grabbing",
                        onMouseDown: handleMouseDown,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-2 h-2 rounded-full bg-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/LogPip.tsx",
                                                lineNumber: 139,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-2 h-2 rounded-full bg-amber-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/LogPip.tsx",
                                                lineNumber: 140,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-2 h-2 rounded-full bg-emerald-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/LogPip.tsx",
                                                lineNumber: 141,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/LogPip.tsx",
                                        lineNumber: 138,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-black text-white/40 uppercase tracking-widest",
                                        children: "Debug Console"
                                    }, void 0, false, {
                                        fileName: "[project]/components/LogPip.tsx",
                                        lineNumber: 143,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/LogPip.tsx",
                                lineNumber: 137,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setIsOpen(false);
                                    localStorage.setItem('tfc_log_pip_open', 'false');
                                },
                                className: "w-5 h-5 flex items-center justify-center rounded hover:bg-white/10 text-gray-400",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-cross-small"
                                }, void 0, false, {
                                    fileName: "[project]/components/LogPip.tsx",
                                    lineNumber: 149,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/LogPip.tsx",
                                lineNumber: 145,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LogPip.tsx",
                        lineNumber: 136,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex border-t border-gray-700/50",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('system'),
                                className: `flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'system' ? 'text-[#4b33e8] bg-white/5 border-b-2 border-[#4b33e8]' : 'text-gray-500 hover:text-gray-300'}`,
                                children: "System Logs"
                            }, void 0, false, {
                                fileName: "[project]/components/LogPip.tsx",
                                lineNumber: 154,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setActiveTab('bridge'),
                                className: `flex-1 py-1.5 text-[9px] font-black uppercase tracking-wider transition-all ${activeTab === 'bridge' ? 'text-[#4b33e8] bg-white/5 border-b-2 border-[#4b33e8]' : 'text-gray-500 hover:text-gray-300'}`,
                                children: "Bridge Logs"
                            }, void 0, false, {
                                fileName: "[project]/components/LogPip.tsx",
                                lineNumber: 160,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LogPip.tsx",
                        lineNumber: 153,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/LogPip.tsx",
                lineNumber: 135,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-auto p-2 bg-black/50",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "min-w-full inline-block font-mono text-[9px] space-y-1",
                    children: activeTab === 'system' ? filteredLogs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex gap-2 hover:bg-white/5 p-0.5 rounded group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: `shrink-0 font-bold ${log.level === 'error' ? 'text-red-500' : log.level === 'warn' ? 'text-amber-500' : log.level === 'info' ? 'text-blue-500' : 'text-gray-500'}`,
                                    children: [
                                        "[",
                                        log.level[0].toUpperCase(),
                                        "]"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/LogPip.tsx",
                                    lineNumber: 175,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-[8px] text-gray-600 font-bold shrink-0",
                                    children: !log.category || log.category === '/' ? 'HOME' : log.category.split('/').pop()?.toUpperCase() || 'GLOBAL'
                                }, void 0, false, {
                                    fileName: "[project]/components/LogPip.tsx",
                                    lineNumber: 182,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-gray-400 whitespace-pre-wrap",
                                    children: log.message
                                }, void 0, false, {
                                    fileName: "[project]/components/LogPip.tsx",
                                    lineNumber: 185,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, log.id, true, {
                            fileName: "[project]/components/LogPip.tsx",
                            lineNumber: 174,
                            columnNumber: 29
                        }, this)) : bridgeLogs.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-col gap-1 border-b border-white/5 pb-1 mb-1 last:border-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: `px-1 rounded-[2px] text-[7px] font-black uppercase ${msg.direction === 'out' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`,
                                            children: msg.direction === 'out' ? 'OUT' : 'IN'
                                        }, void 0, false, {
                                            fileName: "[project]/components/LogPip.tsx",
                                            lineNumber: 192,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-white font-black uppercase text-[8px] truncate",
                                            children: msg.type
                                        }, void 0, false, {
                                            fileName: "[project]/components/LogPip.tsx",
                                            lineNumber: 195,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-[7px] text-gray-600 ml-auto",
                                            children: new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour12: false,
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/components/LogPip.tsx",
                                            lineNumber: 196,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/LogPip.tsx",
                                    lineNumber: 191,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "text-[8px] text-gray-400 bg-white/5 p-1 rounded overflow-x-auto whitespace-pre font-mono",
                                    children: typeof msg.payload === 'object' ? JSON.stringify(msg.payload) : String(msg.payload)
                                }, void 0, false, {
                                    fileName: "[project]/components/LogPip.tsx",
                                    lineNumber: 198,
                                    columnNumber: 33
                                }, this)
                            ]
                        }, msg.id, true, {
                            fileName: "[project]/components/LogPip.tsx",
                            lineNumber: 190,
                            columnNumber: 29
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/LogPip.tsx",
                    lineNumber: 171,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/LogPip.tsx",
                lineNumber: 170,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-1 px-2 border-t border-gray-800 bg-gray-900 flex justify-between items-center gap-2",
                children: [
                    activeTab === 'system' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                        value: catFilter,
                        onChange: (e)=>setCatFilter(e.target.value),
                        className: "flex-1 bg-transparent border-none text-[8px] text-gray-400 font-bold outline-none uppercase cursor-pointer",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                value: "all",
                                className: "bg-gray-900",
                                children: "ALL PAGES"
                            }, void 0, false, {
                                fileName: "[project]/components/LogPip.tsx",
                                lineNumber: 215,
                                columnNumber: 25
                            }, this),
                            categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                    value: cat,
                                    className: "bg-gray-900",
                                    children: (cat === '/' ? 'HOME' : cat.split('/').pop()?.toUpperCase()) || 'GLOBAL'
                                }, cat, false, {
                                    fileName: "[project]/components/LogPip.tsx",
                                    lineNumber: 217,
                                    columnNumber: 29
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LogPip.tsx",
                        lineNumber: 210,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex-1 text-[8px] text-gray-600 font-bold uppercase",
                        children: [
                            bridgeLogs.length,
                            " MESSAGES"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LogPip.tsx",
                        lineNumber: 223,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const data = activeTab === 'system' ? logs : bridgeLogs;
                                    const text = data.map((l)=>activeTab === 'system' ? `[${new Date(l.timestamp).toLocaleString()}] [${l.level.toUpperCase()}] [${l.category}] ${l.message}` : `[${new Date(l.timestamp).toLocaleString()}] [${l.direction.toUpperCase()}] [${l.type}] ${JSON.stringify(l.payload)}`).join('\n');
                                    const blob = new Blob([
                                        text
                                    ], {
                                        type: 'text/plain'
                                    });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `tfc_pip_${activeTab}_logs_${new Date().getTime()}.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                },
                                className: "text-[8px] text-blue-500 font-black hover:underline uppercase",
                                children: "DL"
                            }, void 0, false, {
                                fileName: "[project]/components/LogPip.tsx",
                                lineNumber: 229,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>activeTab === 'system' ? __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalLogger"].clearLogs() : __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalBridgeLogger"].clearLogs(),
                                className: "text-[8px] text-red-500 font-black hover:underline uppercase",
                                children: "CLEAR"
                            }, void 0, false, {
                                fileName: "[project]/components/LogPip.tsx",
                                lineNumber: 249,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/LogPip.tsx",
                        lineNumber: 228,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/LogPip.tsx",
                lineNumber: 208,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/LogPip.tsx",
        lineNumber: 125,
        columnNumber: 9
    }, this);
}
}),
"[project]/context/SessionContext.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "SessionProvider",
    ()=>SessionProvider,
    "useSession",
    ()=>useSession
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
const SessionContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["createContext"])(undefined);
const SessionProvider = ({ children })=>{
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [currentSession, setCurrentSession] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [allSessions, setAllSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [isLocked, setIsLocked] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const lastRedirectPath = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const lastRedirectTime = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(0);
    // --- REDIRECTION LOGIC ---
    const handleRedirection = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((sessions)=>{
        if (!router.isReady || router.pathname.includes('/login')) return;
        // 1. Find the Absolute Master (Active or Disposition Pending in ANY campaign)
        const masterSession = [
            ...sessions
        ].sort((a, b)=>new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).find((s)=>s.manual_status === 'active' || s.manual_status === 'disposition_pending' || s.status === 'active' || s.status === 'disposition_pending');
        // 2. If no Master, look for the latest Assigned Lead matching CURRENT context
        let targetSession = masterSession;
        if (!targetSession) {
            const currentCampaignId = router.query.id;
            const currentCustomerId = router.query.customerId;
            const contextualAssigned = [
                ...sessions
            ].sort((a, b)=>new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()).find((s)=>s.status === 'assigned' && String(s.campaign_id) === String(currentCampaignId));
            if (contextualAssigned && !!currentCustomerId) {
                targetSession = contextualAssigned;
            }
        }
        if (!targetSession) {
            if (("TURBOPACK compile-time value", "undefined") !== 'undefined' && localStorage.getItem('manual_inspection_snapshot')) //TURBOPACK unreachable
            ;
            setCurrentSession(null);
            return;
        }
        const hot = targetSession;
        setCurrentSession(hot);
        // NEW: URL-based Manual Mode Handling
        const isManualInUrl = router.query.isManual === 'true';
        if (isManualInUrl) {
            const status = hot.manual_status || hot.status;
            const isGenuinelyHot = status === 'active' || status === 'disposition_pending';
            const currentCustomerId = router.query.customerId;
            // If we are on a different CUSTOMER than the server's 'hot' session
            // AND that server session is NOT active/pending, we STAY on the manual lead.
            if (String(hot.customer_id) !== String(currentCustomerId) && !isGenuinelyHot) {
                setIsLocked(true);
                console.log("[Session-Context] 🔒 Manual Mode (URL) Active. Ignoring non-hot server session:", hot.id);
                return;
            }
        }
        // FALLBACK: Heritage Manual Lock (LocalStorage)
        const snapshotStr = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        // Perform Redirection logic
        const status = hot.manual_status || hot.status;
        const isActuallyHot = status === 'active' || status === 'disposition_pending';
        // Redirect for 'assigned' ONLY if we are already on a customer page of the SAME campaign
        const currentCampaignId = router.query.id;
        const isSequentialAssignment = status === 'assigned' && !!router.query.customerId && String(hot.campaign_id) === String(currentCampaignId);
        if (!isActuallyHot && !isSequentialAssignment) return;
        const targetCamp = hot.is_manual ? hot.manual_campaign_id || hot.campaign_id : hot.campaign_id;
        const targetCust = hot.is_manual ? hot.manual_customer_id : hot.customer_id;
        if (!targetCamp || !targetCust) return;
        const targetPath = `/portal/campaign/${targetCamp}/${targetCust}`;
        const maskPath = `/campaign/${targetCamp}/${targetCust}`;
        const currentPath = router.asPath.split('?')[0].replace(/\/$/, "");
        const normalizedTarget = targetPath.replace(/\/$/, "");
        const normalizedMask = maskPath.replace(/\/$/, "");
        const isAlreadyThere = currentPath === normalizedTarget || currentPath === normalizedMask;
        const now = Date.now();
        if (!isAlreadyThere && (lastRedirectPath.current !== normalizedTarget || now - lastRedirectTime.current > 3000)) {
            console.log(`[Session-Context] 🚀 Redirecting to: ${normalizedTarget}`);
            lastRedirectPath.current = normalizedTarget;
            lastRedirectTime.current = now;
            router.push(targetPath);
        }
    }, [
        router
    ]);
    const fetchSessions = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (!user?.uid) return;
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').eq('user_id', user.uid).order('updated_at', {
                ascending: false
            }).limit(10);
            if (error) throw error;
            const latestSessions = data || [];
            setAllSessions(latestSessions);
            handleRedirection(latestSessions);
        } catch (e) {
            console.error("[Session-Context] Fetch error:", e);
        } finally{
            setIsLoading(false);
        }
    }, [
        user?.uid,
        handleRedirection
    ]);
    // Initial and Polling
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!mounted || !user?.uid) return;
        fetchSessions();
        const interval = setInterval(fetchSessions, 5000);
        return ()=>clearInterval(interval);
    }, [
        user?.uid,
        mounted,
        fetchSessions
    ]);
    // Real-time
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!user?.uid) return;
        const channel = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].channel(`session_updates_${user.uid}`).on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'call_sessions',
            filter: `user_id=eq.${user.uid}`
        }, ()=>{
            console.log("[Session-Context] ⚡ Real-time update detected.");
            fetchSessions();
        }).subscribe();
        return ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
        };
    }, [
        user?.uid,
        fetchSessions
    ]);
    const startManualLock = (session)=>{
        localStorage.setItem('manual_inspection_snapshot', JSON.stringify(session));
        setIsLocked(true);
    };
    const clearManualLock = ()=>{
        localStorage.removeItem('manual_inspection_snapshot');
        setIsLocked(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(SessionContext.Provider, {
        value: {
            currentSession,
            allSessions,
            isLoading,
            isLocked,
            startManualLock,
            clearManualLock
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/context/SessionContext.tsx",
        lineNumber: 228,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useSession = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useContext"])(SessionContext);
    if (context === undefined) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/PortalContainer.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>PortalContainer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UserProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/UserProvider.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlobalCallHandler$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/GlobalCallHandler.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CallReminderOverlay$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/CallReminderOverlay.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LogPip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/LogPip.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/SessionContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UserProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlobalCallHandler$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CallReminderOverlay$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UserProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlobalCallHandler$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CallReminderOverlay$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
function PortalContainer({ children }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Minimal Layout Pages (No Sidebar/Header)
    const minimalPages = [
        '/portal/login',
        '/portal/signup',
        '/portal/signup-success',
        '/portal/hold',
        '/portal/pending',
        '/portal/suspended',
        '/portal/rejected',
        '/portal/profile-completion'
    ];
    const isMinimal = minimalPages.includes(router.pathname);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$UserProvider$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["UserProvider"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$context$2f$SessionContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["SessionProvider"], {
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"], {
                hideSidebar: isMinimal,
                hideHeader: isMinimal,
                children: [
                    children,
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$GlobalCallHandler$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/PortalContainer.tsx",
                        lineNumber: 32,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$CallReminderOverlay$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/PortalContainer.tsx",
                        lineNumber: 33,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$LogPip$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                        fileName: "[project]/components/PortalContainer.tsx",
                        lineNumber: 34,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/PortalContainer.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/PortalContainer.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/PortalContainer.tsx",
        lineNumber: 28,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/_app.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogService$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dialogService.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$networkInterceptors$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/networkInterceptors.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/flutterBridge.ts [ssr] (ecmascript)"); // Initialize bridge listeners
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OfflineOverlay$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/OfflineOverlay.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PortalContainer$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PortalContainer.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PortalContainer$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PortalContainer$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
;
;
function App({ Component, pageProps }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Decide if this is a portal page or a marketing page
    // Since we moved app files to /portal directory, their actual pathname will start with /portal
    const isPortalPage = router.pathname.startsWith('/portal');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogService$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["DialogProvider"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OfflineOverlay$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/pages/_app.tsx",
                lineNumber: 30,
                columnNumber: 7
            }, this),
            isPortalPage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PortalContainer$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                    ...pageProps
                }, void 0, false, {
                    fileName: "[project]/pages/_app.tsx",
                    lineNumber: 33,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/_app.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                ...pageProps
            }, void 0, false, {
                fileName: "[project]/pages/_app.tsx",
                lineNumber: 36,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/_app.tsx",
        lineNumber: 29,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__4f75df4e._.js.map