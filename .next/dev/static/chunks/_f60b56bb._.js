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
        if ("TURBOPACK compile-time truthy", 1) {
            const win = window;
            if (win.flutter_inappwebview?.callHandler) {
                win.flutter_inappwebview.callHandler("fromWebApp", {
                    type: "logout",
                    value: true
                });
            }
            // IMPORTANT: Flag this as an INTENTIONAL logout so the UI doesn't show "Expired"
            localStorage.setItem('manual_logout_intended', 'true');
            // Clear specific caches instead of nuking everything immediately
            localStorage.removeItem('cached_user_profile');
            sessionStorage.removeItem('active_user_profile');
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
"[project]/lib/dashboardUtils.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DashboardLevel",
    ()=>DashboardLevel,
    "getUserDashboardLevel",
    ()=>getUserDashboardLevel
]);
var DashboardLevel = /*#__PURE__*/ function(DashboardLevel) {
    DashboardLevel["LEVEL_1_ADMIN"] = "LEVEL_1";
    DashboardLevel["LEVEL_2_CLIENT_CEO"] = "LEVEL_2";
    DashboardLevel["LEVEL_3_TL_SALES"] = "LEVEL_3";
    DashboardLevel["LEVEL_4_AGENT_SALES"] = "LEVEL_4";
    DashboardLevel["UNKNOWN"] = "UNKNOWN";
    return DashboardLevel;
}({});
const getUserDashboardLevel = (user)=>{
    if (!user) return "UNKNOWN";
    const role = (user.role || '').toLowerCase();
    const designation = (user.designation || '').toLowerCase();
    // --- Level 1: Super Admin / Management (TFC Internal) ---
    if (user.isClient === false && (role === 'superadmin' || role === 'super_admin') && (designation === 'ceo' || designation === 'developer')) {
        return "LEVEL_1";
    }
    // --- Level 2: Client CEO / Org Owner / Developer ---
    if (user.isClient === true && (role === 'super_admin' || role === 'superadmin' || designation === 'ceo' || designation === 'developer' || designation === 'owner')) {
        return "LEVEL_2";
    }
    // If we don't have enough data to determine level, return UNKNOWN
    if (!role) return "UNKNOWN";
    // --- Level 3: Team Leader ---
    // Role is 'admin' and designation is 'team_leader'
    if (user.isClient === true && role === 'admin' && (designation === 'team_leader' || designation === 'teamleader' || designation.includes('tl'))) {
        return "LEVEL_3";
    }
    // --- Level 4: Sales Agent ---
    // Default for normal users (role = 'user' or any other non-admin/non-owner)
    return "LEVEL_4";
};
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
    sessionExpired: false,
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
"[project]/hooks/useSessionState.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useSessionState",
    ()=>useSessionState
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useSessionState(key, initialValue) {
    _s();
    const [state, setState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        "useSessionState.useState": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                try {
                    const item = window.sessionStorage.getItem(key);
                    if (item) {
                        const parsed = JSON.parse(item);
                        // Expire after 60 minutes
                        if (Date.now() - parsed.timestamp < 60 * 60 * 1000) {
                            return parsed.value;
                        }
                    }
                } catch (error) {
                    console.warn(`Error reading sessionStorage key "${key}":`, error);
                }
            }
            return initialValue;
        }
    }["useSessionState.useState"]);
    const setValue = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useSessionState.useCallback[setValue]": (value)=>{
            try {
                setState({
                    "useSessionState.useCallback[setValue]": (prevState)=>{
                        const valueToStore = value instanceof Function ? value(prevState) : value;
                        if ("TURBOPACK compile-time truthy", 1) {
                            window.sessionStorage.setItem(key, JSON.stringify({
                                timestamp: Date.now(),
                                value: valueToStore
                            }));
                        }
                        return valueToStore;
                    }
                }["useSessionState.useCallback[setValue]"]);
            } catch (error) {
                console.warn(`Error setting sessionStorage key "${key}":`, error);
            }
        }
    }["useSessionState.useCallback[setValue]"], [
        key
    ]);
    return [
        state,
        setValue
    ];
}
_s(useSessionState, "CpcrUWv600SgspIsaBDrFgCYljA=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/users/useUsersFilters.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUsersFilters",
    ()=>useUsersFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useSessionState.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
function useUsersFilters(organizationId = null, isAuthorised = false) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"])("users_searchQuery", "");
    const [showFilterDropdown, setShowFilterDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [viewType, setViewType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"])("users_viewType", "grid");
    const [userTypeToggle, setUserTypeToggle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"])("users_userTypeToggle", "all");
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"])("users_filters", {
        approval_status: "",
        role: "",
        department: "",
        designation: "",
        work_type: "",
        user_type: "",
        status: "",
        organization_id: "",
        is_client: "",
        is_caller: ""
    });
    // Handle organization filter from URL
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUsersFilters.useEffect": ()=>{
            if (router.isReady && router.query.organization) {
                setFilters({
                    "useUsersFilters.useEffect": (prev)=>({
                            ...prev,
                            organization_id: router.query.organization
                        })
                }["useUsersFilters.useEffect"]);
            }
        }
    }["useUsersFilters.useEffect"], [
        router.isReady,
        router.query.organization
    ]);
    const fetchOrgs = async ()=>{
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name").order("company_name");
        // Filter by organization if the user is not a global authoriser
        if (!isAuthorised) {
            if (organizationId) {
                query = query.eq("id", organizationId);
            } else {
                // If restricted but no organizationId provided, don't fetch anything to prevent leak
                return;
            }
        }
        const { data } = await query;
        if (data) setOrganizations(data);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUsersFilters.useEffect": ()=>{
            if (isAuthorised !== undefined) {
                fetchOrgs();
            }
        }
    }["useUsersFilters.useEffect"], [
        isAuthorised,
        organizationId
    ]);
    return {
        searchQuery,
        setSearchQuery,
        showFilterDropdown,
        setShowFilterDropdown,
        viewType,
        setViewType,
        userTypeToggle,
        setUserTypeToggle,
        filters,
        setFilters,
        organizations,
        fetchOrgs
    };
}
_s(useUsersFilters, "SRL+8iMYdzwHPoSFSYF1m6bH+EY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useSessionState$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useSessionState"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/users/useUsersList.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUsersList",
    ()=>useUsersList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useUsersList(userTypeToggle, organizationId = null, isAuthorised = false) {
    _s();
    const [allUsers, setAllUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingAllUsers, setLoadingAllUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [pendingUsers, setPendingUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loadingPendingUsers, setLoadingPendingUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const fetchAllUsers = async ()=>{
        try {
            setLoadingAllUsers(true);
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) {
                setLoadingAllUsers(false);
                return;
            }
            // Build query based on userTypeToggle
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("*, organizations(id, company_name, org_code)").order("date_of_joining", {
                ascending: false
            });
            if (userTypeToggle === "employee") {
                query = query.eq("user_type", "employee");
            } else if (userTypeToggle === "posp_agent") {
                query = query.eq("user_type", "posp_agent");
            }
            // Filter by organization if the user is not a global authoriser
            if (!isAuthorised) {
                if (organizationId) {
                    query = query.eq("organization_id", organizationId);
                } else {
                    // If restricted but no organizationId provided, don't fetch anything to prevent leak
                    setAllUsers([]);
                    setLoadingAllUsers(false);
                    return;
                }
            }
            const { data, error } = await query;
            if (error) {
                console.error("Error fetching all users:", error);
                setAllUsers([]);
            } else {
                const mappedData = (data || []).map((user)=>({
                        ...user,
                        user_name: user.user_name || user.name || null,
                        profile_pic_url: user.profile_pic_url || user.profile_image || null
                    }));
                setAllUsers(mappedData);
            }
        } catch (err) {
            console.error("Error fetching all users:", err);
        } finally{
            setLoadingAllUsers(false);
        }
    };
    const fetchPendingUsers = async ()=>{
        try {
            setLoadingPendingUsers(true);
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) {
                setLoadingPendingUsers(false);
                return;
            }
            // Build query based on userTypeToggle
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("*").eq("approval_status", "pending").order("created_at", {
                ascending: false
            });
            if (userTypeToggle === "employee") {
                query = query.eq("user_type", "employee");
            } else if (userTypeToggle === "posp_agent") {
                query = query.eq("user_type", "posp_agent");
            }
            // Filter by organization if the user is not a global authoriser
            if (!isAuthorised) {
                if (organizationId) {
                    query = query.eq("organization_id", organizationId);
                } else {
                    // If restricted but no organizationId provided, don't fetch anything to prevent leak
                    setPendingUsers([]);
                    setLoadingPendingUsers(false);
                    return;
                }
            }
            const { data, error } = await query;
            if (error) {
                console.error("Error fetching pending users:", error);
                setPendingUsers([]);
            } else {
                setPendingUsers(data || []);
            }
        } catch (err) {
            console.error("Error fetching pending users:", err);
        } finally{
            setLoadingPendingUsers(false);
        }
    };
    const checkAndApproveExpiredHolds = async ()=>{
        try {
            const now = new Date().toISOString();
            const { data: expiredHolds, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, role, approval_status, user_type").eq("approval_status", "hold").lt("hold_end_date", now);
            if (fetchError) throw fetchError;
            if (expiredHolds && expiredHolds.length > 0) {
                console.log(`Found ${expiredHolds.length} expired holds. Auto-approving...`);
                // Group updates - direct supabase update
                const updates = expiredHolds.map(async (user)=>{
                    // If status was 'hold', revert to 'approved'
                    // Also set status to 'active' if it was 'inactive'
                    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").update({
                        approval_status: "approved",
                        status: "active",
                        hold_start_date: null,
                        hold_end_date: null,
                        status_reason: "Hold expired - Auto approved",
                        hold_by_user_id: null
                    }).eq("id", user.id);
                });
                await Promise.all(updates);
                console.log("Auto-approved expired holds");
                // Refresh data
                fetchAllUsers();
            }
        } catch (error) {
            console.error("Error checking expired holds:", error);
        }
    };
    return {
        allUsers,
        loadingAllUsers,
        pendingUsers,
        loadingPendingUsers,
        fetchAllUsers,
        fetchPendingUsers,
        checkAndApproveExpiredHolds,
        setAllUsers
    };
}
_s(useUsersList, "R+uhrco6nGE/d+rEIydWTH4IyGc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/users/useUsersStats.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUsersStats",
    ()=>useUsersStats
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
function useUsersStats(userTypeToggle, organizationId = null, isAuthorised = false) {
    _s();
    const [userStats, setUserStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        activeUsers: 0,
        totalUsers: 0,
        inactiveUsers: 0,
        approved: 0,
        pending: 0,
        hold: 0,
        suspend: 0,
        totalSalary: 0,
        averageSalary: 0
    });
    const [animatedStats, setAnimatedStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        activeUsers: 0,
        totalUsers: 0,
        inactiveUsers: 0,
        approved: 0,
        pending: 0,
        hold: 0,
        suspend: 0,
        totalSalary: 0,
        averageSalary: 0
    });
    const [loadingStats, setLoadingStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [monthlyActiveUsers, setMonthlyActiveUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [monthlyTotalUsers, setMonthlyTotalUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [designationStats, setDesignationStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [workTypeStats, setWorkTypeStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [departmentStats, setDepartmentStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const fetchUserStats = async ()=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) return;
            // Build query based on userTypeToggle
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("status, approval_status, in_hand_salary, user_type");
            if (userTypeToggle === "employee") {
                query = query.eq("user_type", "employee");
            } else if (userTypeToggle === "posp_agent") {
                query = query.eq("user_type", "posp_agent");
            }
            // Filter by organization if the user is not a global authoriser
            if (!isAuthorised) {
                if (organizationId) {
                    query = query.eq("organization_id", organizationId);
                } else {
                    // If restricted but no organizationId provided, don't fetch anything to prevent leak
                    setLoadingStats(false);
                    return;
                }
            }
            const { data: allUsersData, error: fetchError } = await query;
            if (fetchError) throw fetchError;
            const stats = {
                activeUsers: 0,
                totalUsers: 0,
                inactiveUsers: 0,
                approved: 0,
                pending: 0,
                hold: 0,
                suspend: 0,
                totalSalary: 0,
                averageSalary: 0
            };
            if (allUsersData) {
                stats.totalUsers = allUsersData.length;
                // Sum salary and filtering
                let salarySum = 0;
                let salaryCount = 0;
                allUsersData.forEach((user)=>{
                    if (user.status === "active") stats.activeUsers++;
                    if (user.status === "inactive") stats.inactiveUsers++;
                    if (user.approval_status === "approved") stats.approved++;
                    if (user.approval_status === "pending") stats.pending++;
                    if (user.approval_status === "hold") stats.hold++;
                    if (user.approval_status === "suspend") stats.suspend++;
                    if (user.in_hand_salary) {
                        salarySum += Number(user.in_hand_salary);
                        salaryCount++;
                    }
                });
                stats.totalSalary = salarySum;
                stats.averageSalary = salaryCount > 0 ? Math.round(salarySum / salaryCount) : 0;
            }
            setUserStats(stats);
            setAnimatedStats(stats); // Simplify animation for now, just set directly
            setLoadingStats(false);
        } catch (error) {
            console.error("Error fetching user stats:", error);
            setLoadingStats(false);
        }
    };
    const fetchMonthlyUserData = async ()=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) return;
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("status, created_at, user_type");
            if (userTypeToggle === "employee") {
                query = query.eq("user_type", "employee");
            } else if (userTypeToggle === "posp_agent") {
                query = query.eq("user_type", "posp_agent");
            }
            // Filter by organization if the user is not a global authoriser
            if (!isAuthorised) {
                if (organizationId) {
                    query = query.eq("organization_id", organizationId);
                } else {
                    // If restricted but no organizationId provided, don't fetch anything to prevent leak
                    return;
                }
            }
            const { data: allUsersData, error: fetchError } = await query;
            if (fetchError) throw fetchError;
            if (allUsersData) {
                // Group by month - simplified logic from original
                const monthCounts = new Map();
                const months = [
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"
                ];
                // Initialize current year months
                const currentYear = new Date().getFullYear();
                months.forEach((m)=>monthCounts.set(`${m} ${currentYear}`, {
                        active: 0,
                        total: 0
                    }));
                allUsersData.forEach((user)=>{
                    if (user.created_at) {
                        const date = new Date(user.created_at);
                        const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
                        if (monthCounts.has(monthYear)) {
                            const current = monthCounts.get(monthYear);
                            current.total++;
                            if (user.status === 'active') current.active++;
                            monthCounts.set(monthYear, current);
                        }
                    }
                });
                const activeData = Array.from(monthCounts.entries()).map(([month, counts])=>({
                        month,
                        count: counts.active
                    }));
                const totalData = Array.from(monthCounts.entries()).map(([month, counts])=>({
                        month,
                        count: counts.total
                    }));
                setMonthlyActiveUsers(activeData);
                setMonthlyTotalUsers(totalData);
            }
        } catch (error) {
            console.error("Error fetching monthly data:", error);
        }
    };
    const fetchCategoryStats = async ()=>{
        try {
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("designation, work_type, department, user_type");
            if (userTypeToggle === "employee") {
                query = query.eq("user_type", "employee");
            } else if (userTypeToggle === "posp_agent") {
                query = query.eq("user_type", "posp_agent");
            }
            // Filter by organization if the user is not a global authoriser
            if (!isAuthorised) {
                if (organizationId) {
                    query = query.eq("organization_id", organizationId);
                } else {
                    // If restricted but no organizationId provided, don't fetch anything to prevent leak
                    return;
                }
            }
            const { data, error } = await query;
            if (error) throw error;
            if (data) {
                const desStats = {};
                const wtStats = {};
                const deptStats = {};
                data.forEach((user)=>{
                    if (user.designation) desStats[user.designation] = (desStats[user.designation] || 0) + 1;
                    if (user.work_type) wtStats[user.work_type] = (wtStats[user.work_type] || 0) + 1;
                    if (user.department) deptStats[user.department] = (deptStats[user.department] || 0) + 1;
                });
                setDesignationStats(desStats);
                setWorkTypeStats(wtStats);
                setDepartmentStats(deptStats);
            }
        } catch (error) {
            console.error("Error fetching category stats:", error);
        }
    };
    return {
        userStats,
        animatedStats,
        loadingStats,
        monthlyActiveUsers,
        monthlyTotalUsers,
        designationStats,
        workTypeStats,
        departmentStats,
        fetchUserStats,
        fetchMonthlyUserData,
        fetchCategoryStats
    };
}
_s(useUsersStats, "XCZd6Lyak+yXnKXvrOSYODg6I3o=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/users/useUsersActions.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUsersActions",
    ()=>useUsersActions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
;
;
function useUsersActions(refreshData) {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const [selectedUsers, setSelectedUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Modals state
    const [showApprovalModal, setShowApprovalModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [approvalUserData, setApprovalUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [approvalFormData, setApprovalFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        role: "user",
        department: "sales",
        designation: "agent",
        work_type: "on_site",
        user_type: "employee",
        status: "active",
        is_client: false,
        is_caller: true
    });
    const [showHoldModal, setShowHoldModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [holdUserData, setHoldUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [holdFormData, setHoldFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        duration: "1",
        customDate: "",
        customTime: "",
        reason: ""
    });
    const [showSuspendModal, setShowSuspendModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [suspendUserData, setSuspendUserData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [suspendFormData, setSuspendFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        reason: ""
    });
    const handleStatusChange = async (userId, approvalStatus)=>{
        try {
            if (approvalStatus === "approved") {
                const { data: fullUserData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("*").eq("id", userId).single();
                if (error) throw error;
                setApprovalUserData(fullUserData);
                setApprovalFormData({
                    role: fullUserData.role || "user",
                    department: fullUserData.department || "sales",
                    designation: fullUserData.designation || "agent",
                    work_type: fullUserData.work_type || "on_site",
                    user_type: fullUserData.user_type || "employee",
                    status: fullUserData.status || "active",
                    is_client: !!fullUserData.is_client,
                    is_caller: fullUserData.is_caller !== false
                });
                setShowApprovalModal(true);
                return;
            }
            if (approvalStatus === "hold") {
                const { data: fullUserData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("*").eq("id", userId).single();
                if (error) throw error;
                setHoldUserData(fullUserData);
                setShowHoldModal(true);
                return;
            }
            if (approvalStatus === "suspend") {
                const { data: fullUserData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("*").eq("id", userId).single();
                if (error) throw error;
                setSuspendUserData(fullUserData);
                setShowSuspendModal(true);
                return;
            }
            // Direct update for other statuses
            await refreshData();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `User Status Change: ${userId} set to ${approvalStatus}`,
                metadata: {
                    user_id: userId,
                    status: approvalStatus
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])({
                    userId,
                    approvalStatus
                }),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error updating status:", err);
            alert("Failed to update status");
        }
    };
    const handleUpdateField = async (userId, field, value)=>{
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").update({
                [field]: value,
                updated_at: new Date().toISOString()
            }).eq("id", userId);
            if (error) throw error;
            await refreshData();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `User Update: Field "${field}" set to "${String(value)}" for user ${userId}`,
                metadata: {
                    user_id: userId,
                    field,
                    value
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])({
                    userId,
                    field,
                    value
                }),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error(`Error updating ${field}:`, err);
            alert(`Failed to update ${field}: ${err.message}`);
        }
    };
    // Specific wrappers
    const handleUserStatusChange = (userId, status)=>handleUpdateField(userId, "status", status);
    const handleWorkTypeChange = (userId, workType)=>handleUpdateField(userId, "work_type", workType);
    const handleUserTypeChange = (userId, userType)=>handleUpdateField(userId, "user_type", userType);
    const handleRoleChange = (userId, role)=>handleUpdateField(userId, "role", role);
    const handleIsClientChange = (userId, isClient)=>handleUpdateField(userId, "is_client", isClient);
    const handleIsCallerChange = (userId, isCaller)=>handleUpdateField(userId, "is_caller", isCaller);
    const handleDesignationChange = (userId, designation)=>handleUpdateField(userId, "designation", designation);
    const handleDepartmentChange = (userId, department)=>handleUpdateField(userId, "department", department);
    const handleCheckboxChange = (userId, checked)=>{
        if (checked) setSelectedUsers((prev)=>[
                ...prev,
                userId
            ]);
        else setSelectedUsers((prev)=>prev.filter((id)=>id !== userId));
    };
    const handleSelectAll = (checked, allUserIds)=>{
        if (checked) setSelectedUsers(allUserIds);
        else setSelectedUsers([]);
    };
    const handleDeleteUser = async (userId)=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) {
                alert("You must be logged in to delete users");
                return;
            }
            const response = await fetch(`/api/auth/delete-user?userId=${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });
            if (!response.ok) throw new Error("Failed to delete user");
            await refreshData();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Delete User: ${userId}`,
                metadata: {
                    user_id: userId
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])({
                    userId
                }),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user");
        }
    };
    const handleBulkDelete = async ()=>{
        if (selectedUsers.length === 0) return;
        if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`)) {
            return;
        }
        try {
            // Execute all deletes
            await Promise.all(selectedUsers.map((id)=>handleDeleteUser(id)));
            setSelectedUsers([]);
        } catch (err) {
            console.error("Error deleting users:", err);
            alert("Failed to delete some users");
        }
    };
    // Generate Employee ID
    const generateNextEmployeeId = async (userType = "employee", organizationId = null)=>{
        try {
            let basePrefix = userType === "posp_agent" ? "AGT" : "TFC";
            // If organization_id is provided, use the organization's org_code as basePrefix
            if (organizationId) {
                const { data: orgData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("org_code").eq("id", organizationId).maybeSingle();
                if (orgData?.org_code) {
                    basePrefix = orgData.org_code.toUpperCase();
                }
            }
            // For posp_agent, the prefix should be A{basePrefix}
            const idPrefix = userType === "posp_agent" ? `A${basePrefix}` : basePrefix;
            const searchPattern = `${idPrefix}-%`;
            // Find latest employee_id with this prefix
            const { data: latestIds, error: latestError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("employee_id").ilike("employee_id", searchPattern).order("employee_id", {
                ascending: false
            }).limit(1);
            if (latestError) {
                console.error("Error fetching latest employee_id:", latestError);
            }
            let nextNumber = 1;
            if (latestIds && latestIds.length > 0 && latestIds[0].employee_id) {
                const idStr = String(latestIds[0].employee_id);
                const lastDashIndex = idStr.lastIndexOf("-");
                if (lastDashIndex !== -1) {
                    const numPart = idStr.substring(lastDashIndex + 1);
                    const parsed = parseInt(numPart, 10);
                    if (!isNaN(parsed) && parsed >= 1) {
                        nextNumber = parsed + 1;
                    }
                }
            }
            return `${idPrefix}-${String(nextNumber).padStart(3, "0")}`;
        } catch (err) {
            console.error("Error generating employee ID:", err);
            return "TFC-001";
        }
    };
    const handleApproveUserConfirm = async ()=>{
        if (!approvalUserData) return;
        try {
            // Generate next employee ID if user doesn't have one
            let employeeId = approvalUserData.employee_id;
            if (!employeeId || employeeId.trim() === "") {
                employeeId = await generateNextEmployeeId(approvalFormData.user_type, approvalUserData.organization_id);
            }
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").update({
                approval_status: "approved",
                status: approvalFormData.status,
                role: approvalFormData.role,
                department: approvalFormData.department,
                designation: approvalFormData.designation,
                work_type: approvalFormData.work_type,
                user_type: approvalFormData.user_type,
                is_client: approvalFormData.is_client,
                is_caller: approvalFormData.is_caller,
                employee_id: employeeId,
                updated_at: new Date().toISOString()
            }).eq("id", approvalUserData.id);
            if (error) throw error;
            await refreshData();
            setShowApprovalModal(false);
            setApprovalUserData(null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Approve User: ${approvalUserData.user_name || approvalUserData.email}`,
                metadata: {
                    user_id: approvalUserData.id,
                    employee_id: employeeId,
                    role: approvalFormData.role,
                    designation: approvalFormData.designation
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])(approvalFormData),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error approving user:", err);
            alert("Failed to approve user");
        }
    };
    const handleHoldUserConfirm = async ()=>{
        if (!holdUserData) return;
        if (!holdFormData.reason.trim()) {
            alert("Please enter a reason for hold");
            return;
        }
        try {
            // Calculate hold end date
            let holdEndDate;
            const now = new Date();
            if (holdFormData.duration === "custom") {
                if (!holdFormData.customDate) {
                    alert("Please select a custom date");
                    return;
                }
                const customDateTime = new Date(`${holdFormData.customDate}T${holdFormData.customTime || "00:00"}`);
                if (customDateTime <= now) {
                    alert("Hold end date must be in the future");
                    return;
                }
                holdEndDate = customDateTime;
            } else {
                const days = parseInt(holdFormData.duration);
                holdEndDate = new Date(now);
                holdEndDate.setDate(holdEndDate.getDate() + days);
            }
            // Get current user ID from session
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            const currentUserId = session?.user?.id || null;
            // Prepare update data
            const updateData = {
                approval_status: "hold",
                hold_start_date: now.toISOString(),
                hold_end_date: holdEndDate.toISOString(),
                status_reason: holdFormData.reason,
                updated_at: new Date().toISOString()
            };
            if (currentUserId) {
                try {
                    updateData.hold_by_user_id = currentUserId;
                } catch (e) {
                // Ignore
                }
            }
            // Use a simpler approach to avoid the "hold_by_user_id" error if column missing
            // We will try with hold_by_user_id, if fail, try without.
            // But for simplicity in this refactor, let's assume it exists or fail gracefully.
            // Replicating safe logic:
            let error = (await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").update(updateData).eq("id", holdUserData.id)).error;
            if (error && (error.message?.includes("column") || error.code === "42703")) {
                delete updateData.hold_by_user_id;
                const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").update(updateData).eq("id", holdUserData.id);
                error = res.error;
            }
            if (error) throw error;
            await refreshData();
            setShowHoldModal(false);
            setHoldUserData(null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `User on Hold: ${holdUserData.user_name || holdUserData.email}`,
                metadata: {
                    user_id: holdUserData.id,
                    duration: holdFormData.duration,
                    reason: holdFormData.reason,
                    end_date: holdEndDate.toISOString()
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])(holdFormData),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            setHoldFormData({
                duration: "1",
                customDate: "",
                customTime: "",
                reason: ""
            });
        } catch (err) {
            console.error("Error putting user on hold:", err);
            alert("Failed to put user on hold");
        }
    };
    const handleSuspendUserConfirm = async ()=>{
        if (!suspendUserData) return;
        if (!suspendFormData.reason.trim()) {
            alert("Please enter a reason for suspension");
            return;
        }
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").update({
                approval_status: "suspend",
                status_reason: suspendFormData.reason,
                status: "inactive",
                updated_at: new Date().toISOString()
            }).eq("id", suspendUserData.id);
            if (error) throw error;
            await refreshData();
            setShowSuspendModal(false);
            setSuspendUserData(null);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Suspend User: ${suspendUserData.user_name || suspendUserData.email}`,
                metadata: {
                    user_id: suspendUserData.id,
                    reason: suspendFormData.reason
                },
                payload_size: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["estimateSize"])(suspendFormData),
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
            setSuspendFormData({
                reason: ""
            });
        } catch (err) {
            console.error("Error suspending user:", err);
            alert("Failed to suspend user");
        }
    };
    return {
        selectedUsers,
        setSelectedUsers,
        handleStatusChange,
        handleUserStatusChange,
        handleWorkTypeChange,
        handleUserTypeChange,
        handleRoleChange,
        handleIsClientChange,
        handleIsCallerChange,
        handleDesignationChange,
        handleDepartmentChange,
        handleCheckboxChange,
        handleSelectAll,
        handleDeleteUser,
        handleBulkDelete,
        // Modal states
        showApprovalModal,
        setShowApprovalModal,
        approvalUserData,
        setApprovalUserData,
        approvalFormData,
        setApprovalFormData,
        showHoldModal,
        setShowHoldModal,
        holdUserData,
        setHoldUserData,
        holdFormData,
        setHoldFormData,
        showSuspendModal,
        setShowSuspendModal,
        suspendUserData,
        setSuspendUserData,
        suspendFormData,
        setSuspendFormData,
        // Generators & confirm handlers
        generateNextEmployeeId,
        handleApproveUserConfirm,
        handleHoldUserConfirm,
        handleSuspendUserConfirm
    };
}
_s(useUsersActions, "lgwagEL7jvVIK4TJW2Kmr1gvloE=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/hooks/users/useUsersMenu.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUsersMenu",
    ()=>useUsersMenu
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
function useUsersMenu() {
    _s();
    const [openMenuId, setOpenMenuId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openApprovalDropdown, setOpenApprovalDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openWorkTypeDropdown, setOpenWorkTypeDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openUserTypeDropdown, setOpenUserTypeDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openRoleDropdown, setOpenRoleDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openDepartmentDropdown, setOpenDepartmentDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openDesignationDropdown, setOpenDesignationDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openIsClientDropdown, setOpenIsClientDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [openIsCallerDropdown, setOpenIsCallerDropdown] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [menuPosition, setMenuPosition] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const menuRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRef"])({});
    const menuState = {
        openMenuId,
        setOpenMenuId,
        openApprovalDropdown,
        setOpenApprovalDropdown,
        openWorkTypeDropdown,
        setOpenWorkTypeDropdown,
        openUserTypeDropdown,
        setOpenUserTypeDropdown,
        openRoleDropdown,
        setOpenRoleDropdown,
        openDepartmentDropdown,
        setOpenDepartmentDropdown,
        openDesignationDropdown,
        setOpenDesignationDropdown,
        openIsClientDropdown,
        setOpenIsClientDropdown,
        openIsCallerDropdown,
        setOpenIsCallerDropdown,
        menuPosition,
        setMenuPosition
    };
    return {
        menuState,
        menuRefs
    };
}
_s(useUsersMenu, "ZZ+bFYfTS+xUx+CbPmSyottbtuc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/pages/portal/users.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [client] (ecmascript) <locals>"); // Global Layout
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersFilters$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/users/useUsersFilters.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersList$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/users/useUsersList.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersStats$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/users/useUsersStats.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersActions$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/users/useUsersActions.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersMenu$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/users/useUsersMenu.ts [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersHeader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/UsersHeader.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersStats$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/UsersStats.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$PendingUsers$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/PendingUsers.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersFilters$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/UsersFilters.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersList$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/UsersList.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersCategoryStats$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/UsersCategoryStats.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$AddUserModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/modals/AddUserModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$InviteModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/modals/InviteModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$ApprovalModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/modals/ApprovalModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$HoldModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/modals/HoldModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$SuspendModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/modals/SuspendModal.tsx [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$ImportModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/users/modals/ImportModal.tsx [client] (ecmascript)");
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
;
;
;
;
;
;
;
;
;
const Users = ()=>{
    _s();
    // 1. Global User Context (provides user object for data fetching triggers)
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"])();
    // Page level protection logic
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Users.useEffect": ()=>{
            if (mounted && user) {
                // Visibility logic (Strict: Hidden by default)
                const allowedClientDesignations = [
                    "ceo",
                    "developer"
                ];
                const userDesignation = user.designation?.toLowerCase() || "";
                const isUserPageVisible = user.isClient === false || user.isClient === true && allowedClientDesignations.includes(userDesignation);
                if (!isUserPageVisible) {
                    console.warn("Unauthorized access to users page, redirecting...");
                    router.replace("/dashboard");
                }
            }
        }
    }["Users.useEffect"], [
        mounted,
        user,
        router
    ]);
    // 1.5 Auth state for data filtering
    const isAuthorisedUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "Users.useMemo[isAuthorisedUser]": ()=>{
            if (!user) return false;
            // Internal staff (isClient === false) are authorised to see all data
            // Client users (isClient === true) only see their own organization data
            return user.isClient === false;
        }
    }["Users.useMemo[isAuthorisedUser]"], [
        user
    ]);
    // 2. Filters Hook
    const { searchQuery, setSearchQuery, showFilterDropdown, setShowFilterDropdown, viewType, setViewType, userTypeToggle, setUserTypeToggle, filters, setFilters, organizations, fetchOrgs } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersFilters$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersFilters"])(user?.organization_id, isAuthorisedUser);
    // 3. User List Hook (fetches users based on userTypeToggle)
    const { allUsers, loadingAllUsers, pendingUsers, loadingPendingUsers, fetchAllUsers, fetchPendingUsers, checkAndApproveExpiredHolds } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersList$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersList"])(userTypeToggle, user?.organization_id, isAuthorisedUser);
    // 4. Stats Hook (fetches stats based on userTypeToggle)
    const { userStats, loadingStats, monthlyActiveUsers, monthlyTotalUsers, designationStats, workTypeStats, departmentStats, fetchUserStats, fetchMonthlyUserData, fetchCategoryStats } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersStats$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersStats"])(userTypeToggle, user?.organization_id, isAuthorisedUser);
    // 5. Actions Hook
    // Pass a single refresh function that executes all fetches in parallel
    const refreshData = async ()=>{
        await Promise.all([
            fetchAllUsers(),
            fetchUserStats(),
            fetchPendingUsers(),
            fetchCategoryStats(),
            fetchMonthlyUserData()
        ]);
    };
    const { selectedUsers, setSelectedUsers, handleStatusChange, handleUserStatusChange, handleWorkTypeChange, handleUserTypeChange, handleRoleChange, handleIsClientChange, handleIsCallerChange, handleDesignationChange, handleDepartmentChange, handleCheckboxChange, handleSelectAll, handleDeleteUser, handleBulkDelete, // Modals
    showApprovalModal, setShowApprovalModal, approvalUserData, setApprovalUserData, approvalFormData, setApprovalFormData, showHoldModal, setShowHoldModal, holdUserData, setHoldUserData, holdFormData, setHoldFormData, showSuspendModal, setShowSuspendModal, suspendUserData, setSuspendUserData, suspendFormData, setSuspendFormData, handleApproveUserConfirm, handleHoldUserConfirm, handleSuspendUserConfirm } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersActions$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersActions"])(refreshData);
    // 6. Menu Hook
    const { menuState, menuRefs } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersMenu$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersMenu"])();
    // Local state for other modals
    const [showAddUserModal, setShowAddUserModal] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [showInviteModal, setShowInviteModal] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [showImportModal, setShowImportModal] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    // Initial Data Fetch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Users.useEffect": ()=>{
            if (mounted && user) {
                // Only fetch if we are authorised (internal) OR if we have the organization_id (client)
                // This prevents fetching all users before the organization_id is loaded
                if (isAuthorisedUser || user.organization_id) {
                    refreshData();
                    fetchOrgs();
                    checkAndApproveExpiredHolds();
                }
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["Users.useEffect"], [
        mounted,
        user?.uid,
        user?.organization_id,
        userTypeToggle,
        isAuthorisedUser
    ]); // Re-fetch only when core identity or filters change
    // Filter Users Logic
    const filteredUsers = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useMemo({
        "Users.useMemo[filteredUsers]": ()=>{
            let filtered = allUsers;
            // Generic Search Filter
            if (searchQuery.trim() !== "") {
                const query = searchQuery.toLowerCase();
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>{
                        const userName = (user.user_name || "").toLowerCase();
                        const employeeId = (user.employee_id || "").toLowerCase();
                        const email = (user.email || "").toLowerCase();
                        const contactNo = (user.contact_no || "").toLowerCase();
                        const department = (user.department || "").toLowerCase();
                        const designation = (user.designation || "").toLowerCase();
                        const role = (user.role || "").toLowerCase();
                        const orgName = (user.organizations?.company_name || "").toLowerCase();
                        const isClient = user.is_client ? "client" : "personnel employee agent";
                        const isCaller = user.is_caller ? "caller" : "";
                        return userName.includes(query) || employeeId.includes(query) || email.includes(query) || contactNo.includes(query) || department.includes(query) || designation.includes(query) || role.includes(query) || orgName.includes(query) || isClient.includes(query) || isCaller.includes(query);
                    }
                }["Users.useMemo[filteredUsers]"]);
            }
            // Apply filters
            if (filters.approval_status) {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>user.approval_status === filters.approval_status
                }["Users.useMemo[filteredUsers]"]);
            }
            if (filters.role) {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>user.role === filters.role
                }["Users.useMemo[filteredUsers]"]);
            }
            if (filters.department) {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>user.department === filters.department
                }["Users.useMemo[filteredUsers]"]);
            }
            if (filters.designation) {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>user.designation === filters.designation
                }["Users.useMemo[filteredUsers]"]);
            }
            if (filters.work_type) {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>user.work_type === filters.work_type
                }["Users.useMemo[filteredUsers]"]);
            }
            // user_type filtering is handled by hook mostly, but if 'all' is toggled and dropdown is used
            if (filters.user_type) {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>user.user_type === filters.user_type
                }["Users.useMemo[filteredUsers]"]);
            }
            if (filters.status) {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>user.status === filters.status
                }["Users.useMemo[filteredUsers]"]);
            }
            if (filters.organization_id) {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>user.organization_id === filters.organization_id
                }["Users.useMemo[filteredUsers]"]);
            }
            // Explicit string comparison for boolean/string mixed types from filters
            if (filters.is_client !== "") {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>String(user.is_client) === filters.is_client
                }["Users.useMemo[filteredUsers]"]);
            }
            if (filters.is_caller !== "") {
                filtered = filtered.filter({
                    "Users.useMemo[filteredUsers]": (user)=>String(user.is_caller) === filters.is_caller
                }["Users.useMemo[filteredUsers]"]);
            }
            // Sort by user name alphabetically (create copy to avoid mutating original state)
            return [
                ...filtered
            ].sort({
                "Users.useMemo[filteredUsers]": (a, b)=>{
                    const nameA = (a.user_name || "").toLowerCase();
                    const nameB = (b.user_name || "").toLowerCase();
                    return nameA.localeCompare(nameB);
                }
            }["Users.useMemo[filteredUsers]"]);
        }
    }["Users.useMemo[filteredUsers]"], [
        allUsers,
        searchQuery,
        filters
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("title", {
                    children: "Users | TFC Nexus"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/users.tsx",
                    lineNumber: 267,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/pages/portal/users.tsx",
                lineNumber: 266,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-6 sm:space-y-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersHeader$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["UsersHeader"], {
                            userTypeToggle: userTypeToggle,
                            setUserTypeToggle: setUserTypeToggle
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/users.tsx",
                            lineNumber: 273,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersStats$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["UsersStats"], {
                            loadingStats: loadingStats,
                            userStats: userStats,
                            allUsers: allUsers,
                            monthlyActiveUsers: monthlyActiveUsers,
                            monthlyTotalUsers: monthlyTotalUsers,
                            setFilters: setFilters,
                            onInviteClick: ()=>setShowInviteModal(true),
                            userTypeToggle: userTypeToggle
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/users.tsx",
                            lineNumber: 279,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$PendingUsers$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["PendingUsers"], {
                            loadingPendingUsers: loadingPendingUsers,
                            pendingUsers: pendingUsers,
                            mounted: mounted,
                            onStatusChange: async (userId, status)=>{
                                if (status === "approved") {
                                    const user = pendingUsers.find((u)=>u.id === userId);
                                    if (user) {
                                        setApprovalUserData(user); // pendingUser is structurally similar
                                        setApprovalFormData({
                                            role: "user",
                                            department: "sales",
                                            designation: "agent",
                                            work_type: "on_site",
                                            user_type: user.user_type === "posp_agent" ? "posp_agent" : "employee",
                                            status: "active",
                                            is_client: !!user.is_client,
                                            is_caller: user.is_caller !== false
                                        });
                                        setShowApprovalModal(true);
                                    }
                                } else if (status === "rejected") {
                                    if (confirm("Are you sure you want to reject this user?")) {
                                        await handleStatusChange(userId, "rejected");
                                    }
                                }
                            }
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/users.tsx",
                            lineNumber: 291,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col xl:flex-row gap-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0 space-y-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersFilters$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["UsersFilters"], {
                                            searchQuery: searchQuery,
                                            setSearchQuery: setSearchQuery,
                                            showFilterDropdown: showFilterDropdown,
                                            setShowFilterDropdown: setShowFilterDropdown,
                                            filters: filters,
                                            setFilters: setFilters,
                                            viewType: viewType,
                                            setViewType: setViewType,
                                            selectedUsers: selectedUsers,
                                            allUsers: allUsers,
                                            filteredUsersCount: filteredUsers.length,
                                            totalUsersCount: allUsers.length,
                                            organizations: organizations,
                                            onAddUserClick: ()=>setShowAddUserModal(true),
                                            onBulkDelete: ()=>{
                                                handleBulkDelete();
                                            },
                                            userTypeToggle: userTypeToggle
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/users.tsx",
                                            lineNumber: 327,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersList$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["UsersList"], {
                                            loading: loadingAllUsers,
                                            filteredUsers: filteredUsers,
                                            viewType: viewType,
                                            selectedUsers: selectedUsers,
                                            allUsers: allUsers,
                                            menuState: menuState,
                                            menuRefs: menuRefs,
                                            onSelectAll: handleSelectAll,
                                            onCheckboxChange: handleCheckboxChange,
                                            handlers: {
                                                handleStatusChange,
                                                handleUserStatusChange,
                                                handleWorkTypeChange,
                                                handleUserTypeChange,
                                                handleRoleChange,
                                                handleIsClientChange,
                                                handleIsCallerChange,
                                                handleDesignationChange,
                                                handleDepartmentChange,
                                                handleDeleteUser
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/users.tsx",
                                            lineNumber: 349,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/users.tsx",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$UsersCategoryStats$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["UsersCategoryStats"], {
                                    designationStats: designationStats,
                                    workTypeStats: workTypeStats,
                                    departmentStats: departmentStats,
                                    userTypeToggle: userTypeToggle,
                                    filters: filters,
                                    setFilters: setFilters
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/users.tsx",
                                    lineNumber: 375,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/users.tsx",
                            lineNumber: 324,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/users.tsx",
                    lineNumber: 271,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/pages/portal/users.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$AddUserModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["AddUserModal"], {
                show: showAddUserModal,
                onClose: ()=>setShowAddUserModal(false),
                onSuccess: ()=>{
                    refreshData();
                },
                isAuthorised: isAuthorisedUser,
                organizationId: user?.organization_id
            }, void 0, false, {
                fileName: "[project]/pages/portal/users.tsx",
                lineNumber: 388,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$InviteModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["InviteModal"], {
                show: showInviteModal,
                onClose: ()=>setShowInviteModal(false)
            }, void 0, false, {
                fileName: "[project]/pages/portal/users.tsx",
                lineNumber: 398,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$ImportModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ImportModal"], {
                show: showImportModal,
                onClose: ()=>setShowImportModal(false),
                onSuccess: ()=>{
                    refreshData();
                },
                organizations: organizations
            }, void 0, false, {
                fileName: "[project]/pages/portal/users.tsx",
                lineNumber: 403,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$ApprovalModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["ApprovalModal"], {
                show: showApprovalModal,
                onClose: ()=>{
                    setShowApprovalModal(false);
                    setApprovalUserData(null);
                },
                onConfirm: handleApproveUserConfirm,
                userData: approvalUserData,
                formData: approvalFormData,
                setFormData: setApprovalFormData
            }, void 0, false, {
                fileName: "[project]/pages/portal/users.tsx",
                lineNumber: 412,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$HoldModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["HoldModal"], {
                show: showHoldModal,
                onClose: ()=>{
                    setShowHoldModal(false);
                    setHoldUserData(null);
                },
                onConfirm: handleHoldUserConfirm,
                userData: holdUserData,
                formData: holdFormData,
                setFormData: setHoldFormData
            }, void 0, false, {
                fileName: "[project]/pages/portal/users.tsx",
                lineNumber: 424,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$users$2f$modals$2f$SuspendModal$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["SuspendModal"], {
                show: showSuspendModal,
                onClose: ()=>{
                    setShowSuspendModal(false);
                    setSuspendUserData(null);
                },
                onConfirm: handleSuspendUserConfirm,
                userData: suspendUserData,
                formData: suspendFormData,
                setFormData: setSuspendFormData
            }, void 0, false, {
                fileName: "[project]/pages/portal/users.tsx",
                lineNumber: 436,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
_s(Users, "qmQ8eEt7Tjy5xwCt+vFRHGROuAU=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$client$5d$__$28$ecmascript$29$__["useUser"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersFilters$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersFilters"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersList$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersList"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersStats$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersStats"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersActions$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersActions"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$users$2f$useUsersMenu$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["useUsersMenu"]
    ];
});
_c = Users;
const __TURBOPACK__default__export__ = Users;
var _c;
__turbopack_context__.k.register(_c, "Users");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_f60b56bb._.js.map