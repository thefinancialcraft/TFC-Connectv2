(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/localStorageUtils.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const dataToStore = {
            ...userData,
            all_time_active: userData.all_time_active ?? true
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));
        console.log('User data stored successfully');
    } catch (error) {
        console.error('Error storing user data:', error);
    }
}
function getStoredUserData() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading user data:', error);
    }
    return null;
}
function getAllStoredUsers() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        // First try to get from array storage
        const arrayData = localStorage.getItem(STORAGE_KEY_ARRAY);
        if (arrayData) {
            const parsed = JSON.parse(arrayData);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
        // Fallback to single user storage (for backward compatibility)
        const singleUser = getStoredUserData();
        if (singleUser) {
            return [
                singleUser
            ];
        }
    } catch (error) {
        console.error('Error reading users array:', error);
    }
    return [];
}
function removeStoredUser(userId) {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const allUsers = getAllStoredUsers();
        const filtered = allUsers.filter((u)=>u.user_id !== userId);
        if (filtered.length === 0) {
            // If no users left, clear everything
            clearStoredUserData();
        } else {
            // Update array storage
            localStorage.setItem(STORAGE_KEY_ARRAY, JSON.stringify(filtered));
            // Update single user storage to first remaining user (for backward compatibility)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered[0]));
        }
    } catch (error) {
        console.error('Error removing user:', error);
    }
}
function clearStoredUserData() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STORAGE_KEY_ARRAY);
    } catch (error) {
        console.error('Error clearing user data:', error);
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/supabase.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase,
    "supabaseAdmin",
    ()=>supabaseAdmin
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://qcglmkmhqvmkugaqvqih.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjZ2xta21ocXZta3VnYXF2cWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY0OTA5MTUsImV4cCI6MjA4MjA2NjkxNX0.XRbQNB4sbRgSppMH76ED7OruPYHJgI-xOMLQM7ZT6Lc");
const supabaseServiceRoleKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].env.SUPABASE_SERVICE_ROLE_KEY;
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = supabaseServiceRoleKey ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
}) : null;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/bridgeLogger.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const newEntry = {
                id: Math.random().toString(36).substring(2, 11),
                direction,
                type,
                payload,
                timestamp: new Date().toISOString()
            };
            const existingLogs = this.getLogs();
            const updatedLogs = [
                newEntry,
                ...existingLogs
            ].slice(0, MAX_BRIDGE_LOGS);
            localStorage.setItem(BRIDGE_LOG_STORAGE_KEY, JSON.stringify(updatedLogs));
            // Trigger a custom event so the UI can update in real-time
            window.dispatchEvent(new CustomEvent('tfc-new-bridge-log', {
                detail: newEntry
            }));
        } catch (e) {
            console.error("Failed to save bridge log", e);
        }
    }
    getLogs() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        try {
            const logs = localStorage.getItem(BRIDGE_LOG_STORAGE_KEY);
            if (!logs) return [];
            const parsed = JSON.parse(logs);
            // Ensure it's an array
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            console.error("Failed to parse bridge logs", e);
            return [];
        }
    }
    clearLogs() {
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
        localStorage.removeItem(BRIDGE_LOG_STORAGE_KEY);
        window.dispatchEvent(new CustomEvent('tfc-bridge-logs-cleared'));
    }
}
const globalBridgeLogger = new BridgeLogger();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/flutterBridge.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/bridgeLogger.ts [client] (ecmascript)");
;
;
// Global receiver for Flutter messages to ensure they are logged and dispatched via events
if ("TURBOPACK compile-time truthy", 1) {
    const win = window;
    if (!win.__bridge_initialized) {
        win.fromFlutter = (data)=>{
            // 1. Log the incoming message
            const type = data?.type || 'unknown';
            const value = data?.value;
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["globalBridgeLogger"].addLog('in', type, value);
            // 2. Dispatch as a CustomEvent so multiple components can listen without overwriting
            window.dispatchEvent(new CustomEvent('tfc-bridge-message', {
                detail: data
            }));
            console.log("🔔 [Bridge] Received & Dispatched:", data);
        };
        win.__bridge_initialized = true;
    }
}
const notifyFlutter = (type, value)=>{
    if ("TURBOPACK compile-time truthy", 1) {
        const win = window;
        // Keyed Deduplication: Store last message per type to prevent overwriting during rapid syncs
        if (!win.__bridge_history) win.__bridge_history = {};
        win.__bridge_history[type] = {
            value,
            time: Date.now()
        };
        // Log the outgoing message
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["globalBridgeLogger"].addLog('out', type, value);
        if (win.flutter_inappwebview?.callHandler) {
            console.log(`🚀 [Bridge] Sending ${type}:`, value);
            win.flutter_inappwebview.callHandler('fromWebApp', {
                type,
                value
            });
            return true;
        }
    }
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
    const isBridgeActive = ("TURBOPACK compile-time value", "object") !== 'undefined' && !!window.flutter_inappwebview?.callHandler;
    if (!isBridgeActive) return false;
    // Normalize user data for bridge
    const userInfoPayload = {
        user_name: user.displayName || user.user_name || null,
        employee_id: user.employeeId || user.employee_id || null,
        email: user.email,
        role: user.role,
        designation: user.designation || user.role,
        department: user.department || null,
        createdAt: user.createdAt || user.created_at,
        lastSignInAt: user.lastSignInAt || user.last_sign_in_at,
        profilePicUrl: user.profilePicUrl || user.profile_pic_url
    };
    console.log("🚀 [Bridge] Syncing User Profile");
    return notifyFlutter('sync_user_info', userInfoPayload);
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
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.flutter_inappwebview) {
        console.log("📱 [Bridge] Mobile context. Skipping command sync (type/value) to DB.");
        return;
    }
    try {
        // 1. Fetch current device status to check if it's online
        const { data: device, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('last_seen, status').eq('employee_id', employeeId).eq('is_primary', true).maybeSingle();
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
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
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
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
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
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
            last_seen: new Date().toISOString()
        }).eq('entry_id', entryId).eq('is_primary', true).eq('status', 'connected');
        if (error) console.error("❌ [Heartbeat] Update failed:", error);
    } catch (err) {
        console.error("❌ [Heartbeat] Error:", err);
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/dialogUtils.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
    if (("TURBOPACK compile-time value", "object") !== 'undefined' && window.showDialog) {
        window.showDialog({
            message,
            title: title || (type === 'error' ? 'Error' : type === 'success' ? 'Success' : type === 'warning' ? 'Warning' : 'Information'),
            type
        });
    } else {
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
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    const originalConsole = {
        ...console
    };
    // Replace console.error with dialog
    console.error = (...args)=>{
        originalConsole.error(...args); // Still log to console for debugging
        const message = args.map((arg)=>typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
        showError(message, 'Error');
    };
    // Replace console.warn with dialog
    console.warn = (...args)=>{
        originalConsole.warn(...args);
        const message = args.map((arg)=>typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)).join(' ');
        showWarning(message, 'Warning');
    };
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/monitoring.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/authService.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkAuthAndFetchProfile",
    ()=>checkAuthAndFetchProfile,
    "handleLogout",
    ()=>handleLogout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [client] (ecmascript)");
;
;
async function checkAuthAndFetchProfile() {
    try {
        const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
        const authUser = session?.user;
        if (sessionError || !authUser) {
            return {
                user: null,
                error: "No session found",
                shouldRedirect: true
            };
        }
        // Fetch profile from database
        const { data: profileData, error: profileError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("*").eq("user_id", authUser.id).maybeSingle();
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
            updatedAt: profileData?.updated_at || null,
            profilePicUrl: profileData?.profile_pic_url || profileData?.profile_image || null,
            googleCalendarConnected: profileData?.google_calendar_connected || false,
            googleCalendarSkipped: profileData?.google_calendar_skipped || false,
            isClient: profileData?.is_client || false,
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
        if ("TURBOPACK compile-time truthy", 1) {
            const win = window;
            if (win.flutter_inappwebview?.callHandler) {
                win.flutter_inappwebview.callHandler("fromWebApp", {
                    type: "logout",
                    value: true
                });
            }
            // Clear all auth related local storage
            localStorage.clear();
            sessionStorage.clear();
        }
        // 2. Clear Supabase session on server and client
        const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        if (user) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'AUTH',
                description: `User Logout: ${user.email}`,
                user_id: user.id,
                metadata: {
                    email: user.email
                }
            });
        }
        await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
        console.log("👋 [Auth] Logout complete, redirecting to login...");
        router.replace("/login");
    } catch (err) {
        console.error("❌ [Auth] Logout failure:", err);
        router.replace("/login");
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/phoneUtils.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$crypto$2d$js$2f$sha256$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/crypto-js/sha256.js [client] (ecmascript)");
;
/**
 * Utility for phone number encryption and decryption
 * Uses a simple XOR + Base64 scheme with a prefix for identification.
 * This allows both encrypted and plain text numbers to coexist.
 */ const SECRET_KEY = ("TURBOPACK compile-time value", "TfcV2_Secure_9Xk2Lp5Nm8Qj4Rs7Vw1Zy3Bd6G") || "TFC_CONNECT_SECURE_PHONE_VAULT";
const computePhoneHash = (phone)=>{
    if (!phone) return null;
    // Normalize phone number if needed (e.g. remove spaces, dashes)
    // For now, we assume the input is the raw phone string as user types it.
    // We should probably strip common non-digit characters to make search more robust.
    const normalized = phone.replace(/[^0-9]/g, '');
    if (!normalized) return null;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$crypto$2d$js$2f$sha256$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"])(normalized).toString();
};
const encryptPhone = (phone)=>{
    if (!phone) return "";
    // Safety check: Don't encrypt if already encrypted
    if (phone.startsWith("__enc__")) return phone;
    try {
        // Simple symmetric XOR cipher
        const encrypted = phone.split('').map((char, i)=>String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join('');
        // Convert to Base64 for DB storage
        return `__enc__${btoa(encrypted)}`;
    } catch (e) {
        console.error("Shield Encryption Failed:", e);
        return phone; // Fallback to plain text
    }
};
const decryptPhone = (phone)=>{
    if (!phone) return "";
    // If it doesn't have our prefix, it's plain text (legacy data)
    if (!phone.startsWith("__enc__")) return phone;
    try {
        const base64Data = phone.substring(7); // Remove "__enc__"
        const encrypted = atob(base64Data);
        const decrypted = encrypted.split('').map((char, i)=>String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join('');
        return decrypted;
    } catch (e) {
        console.warn("Shield Decryption Failed (possible corrupted data):", e);
        return phone; // Return as-is
    }
};
const formatMaskedPhone = (phone)=>{
    const realPhone = decryptPhone(phone);
    if (!realPhone) return "—";
    if (realPhone.length < 4) return realPhone;
    // Show first 2 and last 2, mask the middle
    return realPhone.substring(0, 2) + "******" + realPhone.substring(realPhone.length - 2);
};
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
"[project]/config/navigation.ts [client] (ecmascript)", ((__turbopack_context__) => {
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/context/UserContext.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UserContext",
    ()=>UserContext,
    "useUser",
    ()=>useUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const UserContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["createContext"])({
    user: null,
    mounted: false,
    loading: true,
    error: null,
    statusMessage: "",
    refetchUser: async ()=>{}
});
const useUser = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useContext"])(UserContext);
};
_s(useUser, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useCallSessionRedirect.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCallSessionRedirect",
    ()=>useCallSessionRedirect
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
function useCallSessionRedirect(userId) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const lastPulseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(0);
    const checkActiveSession = async ()=>{
        if (!userId || !router.isReady) return;
        // Prevent redirects during active save operations
        const isSaving = ("TURBOPACK compile-time value", "object") !== 'undefined' && localStorage.getItem('lead_save_in_progress') === 'true';
        if (isSaving) return;
        // Match debounce to heartbeat (approx 500ms-1000ms is safe)
        const now = Date.now();
        if (now - lastPulseRef.current < 500) return;
        lastPulseRef.current = now;
        try {
            // Fetch all sessions to monitor them separately
            const { data: sessions, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from('call_sessions').select('*').eq('user_id', userId);
            if (error) throw error;
            if (!sessions || sessions.length === 0) return;
            // 1. Filter for "HOT" sessions (Active or Pending)
            const manualHotSessions = sessions.filter((s)=>s.manual_status === 'active' || s.manual_status === 'disposition_pending');
            const systemHotSessions = sessions.filter((s)=>s.status === 'active' || s.status === 'disposition_pending');
            console.log(`[Session-Guard] Pulse Check: Manual-Hot=${manualHotSessions.length}, System-Hot=${systemHotSessions.length}`);
            let sessionToFollow = null;
            let prioritizeManual = false;
            // PRIORITY RULE: Manual sessions take priority over System sessions
            if (manualHotSessions.length > 0) {
                // Pick the most recently updated manual session
                sessionToFollow = manualHotSessions.sort((a, b)=>new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
                prioritizeManual = true;
            } else if (systemHotSessions.length > 0) {
                // Pick the most recently updated system session
                sessionToFollow = systemHotSessions.sort((a, b)=>new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];
            }
            if (sessionToFollow) {
                const targetCamp = prioritizeManual ? sessionToFollow.manual_campaign_id || sessionToFollow.campaign_id : sessionToFollow.campaign_id;
                const targetCust = prioritizeManual ? sessionToFollow.manual_customer_id : sessionToFollow.customer_id;
                if (targetCamp && targetCust) {
                    const { id: currentCamp, customerId: currentCust } = router.query;
                    const isAlreadyThere = String(currentCamp) === String(targetCamp) && String(currentCust) === String(targetCust);
                    if (!isAlreadyThere) {
                        const expectedPath = `/portal/campaign/${targetCamp}/${targetCust}`;
                        console.log(`[Session-Guard] Forced redirection to HOT session (${prioritizeManual ? 'Manual' : 'System'}): ${expectedPath}`);
                        router.push(expectedPath);
                    }
                }
            } else {
            // NO HOT SESSIONS FOUND
            // If the leads are just 'assigned' (call_start_at is null, etc.), we ALLOW navigation.
            // console.log("[Session-Guard] No active/pending sessions. Navigation allowed.");
            }
        } catch (err) {
            console.error('[Session-Guard] Error:', err);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useCallSessionRedirect.useEffect": ()=>{
            if (!userId) return;
            checkActiveSession();
            const channel = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].channel(`global_session_guard:${userId}`).on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'call_sessions',
                filter: `user_id=eq.${userId}`
            }, {
                "useCallSessionRedirect.useEffect.channel": (payload)=>{
                    console.log(`[Session-Guard] Realtime sync event received:`, payload.eventType);
                    // Short delay to allow DB propagation
                    setTimeout(checkActiveSession, 500);
                }
            }["useCallSessionRedirect.useEffect.channel"]).subscribe();
            const handleVisibility = {
                "useCallSessionRedirect.useEffect.handleVisibility": ()=>{
                    if (document.visibilityState === 'visible') checkActiveSession();
                }
            }["useCallSessionRedirect.useEffect.handleVisibility"];
            // 2000ms Stable Heartbeat (Reduced from aggressive 500ms)
            const heartbeat = setInterval({
                "useCallSessionRedirect.useEffect.heartbeat": ()=>{
                    // Check for localized "save-in-progress" lock to prevent race conditions
                    const isSaving = ("TURBOPACK compile-time value", "object") !== 'undefined' && localStorage.getItem('lead_save_in_progress') === 'true';
                    if (!isSaving) {
                        checkActiveSession();
                    }
                }
            }["useCallSessionRedirect.useEffect.heartbeat"], 2000);
            window.addEventListener('visibilitychange', handleVisibility);
            return ({
                "useCallSessionRedirect.useEffect": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].removeChannel(channel);
                    clearInterval(heartbeat);
                    window.removeEventListener('visibilitychange', handleVisibility);
                }
            })["useCallSessionRedirect.useEffect"];
        }
    }["useCallSessionRedirect.useEffect"], [
        userId,
        router.query
    ]); // Reliable dependency on query change
}
_s(useCallSessionRedirect, "3CPFp/0YwE3Ac/msBkuN/afakww=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useAuthGuard.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthGuard",
    ()=>useAuthGuard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/authService.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
function useAuthGuard() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [statusMessage, setStatusMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("Checking session...");
    const loadingRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(false);
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
            const { data: { session: authSession }, error: authError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const authUser = authSession?.user;
            if (authUser) {
                // --- ⚡ SESSION PROFILE CACHE (Ghostly Fetch Prevention) ---
                // Keeps the profile in memory for the duration of the tab so we don't hit the DB/API every reload.
                const sessionProfileStr = ("TURBOPACK compile-time truthy", 1) ? sessionStorage.getItem('active_user_profile') : "TURBOPACK unreachable";
                if (sessionProfileStr) {
                    try {
                        const cachedProfile = JSON.parse(sessionProfileStr);
                        setUser(cachedProfile);
                        console.log("⚡ [Auth] Restored User Profile from Session Tab Memory. API hit skipped.");
                        if ((isLoginPage || isRootPath) && !isPublicLandingPage) {
                            const lastPath = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('last_visited_path') : "TURBOPACK unreachable";
                            router.push(lastPath || "/dashboard");
                        }
                        setLoading(false);
                        loadingRef.current = false;
                        return;
                    } catch (e) {
                        console.warn("Failed to parse session profile cache", e);
                    }
                }
                // Fetch/Refresh Profile from DB (Only happens on very first login or when tab is perfectly closed)
                setStatusMessage("Fetching user profile...");
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$authService$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["checkAuthAndFetchProfile"])();
                if (result.user) {
                    if (!user) setStatusMessage("Finalizing setup...");
                    setUser(result.user);
                    // Store securely in Tab Memory
                    if ("TURBOPACK compile-time truthy", 1) {
                        sessionStorage.setItem('active_user_profile', JSON.stringify(result.user));
                    }
                    // Logged in: if on login/root, move to dashboard or last path
                    if ((isLoginPage || isRootPath) && !isPublicLandingPage) {
                        if (!user) setStatusMessage("Restoring your screen...");
                        const lastPath = ("TURBOPACK compile-time truthy", 1) ? localStorage.getItem('last_visited_path') : "TURBOPACK unreachable";
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
                    setStatusMessage("Access denied. Please login...");
                    router.push("/login");
                }
            }
        } catch (err) {
            console.error("Auth check failed:", err);
            // Clear cache on fatal auth errors
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem("cached_user_profile");
            }
            setError(err.message || "Authentication error");
        } finally{
            setLoading(false);
            loadingRef.current = false;
        }
    };
    // 1. Initial Auth Setup & Global Listener
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuthGuard.useEffect": ()=>{
            setMounted(true);
            fetchAuth(); // Initial Check
            const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "useAuthGuard.useEffect": (event, session)=>{
                    console.log(`🔐 [Auth Event] ${event}`);
                    // STRICT SINGLE-FETCH: 
                    // We purposefully ignore "TOKEN_REFRESH" and "USER_UPDATED" events to prevent redundant API calls 
                    // on tab-switches or background wakeups.
                    if (event === 'SIGNED_IN') {
                        fetchAuth(true); // Sync data only on explicit login
                    } else if (event === 'SIGNED_OUT') {
                        // Prevent accidental kicks due to token refresh timing out when waking from suspended background tabs
                        setTimeout({
                            "useAuthGuard.useEffect": async ()=>{
                                const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                                if (!data.session) {
                                    // Clear cache so it doesn't try to auto-login next time
                                    if ("TURBOPACK compile-time truthy", 1) {
                                        localStorage.removeItem("cached_user_profile");
                                        sessionStorage.removeItem("active_user_profile");
                                    }
                                    setUser(null);
                                    router.push("/login");
                                } else {
                                    console.log("🔐 [Auth Guard] False SIGNED_OUT event caught and ignored.");
                                }
                            }
                        }["useAuthGuard.useEffect"], 1500);
                    }
                }
            }["useAuthGuard.useEffect"]);
            return ({
                "useAuthGuard.useEffect": ()=>{
                    subscription.unsubscribe();
                }
            })["useAuthGuard.useEffect"];
        }
    }["useAuthGuard.useEffect"], []);
    // 2. Production Pattern: Pure Route Protection on every navigation
    // This runs when the URL changes but does NOT trigger a heavy fetchAuth unless necessary.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAuthGuard.useEffect": ()=>{
            if (!mounted || loading) return;
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
                // Logged in and trying to access login/root
                if (isLoginPage || isRootPath) {
                    const lastPath = localStorage.getItem('last_visited_path');
                    router.push(lastPath || "/dashboard");
                } else if (!isPublicLandingPage) {
                    // Save the valid current path so Flutter WebView can restore it on wakeup
                    if ("TURBOPACK compile-time truthy", 1) {
                        localStorage.setItem('last_visited_path', router.asPath);
                    }
                }
            }
        }
    }["useAuthGuard.useEffect"], [
        router.pathname,
        router.asPath,
        user?.uid,
        mounted,
        loading
    ]);
    return {
        user,
        loading,
        error,
        mounted,
        statusMessage,
        refetchUser: fetchAuth
    };
}
_s(useAuthGuard, "IOXwMeUJgulr++5zI26HjDwvKKI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useDashboardStats.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDashboardStats",
    ()=>useDashboardStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const CACHE_TTL = 60 * 1000; // 60 seconds
function useDashboardStats() {
    _s();
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        totalCustomers: 0,
        totalPremium: 0,
        totalConverted: 0,
        conversionRate: 0,
        totalDials: 0,
        totalTalktime: 0,
        activeCampaigns: 0,
        teamSize: 0,
        efficiencyScore: 75
    });
    const [secondaryStats, setSecondaryStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        todayCalls: 0,
        freshProspects: 0,
        followupCalls: 0,
        overdueFollowups: 0,
        newProspects: 0,
        assignedMembers: 0
    });
    const [performanceMetrics, setPerformanceMetrics] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        avgDuration: "0m 0s",
        connectedRate: "0%",
        roi: "1.0x"
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])({});
    // Clean up abort controller on unmount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDashboardStats.useEffect": ()=>{
            return ({
                "useDashboardStats.useEffect": ()=>{
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                    }
                }
            })["useDashboardStats.useEffect"];
        }
    }["useDashboardStats.useEffect"], []);
    const fetchStats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDashboardStats.useCallback[fetchStats]": async (orgId, dateFilter = "this_month", userId)=>{
            const cacheKey = `${orgId || 'all'}-${dateFilter}-${userId || 'all'}`;
            // Check cache
            const cached = cacheRef.current[cacheKey];
            if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                setStats(cached.data.stats);
                setSecondaryStats(cached.data.secondaryStats);
                setPerformanceMetrics(cached.data.performanceMetrics);
                loading && setLoading(false); // Ensure loading is false if cache hit
                return;
            }
            // Cancel previous request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            const controller = new AbortController();
            abortControllerRef.current = controller;
            try {
                setLoading(true);
                setError(null);
                // Wait for session using the robust helper (handles hydration race conditions)
                const { ensureValidSession } = await __turbopack_context__.A("[project]/lib/sessionManager.ts [client] (ecmascript, async loader)");
                const session = await ensureValidSession();
                if (!session) throw new Error("Not authenticated");
                const params = new URLSearchParams({
                    dateFilter,
                    ...orgId && {
                        orgId
                    },
                    ...userId && {
                        userId
                    }
                });
                const response = await fetch(`/api/dashboard_overview?${params}`, {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`
                    },
                    signal: controller.signal
                });
                let result;
                try {
                    result = await response.json();
                } catch (e) {
                    throw new Error(`API error: ${response.status}`);
                }
                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || `API error: ${response.status}`);
                }
                const data = {
                    stats: result.data.stats,
                    secondaryStats: result.data.secondaryStats,
                    performanceMetrics: result.data.performanceMetrics
                };
                // Update State
                setStats(data.stats);
                setSecondaryStats(data.secondaryStats);
                setPerformanceMetrics(data.performanceMetrics);
                // Update Cache
                cacheRef.current[cacheKey] = {
                    data,
                    timestamp: Date.now()
                };
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error("Dashboard Stats Fetch Error:", err);
                setError(err.message || "Unknown error");
            } finally{
                if (controller.signal.aborted) {
                // Do nothing
                } else {
                    setLoading(false);
                    if (abortControllerRef.current === controller) {
                        abortControllerRef.current = null;
                    }
                }
            }
        }
    }["useDashboardStats.useCallback[fetchStats]"], []);
    return {
        stats,
        secondaryStats,
        performanceMetrics,
        loading,
        error,
        fetchStats
    };
}
_s(useDashboardStats, "ip0Gq4emDY9tICTljE4Nclgk4nE=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useDashboardCharts.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDashboardCharts",
    ()=>useDashboardCharts
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const CACHE_TTL = 60 * 1000;
function useDashboardCharts() {
    _s();
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pieData, setPieData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [heatmapData, setHeatmapData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [campaignData, setCampaignData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [hourlyStats, setHourlyStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDashboardCharts.useEffect": ()=>{
            return ({
                "useDashboardCharts.useEffect": ()=>{
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                    }
                }
            })["useDashboardCharts.useEffect"];
        }
    }["useDashboardCharts.useEffect"], []);
    const fetchChartData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDashboardCharts.useCallback[fetchChartData]": async (orgId, dateFilter = "this_month", customRange, userId)=>{
            const cacheKey = `${orgId || 'all'}-${dateFilter}-${customRange ? JSON.stringify(customRange) : ''}-${userId || 'all'}`;
            const cached = cacheRef.current[cacheKey];
            if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
                setChartData(cached.data.chartData);
                setPieData(cached.data.pieData);
                setHeatmapData(cached.data.heatmapData);
                setCampaignData(cached.data.campaignData);
                setHourlyStats(cached.data.hourlyStats);
                loading && setLoading(false);
                return;
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            const controller = new AbortController();
            abortControllerRef.current = controller;
            try {
                setLoading(true);
                setError(null);
                // Wait for session using the robust helper (handles hydration race conditions)
                const { ensureValidSession } = await __turbopack_context__.A("[project]/lib/sessionManager.ts [client] (ecmascript, async loader)");
                const session = await ensureValidSession();
                if (!session) throw new Error("Not authenticated");
                const params = new URLSearchParams({
                    dateFilter,
                    ...orgId && {
                        orgId
                    },
                    ...customRange && {
                        startDate: customRange.start,
                        endDate: customRange.end
                    },
                    ...userId && {
                        userId
                    }
                });
                const response = await fetch(`/api/dashboard_charts?${params}`, {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`
                    },
                    signal: controller.signal
                });
                let result;
                try {
                    result = await response.json();
                } catch (e) {
                    throw new Error(`API error: ${response.status}`);
                }
                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || `API error: ${response.status}`);
                }
                const data = result.data;
                setChartData(data.chartData);
                setPieData(data.pieData);
                setHeatmapData(data.heatmapData);
                setCampaignData(data.campaignData);
                setHourlyStats(data.hourlyStats);
                cacheRef.current[cacheKey] = {
                    data,
                    timestamp: Date.now()
                };
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error("Dashboard Charts Fetch Error:", err);
                setError(err.message || "Unknown error");
            } finally{
                if (controller.signal.aborted) {
                // Do nothing
                } else {
                    // Only turn off loading if THIS was the active request
                    if (abortControllerRef.current === controller) {
                        setLoading(false);
                        abortControllerRef.current = null;
                    }
                }
            }
        }
    }["useDashboardCharts.useCallback[fetchChartData]"], []);
    return {
        chartData,
        pieData,
        heatmapData,
        campaignData,
        hourlyStats,
        loading,
        error,
        fetchChartData
    };
}
_s(useDashboardCharts, "RSDnzN47eVB0eqSCQG7L6UYHlmA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useAgentPerformance.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAgentPerformance",
    ()=>useAgentPerformance
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
const CACHE_TTL = 60 * 1000;
function useAgentPerformance() {
    _s();
    const [agentData, setAgentData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [totalDials, setTotalDials] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [totalDuration, setTotalDuration] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const cacheRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useAgentPerformance.useEffect": ()=>{
            return ({
                "useAgentPerformance.useEffect": ()=>{
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                    }
                }
            })["useAgentPerformance.useEffect"];
        }
    }["useAgentPerformance.useEffect"], []);
    const fetchAgentPerformance = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useAgentPerformance.useCallback[fetchAgentPerformance]": async (orgId, dateFilter = "this_month", customRange, force = false, userId)=>{
            const cacheKey = `${orgId || 'all'}-${dateFilter}-${customRange ? JSON.stringify(customRange) : ''}-${userId || 'all'}`;
            const cached = cacheRef.current[cacheKey];
            if (!force && cached && Date.now() - cached.timestamp < CACHE_TTL) {
                setAgentData(cached.data.agentData);
                setTotalDials(cached.data.totalDials);
                setTotalDuration(cached.data.totalDuration);
                loading && setLoading(false);
                return;
            }
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            const controller = new AbortController();
            abortControllerRef.current = controller;
            try {
                setLoading(true);
                setError(null);
                // Wait for session using the robust helper (handles hydration race conditions)
                const { ensureValidSession } = await __turbopack_context__.A("[project]/lib/sessionManager.ts [client] (ecmascript, async loader)");
                const session = await ensureValidSession();
                if (!session) throw new Error("Not authenticated");
                const params = new URLSearchParams({
                    dateFilter,
                    ...orgId && {
                        orgId
                    },
                    ...customRange && {
                        startDate: customRange.start,
                        endDate: customRange.end
                    },
                    ...userId && {
                        userId
                    }
                });
                const response = await fetch(`/api/agent_performance?${params}`, {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`
                    },
                    signal: controller.signal
                });
                let result;
                try {
                    result = await response.json();
                } catch (e) {
                    throw new Error(`API error: ${response.status}`);
                }
                if (!response.ok || !result.success || !result.data) {
                    throw new Error(result.error || `API error: ${response.status}`);
                }
                const data = {
                    agentData: result.data.agents,
                    totalDials: result.data.totalDials || 0,
                    totalDuration: result.data.totalDuration || 0
                };
                setAgentData(data.agentData);
                setTotalDials(data.totalDials);
                setTotalDuration(data.totalDuration);
                cacheRef.current[cacheKey] = {
                    data,
                    timestamp: Date.now()
                };
            } catch (err) {
                if (err.name === 'AbortError') return;
                console.error("Agent Performance Fetch Error:", err);
                setError(err.message || "Unknown error");
            } finally{
                if (controller.signal.aborted) {
                // Do nothing
                } else {
                    setLoading(false);
                    if (abortControllerRef.current === controller) {
                        abortControllerRef.current = null;
                    }
                }
            }
        }
    }["useAgentPerformance.useCallback[fetchAgentPerformance]"], []);
    return {
        agentData,
        totalDials,
        totalDuration,
        loading,
        error,
        fetchAgentPerformance
    };
}
_s(useAgentPerformance, "EIyE/GsyLpSwc/TRyom+ZxCRGoc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useDateFilter.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDateFilter",
    ()=>useDateFilter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dateUtils.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useDateFilter(initialFilter = "this_month") {
    _s();
    const [selectedFilter, setSelectedFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(initialFilter);
    const dateRange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDateFilter.useMemo[dateRange]": ()=>{
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["getISTDateRange"])(selectedFilter);
        }
    }["useDateFilter.useMemo[dateRange]"], [
        selectedFilter
    ]);
    const setFilter = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDateFilter.useCallback[setFilter]": (filter)=>{
            setSelectedFilter(filter);
            // Optionally persist to localStorage
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.setItem("dashboard_date_filter", filter);
            }
        }
    }["useDateFilter.useCallback[setFilter]"], []);
    const getDateRangeLabel = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDateFilter.useCallback[getDateRangeLabel]": (filter)=>{
            switch(filter){
                case "today":
                    return "Today";
                case "yesterday":
                    return "Yesterday";
                case "this_week":
                    return "This Week";
                case "last_7_days":
                    return "Last 7 Days";
                case "this_month":
                    return "This Month";
                case "last_month":
                    return "Last Month";
                case "this_year":
                    return "1 Year Report";
                case "multi_year":
                    return "Multi-Year Report";
                case "all_time":
                    return "All Time";
                default:
                    return filter;
            }
        }
    }["useDateFilter.useCallback[getDateRangeLabel]"], []);
    return {
        selectedFilter,
        dateRange,
        setFilter,
        getDateRangeLabel
    };
}
_s(useDateFilter, "dyl3W4rs5/yjBHf7w5KMnodaZK8=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/useOrganizationDetailData.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useOrganizationDetailData",
    ()=>useOrganizationDetailData
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useOrganizationDetailData(organizationId) {
    _s();
    const [organization, setOrganization] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [orgUsers, setOrgUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const fetchData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOrganizationDetailData.useCallback[fetchData]": async (isBackground = false)=>{
            if (!organizationId || Array.isArray(organizationId)) return;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            abortControllerRef.current = new AbortController();
            try {
                if (!isBackground) setLoading(true);
                setError("");
                // 1. Fetch Organization Details
                const { data: orgData, error: orgError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("*").eq("id", organizationId).single();
                if (orgError) throw orgError;
                setOrganization(orgData);
                // 2. Fetch Users associated with this organization
                const { data: userData, error: userError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, user_name, email, role, status, profile_pic_url, employee_id, expire_at, is_client").eq("organization_id", organizationId).order("user_name", {
                    ascending: true
                });
                if (userError) throw userError;
                setOrgUsers(userData || []);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Error fetching organization detail data:", err);
                    setError("Failed to load organization details");
                }
            } finally{
                if (!isBackground) setLoading(false);
            }
        }
    }["useOrganizationDetailData.useCallback[fetchData]"], [
        organizationId
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useOrganizationDetailData.useEffect": ()=>{
            fetchData();
            return ({
                "useOrganizationDetailData.useEffect": ()=>{
                    if (abortControllerRef.current) {
                        abortControllerRef.current.abort();
                    }
                }
            })["useOrganizationDetailData.useEffect"];
        }
    }["useOrganizationDetailData.useEffect"], [
        fetchData
    ]);
    const refreshData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useOrganizationDetailData.useCallback[refreshData]": (isBackground = false)=>{
            return fetchData(isBackground);
        }
    }["useOrganizationDetailData.useCallback[refreshData]"], [
        fetchData
    ]);
    const stats = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useOrganizationDetailData.useMemo[stats]": ()=>{
            const totalMembers = orgUsers.length;
            const activeLicenses = orgUsers.filter({
                "useOrganizationDetailData.useMemo[stats]": (u)=>u.status === "active"
            }["useOrganizationDetailData.useMemo[stats]"]).length;
            // Expiring soon: within 30 days
            const now = new Date();
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(now.getDate() + 30);
            const expiringSoon = orgUsers.filter({
                "useOrganizationDetailData.useMemo[stats]": (u)=>{
                    if (!u.expire_at) return false;
                    const expiryDate = new Date(u.expire_at);
                    return expiryDate > now && expiryDate <= thirtyDaysFromNow;
                }
            }["useOrganizationDetailData.useMemo[stats]"]).length;
            return {
                totalMembers,
                activeLicenses,
                expiringSoon
            };
        }
    }["useOrganizationDetailData.useMemo[stats]"], [
        orgUsers
    ]);
    const filteredUsers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useOrganizationDetailData.useMemo[filteredUsers]": ()=>{
            const query = searchQuery.toLowerCase().trim();
            if (!query) return orgUsers;
            return orgUsers.filter({
                "useOrganizationDetailData.useMemo[filteredUsers]": (u)=>(u.user_name?.toLowerCase() || "").includes(query) || (u.email?.toLowerCase() || "").includes(query) || (u.employee_id?.toLowerCase() || "").includes(query)
            }["useOrganizationDetailData.useMemo[filteredUsers]"]);
        }
    }["useOrganizationDetailData.useMemo[filteredUsers]"], [
        orgUsers,
        searchQuery
    ]);
    return {
        loading,
        organization,
        setOrganization,
        orgUsers,
        setOrgUsers,
        stats,
        filteredUsers,
        searchQuery,
        setSearchQuery,
        refreshData
    };
}
_s(useOrganizationDetailData, "v3kY636o1tmVaEi5OmNbZM0WLvA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/index.ts [client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// Dashboard Hooks - Centralized exports
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuthGuard.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardStats.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardCharts$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardCharts.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAgentPerformance.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDateFilter$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDateFilter.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useOrganizationDetailData.ts [client] (ecmascript)");
;
;
;
;
;
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_2010f4e1._.js.map